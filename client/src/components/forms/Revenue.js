import React, { useState } from 'react';

const Revenue = () => {
  const [searchParams, setSearchParams] = useState({
    airline_name: '',
  });
  const [monthRev, setMonthRev] = useState(0);
  const [yearRev, setYearRev] = useState(0);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const response = await fetch('http://localhost:4000/api/staff/view_earned_revenue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        airline_name: searchParams.airline_name,
      }),
    });

    const json = await response.json();
    console.log(json);
    setMonthRev(json.MonthRev)
    setYearRev(json.YearRev)
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
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        {monthRev !== 0 && (
            <>
            <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Revenue Last Month: ${monthRev}</div>
            </>
        )}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {yearRev !== 0 && (
            <>
            <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Revenue Last Year: ${yearRev}</div>

            </>
        )}
    </div>
    </>
  );
};

export default Revenue;
