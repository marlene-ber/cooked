import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";

const Settings = ({
  toggleDarkMode,
  isDarkMode,
  handleTextSizeChange,
  textSizeOptions,
  selectedTextSize,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTextSizeOptions, setShowTextSizeOptions] = useState(false);
  const [sure, setSure] = useState(false);

  const toggleSure = () => {
    setSure(!sure);
  };

  //delete account
  const deleteAccount = async (username) => {
    try {
      // Make an HTTP request to delete the account
      await axios.delete(`http://localhost:3001/deleteAccount/${username}`);

      // Optionally, you can perform additional actions after the account is deleted
      // For example, redirect the user to the login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Error deleting account. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      // Access the username from the URL parameters
      const params = new URLSearchParams(window.location.search);
      const username = params.get("username");

      // Call the deleteAccount function with the username
      await deleteAccount(username);

      // Perform any additional actions after successful account deletion if needed
      console.log("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Error deleting account. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <h1
        style={{
          textAlign: "left",
          marginBottom: "20px",
          fontSize: "20px",
          marginRight: "150px",
          borderBottom: "2px solid red",
          width: "75px",
          display: "inline-block",
        }}
      >
        Settings
      </h1>

      <button
        onClick={toggleDarkMode}
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "7px 20px",
          borderRadius: "10px",
          border: "2px solid white",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        {isDarkMode ? (
          <FaSun style={{ marginRight: "5px" }} />
        ) : (
          <FaMoon style={{ marginRight: "5px" }} />
        )}
        Toggle Dark Mode
      </button>

      <button
        onClick={() => setShowTextSizeOptions(!showTextSizeOptions)}
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "7px 40px",
          borderRadius: "10px",
          border: "2px solid white",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Adjust Text Size
      </button>

      {showTextSizeOptions && (
  <div
    style={{
      backgroundColor: "black",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
    }}
  >
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      {textSizeOptions.map((size) => (
        <button
          key={size}
          onClick={() => handleTextSizeChange(size)}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: "black",
            color: size === selectedTextSize ? "red" : "white",
            border: "2px solid white",
            borderRadius: "10px",
          }}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
)}
      <button
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "7px 40px",
          borderRadius: "10px",
          border: "2px solid white",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={toggleSure}
      >
        Delete Account
      </button>
       {sure && (
        <div>
          <h6></h6>
        <h6>Are you sure?</h6>
          <button 
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "7px 20px",
          borderRadius: "10px",
          border: "2px solid white",
          cursor: "pointer",
          marginTop: "10px",
        }}          
          onClick={handleDeleteAccount}>Yes</button>

        <button 
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "7px 20px",
          borderRadius: "10px",
          border: "2px solid white",
          cursor: "pointer",
          marginTop: "10px",
        }}          
          onClick={toggleSure}>No</button>
          </div>



  )}

        
    
    </div>
  );
};

export default Settings;