import React, { useState } from 'react';

const ViewCustomersFlight = () => {
  const [searchParams, setSearchParams] = useState({
    airline_name: '',
    email: '',
  });

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

    // Add your fetch logic here
  };

  return (
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
  );
};

export default ViewCustomersFlight;
