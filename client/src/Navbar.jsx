import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Post from "./Post";
import Settings from "./Settings";

const Navbar = () => {
  const [showUserRectangle, setShowUserRectangle] = useState(false);
  const [showNotificationRectangle, setShowNotificationRectangle] =
    useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState("M");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [badges, setBadges] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const [imageArray, setImageArray] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [display, setDisplay] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchedUsername, setSearchedUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "username") {
        setUsername(value);
        fetchUserData(value);
        fetchUserLikes(value);
      }
    }
  }, []);
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "username") {
        setUsername(value);
        fetchUserData(value);
      }
    }
  }, []);
  useEffect(() => {
    if (newProfilePic) {
      updateProfilePicture();
    }
  }, [newProfilePic]);

  useEffect(() => {
    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
  }, []);

  // fetch user data
  const fetchUserData = async (username) => {
    try {
      const response = await axios.post("http://localhost:3001/userdata", {
        username,
      });
      const userData = response.data.user;
      if (userData.pfp) {
        setProfilePic(userData.pfp);
      } else {
        console.error("Profile picture not found");
      }
      if (userData.achievements) {
        setAchievements(userData.achievements);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // FETCH USER LIKES
  const fetchUserLikes = async (username) => {
    try {
      const response = await axios.post(`http://localhost:3001/posts`, {
        username,
      });
      const userPosts = response.data.posts;

      const likesArray = userPosts.map((post) => post.likes);
      const imageArray = userPosts.map((post) => post.image);
      console.log("User Likes (User IDs):", likesArray);
      console.log("Image):", imageArray);

      const usernamesResponse = await axios.post(
        `http://localhost:3001/usernames`,
        {
          userObjectIds: likesArray.flat(),
        }
      );

      const usernameMap = usernamesResponse.data;

      const usernamesArray = likesArray.map((userIds) =>
        userIds.map((userId) => usernameMap[userId] || "Unknown")
      );

      console.log("User Likes (Usernames):", usernamesArray);

      setUserLikes(usernamesArray);
      setImageArray(imageArray);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePic(file);
    setProfilePic(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searchedUsername === username && searchedUsername) {
      try {
        const checkExisting = await axios.post(
          "http://localhost:3001/checkExisting",
          { newUsername }
        );

        if (checkExisting.data.exists) {
          console.log("Username already exists");
          alert("Username already exists. Please choose a different one.");
          return;
        } else {
          await axios.post("http://localhost:3001/updateUsername", {
            newUsername,
          });
        }
      } catch (error) {
        console.error("Error updating username:", error);
        alert("Error updating username. Please try again later.");
      }
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
      const existing = await axios.post("http://localhost:3001/fetchPassword", {
        username: username,
      });
      if (password === existing && newPassword) {
        if (!passwordRegex.test(password)) {
          console.log("Password does not meet complexity requirements");
          alert(
            "Password must:\n- Be at least 8 characters long\n- Contain at least one uppercase letter, one lowercase letter, and one special character"
          );
          return;
        } else {
          await axios.post("http://localhost:3001/updatePassword", {
            newPassword,
          });
        }
      } else {
        alert("Incorrect information. Please try again.");
      }
    }
  };

  const toggleDisplay = () => {
    setDisplay(!display);
  };

  const updateProfilePicture = async () => {
    try {
      const formData = new FormData();
      formData.append("profilePic", newProfilePic);
      formData.append("username", username);
      const response = await axios.post(
        "http://localhost:3001/updateProfilePic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const newProfilePicUrl = response.data.profilePicUrl;
        setProfilePic(newProfilePicUrl);

        localStorage.setItem("ProfilePic", newProfilePicUrl);

        setNewProfilePic(null);
      } else {
        console.error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const toggleUserRectangle = () => {
    setShowUserRectangle(!showUserRectangle);
    setShowNotificationRectangle(false);
    setShowSettings(false);
  };

  const toggleNotificationRectangle = () => {
    setShowNotificationRectangle(!showNotificationRectangle);
    setShowUserRectangle(false);
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowUserRectangle(false);
    setShowNotificationRectangle(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);

    const body = document.body;

    if (isDarkMode) {
      body.style.backgroundColor = "#333";
      body.style.color = "#fff";
    } else {
      body.style.backgroundColor = "#fff";
      body.style.color = "#000";
    }
  };

  const handleTextSizeChange = (size) => {
    setTextSize(size);
    document.documentElement.style.fontSize =
      size === "S"
        ? "14px"
        : size === "L"
        ? "18px"
        : size === "XL"
        ? "22px"
        : "16px";
  };

  const [showPostPopup, setShowPostPopup] = useState(false);

  const togglePostPopup = () => {
    setShowPostPopup(!showPostPopup);
  };

  const Handleplusbuttonclick = () => {
    togglePostPopup();
  };

  const userRectangleStyle = {
    width: showUserRectangle ? "17%" : "0",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 1)",
    position: "fixed",
    top: "0",
    left: "0",
    transition: "width 0.3s ease-in-out",
    overflowX: "hidden",
    zIndex: 1,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
    borderRadius: showUserRectangle ? "0 20px 20px 0" : "20px",
  };

  const profilePicStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "10px",
    backgroundImage: `url(${profilePic})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const notificationRectangleStyle = {
    width: showNotificationRectangle ? "17%" : "0",
    height: "100vh",
    backgroundColor: "black",
    position: "fixed",
    top: "0",
    left: "0",
    transition: "width 0.3s ease-in-out",
    overflowX: "hidden",
    zIndex: 1,
    borderRadius: showUserRectangle ? "0 20px 20px 0" : "20px",
  };

  const SettingsStyle = {
    width: showSettings ? "17%" : "0",
    height: "100vh",
    backgroundColor: "black",
    color: "white",
    position: "fixed",
    top: "0",
    left: "0",
    transition: "width 0.3s ease-in-out",
    overflowX: "hidden",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: showUserRectangle ? "0 20px 20px 0" : "20px",
  };
  const logoutButtonStyle = {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s, transform 0.3s",
    outline: "none",
  };

  // Add hover effect
  logoutButtonStyle[":hover"] = {
    backgroundColor: "#c9302c",
    transform: "scale(1.05)",
  };

  const location = useLocation();

  const navItemStyle = {
    marginRight: "10px",
    padding: "8px 16px",
    border: "1px solid #000",
    borderRadius: "20px",
    cursor: "pointer",
    color: "#000",
    textDecoration: "none",
    display: "inline-block",
  };

  const navIconStyle = {
    marginRight: "10px",
    padding: "8px 16px",
    border: "1px solid #fff",
    borderRadius: "20px",
    cursor: "pointer",
    color: "#000",
    textDecoration: "none",
    display: "inline-block",
    background: "transparent",
  };

  const homeIconStyle = {
    marginRight: "10px",
    padding: "8px 16px",
    border: "1px solid #fff",
    borderRadius: "20px",
    cursor: "pointer",
    color: "#000",
    textDecoration: "none",
    display: "inline-block",
    background: "transparent",
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const getItemStyle = (item) => {
    return {
      ...navItemStyle,
      backgroundColor: selectedItem === item ? "#ff69b4" : "transparent",
      color: selectedItem === item ? "#000" : "#fff",
    };
  };

  const getNavItemStyle = (item) => {
    const isActive = location.pathname === item;
    return {
      ...navItemStyle,
      backgroundColor: isActive ? "#000" : "fff",
      color: isActive ? "#fff" : "#000",
    };
  };

  const popupStyle = {
    display: showPopup ? "block" : "none",
    position: "fixed",
    zIndex: 1,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingTop: "100px",
  };

  const popupContentStyle = {
    backgroundColor: "black",
    color: "white",
    margin: "auto",
    borderRadius: "30px",
    padding: "20px",
    border: "1px solid black",
    width: "45%",
    fontFamily: "'STIX Two Text', helvetica, sans-serif",
  };

  const closeBtnStyle = {
    color: "#aaa",
    float: "right",
    fontSize: "28px",
    fontWeight: "bold",
  };

  return (
    <div
      className="container"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div
          style={{
            fontFamily: "STIX Two Text, helvetica, sans-serif",
            fontWeight: "bold",
            fontSize: "50px",
            textDecoration: "none",
            color: "red",
            marginRight: "20px",
          }}
        >
          <Link to="/home" style={{ textDecoration: "none" }}>
            <div
              style={{
                fontFamily: "STIX Two Text, helvetica, sans-serif",
                fontWeight: "bold",
                fontSize: "50px",
                color: "red",
                marginRight: "20px",
              }}
            >
              cooked.
            </div>
          </Link>
        </div>

        <Link style={getNavItemStyle("/home")} to="/home">
          Home
        </Link>

        <Link style={getNavItemStyle("/feed")} to="/feed">
          Feed
        </Link>
        <Link style={getNavItemStyle("/explore")} to="/explore">
          Explore
        </Link>
        <Link style={getNavItemStyle("/guide")} to="/guide">
          Guide
        </Link>
      </div>

      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <button style={navIconStyle} onClick={Handleplusbuttonclick}>
          <span>+</span>
        </button>
        <button style={navIconStyle} onClick={toggleUserRectangle}>
          <FaUser />
        </button>
        <button style={navIconStyle} onClick={toggleNotificationRectangle}>
          <FaBell />
        </button>
      </div>

      <div style={userRectangleStyle}>
        <div
          style={{
            fontFamily: "STIX Two Text, helvetica, sans-serif",
            fontWeight: "bold",
            ...userRectangleStyle,
            alignItems: "center",
          }}
        >
          <label
            htmlFor="profilePicInput"
            style={{
              cursor: "pointer",
              position: "relative",
              display: "block",
              marginBottom: "10px",
            }}
          >
            <img
              src={profilePic}
              style={{ ...profilePicStyle, position: "relative" }}
            />
            <span
              style={{
                position: "absolute",
                bottom: 0,
                right: "-20px",
                background: "transparent",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <span style={{ fontSize: "35px", marginRight: "5px" }}>+</span>
            </span>
          </label>
          <input
            type="file"
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
            id="profilePicInput"
          />

          <p>{username}</p>
          {/* Display achievements */}
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {achievements.map((achievement, index) => (
              <li
                key={index}
                style={{
                  fontSize: "16px",
                  marginBottom: "5px",
                  textAlign: "right",
                }}
              >
                {achievement === "SocialChef" && (
                  <div>
                    <img
                      src="http://localhost:3001/uploads/SocialChef.jpg"
                      alt="SocialChef"
                      style={{
                        width: "90px",
                        display: "block",
                        marginLeft: "auto",
                      }}
                    />
                  </div>
                )}
                {achievement === "PopularPlate" && (
                  <div>
                    <img
                      src="http://localhost:3001/uploads/PopularPlate.jpg"
                      alt="PopularPlate"
                      style={{
                        width: "75px",
                        display: "block",
                        marginLeft: "auto",
                      }}
                    />
                  </div>
                )}
                {achievement === "FirstPost" && (
                  <div>
                    <img
                      src="http://localhost:3001/uploads/FirstPost.jpg"
                      alt="FirstPost"
                      style={{
                        width: "90px",
                        display: "block",
                        marginLeft: "auto",
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>

          <h2
            style={{
              textAlign: "left",
              marginBottom: "20px",
              fontSize: "20px",
              marginRight: "150px",
              borderBottom: "2px solid red",
              display: "inline-block",
            }}
          >
            Profile
          </h2>

          <Link to="/profile" style={{ textDecoration: "none" }}>
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "7px 50px",
                borderRadius: "10px",
                border: "2px solid white",
              }}
            >
              View Profile
            </button>
          </Link>
          <p> </p>
          <Link to="/saved" style={{ textDecoration: "none" }}>
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "7px 53px",
                borderRadius: "10px",
                border: "2px solid white",
              }}
            >
              View Saved
            </button>
          </Link>
          <p> </p>

          <div style={popupStyle}>
            <div style={popupContentStyle}>
              <span style={closeBtnStyle} onClick={() => setShowPopup(false)}>
                &times;
              </span>
              <form onSubmit={handleSubmit}>
                <div className="content mt-4">
                  <h2 style={{ color: "white" }}>Update Account Information</h2>
                  <div className="mb-3">
                    <label
                      htmlFor="searchedUsername"
                      style={{ color: "black" }}
                    >
                      <strong>Confirm Existing Username </strong>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Username"
                      autoComplete="off"
                      name="searchedUsername"
                      className="form-control rounded"
                      value={searchedUsername}
                      onChange={(e) => setSearchedUsername(e.target.value)}
                    />

                    <label htmlFor="newUsername" style={{ color: "black" }}>
                      <strong>New Username </strong>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter New Username"
                      autoComplete="off"
                      name="newUsername"
                      className="form-control rounded"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />

                    <label htmlFor="password" style={{ color: "black" }}>
                      <strong>Confirm Existing Password</strong>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter Password"
                      name="password"
                      className="form-control rounded"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <label htmlFor="newPassword" style={{ color: "black" }}>
                      <strong>New Password </strong>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter New Password"
                      autoComplete="off"
                      name="newPassword"
                      className="form-control rounded"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded"
                    style={{
                      background: "white",
                      color: "red",
                      border: "1px solid red",
                      borderRadius: "10px",
                      padding: "8px",
                      width: "20px",
                    }}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "7px 53px",
              borderRadius: "10px",
              border: "2px solid white",
            }}
            onClick={() => setShowPopup(true)}
          >
            Edit Profile
          </button>

          <Settings
            toggleDarkMode={toggleDarkMode}
            isDarkMode={isDarkMode}
            handleTextSizeChange={handleTextSizeChange}
            textSizeOptions={["S", "M", "L", "XL"]}
            selectedTextSize={textSize}
          />
          <button
            style={{
              backgroundColor: "black", //
              color: "white",
              padding: "7px 67px",
              borderRadius: "10px",
              border: "2px solid white",
            }}
            onClick={() => (window.location.href = "/login")}
          >
            Logout
          </button>
        </div>

        <div>
          <div style={notificationRectangleStyle}>
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "20px",
                fontSize: "18px",
                fontWeight: "bold",
                fontFamily: "STIX Two Text, helvetica, sans-serif",
              }}
            >
              Activity
            </div>
            {userLikes.map(
              (likes, index) =>
                likes.length > 0 && (
                  <div
                    key={index}
                    style={{
                      border: "2px solid #ccc",
                      margin: "10px",
                      padding: "10px",
                      borderRadius: "20px",
                      fontFamily: "STIX Two Text, helvetica, sans-serif",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {likes.length > 0 && (
                        <p>
                          {`${likes[0]}${
                            likes.length > 1
                              ? ` and ${likes.length - 1} others`
                              : ""
                          } liked your post`}
                        </p>
                      )}
                      {likes.length > 0 && (
                        <div style={{ marginLeft: "8px" }}>
                          {imageArray[index] && (
                            <img
                              src={`http://localhost:3001/${imageArray[index]}`}
                              alt={`User ${index + 1}`}
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "80%",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        {showPostPopup && (
          <Post
            onClose={togglePostPopup}
            onSubmit={(image) => {
              console.log("Posting image:", image);
            }}
          />
        )}
      </div>
    </div>
  );
};
export default Navbar;
