import Navbar from "./Navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import {
  FaEllipsisH,
  FaPencilAlt,
  FaTrashAlt,
  FaHeart,
  FaBookmark,
  FaStar,
} from "react-icons/fa";
import { IoFlag } from "react-icons/io5";

const Explore = () => {
  // State variables
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [notedPosts, setNotedPosts] = useState([]);
  const [rating, setRating] = useState(0);
  const [originalRating, setOriginalRating] = useState(0);
  const [userObjectId, setUserObjectId] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "username") {
        setUsername(value);
        fetchUserData(value);
        fetchAllPosts();
        break;
      }
    }
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchText, posts]);

  //Filter posts for Search
  const filterPosts = () => {
    const filtered = posts.filter((post) => {
      const postWords = post.name.toLowerCase().split(" ");
      const searchTextLower = searchText.toLowerCase();
      const isNameMatch = postWords.some((word) => word === searchTextLower);
      const isKeywordMatch = post.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTextLower)
      );

      if (isNameMatch || isKeywordMatch) {
        console.log(`Matching post: ${post.name} , ${post.keywords}`);
      }

      return isNameMatch || isKeywordMatch;
    });
    setFilteredPosts(filtered);
  };

  const fetchUserData = async (username) => {
    try {
      const response = await axios.post("http://localhost:3001/userdata", {
        username,
      });
      const userData = response.data.user;
      if (userData.followers) {
        setFollowers(userData.followers.length);
      }
      if (userData.following) {
        setFollowing(userData.following.length);
      }
      setUserObjectId(userData._id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //fetch all posts
  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts/all");
      const allPosts = response.data.posts;

      const shuffledPosts = shuffleArray(allPosts);

      setPosts(shuffledPosts);

      console.log("All posts are fetched.");
    } catch (error) {
      console.error("Error fetching all posts:", error);
    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleOptionToggle = (option) => {
    const isSelected = selectedOptions.includes(option);

    // Update searchText based on selected options
    let updatedSearchText = searchText;
    if (isSelected) {
      updatedSearchText = updatedSearchText.replace(
        new RegExp(option, "gi"),
        ""
      );
    } else {
      updatedSearchText += ` ${option}`;
    }

    setSearchText(updatedSearchText.trim());
    setSelectedOptions(
      isSelected
        ? selectedOptions.filter((selected) => selected !== option)
        : [...selectedOptions, option]
    );

    filterPosts();
  };

  const toggleOptionsDropdown = () => {
    setShowOptionsDropdown(!showOptionsDropdown);
  };

  const keywords = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Easy",
    "Advanced",
    "Quick",
    "Healthy",
    "Holiday",
    "Halal",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Vegetarian",
    "Vegan",
    "Meat-Based",
    "Mexican",
    "Asian",
    "American",
    "African",
    "Italian",
    "European",
    "Thai",
    "Main Course",
    "Side Dish",
    "Sweet",
    "Savory",
    "Soup",
    "Salad",
  ];

  //toggle like button
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
    setOriginalRating(post.rating);
    const myModal = new Modal(document.getElementById("postModal"));
    myModal.show();
  };

  const openOptions = () => {
    console.log("Opening options...");
    setShowOptions(!showOptions);
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

  const toggleBookmark = async (postId) => {
    try {
      if (!userObjectId) {
        console.error("User ObjectId not found.");
        return;
      }

      const isBookmarked = bookmarkedPosts.includes(postId);

      let updatedBookmarkedPosts;
      if (isBookmarked) {
        updatedBookmarkedPosts = bookmarkedPosts.filter(
          (bookmarkedPostId) => bookmarkedPostId !== postId
        );
      } else {
        updatedBookmarkedPosts = [...bookmarkedPosts, postId];
      }

      setBookmarkedPosts((prevBookmarkedPosts) => updatedBookmarkedPosts);

      await axios.post("http://localhost:3001/togglebookmark", {
        postId: postId,
        userId: userObjectId,
      });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const discardChanges = () => {
    setRating(originalRating);
  };

  return (
    <div className="container mt-4">
      <Navbar />
      <div className="content mt-4">
        <h2
          className="text-center"
          style={{
            fontSize: "38.4px",
            fontFamily: "STIX Two Text, helvetica, sans-serif",
            fontWeight: "bold",
          }}
        >
          What would you like to cook today?
        </h2>

        <div className="text-center mb-4 position-relative">
          <input
            type="text"
            placeholder="Search..."
            onClick={toggleOptionsDropdown}
            onChange={handleSearchInputChange}
            className="form-control d-inline"
            style={{ width: "1000px" }}
          />
          {selectedOptions.length > 0 && (
            <div className="d-flex mt-2">
              {selectedOptions.map((option, index) => (
                <div key={index} className="bg-light p-2 mr-2">
                  {option}{" "}
                  <span onClick={() => handleOptionToggle(option)}>x</span>
                </div>
              ))}
            </div>
          )}
          {showOptionsDropdown && (
            <div
              className="position-absolute bg-white border p-2"
              style={{
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "1000px",
                maxHeight: "120px",
                overflowY: "auto",
                zIndex: 100,
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
              }}
            >
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="form-check"
                  onClick={() => handleOptionToggle(keyword)}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={keyword}
                    checked={selectedOptions.includes(keyword)}
                    onChange={() => handleOptionToggle(keyword)}
                  />
                  <label className="form-check-label" htmlFor={keyword}>
                    {keyword}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <h2 className="mt-4"></h2>

        <div className="row m-0">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post._id}
              className="col-md-2 col-sm-2 col-xs-6"
              onClick={() => openModal(post)}
              style={{ cursor: "pointer" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="card"
                style={{
                  height: "400px",
                  border: "none",
                  fontSize: "18px",
                  fontFamily: "STIX Two Text, helvetica, sans-serif",
                  fontWeight: "bold",
                }}
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
                    }}
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title={post.name}
                  >
                    {post.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
              {selectedPost && (
                <button
                  className="btn"
                  onClick={(event) => openOptions(event)}
                  style={{ position: "absolute", top: "20px", right: "4%" }}
                >
                  <FaEllipsisH />
                </button>
              )}
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
                    {/* Button to save changes */}
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

      {showOptions && selectedPost && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "300px" }}
          >
            {" "}
            <div className="modal-content">
              <div className="modal-body" style={{ textAlign: "center" }}>
                <div
                  onClick={handleDeletePost}
                  style={{
                    cursor: "pointer",
                    marginBottom: "10px",
                    color: "red",
                    fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                  }}
                >
                  <FaTrashAlt /> Delete Post
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    width: "100%",
                    margin: "10px 0",
                  }}
                ></div>{" "}
                {/* Line */}
                <div
                  onClick={handleEditCaption}
                  style={{
                    cursor: "pointer",
                    color: "#000",
                    fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                  }}
                >
                  <FaPencilAlt /> Edit Recipe
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    width: "100%",
                    margin: "10px 0",
                  }}
                ></div>{" "}
                {/* Line */}
                <div
                  onClick={closeOptions}
                  style={{
                    cursor: "pointer",
                    color: "#000",
                    fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                  }}
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
