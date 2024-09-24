

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../images/login.jpg'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submit = (e) => {
    e.preventDefault();
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    if (input.email === adminEmail && input.password === adminPassword) {
      alert('Admin Login successfully!!');
      localStorage.setItem('authToken', 'adminToken');
      localStorage.setItem('role', 'admin');
      navigate('/', { replace: true });
    } else {
      axios.post('http://localhost:3000/user/login', input)
        .then((response) => {
          if (response.data.message === 'Login successfully!!') {
            alert(response.data.message);
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('role', response.data.role);
            sessionStorage.setItem('userId', response.data._id);
            navigate('/', { replace: true });
          } else {
            alert(response.data.message);
          }
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div style={{ ...styles.background, backgroundImage: `url(${backgroundImage})` }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div style={styles.formContainer}>
          <h2 className="text-center mb-4" style={styles.heading}>Login</h2>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                required
                onChange={inputHandler}
                style={styles.inputField}
              />
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                required
                onChange={inputHandler}
                style={styles.inputField}
              />
              <span 
                className="position-absolute"
                style={styles.eyeIcon}
                onClick={handlePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="btn w-100" style={styles.button}>Login</button>
            <br />
            <a href="/signup" className="d-block text-center mt-3" style={styles.link}>Signup</a>
            <a href="/forgotpassword" className="d-block text-center mt-3" style={styles.link}>Forgot Password?</a>
          </form>
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
  eyeIcon: {
    top: '70%',
    right: '10px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
  }
};

export default LoginForm;


