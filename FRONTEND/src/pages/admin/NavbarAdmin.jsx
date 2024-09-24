import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink, useNavigate,} from 'react-router-dom';
 
const NavbarAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      const logoutTimer = setTimeout(() => {
        handleLogout();
      },180000); 
      return () => clearTimeout(logoutTimer);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role'); 
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" style={styles.navLink}>
                HomePage
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink className="nav-link" to="adminpage" style={styles.navLink} 
              >
                Admin Dashboard
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

export default NavbarAdmin;

