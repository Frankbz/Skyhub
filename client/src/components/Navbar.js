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
        const response = await fetch('http://localhost:4000/api/profile/add_phone', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: user.email,
              phone_number: phone,
            })
          })
        
        const json = await response.json();
        
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
              <> </>
            )
          ) : (
            <> </>
          )
        }
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