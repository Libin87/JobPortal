import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundImage from '../images/login.jpg';

const Signup = () => {
  const [input, setInput] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, document.title, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const errors = {};
    if (!input.name || /\d/.test(input.name)) {
      errors.name = 'Name should not contain digits and is required.';
    }
    if (!input.phone || !/^\d+$/.test(input.phone)) {
      errors.phone = 'Phone number should contain only digits and is required.';
    }
    if (!input.email || !/\S+@\S+\.\S+/.test(input.email)) {
      errors.email = 'Valid email is required.';
    }
    if (!input.password) {
      errors.password = 'Password is required.';
    } else if (input.password.length < 8) {
      errors.password = 'Password should be at least 8 characters long.';
    } else if (!/[0-9]/.test(input.password)) {
      errors.password = 'Password should contain at least one numeric digit.';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(input.password)) {
      errors.password = 'Password should contain at least one special character.';
    }
    if (!input.role) {
      errors.role = 'Role is required.';
    }
    return errors;
  };

  const submit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    axios.post('http://localhost:3000/user/signup', input)
      .then((response) => {
        if (response.data.message === 'Registered successfully') {
          alert(response.data.message);
          navigate('/login', { replace: true });
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div style={{ ...styles.background, backgroundImage: `url(${backgroundImage})` }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div style={styles.formContainer}>
          <h2 className="text-center mb-4" style={styles.heading}>Signup</h2>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                onChange={inputHandler}
                style={styles.inputField}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                onChange={inputHandler}
                style={styles.inputField}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                onChange={inputHandler}
                style={styles.inputField}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3" style={{ position: 'relative' }}>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                onChange={inputHandler}
                style={styles.inputField}
              />
              <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                name="role"
                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                onChange={inputHandler}
                style={styles.inputField}
              >
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="employer">Employer</option>
              </select>
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>
            <button type="submit" className="btn w-100" style={styles.button}>Register</button>
            <br />
            <a href="/login" className="d-block text-center mt-3" style={styles.link}>Back To Login</a>
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
    position: 'absolute',
    top: '70%',
    right: '10px',
    cursor: 'pointer',
    transform: 'translateY(-50%)',
  },
};

export default Signup;
