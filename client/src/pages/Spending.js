import BarChart from "../components/BarChart"
import "./Spending.css"
import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Spending = () => {
    const navigate = useNavigate()
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const user = JSON.parse(localStorage.getItem('user'));
    const [spending, setSpending] = useState([]);
    const defaultFrom = from || getDefaultFromDate();
    const defaultTo = to || getDefaultToDate();

    useEffect(() => {
        if (!user) {
          navigate("/");
        } else {
          // Fetch initial data for the last 6 months
          const fetchInitialData = async () => {
            const response = await fetch(
              "http://localhost:4000/api/profile/get_spending",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user.email,
                }),
              }
            );
            const json = await response.json();
            setSpending(json);
          };
    
          fetchInitialData();
        }
      }, [user]);

    // Function to get default "from" date (this month - 6)
    function getDefaultFromDate() {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 6);
      return formatDate(currentDate);
    }

    // Function to get default "to" date (this month)
    function getDefaultToDate() {
      const currentDate = new Date();
      return formatDate(currentDate);
    }

    // Function to format date as "Month, Year"
    function formatDate(date) {
      const options = { month: 'long', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }


    const handleSearch = async (e) => {
        e.preventDefault();
        const body = {
            email: user ? user.email : null,
            start_date: from,
            end_date: to
        }
        const response = await fetch('http://localhost:4000/api/profile/get_spending', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
          })
        const json = await response.json()
        setSpending(json)
    }

    return ( 
        <>
        <Navbar />
        <div>
            <div className="box">
                <h3>Spending Report</h3>
                <form onSubmit={handleSearch}>
                    <div className="inputs">
                        <div className="first">
                            <label >From</label>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                            />
                        </div>

                        <div className="second">
                            <label>To</label>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="searchButton">
                        <button type="submit">Search</button>
                    </div>
                </form>
            </div>
            <BarChart from={defaultFrom} to={defaultTo} spending={spending}/>
        </div>
        </>
     );
}
 
export default Spending;