// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import NavbarEmployer from './NavbarEmployer';
// import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
// import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   textAlign: 'center',
//   padding: '10px',
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   backgroundColor: '#f2f2f2',
//   '&:hover': {
//     backgroundColor: '#e0e0e0',
//   },
// }));

// const ButtonContainer = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   gap: '10px',
//   height: '100%',
// });

// const PostedJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [error, setError] = useState('');
//   const [editRowId, setEditRowId] = useState(null);
//   const [validationErrors, setValidationErrors] = useState({}); // State for field validation errors

//   useEffect(() => {
//     const fetchJobs = async () => {
//       const userId = sessionStorage.getItem('userId');

//       try {
//         const response = await axios.get('http://localhost:3000/jobs/myjobs', {
//           params: { userId: userId },
//         });
//         setJobs(response.data);
//       } catch (err) {
//         console.error('Error fetching jobs:', err);
//         setError('Failed to load your posted jobs.');
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Function to handle input change
//   const handleInputChange = (e, jobId) => {
//     const { name, value } = e.target;
//     setJobs((prevJobs) =>
//       prevJobs.map((job) =>
//         job._id === jobId ? { ...job, [name]: value } : job
//       )
//     );

//     // Clear the validation error for this field as user is typing
//     setValidationErrors((prevErrors) => ({
//       ...prevErrors,
//       [jobId]: { ...prevErrors[jobId], [name]: null },
//     }));
//   };

//   // Validation function
//   // Modify the validation function to ignore companyName
//   const validateField = (name, value) => {
//     let errorMsg = '';

//     // If the field is 'companyName' and you don't need to validate it, skip
//     if (name === 'companyName') return '';

//     // Convert the value to a string to ensure trim() works
//     const stringValue = String(value).trim();

   

//     if (!stringValue) {
//       errorMsg = `${name} is required.`;
//     } else if (name === 'salary' && (value < 1000 || value > 5000000)) {
//       errorMsg = 'Enter a valid salary (between 1,000 and 5,000,000).';
//     } else if (name === 'experience' && !/^(?:[1-5]?\d|60)$/.test(stringValue)) {
//       errorMsg = 'Enter a valid experience (0 to 60 years).';
//     } else if (name === 'jobTitle' && stringValue) {
//       const digitCount = (stringValue.match(/\d/g) || []).length;
//       if (digitCount > 2) {
//         errorMsg = 'Enter a valid Job Title';
//       }}
//       else if (name === 'vaccancy' && stringValue) {
//         const vacancyRegex = /^(?:[1-9][0-9]{0,2})$/; // Regex for numbers 1-999
//         if (!vacancyRegex.test(stringValue)) {
//           errorMsg = 'Vacancy must be a number between 1 and 999'; // Error message for invalid vacancy
//         }
//       }
//      else if (name === 'location' && stringValue) {
//       const digitCount = (stringValue.match(/\d/g) || []).length;
//       if (digitCount > 2) {
//         errorMsg = 'Enter A valid Location';
//       }
//     }
//     else if (
//       name === 'contactDetails' &&
//       !(/^(?!.*(\d)\1{4,})\d{10}$/.test(stringValue) || /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/.test(stringValue))
//     ) {
//       errorMsg = 'Enter a valid contact (10-digit phone number or email address).';
//     }



//     return errorMsg;
//   };


//   // Handle validation on blur (when leaving the field)
//   const handleBlur = (e, jobId) => {
//     const { name, value } = e.target;
//     const errorMessage = validateField(name, value);

//     setValidationErrors((prevErrors) => ({
//       ...prevErrors,
//       [jobId]: { ...prevErrors[jobId], [name]: errorMessage },
//     }));
//   };

//   const handleUpdateSubmit = async (jobId) => {
//     const jobToUpdate = jobs.find((job) => job._id === jobId);

//     // Check for errors before submitting
//     let hasError = false;
//     const newErrors = {};

//     // Validate each field and collect errors
//     Object.keys(jobToUpdate).forEach((key) => {
//       const errorMsg = validateField(key, jobToUpdate[key]);
//       if (errorMsg) {
//         console.log(errorMsg)
//         newErrors[key] = errorMsg;
//         hasError = true; // Set hasError if there's a validation error
//       }
//     });

