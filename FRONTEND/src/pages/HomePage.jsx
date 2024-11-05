


// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Footer from '../components/Footer';
// import NavbarAdmin from './admin/NavbarAdmin';
// import NavbarEmployee from './employee/NavbarEmployee';
// import NavbarEmployer from './employer/NavbarEmployer';
// import { Avatar, Container, Divider, ListItem, ListItemText, Button, Card, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import axios from 'axios';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import BusinessIcon from '@mui/icons-material/Business';
// import WorkIcon from '@mui/icons-material/Work';
// import TodayIcon from '@mui/icons-material/Today';
// import EmailIcon from '@mui/icons-material/Email';
// import BadgeIcon from '@mui/icons-material/Badge';
// import SchoolIcon from '@mui/icons-material/School';
// import DescriptionIcon from '@mui/icons-material/Description';
// import BuildIcon from '@mui/icons-material/Build';
// import CloseIcon from '@mui/icons-material/Close';
// import IconButton from '@mui/material/IconButton';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles


// const HomePage = () => {
//   const [role, setRole] = useState('guest');
//   const [jobs, setJobs] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [companyProfileOpen, setCompanyProfileOpen] = useState(false);
//   const [companyDetails, setCompanyDetails] = useState(null); // State to store company details
//   const [loading, setLoading] = useState(false); // State to track loading

//   const navigate = useNavigate();

//   useEffect(() => {
//     const userRole = sessionStorage.getItem('role');
//     if (userRole) {
//       setRole(userRole);
//     }

//     const fetchJobs = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/jobs/approvedHome');
//         setJobs(response.data);
//         console.log('Fetched jobs:', response.data);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//         alert("Failed to fetch jobs. Please try again.");
//       }
//     };

//     fetchJobs();
//   }, [navigate]);


//   const handleClickOpen = (job) => {
//     setSelectedJob(job);    // Sets the job in the local state for further operations
//     sessionStorage.setItem('selectedJobId', job._id);
//     sessionStorage.setItem('selectedJob', job.jobTitle);  // Saves the jobId to sessionStorage
//     sessionStorage.setItem('employerId', job.userId);
//     sessionStorage.setItem('companyName', job.companyName);

//     setOpen(true);          // Opens the dialog or modal
//   };
  

//   const handleClose = () => {
//     setOpen(false);
//   };

//   // Handle opening and closing of company profile dialog
//   const handleCompanyProfileOpen = () => {
//     setCompanyProfileOpen(true);
//   };

//   const handleCompanyProfileClose = () => {
//     setCompanyProfileOpen(false);
//   };
//   const fetchCompanyDetails = async (userId) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3000/profile/${userId}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setCompanyDetails(data);
//       setCompanyProfileOpen(true); // Open the dialog after fetching details
//     } catch (error) {
//       console.error("Error fetching company details:", error);
//       alert("Failed to fetch company details. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [message, setMessage] = useState('');



//   const handleApply = async () => {
//     try {
//       const userId = sessionStorage.getItem('userId');
//       const jobId = sessionStorage.getItem('selectedJobId');
//       const employerId = sessionStorage.getItem('employerId');
//       const companyName = sessionStorage.getItem('companyName');
//       const logo = sessionStorage.getItem('logo');
      
//       console.log('JOB ID:', jobId);
//       console.log('User ID:', userId);
//       const jobTitle = sessionStorage.getItem('selectedJob');

  
//       // Fetch user profile data
//       const profileResponse = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
      
//       // Assuming the profile response contains the needed fields
//       const {
//         name,
//         email,
//         experience,
//         degree,
        
//         resume,  // Make sure the resume field is included in your API response
//         address,
//         skills,
//         jobPreferences,
//         photo,   // Ensure that this is included in your API response
//         dob,
//         phone,
//       } = profileResponse.data; // Adjust according to the actual response structure
  
//       // Prepare the application data
//       const applicationData = {
//         userId,
//         jobId,
//         jobTitle,
//         companyName,
//         name,
//         email,
//         experience,
//         degree,
//         jobTitle,
//         resume,
//         address,
//         skills,
//         jobPreferences,
//         photo,
//         dob,
//         phone,
//         employerId,
//       };
  
