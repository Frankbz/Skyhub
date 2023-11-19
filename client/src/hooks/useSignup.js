import { useState } from 'react';

export const useSignup = () => {
    const [error, setError] = useState(null)

    const signup= async (email, password) => {
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
        }
    }
    return { signup, error }
}
 
