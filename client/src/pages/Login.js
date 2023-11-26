import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useLogin } from "../hooks/useLogin";
import "./authstyle.css"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error } = useLogin()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    login(email, password)
  }
  
  return (
    <div className="wrap">
      <div className="auth-container">
        <div className="auth-image">
          <img src="plane.jpg" alt="Plane" />
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
        <h3> {searchParams.get('type')==="staff"?"Staff":"Customer"}{" "} Log In</h3>


          <label>Email Address</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button>Log in</button>
          {error && <div className="error">{error}</div>}

          <div className="auth-links">
            <p>
              Don't have an account? 
              <Link to="/signup">Sign Up </Link>
            </p>
            
            <p>
              {searchParams.get('type')==="staff" ? (
                <>
                  Customer? {" "}
                  <Link to="/login">Log In </Link>
                </>
              )
              : (
                <>
                  Airline staff?{" "}
                  <Link to="/login?type=staff">Log In </Link>
                </>
              )
              }
            </p>
          </div>
        </form>
      </div>
    </ div>
  )
}

export default Login