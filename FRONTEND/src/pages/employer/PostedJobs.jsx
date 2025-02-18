import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, TextField, Chip, TablePagination, IconButton } from '@mui/material';
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
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavbarEmployer from './NavbarEmployer';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import { formatDate } from '../../utils/dateFormatter';

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
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem('jobListPage');
    return savedPage ? parseInt(savedPage) : 0;
  });
  const [rowsPerPage] = useState(7); // Set to 7 jobs per page
  const [paymentReceiptDialog, setPaymentReceiptDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Predefined options for skills and qualifications
  const skillOptions = [
    "JavaScript", "Python", "Java", "React", "Node.js", "Angular", "Vue.js",
    "PHP", "Ruby", "C++", "C#", "Swift", "Kotlin", "Go", "Rust",
    "HTML", "CSS", "TypeScript", "MongoDB", "MySQL", "PostgreSQL",
    "AWS", "Azure", "Docker", "Kubernetes", "Git", "DevOps",
    "Machine Learning", "AI", "Data Science", "Blockchain"
  ];

  const qualificationOptions = [
    "Bachelor's in Computer Science",
    "Bachelor's in Information Technology",
    "Bachelor's in Engineering",
    "Master's in Computer Science",
    "Master's in Information Technology",
    "PhD in Computer Science",
    "BCA",
    "MCA",
    "B.Tech",
    "M.Tech",
    "BSc Computer Science",
    "MSc Computer Science",
    "Bachelor's in Mathematics",
    "Diploma in Computer Science",
    "Any Degree"
  ];

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

  // Add this function to convert string to array
  const parseArrayField = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Split by comma and trim whitespace
      return value.split(',').map(item => item.trim());
    }
    return [];
  };

  // Modify handleInputChange for Autocomplete fields
  const handleInputChange = (e, jobId) => {
    const { name, value } = e.target;
    
    // Special handling for experience fields
    if (name === 'experience') {
      const job = jobs.find(j => j._id === jobId);
      const updatedExperience = { ...job.experience, ...value };
      const errorMessage = validateField('experience', updatedExperience);
      
      if (errorMessage) {
        setValidationErrors(prev => ({
          ...prev,
          [jobId]: { ...prev[jobId], experience: errorMessage }
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          [jobId]: { ...prev[jobId], experience: null }
        }));
      }

      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === jobId ? { ...job, experience: updatedExperience } : job
        )
      );
      return;
    }

    // Special handling for Autocomplete components
    if (name === 'skills' || name === 'qualifications') {
      const errorMessage = validateField(name, value);
      if (errorMessage) {
        setValidationErrors(prev => ({
          ...prev,
          [jobId]: { ...prev[jobId], [name]: errorMessage }
        }));
        return;
      }
    }

    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job._id === jobId) {
          // Handle skills and qualifications specially
          if (name === 'skills' || name === 'qualifications') {
            return { ...job, [name]: Array.isArray(value) ? value : parseArrayField(value) };
          }
          return { ...job, [name]: value };
        }
        return job;
      })
    );

    setValidationErrors(prev => ({
      ...prev,
      [jobId]: { ...prev[jobId], [name]: null }
    }));
  };

  // Validation function
  const validateField = (name, value) => {
    let errorMsg = '';

    if (!value && name !== 'companyName') {
      return `${name} is required.`;
    }

    switch (name) {
      case 'salary': {
        if (value < 1000 || value > 5000000) {
          errorMsg = 'Enter a valid salary (between 1,000 and 5,000,000).';
        }
        break;
      }
      case 'experience': {
        const { years, months } = value;
        if (years === '' && months === '') {
          errorMsg = 'Experience is required';
        } else {
          const numYears = parseInt(years) || 0;
          const numMonths = parseInt(months) || 0;
          
          if (numYears < 0 || numYears > 60) {
            errorMsg = 'Years should be between 0 and 60';
          } else if (numMonths < 0 || numMonths > 11) {
            errorMsg = 'Months should be between 0 and 11';
          }
        }
        break;
      }
      case 'jobTitle': {
        if (value) {
          const digitCount = (value.match(/\d/g) || []).length;
          if (digitCount > 2) {
            errorMsg = 'Enter a valid Job Title';
          }
        }
        break;
      }
      
      case 'location': {
        const digitCount = (value.match(/\d/g) || []).length;
        if (digitCount > 2) {
          errorMsg = 'Enter A valid Location';
        }
        break;
      }
      case 'vaccancy': {
        const vacancyRegex = /^(?:[1-9][0-9]{0,2})$/;
        if (!vacancyRegex.test(String(value).trim())) {
          errorMsg = 'Vacancy must be a number between 1 and 999';
        }
        break;
      }
      case 'contactDetails': {
        if (!(/^(?!.*(\d)\1{4,})\d{10}$/.test(String(value).trim()) || /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/.test(String(value).trim()))) {
          errorMsg = 'Enter a valid contact (10-digit phone number or email address).';
        }
        break;
      }
      case 'lastDate': {
        const selectedDate = new Date(value);
        const today = new Date();
        const minDate = new Date();
        minDate.setDate(today.getDate() + 5);
        
        if (selectedDate < minDate) {
          errorMsg = 'Last date must be at least 5 days from today';
        }
        break;
      }
      case 'skills': {
        if (Array.isArray(value)) {
          const invalidSkills = value.filter(skill => {
            if (/([a-zA-Z])\1\1/.test(skill)) {
              return true;
            }
            if (!/^[a-zA-Z\s.,']+$/.test(skill)) {
              return true;
            }
            return false;
          });

          if (invalidSkills.length > 0) {
            errorMsg = "Skills can only contain letters, spaces, '.', ',', and ''' and cannot have more than 2 consecutive same letters";
          }
        }
        break;
      }
case 'qualifications': {
        if (Array.isArray(value)) {
          const invalidQuals = value.filter(qual => {
            if (/([a-zA-Z])\1\1/.test(qual)) {
              return true;
            }
            if (!/^[a-zA-Z\s.,']+$/.test(qual)) {
              return true;
            }
            return false;
          });

          if (invalidQuals.length > 0) {
            errorMsg = "Qualifications can only contain letters, spaces, '.', ',', and ''' and cannot have more than 2 consecutive same letters";
          }
        }
        break;
      }

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

  // Modify handleUpdateSubmit function
  const handleUpdateSubmit = async (jobId) => {
    try {
      const jobToUpdate = jobs.find((job) => job._id === jobId);
      
      // Ensure skills and qualifications are arrays
      const updatedJob = {
        ...jobToUpdate,
        skills: parseArrayField(jobToUpdate.skills),
        qualifications: parseArrayField(jobToUpdate.qualifications)
      };

      // Only validate these fields
      const fieldsToValidate = [
        'jobTitle',
        'location',
        'salary',
        'jobType',
        'experience',
        'vaccancy',
        'contactDetails',
        'skills',
        'qualifications'
      ];

      let hasError = false;
      const newErrors = {};

      // Only validate specific fields
      fieldsToValidate.forEach((key) => {
        if (updatedJob[key] !== undefined) {
          const errorMsg = validateField(key, updatedJob[key]);
          if (errorMsg) {
            console.log(`Validation error for ${key}:`, errorMsg);
            newErrors[key] = errorMsg;
            hasError = true;
          }
        }
      });

      if (hasError) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [jobId]: { ...newErrors },
        }));
        toast.error('Please fix the validation errors before submitting.');
        return;
      }

      // Format the data before sending
      const dataToSend = {
        jobTitle: updatedJob.jobTitle,
        location: updatedJob.location,
        salary: updatedJob.salary,
        jobType: updatedJob.jobType,
        qualifications: Array.isArray(updatedJob.qualifications) 
          ? updatedJob.qualifications 
          : [updatedJob.qualifications],
        skills: Array.isArray(updatedJob.skills) 
          ? updatedJob.skills 
          : [updatedJob.skills],
        experience: updatedJob.experience,
        contactDetails: updatedJob.contactDetails,
        vaccancy: updatedJob.vaccancy
      };

      console.log('Sending update data:', dataToSend); // Debug log

      const response = await axios.put(`http://localhost:3000/jobs/${jobId}`, dataToSend);
      
      if (response.data) {
        // Update the jobs state with the new data
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job._id === jobId ? { ...job, ...response.data } : job
          )
        );
        
        setEditRowId(null);
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [jobId]: {},
        }));
        toast.success('Job updated successfully!');
      }
    } catch (err) {
      console.error('Error updating job:', err.response?.data || err.message);
      setError('Failed to update the job.');
      toast.error(err.response?.data?.message || 'Failed to update the job.');
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
  const handleViewPayment = async (job) => {
    if (job.paymentStatus === 'Completed') {
      const receipt = await fetchPaymentReceipt(job._id);
      if (receipt) {
        setSelectedReceipt(receipt);
        setPaymentReceiptDialog(true);
      }
    } else {
      setSelectedJob(job);
      setOpenDialog(true);
    }
  };
  const amount=500;
  const handlePayment = async (jobId) => {
    try {
      const orderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, jobId }),
      });
      const totalAmount = 500;
      const orderData = await orderResponse.json();

      if (!orderData.id) {
        toast.error('Failed to create payment order. Please try again.');
        return;
      }

      const options = {
        key: 'rzp_test_bD1Alu6Su7sKSO',
        amount: parseInt(totalAmount * 100),
        currency: "INR",
        name: 'Job Portal',
        description: 'Job Application Payment',
        order_id: orderData.id,
        notes: {
          jobId: jobId
        },
        handler: async function (response) {
          try {
            console.log("Received from Razorpay:", response);
            
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              console.error("Missing Razorpay parameters:", response);
              toast.error("Payment failed - Missing required parameters");
              return;
            }

            const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                jobId
              }),
            });

            const verifyData = await verifyResponse.json();
            console.log("Verification response:", verifyData);

            if (verifyData.success) {
              toast.success('Payment verified and approved!');
              // Close the dialog
              setOpenDialog(false);
              // Refresh the jobs data
              await refreshJobs();
              // Update the selected job's payment status
              setSelectedJob(prev => prev ? { ...prev, paymentStatus: 'Completed' } : null);
            } else {
              toast.error(verifyData.message || 'Payment verification failed.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: sessionStorage.getItem('name') || '',
          email: sessionStorage.getItem('email') || '',
          contact: sessionStorage.getItem('phone') || ''
        },
        theme: { color: '#F37254' },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error during payment:', error);
      toast.error('Payment initiation failed. Please try again.');
    }
  };

  // Modify the handleChangePage function
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('jobListPage', newPage.toString());
  };

  // Calculate the jobs to display on current page
  const paginatedJobs = jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Add this new function to fetch payment receipt
  const fetchPaymentReceipt = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/payment/receipts/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment receipt:', error);
      toast.error('Failed to fetch payment receipt');
      return null;
    }
  };

  // Add this function to refresh jobs data
  const refreshJobs = async () => {
    const userId = sessionStorage.getItem('userId');
    try {
      const response = await axios.get('http://localhost:3000/jobs/myjobs', {
        params: { userId: userId },
      });
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to refresh jobs data.');
    }
  };

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Optional: Clear the saved page when component unmounts
      // localStorage.removeItem('jobListPage');
    };
  }, []);

  // Add this helper function at the top of your component
  const getActivityStatus = (lastDate) => {
    if (!lastDate) return { status: 'Invalid Date', daysLeft: 0 };
    
    const today = new Date();
    const expiryDate = new Date(lastDate);
    
    // Reset time part for accurate day calculation
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    
    // Calculate days difference
    const diffTime = expiryDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { status: 'Expired', daysLeft: 0 };
    } else if (daysLeft === 0) {
      return { status: 'Expires Today', daysLeft: 0 };
    } else {
      return { status: 'Active', daysLeft };
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
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Salary₹</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Type</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Experience</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Vacancy</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Contact Details</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Posted Date</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Activity Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Skills</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Qualifications</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Payment</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job, index) => (
                <StyledTableRow key={job._id}>
                  <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
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
                      <Grid container spacing={2} sx={{ minWidth: '300px' }}>
                        <Grid item xs={6}>
                          <TextField
                            label="Years"
                            type="number"
                            name="experience.years"
                            value={job.experience.years}
                            onChange={(e) => handleInputChange({
                              target: {
                                name: 'experience',
                                value: {
                                  ...job.experience,
                                  years: e.target.value
                                }
                              }
                            }, job._id)}
                            onBlur={(e) => handleBlur({
                              target: {
                                name: 'experience',
                                value: job.experience
                              }
                            }, job._id)}
                            fullWidth
                            inputProps={{ min: 0, max: 60 }}
                            error={!!validationErrors[job._id]?.experience}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '10px',
                                width: '100%'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Months"
                            type="number"
                            name="experience.months"
                            value={job.experience.months}
                            onChange={(e) => handleInputChange({
                              target: {
                                name: 'experience',
                                value: {
                                  ...job.experience,
                                  months: e.target.value
                                }
                              }
                            }, job._id)}
                            onBlur={(e) => handleBlur({
                              target: {
                                name: 'experience',
                                value: job.experience
                              }
                            }, job._id)}
                            fullWidth
                            inputProps={{ min: 0, max: 11 }}
                            error={!!validationErrors[job._id]?.experience}
                            sx={{
                              '& .MuiInputBase-input': {
                                padding: '10px',
                                width: '100%'
                              }
                            }}
                          />
                        </Grid>
                        {validationErrors[job._id]?.experience && (
                          <Grid item xs={12}>
                            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                              {validationErrors[job._id].experience}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    ) : (
                      <Box sx={{ minWidth: '150px' }}>
                        {`${job.experience.years} year(s) ${job.experience.months} month(s)`}
                      </Box>
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
                    {formatDate(job.datePosted)}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>
                    {(() => {
                      const { status, daysLeft } = getActivityStatus(job.lastDate);
                      return (
                        <Box>
                          <Chip
                            label={status}
                            color={status === 'Active' ? 'success' : status === 'Expires Today' ? 'warning' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                          {status === 'Active' && (
                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                              {daysLeft} days left
                            </Typography>
                          )}
                        </Box>
                      );
                    })()}
                  </StyledTableCell>
                 
                  <StyledTableCell style={{ textAlign: 'center' }}>
                    {(job.approvalStatus)}
                  </StyledTableCell>

                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={skillOptions}
                        value={parseArrayField(job.skills)}
                        onChange={(event, newValue) => 
                          handleInputChange({ 
                            target: { 
                              name: 'skills', 
                              value: newValue 
                            } 
                          }, job._id)
                        }
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              style={{ margin: 2 }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Skills"
                            error={!!validationErrors[job._id]?.skills}
                            helperText={validationErrors[job._id]?.skills}
                          />
                        )}
                      />
                    ) : (
                      parseArrayField(job.skills).join(', ')
                    )}
                  </StyledTableCell>

                  <StyledTableCell>
                    {editRowId === job._id ? (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={qualificationOptions}
                        value={parseArrayField(job.qualifications)}
                        onChange={(event, newValue) => 
                          handleInputChange({ 
                            target: { 
                              name: 'qualifications', 
                              value: newValue 
                            } 
                          }, job._id)
                        }
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              style={{ margin: 2 }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Qualifications"
                            error={!!validationErrors[job._id]?.qualifications}
                            helperText={validationErrors[job._id]?.qualifications}
                          />
                        )}
                      />
                    ) : (
                      parseArrayField(job.qualifications).join(', ')
                    )}
                  </StyledTableCell>

                  <StyledTableCell>
                    {job.approvalStatus === 'approved' && (  // Only show for approved jobs
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
                    )}
                    {job.approvalStatus !== 'approved' && (
                      <Chip
                        label="Pending Approval"
                        color="warning"
                        size="small"
                      />
                    )}
                  </StyledTableCell>

                  <StyledTableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {editRowId === job._id ? (
                        <>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleUpdateSubmit(job._id)}
                            title="Save"
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setEditRowId(null)}
                            title="Cancel"
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {/* Only show Edit and Delete icons if the job is not approved */}
                          {job.approvalStatus !== 'approved' && (
                            <>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => setEditRowId(job._id)}
                                title="Edit"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                  },
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(job._id)}
                                title="Delete"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </>
                      )}
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={15} style={{ textAlign: 'center' }}>
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Add Pagination Component */}
        <TablePagination
          component="div"
          count={jobs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[7]} // Lock to 7 rows per page
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
              display: 'none',
            },
            '.MuiTablePagination-displayedRows': {
              margin: '0 auto',
            },
          }}
        />
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

      <Dialog 
        open={paymentReceiptDialog} 
        onClose={() => setPaymentReceiptDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle 
          style={{ 
            backgroundColor: '#360275', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Payment Receipt
          <IconButton 
            onClick={() => setPaymentReceiptDialog(false)}
            style={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: '20px' }}>
          {selectedReceipt && (
            <Box sx={{ '& > *': { mb: 2 } }}>
              <Typography variant="h6" gutterBottom>
                Receipt Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Receipt ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedReceipt._id}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Payment Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedReceipt.paymentDate).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Amount Paid
                  </Typography>
                  <Typography variant="body1">
                    ₹{selectedReceipt.amount}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Payment ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedReceipt.paymentId}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedReceipt.status}
                    color={selectedReceipt.status === 'success' ? 'success' : 'error'}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  This is an electronic receipt for your payment. Please keep it for your records.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            onClick={() => window.print()}
            startIcon={<PrintIcon />}
          >
            Print Receipt
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setPaymentReceiptDialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default PostedJobs;
