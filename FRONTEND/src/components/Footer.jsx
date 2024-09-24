import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer=() => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 style={styles.heading}>JobPortal</h5>
            <p style={styles.text}>
              Your gateway to finding the best jobs and top talents.
            </p>
            <p style={styles.socialIcons}>
              <a href="#" style={styles.icon}><i className="fab fa-facebook-f"></i></a>
              <a href="#" style={styles.icon}><i className="fab fa-twitter"></i></a>
              <a href="#" style={styles.icon}><i className="fab fa-linkedin-in"></i></a>
              <a href="#" style={styles.icon}><i className="fab fa-instagram"></i></a>
            </p>
          </div>
          <div className="col-md-2">
            <h5 style={styles.heading}>Company</h5>
            <ul style={styles.list}>
              <li><a href="/about" style={styles.link}>About Us</a></li>
              <li><a href="/careers" style={styles.link}>Careers</a></li>
              <li><a href="/contact" style={styles.link}>Contact Us</a></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h5 style={styles.heading}>Resources</h5>
            <ul style={styles.list}>
              <li><a href="/support" style={styles.link}>Support</a></li>
              <li><a href="/terms" style={styles.link}>Terms & Conditions</a></li>
              <li><a href="/privacy" style={styles.link}>Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 style={styles.heading}>Contact Us</h5>
            <p style={styles.text}>Email: support@jobportal.com</p>
            <p style={styles.text}>Phone: +123 456 7890</p>
            <p style={styles.text}>Address: 123 JobPortal Street, JobCity, JP 45678</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <p style={styles.text}>
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles={
  footer: {
    backgroundColor: '#f5f5f5',
    color: '#333', 
    padding: '20px 0',
    marginTop: '40px',
  },
  heading: {
    fontSize: '1.3rem',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#333', 
  },
  text: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '10px',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    display: 'block',
    marginBottom: '8px',
    transition: 'color 0.3s ease',
  },
  icon: {
    color: '#333',
    fontSize: '1.5rem',
    marginRight: '10px',
    transition: 'color 0.3s ease',
  },
  socialIcons: {
    marginTop: '20px',
  },
};

export default Footer;
