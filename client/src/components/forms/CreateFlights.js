import { useState } from 'react';

const CreateFlights = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchParams, setSearchParams] = useState({
    departure_datetime: '',
    arrival_datetime: '',
    start_airport: '',
    dest_airport: '',
    base_price: '',
    airplane_ID: '',
  });
  

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/api/flights/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            airline_name: user ? user.airline_name : null,
            departure_datetime: searchParams.departure_datetime,
            arrival_datetime: searchParams.arrival_datetime,
            start_airport: searchParams.start_airport,
            dest_airport: searchParams.dest_airport,
            base_price: Number(searchParams.base_price),
            airplane_ID: Number(searchParams.airplane_ID),
        })
      })
    
    const json = await response.json();

    if (json.message) {
        alert(json.message);
    
        // Clear the form by resetting the state to its initial values
        setSearchParams({
          departure_datetime: '',
          arrival_datetime: '',
          start_airport: '',
          dest_airport: '',
          base_price: '',
          airplane_ID: '',
        });
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ width: '100%', height: '100%', border: '1px solid #ccc', padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Departure:</label>
            <input
              type="datetime-local"
              name="departure_datetime"
              value={searchParams.departure_datetime}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Arrival:</label>
            <input
              type="datetime-local"
              name="arrival_datetime"
              value={searchParams.arrival_datetime}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Start Airport:</label>
            <input
              type="text"
              name="start_airport"
              value={searchParams.start_airport}
              onChange={handleChange}
              placeholder="Start Airport"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Destination Airport:</label>
            <input
              type="text"
              name="dest_airport"
              value={searchParams.dest_airport}
              onChange={handleChange}
              placeholder="Destination Airport"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Base Price:</label>
            <input
              type="number"
              step="0.01"
              name="base_price"
              value={searchParams.base_price}
              onChange={handleChange}
              placeholder="Base Price"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Airplane ID:</label>
            <input
              type="number"
              name="airplane_ID"
              value={searchParams.airplane_ID}
              onChange={handleChange}
              placeholder="Airplane ID"
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default CreateFlights;
