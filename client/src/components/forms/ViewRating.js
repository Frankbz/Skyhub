import React, { useState } from 'react';

const ViewRating = () => {
  const [searchParams, setSearchParams] = useState({
    flight_ID: '',
    departure_datetime: '',
  });
  const [comments, setComments] = useState([]);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log({
      flight_ID: Number(searchParams.flight_ID),
      departure_datetime: searchParams.departure_datetime,
    });

    const response = await fetch('http://localhost:4000/api/staff/view_ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flight_ID: Number(searchParams.flight_ID),
        departure_datetime: searchParams.departure_datetime,
      }),
    });

    const json = await response.json();

    setComments(json)
    console.log(comments)
  };

  return (
    <>
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
    <div>
      {comments.length > 0 && (<>
        <h2>Comments</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th>Email</th>
              <th>Rating</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{comment.email}</td>
                <td>{comment.rating}</td>
                <td>{comment.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      
      </>
      )}
      </div>
    </>
  );
};

export default ViewRating;
