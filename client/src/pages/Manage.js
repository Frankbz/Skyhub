import "./Manage.css"
import { useState } from "react";

import NavBar from "../components/Navbar"
import CreateFlights from "../components/forms/CreateFlights";
import AddAirplane from "../components/forms/AddAirplane";
import AddAirport from "../components/forms/AddAirport";
import ViewFlightCustomer from "../components/forms/ViewFlightCustomer";
import ViewRating from "../components/forms/ViewRating";
import ScheduleMaintenance from "../components/forms/ScheduleMaintenance";
import ViewFreq from "../components/forms/ViewFreq";
import ViewCustomersFlight from "../components/forms/ViewCustomersFlight";
import Revenue from "../components/forms/Revenue";

const Manage = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };
    return ( 
        <>
        <NavBar />
 
        <div className="buttomRow">
            {[
            'Create Flights',
            'Add Airplane',
            'Add Airport',
            'Maintenance',
            'View Customers',
            'View Ratings',
            'View Customer\'s Flights',
            'View Frequent Customer',
            'Revenue'
            ].map((option) => (
            <button
                key={option}
                onClick={() => handleOptionClick(option)}
                style={{ backgroundColor: selectedOption === option ? 'orange' : '#FFD580' }}
            >
                {option}
            </button>
            ))}
        </div>

        <div style={{ marginTop: '20px', marginLeft: '250px', marginRight: '250px' }}>
            {selectedOption === 'Create Flights' && <CreateFlights />}
            {selectedOption === 'Add Airplane' && <AddAirplane />}
            {selectedOption === 'Add Airport' && <AddAirport />}
            {selectedOption === 'Maintenance' && <ScheduleMaintenance />}
            {selectedOption === 'View Customers' && <ViewFlightCustomer />}
            {selectedOption === 'View Ratings' && <ViewRating />}
            {selectedOption === 'View Frequent Customer' && <ViewFreq />}
            {selectedOption === 'View Customer\'s Flights' && <ViewCustomersFlight />}
            {selectedOption === 'Revenue' && <Revenue />}
        </div>

        </>
        
     );
}
 
export default Manage;