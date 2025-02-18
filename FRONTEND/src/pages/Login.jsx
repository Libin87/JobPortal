import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../images/login.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';
import { auth, googleProvider } from '../pages/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import SuspensionNotice from '../components/SuspensionNotice';

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('userId')) {
      navigate('/');
    }
  }, [navigate]);

  const [input, setInput] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuspensionDialog, setShowSuspensionDialog] = useState(false);
  const [suspensionMessage, setSuspensionMessage] = useState('');

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    if (input.email === adminEmail && input.password === adminPassword) {
      sessionStorage.setItem('role', 'admin');
      sessionStorage.setItem('name', 'Admin');
      sessionStorage.setItem('userId', 'adminId');
      setLoading(false);
      navigate('/', { replace: true });
    } else {
      axios.post('http://localhost:3000/user/login', input)
        .then((response) => {
          setLoading(false);
          if (response.data.message === 'Login successfully!!') {
            sessionStorage.setItem('role', response.data.role);
            sessionStorage.setItem('name', response.data.name);
            sessionStorage.setItem('userId', response.data._id);
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('phone', response.data.phone);
            navigate('/', { replace: true });
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response?.data?.isSuspended) {
            setSuspensionMessage(err.response.data.message);
            setShowSuspensionDialog(true);
          } else if (err.response?.data?.message) {
            alert(err.response.data.message);
          } else {
            console.error("An unexpected error occurred:", err);
            alert("An unexpected error occurred. Please try again later.");
          }
        });
    }
  };

  // Google Sign-In function
  // const signInWithGoogle = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const user = result.user;
  //     alert('Google Sign-In successful!');
  //     sessionStorage.setItem('role', 'employee');
  //     sessionStorage.setItem('name', user.displayName);
  //     sessionStorage.setItem('userId', user.uid);
  //     sessionStorage.setItem('email', user.email);
  //     setLoading(false);
  //     navigate('/', { replace: true });
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Google Sign-In error:", error);
  //     alert("Google Sign-In failed. Please try again.");
  //   }
  // };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Prepare data to send to backend
        const userData = {
            name: user.displayName,
            email: user.email,
            role: 'employee',
            googleId: user.uid,
        };

        // Send user data to backend and get the saved user info
        const response = await axios.post('http://localhost:3000/user/google-signin', userData);
        const savedUser = response.data.user; // Extract user data from the backend response

        // Save the user data returned from backend in session storage
        sessionStorage.setItem('role', savedUser.role);
        sessionStorage.setItem('name', savedUser.name);
        sessionStorage.setItem('userId', savedUser._id); // MongoDB generated ID
        sessionStorage.setItem('email', savedUser.email);

        setLoading(false);
        alert('Google Sign-In successful!');
        navigate('/', { replace: true });
    } catch (error) {
        setLoading(false);
        console.error("Google Sign-In error:", error);
        alert("Google Sign-In failed. Please try again.");
    }
};

  return (
    <div style={{ ...styles.background, backgroundImage: `url(${backgroundImage})` }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div style={styles.formContainer}>
          <h2 className="text-center mb-4" style={styles.heading}>Login</h2>
          {loading ? (
            <div className="text-center">
              <CircularProgress color="primary" />
            </div>
          ) : (
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
              <button type="submit" className="btn w-100" style={styles.button} id="login">Login</button>
              <br /><br />
              <button type="button" onClick={signInWithGoogle} className="btn w-100" style={styles.googleButton}>
                Sign in with Google
              </button>
              <p style={styles.message1}>Google login is available only for employees.</p>
              
              <a href="/signup" className="d-block text-center mt-3" style={styles.link}>Signup</a>
              <a href="/forgotpassword" className="d-block text-center mt-3" style={styles.link}>Forgot Password?</a>
            </form>
          )}
        </div>
      </div>
      <SuspensionNotice 
        message={suspensionMessage}
        open={showSuspensionDialog}
        onClose={() => setShowSuspensionDialog(false)}
      />
    </div>
  );
};

const styles = {
  background: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  },
  message1: {
    color: 'gray', // Optional styling for the message
    fontSize: '0.9rem',
    marginTop: '10px',
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
  googleButton: {
    backgroundColor: '#db4437',
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
  },
};

export default LoginForm;

