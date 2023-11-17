import { useState, useEffect } from 'react';

const Home = () => {
    const [data, setData] = useState({});

    useEffect(() =>{
        fetch('http://localhost:4000/api/airline')
        .then((response) => response.json())
        .then((d) => {
            setData(d);
            console.log(d);
            })
        .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return ( 
        <div>
        {JSON.stringify(data, null, 2)}
      </div>
        
     );
}
 
export default Home;