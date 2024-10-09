// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Footer from '../components/Footer';
// import NavbarAdmin from './admin/NavbarAdmin';
// import NavbarEmployee from './employee/NavbarEmployee';
// import NavbarEmployer from './employer/NavbarEmployer';
// import { Container } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';

// const HomePage = () => {
//   const [role, setRole] = useState('guest'); // Default role is 'guest'
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userRole = localStorage.getItem('role');

//     if (userRole) {
//       setRole(userRole);
//     }

//     // Prevent navigation to the previous page (back button behavior)
//     window.history.pushState(null, null, window.location.href);
//     const handleBackButton = () => {
//       window.history.pushState(null, null, window.location.href);
//     };
//     window.addEventListener('popstate', handleBackButton);

//     return () => {
//       window.removeEventListener('popstate', handleBackButton);
//     };
//   }, [navigate]);

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
//             <div className="col-md-4">
//               <i className="fas fa-briefcase fa-3x mb-3" style={styles.icon}></i>
//               <h4>Find Jobs</h4>
//               <p>Explore thousands of job listings across various industries.</p>
//             </div>
//             <div className="col-md-4">
//               <i className="fas fa-users fa-3x mb-3" style={styles.icon}></i>
//               <h4>Top Companies</h4>
//               <p>Connect with top companies and employers.</p>
//             </div>
//             <div className="col-md-4">
//               <i className="fas fa-chart-line fa-3x mb-3" style={styles.icon}></i>
//               <h4>Career Growth</h4>
//               <p>Enhance your career with our expert guidance and resources.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section style={styles.testimonials}>
//         <div className="container text-center"></div>
//         <Container style={{ textAlign: 'center', backgroundColor: '#360275', color: 'aliceblue', marginBottom: '30px', borderRadius: '50px', maxWidth: '97rem' }}>
//           <h2>LATEST JOBS</h2>
//         </Container>
//       </section>

//       <Container style={{ backgroundColor: '#552878', borderRadius: '10px', maxWidth: '97rem' }}></Container>
//       <Footer />
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     fontFamily: 'Arial, sans-serif',
//   },
//   hero: {
//     backgroundColor: '#360275',
//     padding: '100px 0',
//     color: '#fff',
//   },
//   heroTitle: {
//     fontSize: '3rem',
//     fontWeight: 'bold',
//   },
//   heroSubtitle: {
//     fontSize: '1.5rem',
//     margin: '20px 0',
//   },
//   getStartedButton: {
//     backgroundColor: '#fff',
//     color: '#360275',
//     border: '2px solid #360275',
//     padding: '10px 20px',
//     fontWeight: 'bold',
//     transition: 'all 0.3s ease',
//   },
//   features: {
//     padding: '60px 0',
//     backgroundColor: '#f8f9fa',
//   },
//   icon: {
//     color: '#360275',
//   },
//   testimonials: {
//     padding: '60px 0',
//     backgroundColor: '#f8f9fa',
//   },
// };

// export default HomePage;



// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Footer from '../components/Footer';
// import NavbarAdmin from './admin/NavbarAdmin';
// import NavbarEmployee from './employee/NavbarEmployee';
// import NavbarEmployer from './employer/NavbarEmployer';
// import { Container, Card, CardContent, Typography, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import axios from 'axios';

// const HomePage = () => {
//   const [role, setRole] = useState('guest');
//   const [jobs, setJobs] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userRole = localStorage.getItem('role');
//     if (userRole) {
//       setRole(userRole);
//     }
//     const fetchJobs = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/jobs/viewjob');
//         setJobs(response.data);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//       }
//     };

//     fetchJobs();
//     window.history.pushState(null, null, window.location.href);
//     const handleBackButton = () => {
//       window.history.pushState(null, null, window.location.href);
//     };
//     window.addEventListener('popstate', handleBackButton);

//     return () => {
//       window.removeEventListener('popstate', handleBackButton);
//     };
//   }, [navigate]);

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
//       <section >
//        <div className="container text-center"></div>
//         <Container style={{ textAlign: 'center', backgroundColor: '#360275', color: 'aliceblue', marginBottom: '20px',marginTop:'0px', borderRadius: '50px', maxWidth: '97rem' }}>
//           <h2>LATEST JOBS</h2>
//         </Container>
//     </section>

