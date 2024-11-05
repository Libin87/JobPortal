


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
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   Avatar,
//   Card,
//   Grid,
//   Box
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { styled } from '@mui/material/styles';
// import NavbarEmployee from './NavbarEmployee';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

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

// const JobApplications = () => {
//   const [applications, setApplications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [companyProfileOpen, setCompanyProfileOpen] = useState(false);
//   const [companyDetails, setCompanyDetails] = useState(null);
//   const userId = sessionStorage.getItem('userId'); 

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/jobs/applications`, { params: { userId } });
//         setApplications(response.data);
//       } catch (error) {
//         toast.error("Error fetching applications");
//       }
//     };
//     fetchApplications();
//   }, [userId]);

//   const handleViewDetails = (application) => {
//     setSelectedApplication(application);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedApplication(null);
//   };

//   const fetchCompanyDetails = async (employerId) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/profile/${employerId}`);
//       setCompanyDetails(response.data);
//       setCompanyProfileOpen(true);
//     } catch (error) {
//       toast.error("Error fetching company details");
//     }
//   };

//   const handleCompanyProfileClose = () => {
//     setCompanyProfileOpen(false);
//     setCompanyDetails(null);
//   };

//   return (
//     <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
//       <NavbarEmployee />
//       <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
//         My Job Applications
//       </Typography>

//       <TableContainer component={Paper} style={{ marginTop: '20px' }}>
//         <Table style={{ width: '100%' }}>
//           <TableHead>
//             <TableRow>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Company</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Applied At</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {applications.length > 0 ? (
//               applications.map((application, index) => (
//                 <StyledTableRow key={application._id}>
//                   <StyledTableCell>{index + 1}</StyledTableCell>
//                   <StyledTableCell>{application.jobTitle}</StyledTableCell>
//                   <StyledTableCell>{application.companyName}</StyledTableCell>
//                   <StyledTableCell>{new Date(application.appliedAt).toLocaleDateString('en-GB')}</StyledTableCell> 
//                   <StyledTableCell>{application.approvalStatus}</StyledTableCell>
//                   <StyledTableCell>
//                     <Button variant="contained" color="primary" onClick={() => handleViewDetails(application.jobId)}>
//                       View Details
//                     </Button>
//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))
//             ) : (
//               <StyledTableRow>
//                 <StyledTableCell colSpan={6}>No applications found.</StyledTableCell>
//               </StyledTableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         {selectedApplication && (
//           <>
//             <DialogTitle style={{
//               position: 'relative', textAlign: 'center', paddingRight: '40px', backgroundColor: '#360275',
//               color: '#fff',
//             }}>
//               <Typography variant="h6">{selectedApplication.jobTitle}</Typography>
//               <IconButton onClick={handleClose} style={{ position: 'absolute', right: 0, top: 0 }}>
//                 <CloseIcon />
//               </IconButton>
//             </DialogTitle>
//             <DialogContent>
//               <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px' }}>
//                 <Typography variant="h5" gutterBottom>Job Details</Typography>
//                 <Typography variant="body2" color="textSecondary">Company: {selectedApplication.companyName}</Typography>
//                 <Typography variant="body2" color="textSecondary">Location: {selectedApplication.location}</Typography>
//                 <Typography variant="body2" color="textSecondary">Salary: {selectedApplication.salary}</Typography>
//                 <Typography variant="body2" color="textSecondary">Skills: {selectedApplication.skills}</Typography>
//                 <Typography variant="body2" color="textSecondary">Description: {selectedApplication.jobDescription}</Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => fetchCompanyDetails(selectedApplication.employerId)} // companyId passed here
//                   style={{ marginTop: '20px' }}
//                 >
//                   View Company Profile
//                 </Button>
//               </Card>
//             </DialogContent>
//           </>
//         )}
//       </Dialog>

