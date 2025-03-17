import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Using Bootstrap icons, no import needed

const NavbarEmployer = ({ unreadMessageCount: propUnreadCount }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  
  // Use either the prop value or the local state
  const displayUnreadCount = propUnreadCount !== undefined ? propUnreadCount : localUnreadCount;

  useEffect(() => {
    // Retrieve user details from sessionStorage
    const storedUserName = sessionStorage.getItem('name');

    if (storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      
      // Set logout timer for 30 minutes
      const logoutTimer = setTimeout(() => {
        handleLogout();
      }, 1800000); // 30 minutes

      return () => clearTimeout(logoutTimer);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchUnreadMessageCount = async () => {
      if (!isLoggedIn) return;
      
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/api/chat/unread-count/${userId}`);
        setLocalUnreadCount(response.data.count);
      } catch (error) {
        console.error('Error fetching unread message count:', error);
      }
    };
    
    // Only fetch if prop is not provided
    if (propUnreadCount === undefined) {
      fetchUnreadMessageCount();
      
      // Set up interval to periodically fetch unread count
      const interval = setInterval(fetchUnreadMessageCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, propUnreadCount]);

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('cname'); 
    sessionStorage.removeItem('userId'); 
    sessionStorage.removeItem('email'); 
    sessionStorage.removeItem('phone');  
    setIsLoggedIn(false);
    navigate('/login');
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
            {isLoggedIn && (
              <li className="nav-item">
                <NavLink 
                  to="/chat"
                  className="nav-link btn btn-primary ms-2"
                  style={styles.chatButton}
                >
                  <i className="bi bi-chat-dots me-1"></i>
                  Chat
                  {displayUnreadCount > 0 && (
                    <span className="badge rounded-pill bg-danger" 
                      style={{ 
                        fontSize: '0.6rem', 
                        position: 'relative', 
                        top: '-8px', 
                        left: '-2px' 
                      }}>
                      {displayUnreadCount}
                    </span>
                  )}
                </NavLink>
              </li>
            )}
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
  chatButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
  },
};

export default NavbarEmployer;
