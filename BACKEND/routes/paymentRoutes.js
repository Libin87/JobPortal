const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const JobPost = require('../model/job'); // Assuming you have a JobPost model
const router = express.Router();
const PaymentReceipt = require('../model/paymentReceipt');
const Job = require('../model/job');
require('dotenv').config();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Endpoint to create a new Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, jobId } = req.body;

    // Log received amount and jobId
    console.log("Received amount:", amount, "Job ID:", jobId);
    console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
    console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);

    // Check if amount is valid
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Convert the amount from INR to paise (Razorpay expects amount in paise)
    const options = {
      amount: amount * 100, // 500 INR to 50000 paise
      currency: 'INR',
      receipt: `receipt_${jobId}`,
      payment_capture: 1, // Automatically capture payment
    };

    // Create order with Razorpay
    const order = await razorpay.orders.create(options);
    
    // Log the order details
    console.log("Razorpay order created:", order);

    // Update job post with the new order ID and set payment status to Pending
    await JobPost.findByIdAndUpdate(jobId, {
      razorpay_order_id: order.id,
      paymentStatus: 'Completed',
    });

    // Send back the order details
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});


router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId } = req.body;

    console.log('Verification Request Body:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      jobId
    });

    // Check for missing parameters
    const missingParams = [];
    if (!razorpay_order_id) missingParams.push('razorpay_order_id');
    if (!razorpay_payment_id) missingParams.push('razorpay_payment_id');
    if (!razorpay_signature) missingParams.push('razorpay_signature');
    if (!jobId) missingParams.push('jobId');

    if (missingParams.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required parameters: ${missingParams.join(', ')}`,
        received: req.body
      });
    }

    // Verify the payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('Razorpay secret key is missing');
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    // Generate signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    console.log('Signature verification:', {
      generated: generated_signature,
      received: razorpay_signature
    });

    if (generated_signature === razorpay_signature) {
      // Find and update the job
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
          jobId
        });
      }

      // Create payment receipt
      const receipt = new PaymentReceipt({
        jobId: job._id,
        employerId: job.userId,
        amount: 500,
        currency: 'INR',
        paymentId: razorpay_payment_id,
        status: 'success'
      });

      await receipt.save();

      // Update job status
      await Job.findByIdAndUpdate(jobId, {
        paymentStatus: 'Completed',
        razorpay_payment_id,
        razorpay_order_id
      });

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        receipt
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed"
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});



// Get all payment receipts (for admin)
router.get('/receipts', async (req, res) => {
  try {
    const receipts = await PaymentReceipt.find()
      .populate('jobId', 'jobTitle')
      .populate('employerId', 'name email')
      .sort({ paymentDate: -1 });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this new route to get receipt by job ID
router.get('/receipts/:jobId', async (req, res) => {
  try {
    const receipt = await PaymentReceipt.findOne({ jobId: req.params.jobId })
      .populate('jobId', 'jobTitle')
      .populate('employerId', 'name email');
    
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    res.json(receipt);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
