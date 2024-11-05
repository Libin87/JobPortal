
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const JobPost = require('../model/job'); // Assuming you have a JobPost model
const router = express.Router();
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


// router.post('/verify-payment', async (req, res) => {
//   try {
//     const { order_id, payment_id, razorpay_signature, jobId } = req.body;
    
//     console.log("Received data:", { order_id, payment_id, razorpay_signature, jobId });

//     const generatedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(order_id + '|' + payment_id)
//       .digest('hex');
    
//     console.log("Generated Signature:", generatedSignature);
//     console.log("Received Razorpay Signature:", razorpay_signature);

//     if (generatedSignature === razorpay_signature) {
//       const updatedJob = await JobPost.findByIdAndUpdate(jobId, { paymentStatus: 'Approved' });
//       if (updatedJob) {
//         return res.json({ success: true, message: 'Payment verified and approved!' });
//       } else {
//         return res.status(404).json({ success: false, message: 'Job not found.' });
//       }
//     } else {
//       return res.status(400).json({ success: false, message: 'Payment verification failed.' });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error during verification.' });
//   }
// });


module.exports = router;
