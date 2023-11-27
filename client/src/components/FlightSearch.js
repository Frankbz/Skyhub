import { useState } from 'react';
import styles from './FlightSearch.module.css';

const FlightSearch = ({handleFlights}) => {
  const [searchParams, setSearchParams] = useState({
    sourceCity: '',
    destinationCity: '',
    departureDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevSearchParams) => ({
      ...prevSearchParams,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const reqBody = {
      start_date_range: searchParams.departureDate, 
      end_date_range: searchParams.departureDate,
      start_airport: '', 
      dest_airport: '', 
      start_city: searchParams.sourceCity, 
      dest_city: searchParams.destinationCity
    }
    const response = await fetch('http://localhost:4000/api/flights/view', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(reqBody)
          })
    
    const json = await response.json();
    console.log("json", json)
    handleFlights(json)
    

  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.rows}>
          <div className={styles.titleBox}>
            <h1 className={styles.title}>
              Navigate the Skies, <br />Commence Your Expedition Here
            </h1>
          </div>
          <div className={styles.inputContainer}>
            <form className="flight-search" onSubmit={handleSearch}>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label htmlFor="sourceCity">From</label>
                  <input
                    type="text"
                    placeholder='eg. New York'
                    id="sourceCity"
                    name="sourceCity"
                    value={searchParams.sourceCity}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="destinationCity">To</label>
                  <input
                    type="text"
                    placeholder='eg. Shanghai'
                    id="destinationCity"
                    name="destinationCity"
                    value={searchParams.destinationCity}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="departureDate">Departure Date</label>
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    value={searchParams.departureDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.searchButton}>
                <button type="submit">Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>


  );
};

export default FlightSearch;
