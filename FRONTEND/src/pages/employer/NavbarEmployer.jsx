

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios

const NavbarEmployer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserName = localStorage.getItem('name');

    if (token) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      const logoutTimer = setTimeout(() => {
        handleLogout();
      }, 1800000); // Logout after 30 minutes

      return () => clearTimeout(logoutTimer);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Axios instance for API calls
  const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust the base URL as needed
  });

  const fetchData = async () => {
    try {
      const response = await api.get('/some-endpoint'); // Example endpoint
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
      } else if (error.request) {
        console.error('No Response:', error.request);
      } else {
        console.error('Error', error.message);
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={styles.navbar}>
      <div className="container">
        <NavLink className="navbar-brand" to="/HomePage" style={styles.brand}>
          JobPortal
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" style={styles.navLink}>
                HomePage
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/employerpage"
                className="nav-link btn"
                activeClassName="active"
                style={styles.navLink}
              >
                Employer Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contactus" style={styles.navLink}>
                Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" style={styles.navLink}>
                About
              </NavLink>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <span className="navbar-text" style={styles.userName}>
                  Hello, {userName}!
                </span>
              </li>
            )}
            <li className="nav-item">
              {isLoggedIn ? (
                <button className="nav-link btn btn-danger text-white ms-2" onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              ) : (
                <NavLink className="nav-link btn btn-primary text-white ms-2" to="/login" style={styles.loginButton}>
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#360275',
  },
  navLink: {
    fontSize: '1rem',
    color: '#333',
    padding: '8px 16px',
    transition: 'color 0.3s ease',
  },
  userName: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#F04B3F',
    marginRight: '10px',
  },
  loginButton: {
    backgroundColor: '#360275',
    borderColor: '#360275',
    fontSize: '1rem',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    fontSize: '1rem',
  },
};

export default NavbarEmployer;
