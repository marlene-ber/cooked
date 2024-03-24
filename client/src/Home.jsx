import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Newsletter from "./Newsletter";
import { Modal } from "bootstrap"; // Import Bootstrap Modal
import axios from "axios";
import PopularPostsCarousel from "./PopularPostsCarousel";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaStar,
  FaEllipsisH,
  FaPencilAlt,
  FaTrashAlt,
  FaBookmark,
} from "react-icons/fa"; // Include FaBookmark
import { IoFlag } from "react-icons/io5";

function Home() {
  const [username, setUsername] = useState("");
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [ratedPosts, setRatedPosts] = useState([]);
  const [rating, setRating] = useState(0);
  const [originalRating, setOriginalRating] = useState(0);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [userReview, setUserReview] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userObjectId, setUserObjectId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [displaySearch, setDisplaySearch] = useState(false);
  const [mostFollowedUsers, setMostFollowedUsers] = useState([]);
  const [valid, setValid] = useState(false);
  const [notFound, setNotFound] = useState(true);

  const checkValid = async () => {
    try {
      const response = await axios.post("http://localhost:3001/userdata", {
        username: searchText,
      });
      const userData = response.data.user;
      if (response.status === 200) {
        setValid(true);
      }
    } catch (error) {
      console.error("Error searching user: ", error.message);
    }
  };

  useEffect(() => {
    const fetchMostFollowedUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/users/most-followed"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch most followed users");
        }
        const data = await response.json();
        setMostFollowedUsers(data.users);
      } catch (error) {
        console.error("Error fetching most followed users:", error);
      }
    };

    fetchMostFollowedUsers();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
    setValid(false);
  };

  const welcomeVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  const postVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const postItemStyle = {
    border: "none",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const headingStyle = {
    fontSize: "1.5em",
    color: "black",
    margin: "20px 0",
    textTransform: "none",
    letterSpacing: "normal",
    textAlign: "center",
    fontFamily: "STIX Two Text, helvetica, sans-serif",
    fontWeight: "bold",
    position: "relative",
  };

  const underlineStyle = {
    position: "absolute",
    bottom: "-5px",
    left: "50%",
    width: "90px",
    borderBottom: "2px solid red",
    transform: "translateX(-50%)",
  };

  const paragraphStyle = {
    fontSize: "1.3em",
    color: "black",
    fontFamily: "STIX Two Text, helvetica, sans-serif",
    fontWeight: "bold",
    textAlign: "center",
    margin: "40px 0",
  };

  const buttonStyle = {
    fontFamily: "STIX Two Text, helvetica, sans-serif",
    fontSize: "1em",
    color: "black",
    fontWeight: "bold",
    backgroundColor: "orange",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    cursor: "pointer",
  };

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "username") {
        setUsername(value);
        break;
      }
    }
    if (!username) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlUsername = searchParams.get("username");
      if (urlUsername) {
        setUsername(urlUsername);
      }
    }
  }, [username]);

  //fetches recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/posts/recent");
        if (!response.ok) {
          throw new Error("Failed to fetch recent posts");
        }
        const data = await response.json();
        setRecentPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch recent posts:", error.message);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "username") {
        updateUsername(value);
        break;
      }
    }

    if (!username) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlUsername = searchParams.get("username");
      if (urlUsername) {
        updateUsername(urlUsername);
      }
    }
  }, [username]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/userdata");
        const userData = response.data.user;
        if (userData.followers) {
          // Assuming you have setFollowers function
          setFollowers(userData.followers.length);
        }
        if (userData.following) {
          // Assuming you have setFollowing function
          setFollowing(userData.following.length);
        }
        setUserObjectId(userData._id); // Set the user ObjectId
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSearchClick = async () => {
    setDisplaySearch(true);
  };

  const handlePostSelectFromCarousel = (post) => {
    setSelectedPost(post);

    const myModal = new Modal(document.getElementById("postModal"));
    myModal.show();
  };

  const handlePostSelect = (post) => {
    setSelectedPost(post);
    const myModal = new Modal(document.getElementById("postModal"));
    myModal.show();
  };

  const updateUsername = (newUsername) => {
    setUsername(newUsername);
    document.cookie = `username=${newUsername}; path=/`;
  };

  const toggleLike = async (postId) => {
    try {
      if (!userObjectId) {
        console.error("User ObjectId not found.");
        return;
      }

      const postIndex = posts.findIndex((post) => post._id === postId);
      if (postIndex === -1) {
        console.error("Post not found.");
        return;
      }

      const post = posts[postIndex];
      const isLiked = post.likes.includes(userObjectId);

      let updatedLikes;
      if (isLiked) {
        updatedLikes = post.likes.filter((userId) => userId !== userObjectId);
      } else {
        updatedLikes = [...post.likes, userObjectId];
      }

      const updatedPosts = [...posts];
      updatedPosts[postIndex] = { ...post, likes: updatedLikes };
      setPosts(updatedPosts);

      setLikedPosts((prevLikes) => updatedLikes);

      await axios.post("http://localhost:3001/likepost", {
        postId: postId,
        userId: userObjectId,
      });

      const postOwnerUsername = post.username;
      const likeAction = isLiked ? "unliked" : "liked";
      console.log(`You ${likeAction} ${postOwnerUsername}'s post.`);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const postRatingAndReview = async () => {
    try {
      await axios.post("http://localhost:3001/rateandreview", {
        postId: selectedPost._id,
        userId: userObjectId,
        rating: rating,
        review: userReview,
      });
    } catch (error) {
      console.error("Error posting rating and review:", error);
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
    const myModal = new Modal(document.getElementById("postModal"));
    myModal.show();
  };

  const openOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEditCaption = () => {
    closeOptions();
    setIsEditingCaption("true");
    setEditCaption(selectedPost.caption);
  };

  const handleSaveCaption = () => {
    updateCaption(selectedPost._id, editCaption)
      .then(() => {
        setSelectedPost((prevPost) => ({ ...prevPost, caption: editCaption }));
        setIsEditingCaption(false);
      })
      .catch((error) => console.error("Error updating caption:", error));
  };

  const handleReviewChange = (event) => {
    setUserReview(event.target.value);
  };

  const handleDeletePost = () => {
    closeOptions();
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const discardChanges = () => {
    setIsEditingCaption(false);
    setEditCaption("");
  };

  return (
    <div className="container mt-4">
      <Navbar />
      <motion.div
        className="content mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.h2
          style={{
            textAlign: "center",
            fontFamily: "STIX Two Text, helvetica, sans-serif",
            fontWeight: "bold",
            fontSize: "1.5em",
            color: "black",
          }}
          variants={welcomeVariants}
          initial="hidden"
          animate="visible"
        >
          Welcome to <span style={{ color: "red" }}>cooked.</span> {username}!
        </motion.h2>

        <div
          className="mt-5"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search by Username..."
              onClick={handleSearchClick}
              onChange={handleSearchInputChange}
              className="form-control d-inline"
              style={{
                width: "1000px",
                marginBottom: "10px",
                padding: "10px 20px",
                borderRadius: "30px",
                border: "2px solid #ccc",
                fontSize: "1rem",
              }}
            />
            <button
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                bottom: "10px",
                padding: "10px 20px",
                backgroundColor: "white",
                color: "red",
                cursor: "pointer",
                borderRadius: "20px",
                borderColor: "red",
                padding: "8px 16px",
              }}
              onClick={checkValid}
            >
              Search
            </button>
          </div>
          {displaySearch && valid && (
            <Link
              to={`/user/${searchText}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <button
                style={{
                  borderRadius: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#FFE0B2",
                  color: "#333",
                  marginBottom: "10px",
                  border: "2px solid #FFB74D",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                {searchText}
              </button>
            </Link>
          )}
          {displaySearch && !valid && notFound && (
            <p style={{ color: "red", fontSize: "1rem" }}>User not found.</p>
          )}

          {displaySearch && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  fontFamily: "STIX Two Text, helvetica, sans-serif",
                  fontWeight: "bold",
                  fontSize: "1.5em",
                  color: "black",
                }}
              >
                Popular Users
              </h3>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  listStyleType: "none",
                  justifyContent: "center",
                }}
              >
                {mostFollowedUsers.slice(0, 8).map((user) => (
                  <li key={user._id}>
                    <Link
                      to={`/user/${user.username}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <button
                        style={{
                          position: "static",
                          backgroundColor: "white",
                          color: "red",
                          cursor: "pointer",
                          borderRadius: "20px",
                          borderColor: "red",
                          padding: "8px 16px",
                          width: "250px",
                        }}
                      >
                        <p
                          style={{
                            marginBottom: "5px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#f20f38",
                          }}
                        >
                          {user.username}
                        </p>
                        <p
                          style={{
                            marginBottom: "5px",
                            fontSize: "0.9rem",
                            textAlign: "center",
                            color: "#f20f38",
                          }}
                        >
                          {user.followers ? user.followers.length : 0}{" "}
                          Followers, {user.posts ? user.posts.length : 0} Posts
                        </p>
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-5">
          <PopularPostsCarousel />
        </div>
        <div
          className="mt-5"
          style={{
            backgroundColor: "#FFE4B2",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3 style={headingStyle}>
            Recent Posts<span style={underlineStyle}></span>
          </h3>
          <div className="row">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading &&
              !error &&
              recentPosts.map((post) => (
                <motion.div
                  key={post._id}
                  className="col-md-3 mb-4"
                  style={postItemStyle}
                  onClick={() => handlePostSelect(post)}
                  variants={postVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div
                    style={{
                      height: "85%",
                      position: "relative",
                      borderRadius: "20px",
                    }}
                  >
                    <img
                      src={`http://localhost:3001/${post.image}`}
                      className="card-img-top"
                      alt="Post"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "20px",
                      }}
                    />
                  </div>
                  <div className="card-body" style={{ height: "15%" }}>
                    <p
                      className="card-text"
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        fontSize: "1em",
                        fontFamily: "STIX Two Text, helvetica, sans-serif",
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                      }}
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title={post.name}
                    >
                      {post.name}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
        <p style={paragraphStyle}>
          Ready to dive into our users' mouth-watering recipes? Check out our
          curated collection below.
        </p>
        <div className="text-center">
          <Link to="/explore" style={buttonStyle}>
            Explore Recipes
          </Link>
        </div>
      </motion.div>

      <div
        className="modal fade"
        id="postModal"
        tabIndex="-1"
        aria-labelledby="postModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="postModalLabel"
                style={{
                  fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                  fontWeight: "bold",
                }}
              >
                <span style={{ borderBottom: "2px solid red" }}>
                  Post Details
                </span>
              </h5>
              <button
                type="button"
                className="btn-close black-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{
                  position: "fixed",
                  top: "20px",
                  right: "20px",
                  zIndex: "1000",
                }}
                onClick={() => setShowOptions(false)}
              ></button>
            </div>
            <div
              className="modal-body"
              style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}
            >
              <p> </p>
              {selectedPost && (
                <div className="row">
                  <div className="col-md-6">
                    <div style={{ position: "sticky", top: "0" }}>
                      <img
                        src={`http://localhost:3001/${selectedPost.image}`}
                        className="img-fluid"
                        alt="Post"
                        style={{ maxHeight: "400px", width: "100%" }}
                      />
                      <div style={{ marginTop: "10px", textAlign: "left" }}>
                        <button
                          onClick={() => toggleLike(selectedPost._id)}
                          style={{
                            background: "none",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                            marginRight: "10px",
                            position: "sticky",
                            top: "0",
                          }}
                        >
                          <FaHeart
                            style={{
                              color: likedPosts.includes(userObjectId)
                                ? "red"
                                : "black",
                            }}
                          />
                          <span
                            style={{
                              fontFamily:
                                "'STIX Two Text', 'Helvetica', sans-serif",
                              fontWeight: "bold",
                            }}
                          >
                            {` ${
                              likedPosts.includes(userObjectId)
                                ? selectedPost.likes.length + 1
                                : selectedPost.likes.length
                            } likes`}
                          </span>
                        </button>
                        <button
                          onClick={() => toggleBookmark(selectedPost._id)}
                          style={{
                            background: "none",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                            marginRight: "10px",
                            position: "sticky",
                            top: "0",
                          }}
                        >
                          <FaBookmark
                            style={{
                              color: bookmarkedPosts.includes(selectedPost._id)
                                ? "blue"
                                : "black",
                            }}
                          />
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem("filed_against", userObjectId);
                            localStorage.setItem(
                              "item_number",
                              selectedPost._id
                            );
                            localStorage.setItem("item_type", "Post");
                            window.location.href = "/report";
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                            marginRight: "10px",
                            position: "sticky",
                            top: "0",
                          }}
                        >
                          <IoFlag
                            style={{
                              color: "black",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4
                      style={{
                        fontSize: "1.2rem",
                        fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                        fontWeight: "bold",
                      }}
                    >
                      {username}:<br />
                      Ingredients:
                    </h4>
                    <ul
                      style={{
                        fontSize: "0.9rem",
                        maxHeight: "calc(100vh - 350px)",
                        overflowY: "auto",
                        fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                      }}
                    >
                      {selectedPost.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    {/* Editable caption */}
                    {isEditingCaption ? (
                      <textarea
                        className="form-control"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontFamily:
                            "'STIX Two Text', 'Helvetica', sans-serif",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            fontFamily:
                              "'STIX Two Text', 'Helvetica', sans-serif",
                          }}
                        >
                          Recipe:
                        </span>
                        <br />
                        {selectedPost.caption}
                      </p>
                    )}

                    {isEditingCaption && (
                      <button
                        className="btn btn-primary"
                        onClick={handleSaveCaption}
                      >
                        Save Changes
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#f8f9fa",
                  padding: "20px",
                }}
              >
                <div className="mt-2">
                  <p
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                    }}
                  >
                    Rate and review
                  </p>
                  <div style={{ position: "relative" }}>
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => handleRatingChange(ratingValue)}
                            style={{ display: "none" }}
                          />
                          <FaStar
                            className="star"
                            color={
                              ratingValue <= rating ? "#ffc107" : "#e4e5e9"
                            }
                            size={24}
                          />
                        </label>
                      );
                    })}
                    <button
                      onClick={discardChanges}
                      className="btn btn-link"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "-5px",
                        padding: "0",
                        color: "#007bff",
                      }}
                    >
                      Discard Changes
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <textarea
                    className="form-control"
                    placeholder="Enter review here"
                    rows={2}
                    value={userReview}
                    onChange={handleReviewChange}
                  ></textarea>
                </div>
                <div className="mt-2 text-center">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#000",
                      color: "#fff",
                      border: "2px solid #ff0000",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      fontWeight: "bold",
                      fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                    }}
                    onClick={postRatingAndReview}
                  >
                    Post
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "1.0 rem",
                    color: "#6c757d",
                    marginTop: "10px",
                    cursor: "pointer",
                    textAlign: "right",
                  }}
                  onClick={() => fetchReviewsAndRatings(selectedPost._id)}
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}

export default Home;