//       <Dialog open={companyProfileOpen} onClose={handleCompanyProfileClose} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Typography variant="h5">Company Profile</Typography>
//           <IconButton onClick={handleCompanyProfileClose} style={{ position: 'absolute', right: 0, top: 0 }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           {companyDetails ? (
//             <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px' }}>
//   <Grid container spacing={2}>
//     {/* Left Side: Logo and Company Name */}
//     <Grid item xs={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <Avatar
//         src={`http://localhost:3000/${companyDetails.logoUrl}`}
//         alt="Company Logo"
//         style={{ width: '100px', height: '100px', marginBottom: '10px' }}
//       />
//       <Typography variant="h6" align="center">{companyDetails.cname}</Typography>
//     </Grid>

//     {/* Right Side: Company Details */}
//     <Grid item xs={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//       <Typography variant="body2" color="textSecondary">Email: {companyDetails.email}</Typography>
//       <Typography variant="body2" color="textSecondary">Location: {companyDetails.address}</Typography>
//       <Typography variant="body2" color="textSecondary">Website: {companyDetails.website}</Typography>
//       <Typography variant="body2" color="textSecondary">Tagline: {companyDetails.tagline}</Typography>
//     </Grid>
//   </Grid>
// </Card>

//           ) : (
//             <Typography>Loading company details...</Typography>
//           )}
//         </DialogContent>
//       </Dialog>

//       <ToastContainer />
//     </Container>
//   );
// };

// export default JobApplications;



//   import React, { useEffect, useState } from 'react';
//   import axios from 'axios';
//   import {
//     Container,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     IconButton,
//     Avatar,
//     Card,
//     Box
//   } from '@mui/material';
//   import CloseIcon from '@mui/icons-material/Close';
//   import { styled } from '@mui/material/styles';
//   import NavbarEmployee from './NavbarEmployee';
//   import { ToastContainer, toast } from 'react-toastify';
//   import 'react-toastify/dist/ReactToastify.css';

//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     textAlign: 'center',
//     padding: '10px',
//   }));

//   const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     backgroundColor: '#f2f2f2',
//     '&:hover': {
//       backgroundColor: '#e0e0e0',
//     },
//   }));

//   const JobApplications = () => {
//     const [applications, setApplications] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [selectedApplication, setSelectedApplication] = useState(null);
//     const userId = sessionStorage.getItem('userId');  // Assuming employee ID is stored here

//     useEffect(() => {
//       const fetchApplications = async () => {
//         try {
//           const response = await axios.get(`http://localhost:3000/jobs/applications`, {
//             params: { userId },
//           });
//           setApplications(response.data);
//         } catch (error) {
//           toast.error("Error fetching applications");
//         }
//       };
//       fetchApplications();
//     }, [userId]);

//     const handleViewDetails = async (jobId) => {
//       try {
//         const response = await axios.get(`http://localhost:3000/jobs/viewjob`);
//         // Find the job in the response data that matches the selected jobId
//         const job = response.data.find((job) => job._id === jobId);
//     console.log(job)
//         if (job) {
//           setSelectedApplication(job);
//           setOpen(true);
//         } else {
//           toast.error("Job details not found");
//         }
//       } catch (error) {
//         toast.error("Error fetching job details");
//       }
//     };
    

//     const handleClose = () => {
//       setOpen(false);
//       setSelectedApplication(null);
//     };

//     return (
//       <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
//         <NavbarEmployee />
//         <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
//           My Job Applications
//         </Typography>

