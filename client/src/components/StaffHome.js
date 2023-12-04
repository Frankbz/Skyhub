import styles from "./StaffHome.module.css"
import { useState } from 'react';


const StaffHome = ({handleFlights}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [searchParams, setSearchParams] = useState({
        sourceCity: '',
        destinationCity: '',
        startDate: '',
        endDate: ''
      });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setSearchParams((prevSearchParams) => ({
        ...prevSearchParams,
        [name]: value,
      }));
    };

    const handleSearch = async (e) => {
        e.preventDefault()
        const reqBody = {
            airline_name: user ? user.airline_name : null,
            start_date_range: searchParams.startDate,
            end_date_range: searchParams.endDate,
            start_airport: '',
            dest_airport: '',
            start_city: searchParams.sourceCity,
            dest_city: searchParams.destinationCity
        }
        console.log(reqBody)
        const response = await fetch('http://localhost:4000/api/staff/view_flights', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(reqBody)
          })

        const json = await response.json();
        handleFlights(json)
    }

    return ( 
        <div className={styles.wrap}>
        <div className={styles.container}>
            <div className={styles.rows}>
            <div className={styles.titleBox}>
                <h1 className={styles.title}>
                Manage Everything, <br />Within Skyhub
                </h1>
            </div>
            <div className={styles.inputContainer}>
                <form className="flight-search" onSubmit={handleSearch}>
                <div className={styles.formRow}>
                    <div className="form-group">
                    <label>From</label>
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
                    <label htmlFor="departureDate">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={searchParams.startDate}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="form-group">
                    <label htmlFor="departureDate">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={searchParams.endDate}
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
}
 
export default StaffHome;