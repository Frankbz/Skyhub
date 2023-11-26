import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate();

    const login = async (email, password) => {
        setError(null)
        const type = searchParams.get('type')==="staff" ? "staff" : "customer"
        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ type, email, password })
          })
        
        const json = await response.json();
        // console.log(json)
        if (!response.ok){
            setError(json.error)
        }
        if (response.ok){
            localStorage.setItem('user', JSON.stringify(json))
            navigate("/")
        }
    }
    return { login, error }
}
 