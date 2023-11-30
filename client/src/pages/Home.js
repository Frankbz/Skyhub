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