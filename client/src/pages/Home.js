import FlightSearch from "../components/FlightSearch";
import Ticket from "../components/Ticket";
import Navbar from "../components/Navbar";

import { useState } from "react";
import { useEffect } from "react";


const Home = () => {
  const [flights, setFlights] = useState([]);

  const handleFlights = (data) => {
    setFlights(data);
  };
  const getSpending = async () => {
    const response = await fetch('http://localhost:4000/api/profile/get_spending', {
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({
            "email":"a@c.com",
            "start_date":"2023-1-14 00:00:00",
            "end_date":"2023-11-30 00:00:00"
        })
    })
    const json = await response.json();
    if (!response.ok){
        console.log(json.error);
    }
    if (response.ok){
        console.log(json);
    }
}

useEffect(() =>{
    getSpending();
}, []);

    return ( 
        <>
          <Navbar />
          <FlightSearch handleFlights={handleFlights}/>
          {flights.map((flightData) => (
            <Ticket flightData={flightData} />
          ))}
        </>
     );
}
 
export default Home;