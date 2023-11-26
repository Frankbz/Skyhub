import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./Navbar.css"

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    const navigate = useNavigate()

    useEffect(() => {
        // Check if the user is already logged in based on local storage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.email) {
            setLoggedIn(true);
            setUser(storedUser);
        }
      }, []);

      const handleLogout = () => {
        // Clear user information from local storage on logout
        localStorage.removeItem('user');
        setLoggedIn(false);
        setUser({});
        // Redirect to the home page after logout
        navigate('/');
      };

    return ( 
        <div className="navbar">
        <div className="navbar-item">
          <Link to="/" className="navbar-link skyhub">
            Skyhub
          </Link>
        </div>
  
        {loggedIn ? (
          <>
            <div className="navbar-item">
              <Link to="/profile" className="navbar-link profile">
                My Profile
              </Link>
            </div>
            <div className="navbar-item">
              <button onClick={handleLogout} className="navbar-link logout">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-item">
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </div>
        )}
      </div>
     );
}
 
export default Navbar;