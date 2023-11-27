import "./Ticket.css"; 
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


const Ticket = (props) => {
  const { flightData } = props;

  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    building: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip_code: "",
    card_type: "",
    card_number: "",
    name_on_card: "",
    card_exp_date: "",
    passport_num: "",
    passport_exp_date: "",
    passport_country: "",
    birthday: ""
  })

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

  const handleCheckOut = () => {
    setShowModal(true)  
  }

  const handleBuyTicket = () => {
    setShowModal(false)

    console.log(userInfo)

    // call API here
  }

  //console.log(userInfo)
  return (
    <>
    <div className="ticket">
    <div className="header-section">
      <h2 className="airline-name">{flightData.airline_name}</h2>
      <div className="top-right">
        <p className="flight-id">ID: {flightData.flight_ID}</p>
        <img src="https://raw.githubusercontent.com/pizza3/asset/master/airplane2.png" alt="Airplane" className="plane-image" />
      </div>
    </div>
    <p className="seats">Seats: {flightData.num_of_seats}</p>
    <div className="route-info">
      <div className="source">
        <p className="city-name">{flightData.departure_city}</p>
        <p className="airport-code">{flightData.depart_airport_code}</p>
        <p className="time-info">
          <strong>{new Date(flightData.departure_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
          <br />
          {new Date(flightData.departure_datetime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
        </p>
      </div>
      <div className="arrow">→</div>
      <div className="dest">
        <p className="city-name">{flightData.arrival_city}</p>
        <p className="airport-code">{flightData.arrive_airport_code}</p>
        <p className="time-info">
          <strong>{new Date(flightData.arrival_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
          <br />
          {new Date(flightData.arrival_datetime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
        </p>
      </div>
    </div>
    <div className="status-section">
      <p className="status">Status: {flightData.flight_status}</p>
    </div>
    <button onClick={handleCheckOut} className="checkout-button">Check Out</button>
  </div>
  {/* Modal */}
  <Modal show={showModal} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Ticket Checkout</Modal.Title>
    </Modal.Header>
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
                name="zip_code"
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
              aria-label="Default select example"
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
                name="passport_exp_date"
                onChange={handleChange}
                value={userInfo.passport_exp_date}
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
                name="birthday"
                onChange={handleChange}
                value={userInfo.birthday}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose}>
          Close
        </button>
        <button onClick={handleBuyTicket}>
          Proceed
        </button>
      </Modal.Footer>
  </Modal>
  </>
  );
};


  
  export default Ticket;
  