

import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import backgroundImage from '../images/login.jpg';

const Signup = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem('userId')) {
      navigate('/');
    }
  }, [navigate]);
  const [input, setInput] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on input
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const validateField = (name, value) => {
    const newErrors = {};
    switch (name) {
      case 'name':
        if (!value) {
          newErrors.name = 'Name is required.';
        } else if (value.length < 3) {
          newErrors.name = 'Enter a valid name.';
        } else if (!/^[A-Z]/.test(value)) {
          newErrors.name = 'Name should start with an uppercase letter.';
        } else if (!/^[A-Za-z ]+$/.test(value)) {  // Allows spaces between first and last name
          newErrors.name = 'Name should contain only alphabets ';
        }
        break;
      case 'phone':
        if (!value) {
          newErrors.phone = 'Phone number is required.';
        } else if (!/^\d+$/.test(value)) {
          newErrors.phone = 'Phone should contain only digits.';
        } else if (value.length !== 10) {
          newErrors.phone = 'Phone number must be 10 digits.';
        } else if (/(\d)\1{4,}/.test(value)) {
          newErrors.phone = 'Enter a valid phone number.';
        }
        break;


      case 'email':
        if (!value) {
          newErrors.email = 'Email is required.';
        } else if (!/^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/.test(value)) {
          newErrors.email = 'Enter a valid email ID';
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required.';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long.';
        } else if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          newErrors.password = 'Password must include at least one letter, one number, and one special character.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirm Password is required.';
        } else if (value !== input.password) {
          newErrors.confirmPassword = 'Passwords do not match.';
        }
        break;

      case 'role':
        if (!value) {
          newErrors.role = 'Role is required.';
        }
        break;

      default:
        break;
    }
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldErrors = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors }));
  };

  // const validateAllFields = () => {
  //   const allErrors = {};
  //   Object.keys(input).forEach((key) => {
  //     Object.assign(allErrors, validateField(key, input[key]));
  //   });
  //   return allErrors;
  // };

  // const submit = (e) => {
  //   e.preventDefault();
  //   const allErrors = validateAllFields();
  //   if (Object.keys(allErrors).length > 0) {
  //     setErrors(allErrors);
  //     return;
  //   }

  //   axios.post('http://localhost:3000/user/signup', input)
  //     .then((response) => {
  //       if (response.data.message === 'Registered successfully') {
  //         alert(response.data.message);
  //         navigate('/login', { replace: true });
  //       }
  //     })
  //     .catch((err) => {
  //       let errorMessage = ''; // Initialize the error message variable

  //       if (err.response && err.response.status === 400) {
  //         // Check for existing email
  //         if (err.response.data.message === 'Email already exists') {
  //           errorMessage += 'Email already exists. ';
  //           setErrors((prevErrors) => ({ ...prevErrors, email: 'Email already exists' }));
  //         }
  //         // Check for existing phone number
  //         if (err.response.data.message === 'Phone number already exists') {
  //           errorMessage += 'Phone number already exists. ';
  //           setErrors((prevErrors) => ({ ...prevErrors, phone: 'Phone number already exists' }));
  //         }

  //         // Show alert with all relevant error messages
  //         if (errorMessage) {
  //           alert(errorMessage.trim());
  //         }
  //       } else {
  //         console.log(err);
  //       }
  //     });
  // };
  const validateAllFields = () => {
    const allErrors = {};
    const requiredFields = ['name', 'phone', 'email', 'password', 'confirmPassword', 'role'];
  
    // Loop through required fields to ensure each one has validation
    requiredFields.forEach((field) => {
      const value = input[field] || ''; // Get field value or empty string if undefined
      const fieldErrors = validateField(field, value); // Validate the field
      Object.assign(allErrors, fieldErrors); // Merge any errors found into allErrors
    });
  
    return allErrors;
  };
  
  const submit = (e) => {
    e.preventDefault();
    const allErrors = validateAllFields();
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
  
    axios.post('http://localhost:3000/user/signup', input)
      .then((response) => {
        if (response.data.message === 'Registered successfully') {
          alert(response.data.message);
          navigate('/login', { replace: true });
        }
      })
      .catch((err) => {
        let errorMessage = ''; // Initialize the error message variable
  
        if (err.response && err.response.status === 400) {
          // Check for existing email
          if (err.response.data.message === 'Email already exists') {
            errorMessage += 'Email already exists. ';
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Email already exists' }));
          }
          // Check for existing phone number
          if (err.response.data.message === 'Phone number already exists') {
            errorMessage += 'Phone number already exists. ';
            setErrors((prevErrors) => ({ ...prevErrors, phone: 'Phone number already exists' }));
          }
  
          // Show alert with all relevant error messages
          if (errorMessage) {
            alert(errorMessage.trim());
          }
        } else {
          console.log(err);
        }
      });
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
                style={styles.inputField}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3" style={styles.passwordContainer}>
              <label htmlFor="password" className="form-label">Password</label>
              <div style={styles.inputWithIcon}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  onChange={inputHandler}
                  onBlur={handleBlur}
                  style={styles.inputField}
                />
                <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="mb-3" style={styles.passwordContainer}>
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div style={styles.inputWithIcon}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={inputHandler}
                  onBlur={handleBlur}
                  style={styles.inputField}
                />
                <span onClick={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                name="role"
                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                onChange={inputHandler}
                onBlur={handleBlur}
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
    height: '100vh', // Make sure the background covers the entire viewport height
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '30px',
    marginBottom: '30px',
    minHeight: '500px', // Ensure minimum height so container doesn't shrink or expand
  },
  heading: {
    color: '#360275',
  },
  inputField: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#360275',
    color: 'white',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
  },
  passwordContainer: {
    position: 'relative',
  },
  inputWithIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: '-35px',
    cursor: 'pointer',
  },
  link: {
    color: '#360275',
  },
  // Add a fixed height for the error message section
  errorMessage: {
    minHeight: '20px',  // Reserve space for error messages to prevent layout shifts
    fontSize: '12px',   // Ensure the error message is small and non-disruptive
  },
};


export default Signup;

