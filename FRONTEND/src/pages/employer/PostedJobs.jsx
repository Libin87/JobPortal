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

//   useEffect(() => {
//     const fetchJobs = async () => {
//       const userId = sessionStorage.getItem('userId'); 

//       try {
//         const response = await axios.get(`http://localhost:3000/jobs/myjobs`, {
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

//   const handleEditClick = (jobId) => {
//     setEditRowId(jobId); 
//   };

//   const handleInputChange = (e, jobId) => {
//     const { name, value } = e.target;
//     setJobs((prevJobs) =>
//       prevJobs.map((job) =>
//         job._id === jobId ? { ...job, [name]: value } : job
//       )
//     );
//   };

//   const handleUpdateSubmit = async (jobId) => {
//     const jobToUpdate = jobs.find((job) => job._id === jobId);

//     try {
//       await axios.put(`http://localhost:3000/jobs/${jobId}`, jobToUpdate);
//       setEditRowId(null); 
//     } catch (err) {
//       console.error('Error updating job:', err);
//       setError('Failed to update the job.');
//     }
//   };

//   const handleDelete = async (jobId) => {
//     try {
//       await axios.delete(`http://localhost:3000/jobs/${jobId}`);
//       setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
//     } catch (err) {
//       console.error('Error deleting job:', err);
//       setError('Failed to delete the job.');
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
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Company</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Location</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Salary</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Type</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Experience</StyledTableCell>
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
//                       <input
//                         type="text"
//                         name="jobTitle"
//                         value={job.jobTitle}
//                         onChange={(e) => handleInputChange(e, job._id)}
//                       />
//                     ) : (
//                       job.jobTitle
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <input
//                         type="text"
//                         name=""
//                         value={job.}
//                         onChange={(e) => handleInputChange(e, job._id)}
//                       />
//                     ) : (
//                       job.
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <input
//                         type="text"
//                         name="location"
//                         value={job.location}
//                         onChange={(e) => handleInputChange(e, job._id)}
//                       />
//                     ) : (
//                       job.location
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <input
//                         type="text"
//                         name="salary"
//                         value={job.salary}
//                         onChange={(e) => handleInputChange(e, job._id)}
//                       />
//                     ) : (
//                       job.salary
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <input
//                         type="text"
//                         name="jobType"
//                         value={job.jobType}
//                         onChange={(e) => handleInputChange(e, job._id)}
//                       />
//                     ) : (
//                       job.jobType
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     {editRowId === job._id ? (
//                       <input
//                         type="text"
//                         name="experience"
//                         value={job.experience}
//                         onChange={(e) => handleInputChange(e, job._id)}
//                       />
//                     ) : (
//                       job.experience
//                     )}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <ButtonContainer>
//                       {editRowId === job._id ? (
//                         <>
//                           <Button
//                             variant="contained"
//                             style={{ backgroundColor: 'green', color: 'white' }}
//                             onClick={() => handleUpdateSubmit(job._id)}
//                           >
//                             Save
//                           </Button>
//                           <Button
//                             variant="contained"
//                             style={{ backgroundColor: 'red', color: 'white' }}
//                             onClick={() => setEditRowId(null)} 
//                           >
//                             Cancel
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button
//                             variant="contained"
//                             style={{ backgroundColor: 'blue', color: 'white' }}
//                             onClick={() => handleEditClick(job._id)}
//                           >
//                             Edit
//                           </Button>
//                           <Button
//                             variant="contained"
//                             style={{ backgroundColor: 'red', color: 'white' }}
//                             onClick={() => handleDelete(job._id)}
//                           >
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </ButtonContainer>
//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <StyledTableCell colSpan={8} align="center">
//                   No jobs posted yet.
//                 </StyledTableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default PostedJobs;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
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
    } else if (name === 'salary' && value < 0) {
      errorMsg = 'Salary cannot be negative.';
    } else if (name === 'experience' && !/^\d+$/.test(stringValue)) {
      errorMsg = 'Experience must be a number.';
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
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Posted Date</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
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
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
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
                  <StyledTableCell style={{ textAlign: 'center' }}>
                    {new Date(job.datePosted).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>
                    {(job.
                      approvalStatus)}
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

      <ToastContainer /> {/* Include ToastContainer for notifications */}
    </Container>
  );
};

export default PostedJobs;
