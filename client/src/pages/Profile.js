import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cell from "../components/Cell";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]) // we have ticket ID here
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");
    const [data, setData] = useState({});

    const getInfo = async () =>{
        if (!user){
            navigate("/")
            return
        }
        else{
            const response = await fetch('http://localhost:4000/api/profile/tickets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email: user.email })
            })
            const json = await response.json()
            if (response.ok){
                setFlights(json) 
            }
    }}

    useEffect(() => getInfo, [user])

    const handleCancel = async (ticket_ID) => { 
        const response = await fetch('http://localhost:4000/api/flights/delete_ticket', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: user.email, ticket_ID: ticket_ID })
        })
        const json = await response.json()
        // console.log("json", json)

        window.location.reload()
    }

    const handleClick = (flightData) =>{
        setData(flightData)
        setShowModal(true);
      }

      const handleClose = () => {
        setShowModal(false);
      }

    const handleAddComment = async () => {
        const originalDate = new Date(data.departure_datetime);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formattedDate = originalDate.toLocaleString('en-US', options)
        .replace(/\//g, '-')  // Replace slashes with hyphens
        .replace(/,/g, '')  // Remove commas
        .replace(/^(\d{2})-(\d{2})-(\d{4})/, '$3-$1-$2'); // Rearrange to the desired format

        const response = await fetch('http://localhost:4000/api/comment/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: user.email,
              flight_ID: data.flight_ID,
              departure_datetime: formattedDate,
              comment: comment,
              rating: Number(rating)
              })
            })
            const json = await response.json();
            console.log(json)
            setShowModal(false);
        }

    const getCurrentDate = () => {
        const currentDate = new Date();
        return currentDate.toISOString();
      };
    
    const futureFlights = flights.filter((flightData) => flightData.departure_datetime > getCurrentDate());
    const pastFlights = flights.filter((flightData) => flightData.departure_datetime <= getCurrentDate());

    return ( 
        <>
        <Navbar />
        <div className="container">
            <button type="button" className="btn btn-warning" onClick={()=>{navigate("/spending")}} style={{ position: 'fixed', right: '10px'}}>Track my spending</button>
            <h3>Upcoming Flights</h3>
            {futureFlights.map((flightData) => (
            <Cell flightData={flightData} handleButtonClick={() => handleCancel(flightData.ticket_ID)} buttonName={"Cancel"} buttonShow={user && user.email !== null && user.email !== undefined}/>
            ))}
            <h3>Past Flights</h3>
            {pastFlights.map((flightData) => (
            <Cell flightData={flightData} handleButtonClick={() => handleClick(flightData)} buttonName={"Rate/Comment"} buttonShow={user && user.email !== null && user.email !== undefined}/>                                                                      
            ))}
            {/* Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Comment or Rate to Your Flight</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-2" >
                    <Form.Label>Rate</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            max="5"
                            placeholder="Enter rating (1-5)"
                            value={rating}
                            onChange={(e) => {setRating(e.target.value)}}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2" >
                    <Form.Label>Comment (optional)</Form.Label>
                    <input
                        type="textarea"
                        onChange={(e)=> {setComment(e.target.value)}}
                        value={comment}
                        placeholder="Enter your comment here"
                        maxLength={100}
                    />
                    </Form.Group>
                    
                </Form>
                </Modal.Body>
            <Modal.Footer>
                <button onClick={handleClose}>
                Close
                </button>
                <button onClick={handleAddComment}>
                Submit
                </button>
                </Modal.Footer>
            </Modal>
        </div>
        </>
     );
}
 
export default Profile;