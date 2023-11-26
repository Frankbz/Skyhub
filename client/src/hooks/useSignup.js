import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    const signup = async (email, password) => {
        setError(null)

        const response = await fetch('http://localhost:4000/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
          })
        
        const json = await response.json();

        if (!response.ok){
            setError(json.error)
        }
        if (response.ok){
            localStorage.setItem('user', JSON.stringify(json))
            navigate("/")
        }
    }

    const staff_signup = async (firstname, lastname, airline, email, password) => {
        setError(null)

        const response = await fetch('http://localhost:4000/api/user/staff_signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ firstname, lastname, airline, email, password })
          })
        
        const json = await response.json();

        if (!response.ok){
            setError(json.error)
        }
        if (response.ok){
            localStorage.setItem('user', JSON.stringify(json))
            navigate("/")
        }
    }
    return { signup, staff_signup, error }
}
 