//         <TableContainer component={Paper} style={{ marginTop: '20px' }}>
//           <Table style={{ width: '100%' }}>
//             <TableHead>
//               <TableRow>
//                 <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
//                 <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
//                 <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Company</StyledTableCell>
//                 <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Applied At</StyledTableCell>
//                 <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
//                 <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {applications.length > 0 ? (
//                 applications.map((application, index) => (
//                   <StyledTableRow key={application._id}>
//                     <StyledTableCell>{index + 1}</StyledTableCell>
//                     <StyledTableCell>{application.jobTitle}</StyledTableCell>
//                     <StyledTableCell>{application.companyName}</StyledTableCell>
//                     <StyledTableCell>{new Date(application.appliedAt).toLocaleDateString('en-GB')}</StyledTableCell> 
//                     <StyledTableCell>{application.approvalStatus}</StyledTableCell>
//                     <StyledTableCell>
//                       <Button variant="contained" color="primary" onClick={() => handleViewDetails(application.jobId)}>
//                         View Details
//                       </Button>
//                     </StyledTableCell>
//                   </StyledTableRow>
//                 ))
//               ) : (
//                 <StyledTableRow>
//                   <StyledTableCell colSpan={5}>No applications found.</StyledTableCell>
//                 </StyledTableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Dialog for Application Details */}
//         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//   <DialogTitle sx={{ backgroundColor: '#360275', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//     <Typography variant="h5">Application Details</Typography>
//     <IconButton onClick={handleClose} sx={{ color: 'white' }}>
//       <CloseIcon />
//     </IconButton>
//   </DialogTitle>
  
//   <DialogContent sx={{ p: 3, backgroundColor: '#f2f2f7' }}>
//     <Card sx={{
//       p: 3,
//       backgroundColor: 'white',
//       borderRadius: 2,
//       boxShadow: 1,
//     }}>
//       {selectedApplication ? (
//         <>
//           <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
//             {selectedApplication.jobTitle}
//           </Typography>

//           {[
//             { label: 'Company Name', value: selectedApplication.companyName },
//             { label: 'Location', value: selectedApplication.location },
//             { label: 'Salary', value: selectedApplication.salary },
//             { label: 'Job Type', value: selectedApplication.jobType },
//             { label: 'Qualifications', value: selectedApplication.qualifications },
//             { label: 'Skills Required', value: Array.isArray(selectedApplication.skills) ? selectedApplication.skills.join(', ') : 'N/A' },
//             { label: 'Experience', value: `${selectedApplication.experience} years` },
//             { label: 'Contact Details', value: selectedApplication.contactDetails },
//             { label: 'Last Date to Apply', value: selectedApplication.lastDate ? new Date(selectedApplication.lastDate).toLocaleDateString('en-GB') : 'N/A' }
//           ].map((item, index) => (
//             <Typography key={index} variant="body2" gutterBottom sx={{ color: '#666', mb: 1 }}>
//               <strong>{item.label}:</strong> {item.value}
//             </Typography>
//           ))}

//           <Button
//             variant="contained"
//             color="primary"
//              onClick={() => fetchCompanyDetails(applications.employerId)} // Update ID/function as needed
//             sx={{ mt: 2 }}
//           >
//             View Company Profile
//           </Button>
//         </>
//       ) : (
//         <Typography variant="body1">Loading application details...</Typography>
//       )}
//     </Card>
//   </DialogContent>
// </Dialog>



//         <ToastContainer />
//       </Container>
//     );
//   };

//   export default JobApplications;

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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Card,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import NavbarEmployee from './NavbarEmployee';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledTableCell = styled(TableCell)({
  textAlign: 'center',
  padding: '10px',
});

