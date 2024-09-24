import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactUs=() => {
  return (
    <div style={styles.wrapper}>
      <Navbar/>
      <div style={styles.contactSection}>
        <div className="container">
          <h2 style={styles.heading}>Contact Us</h2>
          <p style={styles.subHeading}>We would love to hear from you! Please fill out the form below and we will get in touch with you shortly.</p>
          <div className="row">
            <div className="col-md-6">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" placeholder="Enter your name"/>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="Enter your email"/>
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="4" placeholder="Your message"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
            <div className="col-md-6">
              <h4 style={styles.contactInfoHeading}>Our Office</h4>
              <p>123 JobPortal Street, JobCity, JP 45678</p>
              <h4 style={styles.contactInfoHeading}>Phone</h4>
              <p>+123 456 7890</p>
              <h4 style={styles.contactInfoHeading}>Email</h4>
              <p>support@jobportal.com</p>
              <div style={styles.socialIcons}>
                <a href="#" style={styles.icon}><i className="fab fa-facebook-f"></i></a>
                <a href="#" style={styles.icon}><i className="fab fa-twitter"></i></a>
                <a href="#" style={styles.icon}><i className="fab fa-linkedin-in"></i></a>
                <a href="#" style={styles.icon}><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

const styles={
  wrapper: {
    fontFamily: 'Arial, sans-serif',
  },
  contactSection: {
    padding: '60px 0',
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    textAlign: 'center',
  },
  contactInfoHeading: {
    fontSize: '1.5rem',
    marginTop: '20px',
  },
  socialIcons: {
    marginTop: '30px',
  },
  icon: {
    color: '#007bff',
    fontSize: '1.5rem',
    marginRight: '15px',
    transition: 'color 0.3s ease',
  },
};

export default ContactUs;