//     // Only show error if there are actual validation errors
//     if (hasError) {
//       setValidationErrors((prevErrors) => ({
//         ...prevErrors,
//         [jobId]: { ...newErrors },
//       }));
//       toast.error('Please fix the validation errors before submitting.');
//       console.log(hasError)// Show toast only if there are errors
//       return; // Prevent submission
//     }

//     try {
//       await axios.put(`http://localhost:3000/jobs/${jobId}`, jobToUpdate);
//       setEditRowId(null);
//       setValidationErrors((prevErrors) => ({
//         ...prevErrors,
//         [jobId]: {}, // Reset errors for this job
//       }));
//       toast.success('Job updated successfully!'); // Show success toast message
//     } catch (err) {
//       console.error('Error updating job:', err);
//       setError('Failed to update the job.');
//       toast.error('Failed to update the job.');
//     }
//   };

//   const handleDelete = async (jobId) => {
//     try {
//       await axios.delete(`http://localhost:3000/jobs/${jobId}`);
//       setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
//       toast.success('Job deleted successfully!');
//     } catch (err) {
//       console.error('Error deleting job:', err);
//       setError('Failed to delete the job.');
//       toast.error('Failed to delete the job.');
//     }
//   };

//   return (
//     <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
//       <NavbarEmployer />
//       <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
//         Your Posted Jobs
//       </Typography>

//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

//       <TableContainer component={Paper} style={{ marginTop: '20px' }}>
//         <Table style={{ width: '100%' }}>
//           <TableHead>
//             <TableRow>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Location</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Salary</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Type</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Experience</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Vacancy</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Contact Details</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Posted Date</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Payment</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {jobs.length > 0 ? (
//               jobs.map((job, index) => (
//                 <StyledTableRow key={job._id}>
//                   <StyledTableCell>{index + 1}</StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <>
//                         <input
//                           type="text"
//                           name="jobTitle"
//                           value={job.jobTitle}
//                           onChange={(e) => handleInputChange(e, job._id)}
//                           onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
//                         />
//                         {validationErrors[job._id]?.jobTitle && (
//                           <p style={{ color: 'red' }}>{validationErrors[job._id].jobTitle}</p>
//                         )}
//                       </>
//                     ) : (
//                       job.jobTitle
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <>
//                         <input
//                           type="text"
//                           name="location"
//                           value={job.location}
//                           onChange={(e) => handleInputChange(e, job._id)}
//                           onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
//                         />
//                         {validationErrors[job._id]?.location && (
//                           <p style={{ color: 'red' }}>{validationErrors[job._id].location}</p>
//                         )}
//                       </>
//                     ) : (
//                       job.location
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <>
//                         <input
//                           type="number"
//                           name="salary"
//                           value={job.salary}
//                           onChange={(e) => handleInputChange(e, job._id)}
//                           onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
//                         />
//                         {validationErrors[job._id]?.salary && (
//                           <p style={{ color: 'red' }}>{validationErrors[job._id].salary}</p>
//                         )}
//                       </>
//                     ) : (
//                       job.salary
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <select
//                         name="jobType"
//                         value={job.jobType}
//                         onChange={(e) => handleInputChange(e, job._id)}
//                         onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
//                       >
//                         <option value="frontend-developer">Frontend Developer</option>
//                         <option value="ui-designer">UI Designer</option>
//                         <option value="backend-developer">Backend Developer</option>
//                         <option value="fullstack-developer">Fullstack Developer</option>
//                         <option value="project-manager">Project Manager</option>
//                         <option value="data-scientist">Data Scientist</option>
//                         <option value="product-designer">Product Designer</option>
//                         <option value="devops-engineer">DevOps Engineer</option>
//                         <option value="qa-engineer">QA Engineer</option>
//                         <option value="marketing-specialist">Marketing Specialist</option>
//                         <option value="hr-manager">HR Manager</option>
//                         <option value="content-writer">Content Writer</option>

//                       </select>
//                     ) : (
//                       job.jobType
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <>
//                         <input
//                           type="number"
//                           name="experience"
//                           value={job.experience}
//                           onChange={(e) => handleInputChange(e, job._id)}
//                           onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
//                         />
//                         {validationErrors[job._id]?.experience && (
//                           <p style={{ color: 'red' }}>{validationErrors[job._id].experience}</p>
//                         )}
//                       </>
//                     ) : (
//                       job.experience
//                     )}