const StyledTableRow = styled(TableRow)({
  backgroundColor: '#f2f2f2',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [companyProfileOpen, setCompanyProfileOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);

  const userId = sessionStorage.getItem('userId'); // Assuming employee ID is stored here

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/jobs/applications`, {
          params: { userId },
        });
        setApplications(response.data);
      } catch (error) {
        toast.error("Error fetching applications");
      }
    };
    fetchApplications();
  }, [userId]);

  const handleViewDetails = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:3000/jobs/viewjob`);
      const job = response.data.find((job) => job._id === jobId);
      if (job) {
        setSelectedApplication(job);
        setOpen(true);
      } else {
        toast.error("Job details not found");
      }
    } catch (error) {
      toast.error("Error fetching job details");
    }
  };

  const fetchCompanyDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/profile/${userId}`);
      setCompanyDetails(response.data);
      setCompanyProfileOpen(true);
    } catch (error) {
      toast.error("Error fetching company details");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApplication(null);
  };

  const handleCompanyProfileClose = () => {
    setCompanyProfileOpen(false);
    setCompanyDetails(null);
  };

  return (
    <Container style={{ maxWidth: '100%', margin: '0 auto' }}>
      <NavbarEmployee />
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#360275' }}>
        My Job Applications
      </Typography>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>#</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Job Title</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Company</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Applied At</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Status</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#360275', color: 'white' }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((application, index) => (
                <StyledTableRow key={application._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{application.jobTitle}</StyledTableCell>
                  <StyledTableCell>{application.companyName}</StyledTableCell>
                  <StyledTableCell>{new Date(application.appliedAt).toLocaleDateString('en-GB')}</StyledTableCell>
                  <StyledTableCell>{application.approvalStatus}</StyledTableCell>
                  <StyledTableCell>
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(application.jobId)}>
                      View Details
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5}>No applications found.</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Application Details */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#360275', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Application Details</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, backgroundColor: '#f2f2f7' }}>
          <Card sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
            {selectedApplication ? (
              <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                  {selectedApplication.jobTitle}
                </Typography>

                {[
                  { label: 'Company Name', value: selectedApplication.companyName },
                  { label: 'Location', value: selectedApplication.location },
                  { label: 'Salary', value: selectedApplication.salary },
                  { label: 'Job Type', value: selectedApplication.jobType },
                  { label: 'Qualifications', value: selectedApplication.qualifications },
                  { label: 'Skills Required', value: Array.isArray(selectedApplication.skills) ? selectedApplication.skills.join(', ') : 'N/A' },
                  { label: 'Experience', value: `${selectedApplication.experience} years` },
                  { label: 'Contact Details', value: selectedApplication.contactDetails },
                  { label: 'Last Date to Apply', value: selectedApplication.lastDate ? new Date(selectedApplication.lastDate).toLocaleDateString('en-GB') : 'N/A' }
                ].map((item, index) => (
                  <Typography key={index} variant="body2" gutterBottom sx={{ color: '#666', mb: 1 }}>
                    <strong>{item.label}:</strong> {item.value}
                  </Typography>
                ))}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchCompanyDetails(selectedApplication.userId)} // Update ID/function as needed
                  sx={{ mt: 2 }}
                >
                  View Company Profile
                </Button>
              </>
            ) : (
              <Typography variant="body1">Loading application details...</Typography>
            )}
          </Card>
        </DialogContent>
      </Dialog>

      {/* Dialog for Company Profile */}
      <Dialog open={companyProfileOpen} onClose={handleCompanyProfileClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#360275', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Company Profile</Typography>
          <IconButton onClick={handleCompanyProfileClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: '#f7f7f7', p: 3 }}>
          <Card sx={{ p: 2, display: 'flex', flexDirection: 'row', backgroundColor: '#fff', borderRadius: '10px' }}>
            {companyDetails ? (
              <>
                <div style={{ flex: 1, textAlign: 'left', marginRight: '20px' }}>
                  <Avatar
                    src={`http://localhost:3000/${companyDetails.logoUrl}`}
                    alt="Company Logo"
                    sx={{ width: 100, height: 100, mb: 1 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "path/to/default-image.png";
                    }}
                  />
                  <Typography variant="h5">{companyDetails.cname}</Typography>
                </div>

                <div style={{ flex: 2 }}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    <strong>Email:</strong> {companyDetails.email}
                  </Typography>
                  
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    <strong>Website:</strong> {companyDetails.website}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    <strong>Address:</strong> {companyDetails.address}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    <strong>Tagline</strong> {companyDetails.tagline}
                  </Typography>
                </div>
              </>
            ) : (
              <Typography variant="body1">Loading company details...</Typography>
            )}
          </Card>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default JobApplications;
