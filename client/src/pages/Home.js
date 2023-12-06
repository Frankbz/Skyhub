import FlightSearch from "../components/FlightSearch";
import Ticket from "../components/Ticket";
import Navbar from "../components/Navbar";
import StaffHome from "../components/StaffHome";

import { useState } from "react";


const Home = () => {
  const [flights, setFlights] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(flights)
  const handleFlights = (data) => {
    setFlights(data);
  };
  

    return ( 
        <>
          <Navbar />
          {
            // change ticket prop
            (user && user.type==="staff") ? (<>
              <StaffHome handleFlights={handleFlights}/>
              {flights.map((flightData) => (
                <Ticket flightData={flightData} />
              ))}
              </>
            ) :
            ( <>
              <FlightSearch handleFlights={handleFlights}/>
              {flights.map((flightData) => (
                <Ticket flightData={flightData} />
              ))}
              </>
            )
          }
          
        </>
     );
}
 
export default Home;