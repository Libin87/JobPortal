import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import Header from '../Header';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,CircularProgress } from '@mui/material';
import { Badge } from 'react-bootstrap';


const AdminReview = () => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      const jobs = response.data;
      setPostedJobs(jobs);
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const handleApprove = (jobId) => {
    axios
      .put(`http://localhost:5000/api/jobs/${jobId}`, { approved: true })
      .then((response) => {
        console.log('Job approved successfully:', response.data);
        fetchPostedJobs();
      })
      .catch((error) => {
        console.error('Error approving job:', error);
      });
  };

  const handleReject = (jobId) => {
    axios
      .put(`http://localhost:5000/api/jobs/${jobId}`, { approved: false })
      .then((response) => {
        console.log('Job rejected successfully:', response.data);
        fetchPostedJobs();
      })
      .catch((error) => {
        console.error('Error rejecting job:', error);
      });
  };

  return (
    <div>
      <Header />
      <Container style={{backgroundColor:'#423B47',marginBottom:'30px',borderRadius:'50px',maxWidth:'84.5%'}}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '40px', backgroundColor: '', color: 'white' }}>ADMIN REVIEW - POSTED JOBS</h2>
      </Container>
      
      <br /><br />
      <Container style={{backgroundColor:'aliceblue',padding:'20px', borderRadius:'10px'}}>
        
        <TableContainer component={Paper} style={{borderRadius:'2px'}}>
        {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', backgroundColor: '' }}>
              <CircularProgress style={{ color: "#360275" }} />
            </div>
          ) : (
          <Table >
            <TableHead style={{backgroundColor:'#360275'}}> 
              <TableRow>
                <TableCell style={{color:'aliceblue',fontWeight:'bolder'}}>Job Title</TableCell>
                <TableCell style={{color:'aliceblue',fontWeight:'bolder'}}>Company Name</TableCell>
                <TableCell style={{color:'aliceblue',fontWeight:'bolder'}}>Location</TableCell>
                <TableCell style={{color:'aliceblue',fontWeight:'bolder'}}>Actions</TableCell>
                <TableCell style={{color:'aliceblue',textAlign:"center",fontWeight:'bolder'}}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{}}>
              {postedJobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.jobTitle}</TableCell>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ cursor: 'pointer', color: 'green', marginRight: '10px' }}
                      onClick={() => handleApprove(job._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ cursor: 'pointer', color: 'darkred' }}
                      onClick={() => handleReject(job._id)}
                    />
                  </TableCell>
                  <TableCell style={{ fontWeight:'bold',color: job.approved ? 'green' : 'red',textAlign:'center',padding:'0.5px',borderRadius:'50px',}}>
                    {job.approved ? 'Approved' : 'Rejected'}
                  </TableCell>
                

                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </TableContainer>
      </Container>
    </div>
  );
};

export default AdminReview;























// import React, { useState, useEffect } from 'react';
// import Header from '../Header';
// import axios from 'axios';
// import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
// import{ Badge } from 'react-bootstrap';
// import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

// const AdminReview = () => {
//   const [postedJobs, setPostedJobs] = useState([]);

//   const fetchPostedJobs = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/jobs');
//       const jobs = response.data;
//       setPostedJobs(jobs);
//     } catch (error) {
//       console.error('Error fetching posted jobs:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPostedJobs();
//   }, []);

//   const handleApprove = (jobId) => {
//     axios
//       .put(`http://localhost:5000/api/jobs/${jobId}`, { approved: true })
//       .then((response) => {
//         console.log('Job approved successfully:', response.data);
//         fetchPostedJobs();
//       })
//       .catch((error) => {
//         console.error('Error approving job:', error);
//       });
//   };

//   const handleReject = (jobId) => {
//     axios
//       .put(`http://localhost:5000/api/jobs/${jobId}`, { approved: false })
//       .then((response) => {
//         console.log('Job rejected successfully:', response.data);
//         fetchPostedJobs();
//       })
//       .catch((error) => {
//         console.error('Error rejecting job:', error);
//       });
//   };

