import React, { useState } from 'react';

const ScheduleMaintenance = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [maintenanceParams, setMaintenanceParams] = useState({
    airplane_ID: '',
    start_datetime: '',
    end_datetime: '',
  });

  const handleChange = (e) => {
    setMaintenanceParams({
      ...maintenanceParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log({
      airplane_ID: Number(maintenanceParams.airplane_ID),
      airline_name: user ? user.airline_name : null,
      start_datetime: maintenanceParams.start_datetime,
      end_datetime: maintenanceParams.end_datetime,
    })
    const response = await fetch('http://localhost:4000/api/staff/add_maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        airplane_ID: Number(maintenanceParams.airplane_ID),
        airline_name: user ? user.airline_name : null,
        start_datetime: maintenanceParams.start_datetime,
        end_datetime: maintenanceParams.end_datetime,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (response.ok) {
        alert("Airplane scheduled for maintenance");
        setMaintenanceParams({
            airplane_ID: '',
            start_datetime: '',
            end_datetime: '',
          })
        }
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
              value={maintenanceParams.airplane_ID}
              onChange={handleChange}
              placeholder="Airplane ID"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Start Datetime:</label>
            <input
              type="datetime-local"
              name="start_datetime"
              value={maintenanceParams.start_datetime}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>End Datetime:</label>
            <input
              type="datetime-local"
              name="end_datetime"
              value={maintenanceParams.end_datetime}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default ScheduleMaintenance;
