import React, { useState } from 'react';
import Cell from '../Cell';

const ViewCustomersFlight = () => {
  const [searchParams, setSearchParams] = useState({
    airline_name: '',
    email: '',
  });
  const [flights, setFlights] = useState([]);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      airline_name: searchParams.airline_name,
      email: searchParams.email,
    });

    const response = await fetch('http://localhost:4000/api/staff/view_customer_flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            airline_name: searchParams.airline_name,
            email: searchParams.email,
          }),
      });
    
    const json = await response.json()
    // console.log(json)
    setFlights(json)
  };    

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div style={{ width: '100%', height: '100%', border: '1px solid #ccc', padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Airline:</label>
            <input
              type="text"
              name="airline_name"
              value={searchParams.airline_name}
              onChange={handleChange}
              placeholder="Airline Name"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={searchParams.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
    {flights.map((flightData) => (
       <Cell
       flightData={flightData}
       handleButtonClick={undefined}
       buttonName={undefined}
       buttonShow={false}
     />
    ))}
    </>
  );
};

export default ViewCustomersFlight;
