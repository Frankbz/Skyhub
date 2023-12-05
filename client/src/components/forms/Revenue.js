import { useState, useEffect } from 'react';

const Revenue = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [monthRev, setMonthRev] = useState(0);
  const [yearRev, setYearRev] = useState(0);

  useEffect(() => {
    const getRev = async () => {
      
      const response = await fetch('http://localhost:4000/api/staff/view_earned_revenue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        airline_name: user ? user.airline_name : null,
        }),
      });

      const json = await response.json();
      console.log(json);
      setMonthRev(json.MonthRev)
      setYearRev(json.YearRev)
      };
    getRev();
  }, [])

  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div>
      <strong>Last Month Revenue:</strong> ${monthRev} 
    </div>
    <div>
      <strong>Last Year Revenue:</strong> ${yearRev} 
    </div>
    </div>
  );
};

export default Revenue;
