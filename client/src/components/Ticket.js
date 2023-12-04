import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Cell from "./Cell";


const Ticket = (props) => {
  const navigate = useNavigate();
  const { flightData } = props;
  const user = JSON.parse(localStorage.getItem('user'));

  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: user ? user.email : null,
    first_name: "",
    last_name: "",
    building: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipcode: "",
    card_type: "",
    card_number: "",
    name_on_card: "",
    card_exp_date: "",
    passport_num: "",
    passport_expr: "",
    passport_country: "",
    date_of_birth: ""
  })
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShowModal(false)
  }

  const handleOpen = () => {
    setShowModal(true)  
  }
  
  const handleBuyTicket = async () => {
    setShowModal(false)
    const originalDate = new Date(flightData.departure_datetime);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = originalDate.toLocaleString('en-US', options)
    .replace(/\//g, '-')  // Replace slashes with hyphens
    .replace(/,/g, '')  // Remove commas
    .replace(/^(\d{2})-(\d{2})-(\d{4})/, '$3-$1-$2'); // Rearrange to the desired format

    
    const response1 = await fetch('http://localhost:4000/api/profile/update_info', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userInfo)
          })
        
    const json1 = await response1.json();
    
    if (!response1.ok){
      console.log(json1.error)
      return
    }
    
    const response2 = await fetch('http://localhost:4000/api/flights/purchase_ticket', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: userInfo.email,
              flight_ID: flightData.flight_ID,
              departure_datetime: formattedDate,
              first_name: userInfo.first_name,
              last_name: userInfo.last_name,
              date_of_birth:userInfo.date_of_birth
            })
          })

    const json2 = await response2.json();
    if (!response2.ok){
      console.log(json2.error)
      return
    }
    navigate("/profile")

  }

  const handleChangeStatus = async () => {
    const originalDate = new Date(flightData.departure_datetime);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = originalDate.toLocaleString('en-US', options)
    .replace(/\//g, '-')  // Replace slashes with hyphens
    .replace(/,/g, '')  // Remove commas
    .replace(/^(\d{2})-(\d{2})-(\d{4})/, '$3-$1-$2'); // Rearrange to the desired format

    console.log({
      flight_ID: flightData.flight_ID,
      departure_datetime: formattedDate,
      flight_status: status
    })
    const response = await fetch('http://localhost:4000/api/flights/change_status', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              flight_ID: flightData.flight_ID,
              departure_datetime: formattedDate,
              flight_status: status
            })
          })
    const json = await response.json();
    console.log(json)
  }

  return (
    <>
      <Cell
      flightData={flightData}
      handleButtonClick={handleOpen}
      buttonName={user && user.type === "customer" ? "Check Out" : "Change Status"}
      buttonShow={user && user.email !== null && user.email !== undefined}
    />
      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        {user ? (
          user.type === "customer" ? (
            // Content for customer type
          <>
            <Modal.Title>Input User Information For Checkout</Modal.Title>
            <Modal.Body>
            <Form>
              <Form.Group className="mb-2" >
                <Form.Label>First Name</Form.Label>
                <input
                  type="text"
                  name="first_name"
                  onChange={handleChange}
                  value={userInfo.first_name}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <input
                  type="text"
                  name="last_name"
                  onChange={handleChange}
                  value={userInfo.last_name}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Building</Form.Label>
                <input
                  type="text"
                  name="building"
                  onChange={handleChange}
                  value={userInfo.building}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Street</Form.Label>
                <input
                  type="text"
                  name="street"
                  onChange={handleChange}
                  value={userInfo.street}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Apartment</Form.Label>
                <input
                  type="text"
                  name="apartment"
                  onChange={handleChange}
                  value={userInfo.apartment}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <input
                  type="text"
                  name="city"
                  onChange={handleChange}
                  value={userInfo.city}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <input
                  type="text"
                  name="state"
                  onChange={handleChange}
                  value={userInfo.state}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Zip Code</Form.Label>
                <input
                  type="text"
                  name="zipcode"
                  onChange={handleChange}
                  value={userInfo.zipcode}
                />
              </Form.Group>
              <Form.Group className="mb-3">
              <Form.Label>Card Type</Form.Label>
              <Form.Select
                name="card_type"
                onChange={handleChange}
                value={userInfo.card_type}
                
              >
                <option value="debit">Debit Card</option>
                <option value="credit">Credit Card</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <input
                  type="text"
                  name="card_number"
                  onChange={handleChange}
                  value={userInfo.card_number}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name On Card</Form.Label>
                <input
                  type="text"
                  name="name_on_card"
                  onChange={handleChange}
                  value={userInfo.name_on_card}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Card Expire Date</Form.Label>
                <input
                  type="date"
                  name="card_exp_date"
                  onChange={handleChange}
                  value={userInfo.card_exp_date}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Passport Number</Form.Label>
                <input
                  type="text"
                  name="passport_num"
                  onChange={handleChange}
                  value={userInfo.passport_num}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Passport Expire Date</Form.Label>
                <input
                  type="date"
                  name="passport_expr"
                  onChange={handleChange}
                  value={userInfo.passport_expr}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Passport Country</Form.Label>
                <input
                  type="text"
                  name="passport_country"
                  onChange={handleChange}
                  value={userInfo.passport_country}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Birthday</Form.Label>
                <input
                  type="date"
                  name="date_of_birth"
                  onChange={handleChange}
                  value={userInfo.date_of_birth}
                />
              </Form.Group>
            </Form>
            </Modal.Body>
          </>
          ) : (
          <>
            <Modal.Title>Change Status</Modal.Title>
            <Modal.Body>
            <Form>
              <Form.Group className="mb-2" >
                <Form.Label>Status (on time/delayed)</Form.Label>
                <input
                  type="text"
                  onChange={(e) => {setStatus(e.target.value)}}
                  value={status}
                />
              </Form.Group>
            </Form>
            </Modal.Body>
            </>
          )
        ) : (
          <p>Not Logged In</p>
        )}
      </Modal.Header>
      
      <Modal.Footer>
        <button onClick={handleClose}>Close</button>
        <button onClick={user && user.type === "customer" ? handleBuyTicket : handleChangeStatus}>Proceed</button>
      </Modal.Footer>
    </Modal>
      </>
  );
};


  
  export default Ticket;
  