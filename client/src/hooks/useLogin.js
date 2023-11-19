import { useState } from 'react';

export const useLogin = () => {
    const [error, setError] = useState(null)

    const login = async (email, password) => {
        setError(null)

        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
          })
        
        const json = await response.json();
        // console.log(json)
        if (!response.ok){
            setError(json.error)
        }
        if (response.ok){
            localStorage.setItem('user', JSON.stringify(json))
        }
    }
    return { login, error }
}
 