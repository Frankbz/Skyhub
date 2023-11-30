import Navbar from "../components/Navbar";
import BarChart from "../components/BarChart"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cell from "../components/Cell";

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]) // we have ticket ID here

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
                console.log(json)
                setFlights(json) // we have ticket ID here
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
        console.log("json", json)

        window.location.reload()
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
            <button type="button" class="btn btn-warning" onClick={()=>{navigate("/spending")}} style={{ position: 'fixed', right: '10px'}}>Track my spending</button>
            <h3>Upcoming Flights</h3>
            {futureFlights.map((flightData) => (
            <Cell flightData={flightData} handleButtonClick={() => handleCancel(flightData.ticket_ID)} buttonName={"Cancel"} buttonShow={user && user.email !== null && user.email !== undefined}/>
            ))}
            <h3>Past Flights</h3>
            {pastFlights.map((flightData) => (
            <Cell flightData={flightData} handleButtonClick={() => handleCancel(flightData.ticket_ID)} buttonName={"Cancel"} buttonShow={user && user.email !== null && user.email !== undefined}/>
            ))}
            
        </div>
        </>
     );
}
 
export default Profile;