import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import "./Navbar.css"

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")

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
        window.location.reload()
      };

      const handleClick = () =>{
        setShowModal(true);
      }

      const handleClose = () => {
        setShowModal(false);
      }

      const handleAddPhone = async () => {
        if (user && user.type === "customer"){
        const response = await fetch('http://localhost:4000/api/profile/add_phone', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: user.email,
              phone_number: phone,
            })
          })
        
        const json = await response.json();
        }
        else if (user && user.type === "staff"){
          const response = await fetch('http://localhost:4000/api/staff/add_phone', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              airline_name: user.airline_name,
              username: user.email,
              phone_number: phone,
            })
          })
          const json = await response.json();
        }
        
        setShowModal(false);
      }

    return ( 
        <div className="navbar">
        <div className="navbar-item">
          <Link to="/" className="navbar-link skyhub">
            Skyhub
          </Link>
        </div>
        {
          loggedIn ? (
            user.type === "customer" ? (
              <> 
                <button onClick={handleClick}> Add phones</button>
              </>
            ) : (
              //  add phone and emails for staff
              <div> 
              <button onClick={handleClick}> Add phones/emails</button>
              
              </div>
            )
          ) : (
            <> </>
          )
        }
        {loggedIn ? (
          <>
            <div className="navbar-item">
              {user.type === "customer" ? (
                <>
                <Link to="/profile" className="navbar-link profile">
                My Profile
                </Link>
                </>
              ) : (
                <>
                <Link to="/manage" className="navbar-link profile">
                Manage Flights
                </Link>
                </>
              )}
              
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
        {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Phone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2" >
              <Form.Label>Phone Number</Form.Label>
              <input
                type="text"
                onChange={(e)=> {setPhone(e.target.value)}}
                value={phone}
              />
              {user ? (
                user.type === "customer" ? (
                  // Content for customer type
                  <></>
                ) : (
                  // Content for staff types
                  <>
                    <Form.Label>Email</Form.Label>
                    <input
                      type="text"
                      onChange={(e)=> {setEmail(e.target.value)}}
                      value={email}
                    />
                  </>
                )
              ) : (
                // Content when user is not logged in
                <p>Not Logged In Header Content</p>
              )}
            </Form.Group>
            
          </Form>
        </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose}>
          Close
        </button>
        <button onClick={handleAddPhone}>
          Add
        </button>
        </Modal.Footer>
      </Modal>
      </div>
     );
}
 
export default Navbar;