//       // Send application data to the server
//       const response = await axios.post('http://localhost:3000/jobs/apply', applicationData);
  
//       // Show success toast
//       toast.success(response.data.message, {
//         onClose: () => console.log('Success toast closed'),  // Optional handler
//       });
//     } catch (error) {
//       const errorMessage = error.response ? error.response.data.message : 'An error occurred';
  
//       // Show error toast
//       toast.error(errorMessage, {
//         onClose: () => console.log('Error toast closed'),  // Optional handler
//       });
//     }
//   };
  
//   return (
//     <div style={styles.wrapper}>
//       {role === 'guest' && <Navbar />}
//       {role === 'admin' && <NavbarAdmin />}
//       {role === 'employee' && <NavbarEmployee />}
//       {role === 'employer' && <NavbarEmployer />}

//       <section style={styles.hero}>
//         <div className="container text-center text-white">
//           <h1 style={styles.heroTitle}>Welcome to JobPortal</h1>
//           <p style={styles.heroSubtitle}>Your gateway to finding the best jobs and top talents</p>
//           {role === 'guest' && (
//             <a href="/signup" className="btn btn-lg mt-4" style={styles.getStartedButton}>
//               Get Started
//             </a>
//           )}
//         </div>
//       </section>

//       <section style={styles.features}>
//         <div className="container">
//           <div className="row text-center">
//             {['Find Jobs', 'Top Companies', 'Career Growth'].map((feature, index) => (
//               <div className="col-md-4" key={index}>
//                 <i className={`fas fa-${index === 0 ? 'briefcase' : index === 1 ? 'users' : 'chart-line'} fa-3x mb-3`} style={styles.icon}></i>
//                 <h4>{feature}</h4>
//                 <p>Explore thousands of job listings across various industries.</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section style={styles.testimonials}>
//         <Container style={{ textAlign: 'center', backgroundColor: '#360275', color: 'aliceblue', marginBottom: '20px', borderRadius: '50px', maxWidth: '97rem' }}>
//           <h2>LATEST JOBS</h2>
//         </Container>
//         <Container style={styles.listContainer}>
//           <div style={styles.columnsWrapper}>
//             {/* First Column */}
//             <div style={styles.column}>
//               {jobs.filter((_, index) => index % 2 === 0).map((job) => (
//                 <React.Fragment key={job._id}>
//                   <ListItem style={styles.listItem}>
//                     <Avatar
//                       src={`http://localhost:3000/${job.logoUrl}`}
//                       alt="Company Logo"
//                       style={styles.logo}
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "path/to/default-image.png";
//                       }}
//                     />
//                     <ListItemText
//                       primary={
//                         <Typography variant="h6" style={styles.jobTitle}>
//                           {job.jobTitle}
//                         </Typography>
//                       }
//                       secondary={
//                         <>
//                           <div style={styles.iconText}>
//                             <LocationOnIcon color="action" style={styles.icon} />
//                             <Typography variant="body2" color="textSecondary">
//                               Location: {job.location}
//                             </Typography>
//                           </div>
//                           <div style={styles.iconText}>
//                             <CurrencyRupeeIcon color="action" style={styles.icon} />
//                             <Typography variant="body2" color="textSecondary">
//                               Salary: {job.salary}
//                             </Typography>
//                           </div>
//                         </>
//                       }
//                     />
//                     {role === 'employee' && (
//                       <Button variant="contained" color="primary" style={styles.viewmore} onClick={() => handleClickOpen(job)}>
//                         View More
//                       </Button>
//                     )}
//                   </ListItem>
//                   <Divider component="li" />
//                 </React.Fragment>
//               ))}
//             </div>

