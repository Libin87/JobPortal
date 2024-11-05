// import React from 'react';

// const PaymentComponent = () => {
//   const handlePayment = async () => {
//     try {
//       const orderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: 500 }),
//       });
      
//       const orderData = await orderResponse.json();

//       const options = {
//         key: 'rzp_test_bD1Alu6Su7sKSO', // Replace with Razorpay Key ID
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: 'Job Portal',
//         description: 'Job Application Payment',
//         order_id: orderData.id,
//         handler: async function (response) {
//           // Optional: Send payment verification data to the backend
//           const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               order_id: orderData.id,
//               payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             }),
//           });

//           const verifyData = await verifyResponse.json();
//           if (verifyData.success) {
//             alert('Payment verified successfully!');
//           } else {
//             alert('Payment verification failed.');
//           }
//         },
//         prefill: {
//           name: 'joseph',
//           email: 'libin9811@gmail.com',
//           contact: '9947957831',
//         },
//         theme: { color: '#F37254' },
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       console.error('Error during payment:', error);
//       alert('Payment initiation failed. Please try again.');
//     }
//   };

//   return <button onClick={handlePayment}>Pay Now</button>;
// };

// export default PaymentComponent;


// PaymentComponent.jsx
import React from 'react';

const PaymentComponent = ({ jobId, amount }) => {
  const handlePayment = async () => {
    try {
      const orderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, jobId }), // Send amount and jobId to backend
      });
      
      const orderData = await orderResponse.json();

      const options = {
        key: 'rzp_test_bD1Alu6Su7sKSO', // Replace with Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Job Portal',
        description: 'Job Application Payment',
        order_id: orderData.id,
        handler: async function (response) {
          // Send verification data to the backend
          const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: orderData.id,
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              jobId, // Send jobId again for verification
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            alert('Payment verified and approved!');
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: 'joseph',
          email: 'libin9811@gmail.com',
          contact: '9947957831',
        },
        theme: { color: '#F37254' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error during payment:', error);
      alert('Payment initiation failed. Please try again.');
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default PaymentComponent;
