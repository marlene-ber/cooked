// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
  // Initialize states for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate username and password
    if (!username || !password) {
      alert("Please provide both username and password.");
      return;
    }

    try {
      // Send login request to server
      const response = await axios.post("http://localhost:3001/login", { username, password });

      console.log(response.data);  

      // Redirect user based on login response
      if (response.data.success) {
        if ((username == 'admin') || (username == 'Admin')) {  
          window.location.href = "/admin"; // Redirect to admin page
        } else {
          navigate(`/home?username=${response.data.user.username}`); // Redirect to home page
        }
      } else {
        // Display login failure alert
        alert("Login failed. Please check your username and password.");
      }
    } catch (error) {
      console.log("Login failed:", error.message);
      // Display login failure alert
      alert("Login failed. Please check your username and password.");
    }
  };

  return (
    // Login form UI
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ position: 'relative', overflow: 'hidden', background: 'url(/rf.jpeg) center center fixed', backgroundSize: 'cover' }}>
      <div className="p-3 rounded w-25" style={{ position: 'absolute', left: 100, zIndex: 1, backgroundColor: 'transparent', color: 'white', fontFamily: 'STIX Two Text, Helvetica, sans-serif' }}> 
        <h2>Login</h2>
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username">
              <strong>Username </strong>
            </label>
            {/* Input field for username */}
            <input
              type="text"
              placeholder="Enter Username"
              autoComplete="off"
              name="username"
              className="form-control rounded"
              onChange={(e) => setUsername(e.target.value)} // Update username state
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            {/* Input field for password */}
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded"
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
          </div>
          {/* Login button */}
          <button type="submit" className="btn btn-primary w-100 rounded">
            Login
          </button>
        </form>
        <p> </p>
        <p>Don&apos;t have an account?</p>
        {/* Link to registration page */}
        <Link to="/signup" className="btn btn-default border w-100 bg-light rounded text-decoration-none">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
