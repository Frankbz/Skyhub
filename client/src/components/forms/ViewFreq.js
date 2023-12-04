import { useState } from 'react';

const ViewFreq = () => {
  const [searchParams, setSearchParams] = useState({
    airplane_ID: '',
    airline_name: '',
    start_datetime: '',
    end_datetime: '',
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call, replace the URL with your actual API endpoint
    const response = await fetch('http://localhost:4000/api/staff/view_top_buyer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        airplane_ID: Number(searchParams.airplane_ID),
        airline_name: searchParams.airline_name,
        start_datetime: searchParams.start_datetime,
        end_datetime: searchParams.end_datetime,
      }),
    });

    const json = await response.json();
    console.log(json);
    // Handle the API response as needed
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ width: '100%', height: '100%', border: '1px solid #ccc', padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Airline Name:</label>
            <input
              type="text"
              name="airline_name"
              value={searchParams.airline_name}
              onChange={handleChange}
              placeholder="Airline Name"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Start Datetime:</label>
            <input
              type="datetime-local"
              name="start_datetime"
              value={searchParams.start_datetime}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>End Datetime:</label>
            <input
              type="datetime-local"
              name="end_datetime"
              value={searchParams.end_datetime}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default ViewFreq;
