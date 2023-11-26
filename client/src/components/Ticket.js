import "./Ticket.css"

const Ticket = (props) => {
    const { flightData } = props;
  
    return (
      <div className="ticketContainer">
        <div className="flightDetails">
          <div className="route">
            <span className="departureCity">{flightData.departure_city}</span>
            <span className="airportArrow">{`->`}</span>
            <span className="arrivalCity">{flightData.arrival_city}</span>
            <span className="flightCode">{flightData.flight_ID}</span>
          </div>
          <div className="datetime">
            <span className="date">
              {new Date(flightData.departure_datetime).toLocaleDateString()} - {new Date(flightData.arrival_datetime).toLocaleDateString()}
            </span>
            <span className="time">
              {new Date(flightData.departure_datetime).toLocaleTimeString()} - {new Date(flightData.arrival_datetime).toLocaleTimeString()}
            </span>
          </div>
          <div className="price">${flightData.base_price}</div>
        </div>
      </div>
    );
  };
  
  export default Ticket;
  