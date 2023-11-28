import Navbar from "../components/Navbar";
import BarChart from "../components/BarChart"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const getInfo = async () =>{
        if (!user){
            navigate("/")
            return
        }
        else{
            const response = await fetch('http://localhost:4000/api/profile/tickets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email: user.email })
            })
            const json = await response.json()
            if (response.ok){
                console.log("jj",json) // should be all flights
            }
    }}
    useEffect(()=>getInfo,[])
    return ( 
        <>
        <Navbar />
        <div>future flights</div>
        <div>past flights</div>
        {/* <BarChart /> */}
            
        </>
     );
}
 
export default Profile;