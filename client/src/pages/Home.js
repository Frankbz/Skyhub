import FlightSearch from "../components/FlightSearch";
import Ticket from "../components/Ticket";
import Navbar from "../components/Navbar";

import { useState } from "react";


const Home = () => {
  const [flights, setFlights] = useState([]);

  const handleFlights = (data) => {
    setFlights(data);
  };
  

  const purchaseTicket = async () => {
    const response = await fetch('http://localhost:4000/api/flights/purchase_ticket', {
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({
            "email":"bob1@gmail.com",
            "flight_ID":"123",
            "departure_datetime":"2023-12-24 01:55:00",
            "first_name":"a",
            "last_name":"b",
            "date_of_birth":"2002-12-24"
        })
    })
    const json = await response.json();
    console.log(json)
    if (!response.ok){
        console.log(json.error);
    }
    if (response.ok){
        console.log(json);
    }
}

useEffect(() =>{
    purchaseTicket();
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