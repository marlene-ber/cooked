import { faFacebookF, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSignUp = () => {
    
    
    console.log("Signing up:", email);
 
    setEmail("");
  };

  return (
    <div
      className="newsletter-footer"
      style={{
        fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
        backgroundColor: "#c4410e",
        color: "#fff",
        padding: "15px",
        marginTop:"50px",
        borderRadius: "5px",
        zIndex: 1000, 
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h3>Sign Up for Newsletter</h3>
            <div className="email-input" style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                style={{ padding: "5px", border: "1px solid #fff", borderRadius: "3px", marginRight: "5px", fontSize: "12px" }}
              />
              <button
                onClick={handleSignUp}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "white",
                  color: "black",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontWeight:"bold",
                  fontSize: "12px",
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <h3 style={{ margin: "0" }}>Follow Us</h3>
            <p style={{ margin: "5px 0 10px 0", fontSize: "12px" }}>Stay connected with us on social media:</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <a href="https://www.facebook.com" style={{ margin: "0 5px" }}>
                <FontAwesomeIcon icon={faFacebookF} style={{ color: "white", fontSize: "20px" }} />
              </a>
              <a href="https://www.instagram.com" style={{ margin: "0 5px" }}>
                <FontAwesomeIcon icon={faInstagram} style={{ color: "white", fontSize: "20px" }} />
              </a>
              <a href="https://www.twitter.com" style={{ margin: "0 5px" }}>
                <FontAwesomeIcon icon={faTwitter} style={{ color: "white", fontSize: "20px" }} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-2">
        <div className="row">
          <div className="col-md-6">
            <h3>About Us</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                <Link to="/terms-of-service" style={{ textDecoration: "none", color: "#fff", fontSize: "12px" }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" style={{ textDecoration: "none", color: "#fff", fontSize: "12px" }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ textDecoration: "none", color: "#fff", fontSize: "12px" }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <h3>Recipes</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                <Link to="/Quick-&-Easy" style={{ textDecoration: "none", color: "#fff", fontSize: "12px" }}>
                  Quick & Easy
                </Link>
              </li>
              <li>
                <Link to="/Holidays" style={{ textDecoration: "none", color: "#fff", fontSize: "12px" }}>
                  Holidays
                </Link>
              </li>
              <li>
                <Link to="/Desserts" style={{ textDecoration: "none", color: "#fff", fontSize: "12px" }}>
                  Desserts
                </Link>
              </li>
              <li>
                <Link to="/Vegan" style={{ textDecoration: "none", color: "#fff", fontSize: "12px" }}>
                  Vegan
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;