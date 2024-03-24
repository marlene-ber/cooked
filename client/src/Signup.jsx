// signup.jsx
import axios from 'axios';
import { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { Link } from "react-router-dom";

function Signup() {
    // Initialize state variables for form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!firstName || !lastName || !username || !email || !password || !passwordRepeat) {
            alert("All fields must be filled. Please provide information for all fields.");
            return;
        }

        // Check if passwords match
        if (password !== passwordRepeat) {
            alert("Passwords do not match");
            return;
        }

        // Regular expression for password complexity requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

        // Check if password meets complexity requirements
        if (!passwordRegex.test(password)) {
            alert("Password must:\n- Be at least 8 characters long\n- Contain at least one uppercase letter, one lowercase letter, and one special character");
            return;
        }

        try {
            // Check if username or email already exists
            const checkExisting = await axios.post('http://localhost:3001/checkExisting', { username, email });

            if (checkExisting.data.exists) {
                alert("Username or email already exists. Please choose a different one.");
                return;
            }

            // Send signup request to server
            const response = await axios.post('http://localhost:3001/signup', { firstName, lastName, username, email, password });
            console.log("Signup successful:", response.data);
            alert("Account created successfully!");
            
        } catch (error) {
            console.log("Error during signup:", error.message);
            alert("Error during signup. Please try again later.");
        }
    }

    // Handle Google signup response
    const responseGoogle = async (response) => {
        try {
            // Send Google signup request to server
            const googleResponse = await axios.post('http://localhost:3001/googleSignup', { token: response.tokenId });
            console.log("Google Signup successful:", googleResponse.data);
            alert("Google account connected successfully!");
            
        } catch (error) {
            console.log("Error during Google signup:", error.message);
            alert("Error during Google signup. Please try again later.");
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ position: 'relative', overflow: 'hidden', background: 'url(/rf.jpeg) center center fixed', backgroundSize: 'cover' }}>
            <div className="p-3 rounded w-25" style={{ position: 'absolute', left: 100, zIndex: 1, backgroundColor: 'transparent', color: 'white', fontFamily: 'STIX Two Text, Helvetica, sans-serif' }}> 
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName">
                            <strong>First Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter First Name"
                            autoComplete="off"
                            name="firstName"
                            className="form-control rounded"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName">
                            <strong>Last Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Last Name"
                            autoComplete="off"
                            name="lastName"
                            className="form-control rounded"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username">
                            <strong>Username </strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            autoComplete="off"
                            name="username"
                            className="form-control rounded"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordRepeat">
                            <strong>Repeat Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Repeat Password"
                            name="passwordRepeat"
                            className="form-control rounded"
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
            <GoogleLogin
                clientId="YOUR_GOOGLE_CLIENT_ID"
                buttonText="Sign up with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle} 
                cookiePolicy={'single_host_origin'}
            />
        </div>
                    <button type="submit" className="btn btn-success w-100 rounded">
                        Register
                    </button>
                </form>
                <p style={{ color: 'white' }}>Already Have an Account?</p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded text-decoration-none">
                    Login
                </Link>
            </div>

            

        </div>
    );
}

export default Signup;