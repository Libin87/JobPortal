import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../images/login.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/forgotpassword', { replace: true });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/user/forgotpassword', { email })
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Something went wrong. Please try again.');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ ...styles.background }}>
      <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
        <div style={styles.formContainer}>
          <h2 className="text-center mb-4" style={styles.heading}>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                name="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={styles.inputField}
              />
            </div>
            <button type="submit" className="btn w-100" style={styles.button}>Submit</button>
          </form>
          {message && <p className="mt-3 text-center">{message}</p>}
          <p className="text-center mt-3">
            <Link to="/login" style={styles.link}>Back to Login</Link> 
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  background: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '400px',
    width: '100%',
  },
  inputField: {
    height: '40px',
  },
  button: {
    backgroundColor: '#360275',
    color: '#fff',
    fontWeight: 'normal',
  },
  link: {
    color: '#360275',
    textDecoration: 'none',
  },
  heading: {
    color: '#360275',
    fontWeight: 'bold',
  },
};
export default ForgotPassword;
