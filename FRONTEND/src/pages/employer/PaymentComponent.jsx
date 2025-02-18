import { useEffect } from "react";
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentComponent = ({ jobId, amount }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      const orderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, jobId }),
      });

      const orderData = await orderResponse.json();
      console.log("Order Data:", orderData);

      if (!orderData.id) {
        toast.error('Failed to create payment order. Try again.');
        return;
      }

      const options = {
        key: 'rzp_test_bD1Alu6Su7sKSO',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Job Portal',
        description: 'Job Application Payment',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            console.log("Payment Response:", response);
            
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              toast.error("Payment failed or response incomplete. Please try again.");
              return;
            }
        
            // Verify payment
            const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                jobId: jobId
              }),
            });
        
            const verifyData = await verifyResponse.json();
            console.log("Verification Response:", verifyData);
            
            if (verifyData.success) {
              toast.success('Payment successful! Your job posting will be reviewed shortly.');
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else {
              toast.error(verifyData.message || 'Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed. Please try again.');
          }
        },
        
        prefill: {
          name: sessionStorage.getItem('name') || '',
          email: sessionStorage.getItem('email') || '',
          contact: sessionStorage.getItem('phone') || ''
        },
        theme: {
          color: '#360275'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error during payment:', error);
      toast.error('Payment initiation failed. Please try again.');
    }
  };

  return (
    <>
      <button 
        onClick={handlePayment}
        style={{
          backgroundColor: '#360275',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Pay Now
      </button>
      {/* Toast Container for notifications */}
      <toast.Container position="top-right" autoClose={3000} />
    </>
  );
};

export default PaymentComponent;
