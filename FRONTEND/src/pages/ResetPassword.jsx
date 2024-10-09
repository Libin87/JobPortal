// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import backgroundImage from '../images/login.jpg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       setMessage('Passwords do not match.');
//       return;
//     }

//     try {
//       const response = await axios.post(`http://localhost:3000/user/resetpassword/${token}`, { newPassword });
//       setMessage(response.data.message);

//       setTimeout(() => {
//         navigate('/login');
//       }, 2000); 
//     } catch (error) {
//       setMessage('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100" style={{ ...styles.background }}>
//       <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
//         <div style={styles.formContainer}>
//           <h2 className="text-center mb-4" style={styles.heading}>Reset Password</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3 position-relative">
//               <label htmlFor="newPassword" className="form-label">New Password</label>
//               <input 
//                 type={showNewPassword ? 'text' : 'password'} 
//                 className="form-control" 
//                 id="newPassword" 
//                 name="newPassword" 
//                 value={newPassword} 
//                 onChange={(e) => setNewPassword(e.target.value)} 
//                 required 
//                 style={styles.inputField}
//               />
//               <FontAwesomeIcon 
//                 icon={showNewPassword ? faEyeSlash : faEye} 
//                 onClick={() => setShowNewPassword(!showNewPassword)} 
//                 style={styles.eyeIcon}
//               />
//             </div>
//             <div className="mb-3 position-relative">
//               <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
//               <input 
//                 type={showConfirmPassword ? 'text' : 'password'} 
//                 className="form-control" 
//                 id="confirmPassword" 
//                 name="confirmPassword" 
//                 value={confirmPassword} 
//                 onChange={(e) => setConfirmPassword(e.target.value)} 
//                 required 
//                 style={styles.inputField}
//               />
//               <FontAwesomeIcon 
//                 icon={showConfirmPassword ? faEyeSlash : faEye} 
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
//                 style={styles.eyeIcon}
//               />
//             </div>
//             <button type="submit" className="btn w-100" style={styles.button}>Reset Password</button>
//           </form>
//           {message && <p className="mt-3 text-center">{message}</p>}
//           <p className="text-center mt-3">
//             <Link to="/login" style={styles.link}>Back to Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   background: {
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     height: '100vh',
//     backgroundImage: `url(${backgroundImage})`,
//   },
//   formContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: '20px',
//     borderRadius: '10px',
//     maxWidth: '400px',
//     width: '100%',
//   },
//   inputField: {
//     height: '40px',
//   },
//   button: {
//     backgroundColor: '#360275',
//     color: '#fff',
//     fontWeight: 'normal',
//   },
//   link: {
//     color: '#360275',
//     textDecoration: 'none',
//   },
//   heading: {
//     color: '#360275',
//     fontWeight: 'bold',
//   },
//   eyeIcon: {
//     position: 'absolute',
//     top: '70%',
//     right: '10px',
//     transform: 'translateY(-50%)',
//     cursor: 'pointer',
//   },
// };

// export default ResetPassword;

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../images/login.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Separate validation function for each rule
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const handleNewPasswordBlur = () => {
    const error = validatePassword(newPassword);
    setPasswordError(error);
  };

  const handleConfirmPasswordBlur = () => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform final validation checks on submit
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    } else {
      setPasswordError('');
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    } else {
      setConfirmPasswordError('');
    }

    try {
      const response = await axios.post(`http://localhost:3000/user/resetpassword/${token}`, { newPassword });
      setMessage(response.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ ...styles.background }}>
      <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
        <div style={styles.formContainer}>
          <h2 className="text-center mb-4" style={styles.heading}>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={handleNewPasswordBlur} 
                required
                style={styles.inputField}
              />
              <FontAwesomeIcon
                icon={showNewPassword ? faEyeSlash : faEye}
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              />
              <div style={styles.errorContainer}>
                {passwordError && <p className="text-danger mb-0">{passwordError}</p>}
              </div>
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPasswordBlur}
                required
                style={styles.inputField}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              />
              <div style={styles.errorContainer}>
                {confirmPasswordError && <p className="text-danger mb-0">{confirmPasswordError}</p>}
              </div>
            </div>
            <button type="submit" className="btn w-100" style={styles.button}>Reset Password</button>
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
  eyeIcon: {
    position: 'absolute',
    top: '60%',
    right: '10px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
  },
  errorContainer: {
    minHeight: '20px', // Ensures space is reserved for the error message, preventing shifting
  },
};

export default ResetPassword;
