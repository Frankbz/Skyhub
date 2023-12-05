import { useState, useEffect } from 'react';

const ViewFreq = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [customer, setCustomer] = useState({}) 
  useEffect(() => {
    const getCustomer = async () => {
      
      const response = await fetch('http://localhost:4000/api/staff/view_top_buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          airline_name: user ? user.airline_name : null
        }),
      });
  
      const json = await response.json();
      console.log(json);
      setCustomer(json[0])
    };
    getCustomer();
  }, [])
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div>
      <strong>Email:</strong> {customer.email}
    </div>
    <div>
      <strong>First Name:</strong> {customer.first_name}
    </div>
    <div>
      <strong>Last Name:</strong> {customer.last_name}
    </div>
  </div>
  );
};

export default ViewFreq;
