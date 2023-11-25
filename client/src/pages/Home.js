import FlightSearch from "../components/FlightSearch";
import Ticket from "../components/Ticket";

const Home = () => {
    const flightData = {
        departure_city: "New York",
        arrival_city: "Shanghai",
        departure_datetime: "2023-12-24T06:55:00.000Z",
        arrival_datetime: "2023-12-25T02:33:00.000Z",
        depart_airport_code: "JFK",
        arrive_airport_code: "PVG",
        base_price: 1000,
        flight_status: "on-time",
        flight_ID: 123,
      };
    return ( 
        <>
        <FlightSearch />
        <Ticket flightData={flightData} />
        </>
     );
}
 
export default Home;