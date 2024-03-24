import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";



const Report = () =>  {
    const filedAgainst = localStorage.getItem("filed_against");
    const itemNumber = localStorage.getItem("item_number")
    const itemType = localStorage.getItem("item_type")  
    const [text, setText] = useState('');
    const [filedBy, setFiledBy] = useState('');
    const [submitted, setSubmitted] = useState(false);

    

  const buttonStyle = {
    fontFamily: 'STIX Two Text, helvetica, sans-serif',
    fontSize: '1em',
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'orange',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    cursor: 'pointer',
  };


    useEffect(() => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
          const [name, value] = cookie.split("=");
          if (name === "username") {
            getUserID(value);
          }
        }
      }, []);

// user id
    const getUserID = async (value) => {
        try {
            const response = await axios.post("http://localhost:3001/userdata", {
                username: value,
            });
            setFiledBy(response.data.user._id);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitted(true);

            await axios.post('http://localhost:3001/report/file', {
                filedBy: filedBy,
                filedAgainst: filedAgainst,
                complaint: text,
                itemType: itemType,
                itemNumber: itemNumber,
                resolved: false,
                filedAt: new Date()
            });
            console.log("Report sent:", response.data);
        } catch (error) {
            console.log("Error filing report.", error.message);
        }
    }

    return (
        <div style={{ marginLeft: '10px' }}>
            <h3 style={{ color: 'black', textAlign: 'center', fontFamily: 'STIX Two Text, helvetica, sans-serif', fontWeight: 'bold', margin: '40px 0' }}>Welcome to the Report Page</h3>
            <h6 style={{ color: 'black', textAlign: 'center' }}>We take customer satisfaction seriously and appreciate your time.</h6>

            {submitted ? (
                <div> 
                <h6 style={{ color: 'black', textAlign: 'center' }}>Your report has been submitted.</h6>
                <button style={{ ...buttonStyle, marginLeft: 'calc(50% - 50px)', marginTop: '20px' }} onClick={() => window.location.href = "/home"}>
                Home
            </button>
            </div>
            ):(
                <div>
                    <h6 style={{ color: 'black', textAlign: 'center' }}>Please briefly explain why you are filing a report:</h6>
                <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    placeholder="Type here..."
                    style={{ width: '300px', height: '100px', marginLeft: 'calc(50% - 150px)', marginTop: '20px' }}
                />
                <button style={{ ...buttonStyle, marginLeft: 'calc(50% - 50px)', marginTop: '20px' }} type="submit" onClick={handleSubmit}>Submit</button>
                <button style={{ ...buttonStyle, marginLeft: 'calc(50% - 50px)', marginTop: '20px' }} onClick={() => window.location.href = "/home"}>
                    Cancel
                </button>
                        </div>
                )}
            </div>
    );
}
export default Report;