//             {/* Second Column */}
//             <div style={styles.column}>
//               {jobs.filter((_, index) => index % 2 !== 0).map((job) => (
//                 <React.Fragment key={job._id}>
//                   <ListItem style={styles.listItem}>
//                     <Avatar
//                       src={`http://localhost:3000/${job.logoUrl}`}
//                       alt="Company Logo"
//                       style={styles.logo}
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "path/to/default-image.png";
//                       }}
//                     />
//                     <ListItemText
//                       primary={
//                         <Typography variant="h6" style={styles.jobTitle}>
//                           {job.jobTitle}
//                         </Typography>
//                       }
//                       secondary={
//                         <>
//                           <div style={styles.iconText}>
//                             <BusinessIcon color="action" style={styles.icon} />
//                             <Typography variant="body2" color="textSecondary">
//                               Company: {job.companyName}
//                             </Typography>
//                           </div>
//                           <div style={styles.iconText}>
//                             <LocationOnIcon color="action" style={styles.icon} />
//                             <Typography variant="body2" color="textSecondary">
//                               Location: {job.location}
//                             </Typography>
//                           </div>
//                           <div style={styles.iconText}>
//                             <CurrencyRupeeIcon color="action" style={styles.icon} />
//                             <Typography variant="body2" color="textSecondary">
//                               Salary: {job.salary}
//                             </Typography>
//                           </div>
//                         </>
//                       }
//                     />
//                     {role === 'employee' && (
//                       <Button variant="contained" color="primary" style={styles.viewmore} onClick={() => handleClickOpen(job)}>
//                         View More
//                       </Button>
//                     )}
//                   </ListItem>
//                   <Divider component="li" />
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
//         </Container>

//         <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//           {selectedJob && (
//             <>
//               <DialogTitle style={{
//                 position: 'relative', textAlign: 'center', paddingRight: '40px', backgroundColor: '#360275',
//                 color: '#fff',
//               }}>
//                 <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
//                   {selectedJob.jobTitle}
//                 </Typography>
//                 <IconButton onClick={handleClose} style={{ position: 'absolute', right: 0, top: 0 }}>
//                   <CloseIcon />
//                 </IconButton>
//               </DialogTitle>

