import { useState, useEffect } from 'react';

const Home = () => {
    console.log('Working');

    const [data, setData] = useState({});
    const viewFlights = async () => {   //TESTS VIEW FLIGHTS ROUTE
        const response = await fetch('http://localhost:4000/api/flights/view', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "start_date_range":"2022-12-24 01:55:00",
                "end_date_range":"2023-12-24 01:55:00", 
                //"start_airport":"JFK", 
                "dest_airport":"PVG"
                //"start_city":"New York",
                //"dest_city":"Shanghai"
            })
          });

        const json = await response.json();
        console.log(json)
        if (!response.ok){
            console.log(json.error);
        }
        if (response.ok){
            console.log(json);
        }
    }
    
    const getTickets = async () => {    //TESTS GET TICKETS ROUTE
        const response = await fetch('http://localhost:4000/api/profile/tickets', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "email":"bob1@gmail.com"
            })
          });

        const json = await response.json();
        console.log(json)
        if (!response.ok){
            console.log(json.error);
        }
        if (response.ok){
            console.log(json);
        }
    }


    useEffect(() =>{
        getTickets();
    }, []);

    return ( 
        <div>
        {JSON.stringify(data, null, 2)}
      </div>
        
     );
}
 
export default Home;