//         <Container style={styles.cardContainer}>
//           {jobs.map((job) => (
//             <Card key={job._id} style={styles.card}>
//               <CardContent>
//                 <Typography variant="h5" component="div" style={styles.cardTitle}>
//                   {job.jobTitle}
//                 </Typography>
//                 <Typography color="text.secondary" style={styles.cardSubtitle}>
//                   {job.}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Location: {job.location}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Salary: {job.salary}
//                 </Typography>
//                 <Button variant="contained" color="primary" style={styles.applyButton}>
//                   Apply Now
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </Container>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     fontFamily: 'Arial, sans-serif',
//   },
//   hero: {
//     backgroundColor: '#360275',
//     padding: '80px 0', 
//     color: '#fff',
//     boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
//   },
//   heroTitle: {
//     fontSize: '3.5rem',
//     fontWeight: 'bold',
//     marginBottom: '20px', 
//   },
//   heroSubtitle: {
//     fontSize: '1.5rem',
//     margin: '20px 0',
//   },
//   getStartedButton: {
//     backgroundColor: '#fff',
//     color: '#360275',
//     border: '2px solid #fff',
//     padding: '10px 20px',
//     fontWeight: 'bold',
//     transition: 'all 0.3s ease',
//     borderRadius: '25px', 
//     '&:hover': {
//       backgroundColor: '#360275',
//       color: '#fff',
//     },
//   },
//   features: {
//     padding: '70px 0',
//     backgroundColor: '#f8f9fa',
//     marginBottom:'5px'
//   },
//   icon: {
//     color: '#360275',
//   },
//   testimonials: {
//     padding: '60px 0',
//     backgroundColor: '#f8f9fa',
//   },
//   latestJobsContainer: {
//     textAlign: 'center',
//     backgroundColor: '#360275',
//     color: 'aliceblue',
//     marginBottom: '10px', 
//     borderRadius: '0px',
//     padding: '5px 0',
//   },
//   cardContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     padding: '20px',
//   },
//   card: {
//     margin: '10px',
//     width: '300px',
//     height: 'auto', 
//     borderRadius: '10px',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//     transition: 'transform 0.2s', 
//     '&:hover': {
//       transform: 'scale(1.05)',
//     },
//   },
//   cardTitle: {
//     fontWeight: 'bold',
//     color: '#360275',
//   },
//   cardSubtitle: {
//     color: '#6c757d',
//     marginBottom: '10px', 
//   },
//   applyButton: {
//     marginTop: '10px',
//     backgroundColor: '#28a745', 
//     '&:hover': {
//       backgroundColor: '#218838', 
//     },
//   },
// };

// export default HomePage;



import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';
import NavbarAdmin from './admin/NavbarAdmin';
import NavbarEmployee from './employee/NavbarEmployee';
import NavbarEmployer from './employer/NavbarEmployer';
import { Container, Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const HomePage = () => {
  const [role, setRole] = useState('guest');
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token'); // Retrieve the JWT token

    if (userRole) {
      setRole(userRole);
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/jobs/approved', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Optionally handle unauthorized errors
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem('token'); // Remove token on unauthorized
          navigate('/login'); // Redirect to login page
        }
      }
    };

    fetchJobs();

    // Prevent back button navigation to login page
    window.history.pushState(null, null, window.location.href);
    const handleBackButton = () => {
      window.history.pushState(null, null, window.location.href);
    };
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

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
        <section>
          <div className="container text-center"></div>
          <Container style={{ textAlign: 'center', backgroundColor: '#360275', color: 'aliceblue', marginBottom: '20px', marginTop: '0px', borderRadius: '50px', maxWidth: '97rem' }}>
            <h2>LATEST JOBS</h2>
          </Container>
        </section>

        <Container style={styles.cardContainer}>
          {jobs.map((job) => (
            <Card key={job._id} style={styles.card}>
              <CardContent>
                <Typography variant="h5" component="div" style={styles.cardTitle}>
                  {job.jobTitle}
                </Typography>
                {/* <Typography color="text.secondary" style={styles.cardSubtitle}>
                  {job.}
                </Typography> */}
                <Typography variant="body2" color="text.secondary">
                  Location: {job.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salary: {job.salary}
                </Typography>
                <Button variant="contained" color="primary" style={styles.applyButton}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </Container>
      </section>

      <Footer />
    </div>
  );
};

const styles = {
  wrapper: {
    fontFamily: 'Arial, sans-serif',
  },
  hero: {
    backgroundColor: '#360275',
    padding: '80px 0',
    color: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    margin: '20px 0',
  },
  getStartedButton: {
    backgroundColor: '#fff',
    color: '#360275',
    border: '2px solid #fff',
    padding: '10px 20px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    borderRadius: '25px',
    '&:hover': {
      backgroundColor: '#360275',
      color: '#fff',
    },
  },
  features: {
    padding: '70px 0',
    backgroundColor: '#f8f9fa',
    marginBottom: '5px',
  },
  icon: {
    color: '#360275',
  },
  testimonials: {
    padding: '60px 0',
    backgroundColor: '#f8f9fa',
  },
  latestJobsContainer: {
    textAlign: 'center',
    backgroundColor: '#360275',
    color: 'aliceblue',
    marginBottom: '10px',
    borderRadius: '0px',
    padding: '5px 0',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    margin: '10px',
    width: '300px',
    height: 'auto',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#360275',
  },
  cardSubtitle: {
    color: '#6c757d',
    marginBottom: '10px',
  },
  applyButton: {
    marginTop: '10px',
    backgroundColor: '#28a745',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
};

export default HomePage;


