import { useState } from "react";
import { Link } from "react-router-dom";

import { useSignup } from "../hooks/useSignup"
import "./authstyle.css"

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [airline, setAirline] = useState('')

  const {staff_signup, error} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await staff_signup(firstname, lastname, airline, email, password)
  }

  return (
    <div className="wrap">
      <div className="auth-container">
        <div className="auth-image">
          <img src="plane.jpg" alt="Plane" />
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h3>Staff Sign up</h3>

          <label>First Name</label>
          <input
            type="text"
            onChange={(e) => setFirstname(e.target.value)}
            value={firstname}
          />

          <label>Last Name</label>
            <input
              type="text"
              onChange={(e) => setLastname(e.target.value)}
              value={lastname}
            />
          
          <label>Airline</label>
            <input
              type="text"
              onChange={(e) => setAirline(e.target.value)}
              value={airline}
            />

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

          <button>Sign Up</button>
          {error && <div className="error">{error}</div>}

          <div className="auth-links">
            <p>
              Already have an account? {" "}
              <Link to="/login">Log In </Link>
            </p>
            <p>
              Customer?{" "}
              <Link to="/signup">Sign up </Link>
            </p>
          </div>
        </form>
      </div>
    </ div>
  )
}

export default Signup