//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <>
//                         <input
//                           type="number"
//                           name="vaccancy"
//                           value={job.vaccancy}
//                           onChange={(e) => handleInputChange(e, job._id)}
//                           onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
//                         />
//                         {validationErrors[job._id]?.vaccancy && ( // Check for the correct field 'vaccancy'
//                           <p style={{ color: 'red' }}>{validationErrors[job._id].vaccancy}</p> // Display the error message
//                         )}
//                       </>
//                     ) : (
//                       job.vaccancy
//                     )}
//                   </StyledTableCell>

//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <>
//                         <input
//                           type="text"
//                           name="contactDetails"
//                           value={job.contactDetails}
//                           onChange={(e) => handleInputChange(e, job._id)}
//                           onBlur={(e) => handleBlur(e, job._id)}
//                         />
//                         {validationErrors[job._id]?.contactDetails && (
//                           <p style={{ color: 'red' }}>{validationErrors[job._id].contactDetails}</p>
//                         )}

//                       </>
//                     ) : (
//                       job.contactDetails
//                     )}

//                   </StyledTableCell>
//                   <StyledTableCell style={{ textAlign: 'center' }}>
//                     {new Date(job.datePosted).toLocaleDateString()}
//                   </StyledTableCell>
//                   <StyledTableCell style={{ textAlign: 'center' }}>
//                     {(job.
//                       approvalStatus)}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <ButtonContainer>
//                       {editRowId === job._id ? (
//                         <>
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={() => handleUpdateSubmit(job._id)}
//                           >
//                             Update
//                           </Button>
//                           <Button
//                             variant="outlined"
//                             color="secondary"
//                             onClick={() => setEditRowId(null)}
//                           >
//                             Cancel
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           {/* Only show Edit and Delete buttons if the job is not approved */}
//                           {job.approvalStatus !== 'approved' && (
//                             <>
//                               <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={() => setEditRowId(job._id)}
//                               >
//                                 Edit
//                               </Button>
//                               <Button
//                                 variant="outlined"
//                                 color="secondary"
//                                 onClick={() => handleDelete(job._id)}
//                               >
//                                 Delete
//                               </Button>
//                             </>
//                           )}
//                         </>
//                       )}
//                     </ButtonContainer>

//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))
//             ) : (
//               <StyledTableRow>
//                 <StyledTableCell colSpan={6}>No jobs posted yet.</StyledTableCell>
//               </StyledTableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <ToastContainer /> {/* Include ToastContainer for notifications */}
//     </Container>
//   );
// };

// export default PostedJobs;






import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions,} from '@mui/material';