//   return (
//     <div>
//       <Header />
//       <Container>
//         <h2 style={{ textAlign: 'center', fontWeight: 'bolder', fontFamily: 'lucida', marginTop: '40px', backgroundColor: '', color: 'black' }}>Admin Review - Posted Jobs</h2>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Job Title</TableCell>
//                 <TableCell>Company Name</TableCell>
//                 <TableCell>Location</TableCell>
//                 <TableCell>Actions</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {postedJobs.map((job) => (
//                 <TableRow key={job._id}>
//                   <TableCell>{job.jobTitle}</TableCell>
//                   <TableCell>{job.companyName}</TableCell>
//                   <TableCell>{job.location}</TableCell>
//                   <TableCell>
//                     {/* <Button  style={{backgroundColor:'green'}}   variant="contained" color="primary" onClick={() => handleApprove(job._id)}>
//                       Approve
//                     </Button>
//                     <Button style={{ marginLeft: '10px', backgroundColor:'darkred' }} variant="contained" onClick={() => handleReject(job._id)}>
//                       Reject
//                     </Button> */}
//                     <AiOutlineCheck
//                       style={{ cursor: 'pointer', color: 'green', marginRight: '10px' }}
//                       onClick={() => handleApprove(job._id)}
//                     />
//                     <AiOutlineClose
//                       style={{ cursor: 'pointer', color: 'darkred' }}
//                       onClick={() => handleReject(job._id)}
//                     />



//                   </TableCell>
//                   {/* <TableCell>{job.approved ? 'Approved' : 'Rejected'}</TableCell> */}
//                   <TableCell>
//                   <Badge pill variant={job.approved ? 'success' : 'danger'}>
//                       {job.approved ? 'Approved' : 'Rejected'}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Container>
//     </div>
//   );
// };

// export default AdminReview;





















// import React, { useState, useEffect } from 'react';
// import Header from '../Header';
// import axios from 'axios';
// import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

// const AdminReview = () => {
//   const [postedJobs, setPostedJobs] = useState([]);

//   const fetchPostedJobs = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/jobs');
//       const jobs = response.data;
//       setPostedJobs(jobs);
//     } catch (error) {
//       console.error('Error fetching posted jobs:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPostedJobs();
//   }, []);

//   const handleApprove = (jobId) => {
//     axios
//       .put(`http://localhost:5000/api/jobs/${jobId}`, { approved: true })
//       .then((response) => {
//         console.log('Job approved successfully:', response.data);
//         fetchPostedJobs();
//       })
//       .catch((error) => {
//         console.error('Error approving job:', error);
//       });
//   };

//   const handleReject = (jobId) => {
//     axios
//       .put(`http://localhost:5000/api/jobs/${jobId}`, { approved: false })
//       .then((response) => {
//         console.log('Job rejected successfully:', response.data);
//         fetchPostedJobs();
//       })
//       .catch((error) => {
//         console.error('Error rejecting job:', error);
//       });
//   };

//   return (
//     <div>
//       <Header />
//       <Container>
//         <h2 style={{ textAlign: 'center', fontWeight: 'bolder', fontFamily: 'lucida', marginTop: '40px', backgroundColor: '', color: 'black' }}>Admin Review - Posted Jobs</h2>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Job Title</TableCell>
//                 <TableCell>Company Name</TableCell>
//                 <TableCell>Location</TableCell>
//                 <TableCell>Actions</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {postedJobs.map((job) => (
//                 <TableRow key={job._id}>
//                   <TableCell>{job.jobTitle}</TableCell>
//                   <TableCell>{job.companyName}</TableCell>
//                   <TableCell>{job.location}</TableCell>
//                   <TableCell>
//                     <Button variant="contained" color="primary" onClick={() => handleApprove(job._id)}>
//                       Approve
//                     </Button>
//                     <Button style={{marginLeft:'10px'}}  variant="contained" color="secondary" onClick={() => handleReject(job._id)}>
//                       Reject
//                     </Button>
//                   </TableCell>
//                   <TableCell>{job.approved ? 'Approved' : 'Rejected'}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Container>
//     </div>
//   );
// };

// export default AdminReview;
