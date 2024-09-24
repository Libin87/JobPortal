import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';
import NavbarAdmin from './admin/NavbarAdmin';
import NavbarEmployee from './employee/NavbarEmployee';
import NavbarEmployer from './employer/NavbarEmployer';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const [role, setRole] = useState('guest'); // Default role is 'guest'
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');

    if (userRole) {
      setRole(userRole);
    }

    // Prevent navigation to the previous page (back button behavior)
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
            <div className="col-md-4">
              <i className="fas fa-briefcase fa-3x mb-3" style={styles.icon}></i>
              <h4>Find Jobs</h4>
              <p>Explore thousands of job listings across various industries.</p>
            </div>
            <div className="col-md-4">
              <i className="fas fa-users fa-3x mb-3" style={styles.icon}></i>
              <h4>Top Companies</h4>
              <p>Connect with top companies and employers.</p>
            </div>
            <div className="col-md-4">
              <i className="fas fa-chart-line fa-3x mb-3" style={styles.icon}></i>
              <h4>Career Growth</h4>
              <p>Enhance your career with our expert guidance and resources.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.testimonials}>
        <div className="container text-center"></div>
        <Container style={{ textAlign: 'center', backgroundColor: '#360275', color: 'aliceblue', marginBottom: '30px', borderRadius: '50px', maxWidth: '97rem' }}>
          <h2>LATEST JOBS</h2>
        </Container>
      </section>

      <Container style={{ backgroundColor: '#552878', borderRadius: '10px', maxWidth: '97rem' }}></Container>
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
    padding: '100px 0',
    color: '#fff',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    margin: '20px 0',
  },
  getStartedButton: {
    backgroundColor: '#fff',
    color: '#360275',
    border: '2px solid #360275',
    padding: '10px 20px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  features: {
    padding: '60px 0',
    backgroundColor: '#f8f9fa',
  },
  icon: {
    color: '#360275',
  },
  testimonials: {
    padding: '60px 0',
    backgroundColor: '#f8f9fa',
  },
};

export default HomePage;