import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavbarEmployer from './NavbarEmployer';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  padding: '10px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#f2f2f2',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
}));

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  height: '100%',
});

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [editRowId, setEditRowId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // State for field validation errors

  useEffect(() => {
    const fetchJobs = async () => {
      const userId = sessionStorage.getItem('userId');

      try {
        const response = await axios.get('http://localhost:3000/jobs/myjobs', {
          params: { userId: userId },
        });
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load your posted jobs.');
      }
    };

    fetchJobs();
  }, []);

  // Function to handle input change
  const handleInputChange = (e, jobId) => {
    const { name, value } = e.target;
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [name]: value } : job
      )
    );

    // Clear the validation error for this field as user is typing
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [jobId]: { ...prevErrors[jobId], [name]: null },
    }));
  };

  // Validation function
  // Modify the validation function to ignore companyName
  const validateField = (name, value) => {
    let errorMsg = '';

    // If the field is 'companyName' and you don't need to validate it, skip
    if (name === 'companyName') return '';

    // Convert the value to a string to ensure trim() works
    const stringValue = String(value).trim();

   

    if (!stringValue) {
      errorMsg = `${name} is required.`;
    } else if (name === 'salary' && (value < 1000 || value > 5000000)) {
      errorMsg = 'Enter a valid salary (between 1,000 and 5,000,000).';
    } else if (name === 'experience' && !/^(?:[1-5]?\d|60)$/.test(stringValue)) {
      errorMsg = 'Enter a valid experience (0 to 60 years).';
    } else if (name === 'jobTitle' && stringValue) {
      const digitCount = (stringValue.match(/\d/g) || []).length;
      if (digitCount > 2) {
        errorMsg = 'Enter a valid Job Title';
      }}
      else if (name === 'vaccancy' && stringValue) {
        const vacancyRegex = /^(?:[1-9][0-9]{0,2})$/; // Regex for numbers 1-999
        if (!vacancyRegex.test(stringValue)) {
          errorMsg = 'Vacancy must be a number between 1 and 999'; // Error message for invalid vacancy
        }
      }
     else if (name === 'location' && stringValue) {
      const digitCount = (stringValue.match(/\d/g) || []).length;
      if (digitCount > 2) {
        errorMsg = 'Enter A valid Location';
      }
    }
    else if (
      name === 'contactDetails' &&
      !(/^(?!.*(\d)\1{4,})\d{10}$/.test(stringValue) || /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/.test(stringValue))
    ) {
      errorMsg = 'Enter a valid contact (10-digit phone number or email address).';
    }



    return errorMsg;
  };


  // Handle validation on blur (when leaving the field)
  const handleBlur = (e, jobId) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [jobId]: { ...prevErrors[jobId], [name]: errorMessage },
    }));
  };

  const handleUpdateSubmit = async (jobId) => {
    const jobToUpdate = jobs.find((job) => job._id === jobId);

    // Check for errors before submitting
    let hasError = false;
    const newErrors = {};

    // Validate each field and collect errors
    Object.keys(jobToUpdate).forEach((key) => {
      const errorMsg = validateField(key, jobToUpdate[key]);
      if (errorMsg) {
        console.log(errorMsg)
        newErrors[key] = errorMsg;
        hasError = true; // Set hasError if there's a validation error
      }
    });

    // Only show error if there are actual validation errors
    if (hasError) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [jobId]: { ...newErrors },
      }));
      toast.error('Please fix the validation errors before submitting.');
      console.log(hasError)// Show toast only if there are errors
      return; // Prevent submission
    }

    try {
      await axios.put(`http://localhost:3000/jobs/${jobId}`, jobToUpdate);
      setEditRowId(null);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [jobId]: {}, // Reset errors for this job
      }));
      toast.success('Job updated successfully!'); // Show success toast message
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update the job.');
      toast.error('Failed to update the job.');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:3000/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success('Job deleted successfully!');
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete the job.');
      toast.error('Failed to delete the job.');
    }
  };
  const [openDialog, setOpenDialog] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);
