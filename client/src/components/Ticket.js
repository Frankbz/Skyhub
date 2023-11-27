import "./Ticket.css"

const Ticket = (props) => {
  const { flightData } = props;

  return (
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
    <button className="checkout-button">Check Out</button>
  </div>
  );
};


  
  export default Ticket;
  