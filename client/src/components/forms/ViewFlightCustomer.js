import React, { useState } from 'react';

const ViewFlightCustomer = () => {
  const [searchParams, setSearchParams] = useState({
    flight_ID: '',
    departure_datetime: '',
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    // Backend not done
    e.preventDefault();

    console.log({
      flight_ID: Number(searchParams.flight_ID),
      departure_datetime: searchParams.departure_datetime,
    });

    const response = await fetch('http://localhost:4000/api/flights/view_customers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            flight_ID: Number(searchParams.flight_ID),
            departure_datetime: searchParams.departure_datetime,
          })
      })
    const json = await response.json();
    console.log(json)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ width: '100%', height: '100%', border: '1px solid #ccc', padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Flight ID:</label>
            <input
              type="number"
              name="flight_ID"
              value={searchParams.flight_ID}
              onChange={handleChange}
              placeholder="Flight ID"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Departure:</label>
            <input
              type="datetime-local"
              name="departure_datetime"
              value={searchParams.departure_datetime}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default ViewFlightCustomer;
