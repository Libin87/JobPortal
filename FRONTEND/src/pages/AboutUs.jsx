import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import image from '../images/about.jpg'

const AboutUs=() => {
  return (
    <div>
      <Navbar />
      <section style={styles.aboutSection}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2 style={styles.heading}>About JobPortal</h2>
              <p style={styles.paragraph}>
                JobPortal is committed to bridging the gap between job seekers and top companies. 
                Our platform is designed to connect professionals with their dream careers and 
                provide businesses with exceptional talent.
              </p>
              <p style={styles.paragraph}>
                With a wide range of job listings, expert career advice, and a growing network of 
                companies, JobPortal has become a trusted destination for job hunters and employers 
                alike.
              </p>
            </div>
            <div className="col-md-6">
              <img 
                src={image} 
                alt="Office environment" 
                style={styles.image} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section style={styles.visionMissionSection}>
        <div className="container text-center">
          <h2 style={styles.heading}>Our Vision & Mission</h2>
          <div className="row mt-4">
            <div className="col-md-6">
              <h4>Our Vision</h4>
              <p>
                To become the leading global platform where professionals and 
                companies find each other, driving innovation and growth across industries.
              </p>
            </div>
            <div className="col-md-6">
              <h4>Our Mission</h4>
              <p>
                Empower professionals to achieve their career goals and assist companies in 
                building dynamic teams, fostering productivity and success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={styles.statsSection}>
        <div className="container text-center">
          <h2 style={styles.heading}>Our Impact</h2>
          <div className="row mt-4">
            <div className="col-md-4">
              <h3>100K+</h3>
              <p>Job Listings</p>
            </div>
            <div className="col-md-4">
              <h3>50K+</h3>
              <p>Companies Connected</p>
            </div>
            <div className="col-md-4">
              <h3>500K+</h3>
              <p>Active Job Seekers</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const styles={
  aboutSection: {
    padding: '60px 0',
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#343a40',
  },
  paragraph: {
    fontSize: '1.1rem',
    color: '#6c757d',
    marginBottom: '15px',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
  },
  visionMissionSection: {
    padding: '60px 0',
    backgroundColor: '#ffffff',
  },
  statsSection: {
    padding: '60px 0',
    backgroundColor: '#007bff',
    color: '#ffffff',
  },
};

export default AboutUs;
