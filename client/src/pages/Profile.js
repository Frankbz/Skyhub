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
    useEffect(()=>getInfo,[])

    const handleCancel = () => { // TODO
        console.log("cc")
    }

    const getCurrentDate = () => {
        const currentDate = new Date();
        return currentDate.toISOString();
      };
    
    const futureFlights = flights.filter((flightData) => flightData.departure_datetime > getCurrentDate());
    const pastFlights = flights.filter((flightData) => flightData.departure_datetime <= getCurrentDate());
    console.log(flights, futureFlights, pastFlights)
    return ( 
        <>
        <Navbar />
        <div className="container">
            <h3>Upcoming Flights</h3>
            {futureFlights.map((flightData) => (
            <Cell flightData={flightData} handleButtonClick={handleCancel} buttonName={"Cancel"} />
            ))}
            <h3>Past Flights</h3>
            {pastFlights.map((flightData) => (
            <Cell flightData={flightData} handleButtonClick={handleCancel} buttonName={"Cancel"} />
            ))}
            {/* <BarChart /> */}
        </div>
        </>
     );
}
 
export default Profile;