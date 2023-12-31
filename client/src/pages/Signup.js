import { useState } from "react";
import { Link } from "react-router-dom";

import { useSignup } from "../hooks/useSignup"
import "./authstyle.css"

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(email, password)
  }

  return (
    <div className="wrap">
      <div className="auth-container">
        <div className="auth-image">
          <img src="plane.jpg" alt="Plane" />
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h3>Customer Sign up</h3>

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
              Airline staff?{" "}
              <Link to="/staffsignup">Sign up </Link>
            </p>
          </div>
        </form>
      </div>
    </ div>
  )
}

export default Signup