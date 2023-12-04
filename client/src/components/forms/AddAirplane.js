import { useState } from 'react';

const AddAirplane = () => {
  const [airplaneParams, setAirplaneParams] = useState({
    airline_name: '',
    num_of_seats: '',
    manufacturing_company: '',
    model_number: '',
    age: '',
  });

  const handleChange = (e) => {
    setAirplaneParams({
      ...airplaneParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      airline_name: airplaneParams.airline_name,
      num_of_seats: Number(airplaneParams.num_of_seats),
      manufacturing_company: airplaneParams.manufacturing_company,
      model_number: airplaneParams.model_number,
      age: Number(airplaneParams.age),
    });

    const response = await fetch('http://localhost:4000/api/staff/add_plane', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            airline_name: airplaneParams.airline_name,
            num_of_seats: Number(airplaneParams.num_of_seats),
            manufacturing_company: airplaneParams.manufacturing_company,
            model_number: airplaneParams.model_number,
            age: Number(airplaneParams.age),
          })
      })
    const json = await response.json();
    console.log(json)
    if (response.ok) {
        alert("Airplane successfully added");
        setAirplaneParams({
            airline_name: '',
            num_of_seats: '',
            manufacturing_company: '',
            model_number: '',
            age: '',
          })
        }
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
              value={airplaneParams.airline_name}
              onChange={handleChange}
              placeholder="Airline Name"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Number of Seats:</label>
            <input
              type="number"
              name="num_of_seats"
              value={airplaneParams.num_of_seats}
              onChange={handleChange}
              placeholder="Number of Seats"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Manufacturing Company:</label>
            <input
              type="text"
              name="manufacturing_company"
              value={airplaneParams.manufacturing_company}
              onChange={handleChange}
              placeholder="Manufacturing Company"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Model Number:</label>
            <input
              type="text"
              name="model_number"
              value={airplaneParams.model_number}
              onChange={handleChange}
              placeholder="Model Number"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={airplaneParams.age}
              onChange={handleChange}
              placeholder="Age"
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default AddAirplane;