//               <DialogContent>
//               <ToastContainer />
//                 <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px' }}>
//                   <Typography variant="h5" gutterBottom>
//                     Job Details
//                   </Typography>
//                   <div style={styles.iconText}>
//                     <BusinessIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Company: {selectedJob.companyName}
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <LocationOnIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Location: {selectedJob.location}
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <CurrencyRupeeIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Salary: {selectedJob.salary}
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <TodayIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Last Date to Apply: {new Date(selectedJob.lastDate).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'  
//                       })}
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <WorkIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Job Type: {selectedJob.jobType}
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <BadgeIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Experience: {selectedJob.experience} years
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <SchoolIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Qualifications: {selectedJob.qualifications}
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <BuildIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Skills: {selectedJob.skills}
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <DescriptionIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Job Description: {selectedJob.jobDescription}
//                     </Typography>
//                   </div>
//                   <div style={styles.iconText}>
//                     <EmailIcon color="action" style={styles.icon} />
//                     <Typography variant="body2" color="textSecondary">
//                       Contact Details: {selectedJob.contactDetails}
//                     </Typography>
//                   </div>
//                   <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => fetchCompanyDetails(selectedJob.userId)} // Pass the company ID
//                     >
//                       View Company Profile
//                     </Button>
//                     <div>
//                     <ToastContainer />
//   {jobs.map((job, index) => (
//     <div key={job._id}>
//       <h2>{job.title}</h2>
//       {index === 0 && (
//         <Button variant="contained" color="secondary" onClick={() => handleApply()}>
//           Apply
//         </Button>
//       )}
//     </div>
//   ))}
// </div>
//                   </div>
//                 </Card>
//               </DialogContent>
//             </>
//           )}
//         </Dialog>
//         <Dialog open={companyProfileOpen} onClose={handleCompanyProfileClose} maxWidth="sm" fullWidth>
//           <DialogTitle>
//             <Typography variant="h5">Company Profile</Typography>
//             <IconButton onClick={handleCompanyProfileClose} style={{ position: 'absolute', right: 0, top: 0 }}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent>
//             <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', display: 'flex', flexDirection: 'row' }}>
//               {companyDetails ? (
//                 <>
//                   {/* First Section: Company Logo and Name */}
//                   <div style={{ flex: 1, textAlign: 'left', marginRight: '20px' }}>
//                     <Avatar
//                       src={`http://localhost:3000/${companyDetails.logoUrl}`} // Assuming you have logoUrl in companyDetails
//                       alt="Company Logo"
//                       style={{ width: '100px', height: '100px', marginBottom: '10px' }}
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "path/to/default-image.png";
//                       }}
//                     />
//                     <div style={{ marginLeft: "0px" }}>
//                       <Typography variant="h5">{companyDetails.cname}</Typography>

//                     </div>
//                   </div>

//                   {/* Second Section: Remaining Company Details */}
//                   <div style={{ flex: 2 }}>
//                     <Typography variant="body1" gutterBottom>
//                       Address: {companyDetails.address}
//                     </Typography>
//                     <Typography variant="body1" gutterBottom>
//                       Email: {companyDetails.email}
//                     </Typography>
//                     <Typography variant="body1" gutterBottom>
//                       Website: {companyDetails.website}
//                     </Typography>
//                     <Typography variant="body1" gutterBottom>
//                       Tagline: {companyDetails.tagline}
//                     </Typography>
//                     {/* Add more company details as needed */}
//                   </div>
//                 </>
//               ) : (
//                 <Typography variant="body1">Loading company details...</Typography> // Fallback for loading state
//               )}
//             </Card>
//           </DialogContent>
//         </Dialog>

//       </section>

//       <Footer />
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     margin: 0,
//     padding: 0,
//     fontFamily: 'Arial, sans-serif',
//   },
//   hero: {
//     height: '400px',
//     backgroundColor: '#360275',
//     color: '#fff',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heroTitle: {
//     fontSize: '48px',
//     fontWeight: 'bold',
//     marginBottom: '20px',
//   },
//   heroSubtitle: {
//     fontSize: '24px',
//   },
//   getStartedButton: {
//     backgroundColor: '#fff',
//     color: '#360275',
//     padding: '10px 20px',
//     fontSize: '18px',
//     fontWeight: 'bold',
//     textDecoration: 'none',
//   },
//   features: {
//     padding: '50px 0',
//   },
//   icon: {
//     marginRight: '8px',
//   },
//   testimonials: {
//     padding: '50px 0',
//   },
//   listContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     listStyle: 'none',
//   },
//   columnsWrapper: {
//     display: 'flex',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   column: {
//     width: '45%',
//   },
//   listItem: {
//     listStyleType: 'none',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '10px',
//   },
//   logo: {
//     width: '50px',
//     height: '50px',
//     marginRight: '15px',
//   },
//   jobTitle: {
//     fontWeight: 'bold',
//   },
 
//   iconText: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '10px',
//   },
//   dialogTitle: {
//     backgroundColor: '#360275',
//     color: '#fff',
//     textAlign: 'center',
//     padding: '10px 0',
//   },
// };

// export default HomePage;





import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';
import NavbarAdmin from './admin/NavbarAdmin';
import NavbarEmployee from './employee/NavbarEmployee';
import NavbarEmployer from './employer/NavbarEmployer';
import { Avatar, Container, Divider, ListItem, ListItemText, Button, Card, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import TodayIcon from '@mui/icons-material/Today';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import BuildIcon from '@mui/icons-material/Build';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles


const HomePage = () => {
  const [role, setRole] = useState('guest');
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [companyProfileOpen, setCompanyProfileOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null); // State to store company details
  const [loading, setLoading] = useState(false); // State to track loading

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = sessionStorage.getItem('role');
    if (userRole) {
      setRole(userRole);
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/jobs/approvedHome');
        setJobs(response.data);
        console.log('Fetched jobs:', response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        alert("Failed to fetch jobs. Please try again.");
      }
    };

    fetchJobs();
  }, [navigate]);


  const handleClickOpen = (job) => {
    setSelectedJob(job);    // Sets the job in the local state for further operations
    sessionStorage.setItem('selectedJobId', job._id);
    sessionStorage.setItem('selectedJob', job.jobTitle);  // Saves the jobId to sessionStorage
    sessionStorage.setItem('employerId', job.userId);
    sessionStorage.setItem('companyName', job.companyName);

    setOpen(true);          // Opens the dialog or modal
  };
  

  const handleClose = () => {
    setOpen(false);
  };

  // Handle opening and closing of company profile dialog
  const handleCompanyProfileOpen = () => {
    setCompanyProfileOpen(true);
  };

  const handleCompanyProfileClose = () => {
    setCompanyProfileOpen(false);
  };
  const fetchCompanyDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCompanyDetails(data);
      setCompanyProfileOpen(true); // Open the dialog after fetching details
    } catch (error) {
      console.error("Error fetching company details:", error);
      alert("Failed to fetch company details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [message, setMessage] = useState('');



  const handleApply = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const jobId = sessionStorage.getItem('selectedJobId');
      const employerId = sessionStorage.getItem('employerId');
      const companyName = sessionStorage.getItem('companyName');
      const logo = sessionStorage.getItem('logo');
      
      console.log('JOB ID:', jobId);
      console.log('User ID:', userId);
      const jobTitle = sessionStorage.getItem('selectedJob');

  
      // Fetch user profile data
      const profileResponse = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
      
      // Assuming the profile response contains the needed fields
      const {
        name,
        email,
        experience,
        degree,
        
        resume,  // Make sure the resume field is included in your API response
        address,
        skills,
        jobPreferences,
        photo,   // Ensure that this is included in your API response
        dob,
        phone,
      } = profileResponse.data; // Adjust according to the actual response structure
  
      // Prepare the application data
      const applicationData = {
        userId,
        jobId,
        jobTitle,
        companyName,
        name,
        email,
        experience,
        degree,
        jobTitle,
        resume,
        address,
        skills,
        jobPreferences,
        photo,
        dob,
        phone,
        employerId,
      };
  
      // Send application data to the server
      const response = await axios.post('http://localhost:3000/jobs/apply', applicationData);
  
      // Show success toast
      toast.success(response.data.message, {
        onClose: () => console.log('Success toast closed'),  // Optional handler
      });
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An error occurred';
  
      // Show error toast
      toast.error(errorMessage, {
        onClose: () => console.log('Error toast closed'),  // Optional handler
      });
    }
  };
  
  return (
    <div style={styles.wrapper}>
      {role === 'guest' && <Navbar />}
      {role === 'admin' && <NavbarAdmin />}
      {role === 'employee' && <NavbarEmployee />}
      {role === 'employer' && <NavbarEmployer />}

      <section style={styles.hero}>
        <div className="container text-center text-white">
          <h1 style={styles.heroTitle}>Welcome to JobPortal</h1>
          <p style={styles.heroSubtitle}>Your gateway to finding the best jobs and top talents</p>
          {role === 'guest' && (
            <a href="/signup" className="btn btn-lg mt-4" style={styles.getStartedButton}>
              Get Started
            </a>
          )}
        </div>
      </section>

      <section style={styles.features}>
        <div className="container">
          <div className="row text-center">
            {['Find Jobs', 'Top Companies', 'Career Growth'].map((feature, index) => (
              <div className="col-md-4" key={index}>
                <i className={`fas fa-${index === 0 ? 'briefcase' : index === 1 ? 'users' : 'chart-line'} fa-3x mb-3`} style={styles.icon}></i>
                <h4>{feature}</h4>
                <p>Explore thousands of job listings across various industries.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.testimonials}>
        <Container style={{ textAlign: 'center', backgroundColor: '#360275', color: 'aliceblue', marginBottom: '20px', borderRadius: '50px', maxWidth: '97rem' }}>
          <h2>LATEST JOBS</h2>
        </Container>
        <Container style={styles.listContainer}>
          <div style={styles.columnsWrapper}>
            {/* First Column */}
            <div style={styles.column}>
              {jobs.filter((_, index) => index % 2 === 0).map((job) => (
                <React.Fragment key={job._id}>
                  <ListItem style={styles.listItem}>
                    <Avatar
                      src={`http://localhost:3000/${job.logoUrl}`}
                      alt="Company Logo"
                      style={styles.logo}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "path/to/default-image.png";
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="h6" style={styles.jobTitle}>
                          {job.jobTitle}
                        </Typography>
                      }
                      secondary={
                        <>
                        <div style={styles.iconText}>
                            <BusinessIcon color="action" style={styles.icon} />
                            <Typography variant="body2" color="textSecondary">
                              Company: {job.companyName}
                            </Typography>
                          </div>
                          <div style={styles.iconText}>
                            <LocationOnIcon color="action" style={styles.icon} />
                            <Typography variant="body2" color="textSecondary">
                              Location: {job.location}
                            </Typography>
                          </div>
                          <div style={styles.iconText}>
                            <CurrencyRupeeIcon color="action" style={styles.icon} />
                            <Typography variant="body2" color="textSecondary">
                              Salary: {job.salary}
                            </Typography>
                          </div>
                        </>
                      }
                    />
                    {role === 'employee' && (
                      <Button variant="contained" color="primary" style={styles.viewmore} onClick={() => handleClickOpen(job)}>
                        View More
                      </Button>
                    )}
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </div>

            {/* Second Column */}
            <div style={styles.column}>
              {jobs.filter((_, index) => index % 2 !== 0).map((job) => (
                <React.Fragment key={job._id}>
                  <ListItem style={styles.listItem}>
                    <Avatar
                      src={`http://localhost:3000/${job.logoUrl}`}
                      alt="Company Logo"
                      style={styles.logo}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "path/to/default-image.png";
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="h6" style={styles.jobTitle}>
                          {job.jobTitle}
                        </Typography>
                      }
                      secondary={
                        <>
                          <div style={styles.iconText}>
                            <BusinessIcon color="action" style={styles.icon} />
                            <Typography variant="body2" color="textSecondary">
                              Company: {job.companyName}
                            </Typography>
                          </div>
                          <div style={styles.iconText}>
                            <LocationOnIcon color="action" style={styles.icon} />
                            <Typography variant="body2" color="textSecondary">
                              Location: {job.location}
                            </Typography>
                          </div>
                          <div style={styles.iconText}>
                            <CurrencyRupeeIcon color="action" style={styles.icon} />
                            <Typography variant="body2" color="textSecondary">
                              Salary: {job.salary}
                            </Typography>
                          </div>
                        </>
                      }
                    />
                    {role === 'employee' && (
                      <Button variant="contained" color="primary" style={styles.viewmore} onClick={() => handleClickOpen(job)}>
                        View More
                      </Button>
                    )}
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </div>
          </div>
        </Container>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          {selectedJob && (
            <>
              <DialogTitle style={{
                position: 'relative', textAlign: 'center', paddingRight: '40px', backgroundColor: '#360275',
                color: '#fff',
              }}>
                <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                  {selectedJob.jobTitle}
                </Typography>
                <IconButton onClick={handleClose} style={{ position: 'absolute', right: 0, top: 0 }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent>
              <ToastContainer />
                <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px' }}>
                  <Typography variant="h5" gutterBottom>
                    Job Details
                  </Typography>
                  <div style={styles.iconText}>
                    <BusinessIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Company: {selectedJob.companyName}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <LocationOnIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Location: {selectedJob.location}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <CurrencyRupeeIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Salary: {selectedJob.salary}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <TodayIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Last Date to Apply: {new Date(selectedJob.lastDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'  
                      })}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <WorkIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Job Type: {selectedJob.jobType}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <BadgeIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Experience: {selectedJob.experience} years
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <SchoolIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Qualifications: {selectedJob.qualifications}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <BuildIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Skills: {selectedJob.skills}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <DescriptionIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Job Description: {selectedJob.jobDescription}
                    </Typography>
                  </div>
                  <div style={styles.iconText}>
                    <EmailIcon color="action" style={styles.icon} />
                    <Typography variant="body2" color="textSecondary">
                      Contact Details: {selectedJob.contactDetails}
                    </Typography>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => fetchCompanyDetails(selectedJob.userId)} // Pass the company ID
                    >
                      View Company Profile
                    </Button>
                    <div>
                    <ToastContainer />
  {jobs.map((job, index) => (
    <div key={job._id}>
      <h2>{job.title}</h2>
      {index === 0 && (
        <Button variant="contained" color="secondary" onClick={() => handleApply()}>
          Apply
        </Button>
      )}
    </div>
  ))}
</div>
                  </div>
                </Card>
              </DialogContent>
            </>
          )}
        </Dialog>
        <Dialog open={companyProfileOpen} onClose={handleCompanyProfileClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h5">Company Profile</Typography>
            <IconButton onClick={handleCompanyProfileClose} style={{ position: 'absolute', right: 0, top: 0 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Card style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', display: 'flex', flexDirection: 'row' }}>
              {companyDetails ? (
                <>
                  {/* First Section: Company Logo and Name */}
                  <div style={{ flex: 1, textAlign: 'left', marginRight: '20px' }}>
                    <Avatar
                      src={`http://localhost:3000/${companyDetails.logoUrl}`} // Assuming you have logoUrl in companyDetails
                      alt="Company Logo"
                      style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "path/to/default-image.png";
                      }}
                    />
                    <div style={{ marginLeft: "0px" }}>
                      <Typography variant="h5">{companyDetails.cname}</Typography>

                    </div>
                  </div>

                  {/* Second Section: Remaining Company Details */}
                  <div style={{ flex: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Address: {companyDetails.address}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Email: {companyDetails.email}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Website: {companyDetails.website}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Tagline: {companyDetails.tagline}
                    </Typography>
                    {/* Add more company details as needed */}
                  </div>
                </>
              ) : (
                <Typography variant="body1">Loading company details...</Typography> // Fallback for loading state
              )}
            </Card>
          </DialogContent>
        </Dialog>

      </section>

      <Footer />
    </div>
  );
};

const styles = {
  wrapper: {
    margin: 0,
    padding: 0,
    fontFamily: 'Arial, sans-serif',
  },
  hero: {
    height: '400px',
    backgroundColor: '#360275',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '24px',
  },
  getStartedButton: {
    backgroundColor: '#fff',
    color: '#360275',
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  features: {
    padding: '50px 0',
  },
  icon: {
    marginRight: '8px',
  },
  testimonials: {
    padding: '50px 0',
  },
 
  dialogTitle: {
    backgroundColor: '#360275',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 0',
  },
    listContainer: {
      display: 'flex',
      justifyContent: 'center',
      listStyle: 'none',
      padding: '20px',
      background: 'linear-gradient(135deg, #f0f0f5, #e0e0ff)', // Adds a light gradient background
      border: '2px solid #360275', // Adds a prominent border
      borderRadius: '15px', // Rounds the container's corners
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Enhances shadow for a subtle 3D effect
      maxWidth: '90%',
      margin: '0 auto',
    },
    columnsWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px',
      width: '100%',
    },
    column: {
      width: '45%',
    },
    listItem: {
      listStyleType: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#fff', // White background for each list item
      border: '1px solid #ddd',
      borderRadius: '10px', // Rounds corners of each item
      marginBottom: '10px', // Adds space between items
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease', // Animation for hover effect
    },
    logo: {
      width: '80px',
      height: '80px',
      marginRight: '15px',
      borderRadius: '50%', // Circular logo style
      border: '1px solid #360275',
    },
  
    iconText: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
    },
    viewmore: {
      backgroundColor: '#360275',
      color: '#fff',
      borderRadius: '20px',
      padding: '5px 15px',
      boxShadow: '0px 3px 8px rgba(54, 2, 117, 0.3)',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: '#5e379a',
      },
    },
    listItemHover: {
      transform: 'scale(1.02)', // Scale effect on hover
    },
  };
  

export default HomePage;
