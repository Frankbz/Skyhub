import { useState } from 'react';

const AddAirport = () => {
  const [searchParams, setSearchParams] = useState({
    airport_code: '',
    name: '',
    city: '',
    country: '',
    num_of_terminals: '',
    airport_type: '',
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/api/staff/add_airport', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            airport_code: searchParams.airport_code,
            name: searchParams.name,
            city: searchParams.city,
            country: searchParams.country,
            num_of_terminals: Number(searchParams.num_of_terminals),
            airport_type: searchParams.airport_type,
          })
      })
    const json = await response.json();
    console.log(json)
    if (response.ok) {
        alert("Airport successfully added");
        setSearchParams({
            airport_code: '',
            name: '',
            city: '',
            country: '',
            num_of_terminals: '',
            airport_type: '',
          })
        }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ width: '100%', height: '100%', border: '1px solid #ccc', padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Airport Code:</label>
            <input
              type="text"
              name="airport_code"
              value={searchParams.airport_code}
              onChange={handleChange}
              placeholder="Airport Code (eg. JFK)"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={searchParams.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={searchParams.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={searchParams.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Terminals:</label>
            <input
              type="number"
              name="num_of_terminals"
              value={searchParams.num_of_terminals}
              onChange={handleChange}
              placeholder="Number of Terminals"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <label>Airport Type:</label>
            <input
              type="text"
              name="airport_type"
              value={searchParams.airport_type}
              onChange={handleChange}
              placeholder="Airport Type"
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default AddAirport;