const handleViewPayment = (job) => {
  setSelectedJob(job);
  setOpenDialog(true);
};
const amount=500;
const handlePayment = async (jobId) => {
  try {
    const orderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, jobId }), // Send amount and jobId to backend
    });
    const totalAmount=500
    const orderData = await orderResponse.json();

    const options = {
      key: '', // Replace with Razorpay Key ID
      amount: parseInt(totalAmount * 100),
      currency: "INR",
      name: 'Job Portal',
      description: 'Job Application Payment',
      
     
      handler: async function (response) {
  console.log("Received from Razorpay:", response); // Check for razorpay_signature here
  const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: orderData.id,
      payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature, // Check if this is undefined
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



  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarEmployer />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        Your Posted Jobs
      </Typography>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Location</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Salary</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Type</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Experience</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Vacancy</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Contact Details</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Posted Date</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Payment</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <StyledTableRow key={job._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <>
                        <input
                          type="text"
                          name="jobTitle"
                          value={job.jobTitle}
                          onChange={(e) => handleInputChange(e, job._id)}
                          onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
                        />
                        {validationErrors[job._id]?.jobTitle && (
                          <p style={{ color: 'red' }}>{validationErrors[job._id].jobTitle}</p>
                        )}
                      </>
                    ) : (
                      job.jobTitle
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <>
                        <input
                          type="text"
                          name="location"
                          value={job.location}
                          onChange={(e) => handleInputChange(e, job._id)}
                          onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
                        />
                        {validationErrors[job._id]?.location && (
                          <p style={{ color: 'red' }}>{validationErrors[job._id].location}</p>
                        )}
                      </>
                    ) : (
                      job.location
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <>
                        <input
                          type="number"
                          name="salary"
                          value={job.salary}
                          onChange={(e) => handleInputChange(e, job._id)}
                          onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
                        />
                        {validationErrors[job._id]?.salary && (
                          <p style={{ color: 'red' }}>{validationErrors[job._id].salary}</p>
                        )}
                      </>
                    ) : (
                      job.salary
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <select
                        name="jobType"
                        value={job.jobType}
                        onChange={(e) => handleInputChange(e, job._id)}
                        onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
                      >
                        <option value="frontend-developer">Frontend Developer</option>
                        <option value="ui-designer">UI Designer</option>
                        <option value="backend-developer">Backend Developer</option>
                        <option value="fullstack-developer">Fullstack Developer</option>
                        <option value="project-manager">Project Manager</option>
                        <option value="data-scientist">Data Scientist</option>
                        <option value="product-designer">Product Designer</option>
                        <option value="devops-engineer">DevOps Engineer</option>
                        <option value="qa-engineer">QA Engineer</option>
                        <option value="marketing-specialist">Marketing Specialist</option>
                        <option value="hr-manager">HR Manager</option>
                        <option value="content-writer">Content Writer</option>

                      </select>
                    ) : (
                      job.jobType
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <>
                        <input
                          type="number"
                          name="experience"
                          value={job.experience}
                          onChange={(e) => handleInputChange(e, job._id)}
                          onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
                        />
                        {validationErrors[job._id]?.experience && (
                          <p style={{ color: 'red' }}>{validationErrors[job._id].experience}</p>
                        )}
                      </>
                    ) : (
                      job.experience
                    )}

                  </StyledTableCell>
                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <>
                        <input
                          type="number"
                          name="vaccancy"
                          value={job.vaccancy}
                          onChange={(e) => handleInputChange(e, job._id)}
                          onBlur={(e) => handleBlur(e, job._id)} // Blur event for validation
                        />
                        {validationErrors[job._id]?.vaccancy && ( // Check for the correct field 'vaccancy'
                          <p style={{ color: 'red' }}>{validationErrors[job._id].vaccancy}</p> // Display the error message
                        )}
                      </>
                    ) : (
                      job.vaccancy
                    )}
                  </StyledTableCell>

                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <>
                        <input
                          type="text"
                          name="contactDetails"
                          value={job.contactDetails}
                          onChange={(e) => handleInputChange(e, job._id)}
                          onBlur={(e) => handleBlur(e, job._id)}
                        />
                        {validationErrors[job._id]?.contactDetails && (
                          <p style={{ color: 'red' }}>{validationErrors[job._id].contactDetails}</p>
                        )}

                      </>
                    ) : (
                      job.contactDetails
                    )}

                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>
                    {new Date(job.datePosted).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>
                    {(job.
                      approvalStatus)}
                  </StyledTableCell>
                  <StyledTableCell>
  <Button
    variant="contained"
    color={job.paymentStatus === 'Completed' ? 'primary' : 'inherit'}
    style={{
      backgroundColor: job.paymentStatus === 'Completed' ? '' : 'red',
      color: job.paymentStatus === 'Completed' ? '' : 'white',
    }}
    onClick={() => handleViewPayment(job)}
  >
    {job.paymentStatus === 'Completed' ? 'View' : 'Pay'}
  </Button>
</StyledTableCell>



                  <StyledTableCell>
                    <ButtonContainer>
                      {editRowId === job._id ? (
                        <>
                        
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdateSubmit(job._id)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setEditRowId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                        
                          {/* Only show Edit and Delete buttons if the job is not approved */}
                          {job.approvalStatus !== 'approved' && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setEditRowId(job._id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleDelete(job._id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </ButtonContainer>

                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={6}>No jobs posted yet.</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle style={{ backgroundColor: '#360275', color: 'white' }}>
    Payment Status
  </DialogTitle>
  <DialogContent style={{ padding: '20px' }}>
    <Typography variant="h6" gutterBottom>
      Job Title: {selectedJob?.jobTitle}
    </Typography>
    <Typography variant="body1" style={{ marginBottom: '10px' }}>
      Payment Status: {selectedJob?.paymentStatus}
    </Typography>
    {selectedJob?.paymentStatus === 'Pending' && (
      
      <Box style={{ backgroundColor: '#ffeeba', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
        <Typography variant="body2" color="error">
          Alert: Please note that the job will only be made public after payment is completed.
        </Typography>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    {selectedJob?.paymentStatus === 'Pending' && (
      <Button
        variant="contained"
        color="primary"
        onClick={()=>handlePayment(selectedJob._id)} 
      >
        Pay Now
      </Button>
    )}
    <Button variant="contained" onClick={() => setOpenDialog(false)} color="secondary">
      Close
    </Button>
  </DialogActions>
</Dialog>


      <ToastContainer /> {/* Include ToastContainer for notifications */}
    </Container>
  );
};

export default PostedJobs;
