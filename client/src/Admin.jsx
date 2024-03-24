// Import necessary modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define Admin component
function Admin() {
  // Define state variables
  const [searchUsername, setSearchUsername] = useState("");
  const [user, setUser] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [reported, setReported] = useState("");
  const [reportsCount, setReportsCount] = useState("");
  const [createdAt, setCreatedAt] = useState();
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const [reports, setReports] = useState([]);
  const [listReports, setListReports] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/userdata", {
        username: searchUsername,
      });
      const userData = response.data.user;
      // Update state with user data
      setCreatedAt(userData.createdAt);
      setFollowers(userData.followers.length);
      setUser(searchUsername);
      setFollowing(userData.following.length);
      setReported(userData.reported);
      setReportsCount(userData.reportsCount);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
    } catch (error) {
      // Reset user info if user not found
      setFollowers(-1);
      setFollowing(-1);
      setUser("Not Found");
      setFirstName("None");
      setLastName("");
      setEmail("None");
      setCreatedAt();
      setReported(false);
      setReportsCount(0);
      console.error("Error fetching user data:", error);
    }
  };

  // Function to handle input change
  const handleChange = (event) => {
    setSearchUsername(event.target.value);
  };

  // Effect hook to fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/report/display"
        );
        setReports(response.data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  // Function to handle delete account confirmation
  const handleConfirmDelete = () => {
    setShowConfirm(true);
  };

  // Function to handle account deletion cancellation
  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Function to delete user account
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(user);
      console.log("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Error deleting account. Please try again later.");
    }
  };

  // Function to handle report resolution
  const handleResolve = async (reportId, resolved) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/report/resolve",
        {
          reportId: reportId,
          resolved: resolved,
        }
      );
      const updatedReports = reports.map((report) => {
        if (report._id === reportId) {
          return { ...report, resolved: !resolved };
        }
        return report;
      });
      setReports(updatedReports);
      console.log("Report resolved:", response.data);
    } catch (error) {
      console.log("Error resolving report:", error.message);
    }
  };

  // Function to render user info card
  const renderUserCard = (label, value) => (
    <div className="user-info-card" style={cardStyle}>
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );

  const cardStyle = {
    backgroundColor: "white",
    color: "red",
    padding: "20px",
    borderRadius: "10px",
    margin: "10px",
    width: "350px",
    height: "120px",
    textAlign: "center",
    fontFamily: "STIX Two Text, helvetica, sans-serif",
    border: "2px solid red",
  };

  const cardContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "1000px",
    margin: "0 auto",
    marginBottom: "20px",
  };

  return (
    <div style={{ backgroundColor: "white", color: "red", minHeight: "100vh" }}>
      <h1
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "2em",
          fontFamily: "STIX Two Text, helvetica, sans-serif",
          fontWeight: "bold",
        }}
      >
        ADMIN DASHBOARD
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <form onSubmit={handleSubmit} style={{ marginLeft: "10px" }}>
          <input
            type="text"
            placeholder="Enter Username"
            value={searchUsername}
            autoComplete="off"
            onChange={handleChange}
            style={{
              padding: "8px",
              width: "900px",
              borderRadius: "10px",
              border: "2px solid red",
              marginRight: "10px",
              outline: "none",
              fontSize: "16px",
              backgroundColor: "white",
              color: "black",
            }}
          />
        </form>
      </div>

      <div style={cardContainerStyle}>
        {searchUsername !== "Not Found" && renderUserCard("USERNAME", user)}
        {searchUsername !== "Not Found" &&
          renderUserCard("FOLLOWERS", followers)}
        {searchUsername !== "Not Found" &&
          renderUserCard("FOLLOWING", following)}
        {searchUsername !== "Not Found" &&
          renderUserCard("REPORTS", reportsCount)}
        {searchUsername !== "Not Found" &&
          renderUserCard("CREATED AT", createdAt)}
        {searchUsername !== "Not Found" &&
          renderUserCard("REPORTED", reported.toString())}
        {searchUsername === "Not Found" && (
          <div className="user-info-card" style={cardStyle}>
            <h3>USERNAME</h3>
            <p>{searchUsername}</p>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate(`/home?username=${user}`)}
          style={{
            backgroundColor: "white",
            border: "2px solid red",
            padding: "10px 20px",
            margin: "10px",
            cursor: "pointer",
          }}
        >
          Log into Account
        </button>
        <h3></h3>
        <button
          onClick={handleConfirmDelete}
          style={{
            backgroundColor: "white",
            border: "2px solid red",
            padding: "10px 20px",
            margin: "10px",
            cursor: "pointer",
          }}
        >
          Delete Account
        </button>
        <button
          onClick={toggleListReports}
          style={{
            backgroundColor: "white",
            border: "2px solid red",
            padding: "10px 20px",
            margin: "10px",
            cursor: "pointer",
          }}
        >
          Show All Reports
        </button>
      </div>

      {showConfirm && searchUsername && createdAt && (
        <div className="confirm-popup">
          <h4></h4>
          <p>Are you sure you want to delete this account?</p>
          <button
            onClick={handleDeleteAccount}
            style={{
              backgroundColor: "red",
              color: "white",
              border: "2px solid white",
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "white",
              border: "2px solid red",
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      )}

      <h3></h3>

      {listReports && (
        <div>
          <h2>List of Reports</h2>
          <ul>
            {reports.map((report) => (
              <li key={report._id}>
                <strong>Id: </strong> {report._id}
                <br />
                <strong>Filed By: </strong> {report.filedBy}
                <br />
                <strong>Filed Against: </strong> {report.filedAgainst}
                <br />
                <strong>Complaint: </strong> {report.complaint}
                <br />
                <strong>Item Type: </strong> {report.itemType}
                <br />
                <strong>Item Number: </strong> {report.itemNumber}
                <br />
                <strong>Filed At: </strong>{" "}
                {new Date(report.filedAt).toLocaleString()}
                <br />
                <strong>Resolved: </strong> {report.resolved ? "Yes" : "No"}{" "}
                <br />
                <button
                  onClick={() => handleResolve(report._id, report.resolved)}
                >
                  {report.resolved ? "Resolved" : "Resolve"}
                </button>
                <br />
                <strong>
                  <br />
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Admin;
