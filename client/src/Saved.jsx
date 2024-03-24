import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHeart,
  FaBookmark,
  FaStar,
  FaPencilAlt,
  FaTrashAlt,
  FaEllipsisH,
} from "react-icons/fa";
import { Modal } from "bootstrap";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Saved = () => {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "username" && value !== username) {
          setUsername(value);
          try {
            // Fetch saved posts of the user
            const response = await axios.post("http://localhost:3001/savedposts", {
              username: value,
            });
            const { savedPosts } = response.data;
            // Set the saved posts
            setPosts(savedPosts);
          } catch (error) {
            console.error("Error fetching saved posts:", error);
          }
          break;
        }
      }
    };

    fetchData();
  }, [username]);

  //toggle like
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

      setLikedPosts(updatedPosts.map((post) => post.likes).flat());

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

  const closeOptions = () => {
    setShowOptions(false);
  };

  //save 
  const toggleBookmark = (postId) => {
    if (bookmarkedPosts.includes(postId)) {
      setBookmarkedPosts(bookmarkedPosts.filter((id) => id !== postId));
    } else {
      setBookmarkedPosts([...bookmarkedPosts, postId]);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleUsernameClick = (post) => {
    
    console.log(`Clicked on username: ${post.username}`);
  };

  const discardChanges = () => {
    setRating(originalRating);
  };

  // save caption
  const handleSaveCaption = () => {
    
    updateCaption(selectedPost._id, editCaption)
      .then(() => {
        
        setSelectedPost((prevPost) => ({ ...prevPost, caption: editCaption }));
        setIsEditingCaption(false); 
      })
      .catch((error) => console.error("Error updating caption:", error));
  };

  //edit caption
  const handleEditCaption = () => {
    closeOptions();
    setIsEditingCaption("true"); 
    setEditCaption(selectedPost.caption); 
  };
// delete post
  const handleDeletePost = () => {
    closeOptions();
  };

  return (
    <div className="container mt-4">
      <Navbar />
      <p>.</p>
      <div className="row justify-content-center">
        <div className="col-md-6" >
          {posts.map((post) => (
            <div
              key={post._id}
              className="mb-4"
              onClick={() => openModal(post)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="card text-center"
                style={{
                  width: "500px",
                  height: "700px",
                  border: "none",
                  overflow: "hidden",
                  borderRadius: "0px",
                  borderBottom: "1px solid #ccc", 
                  fontFamily: "'STIX Two Text', 'Helvetica', sans-serif", 
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(post);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <p
                    className="card-text"
                    style={{
                      fontFamily: "'STIX Two Text', 'Helvetica', sans-serif", 
                      fontWeight: "bold",
                    }}
                  >
                    <Link
                      to={`/user/${post.username}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      {post.username}
                    </Link>
                  </p>
                  <img
                    src={`http://localhost:3001/${post.image}`}
                    className="card-img-top mx-auto d-block"
                    alt="Post"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "560px",
                      borderRadius: "10px",
                    }}
                  />
                  <div className="card-body" style={{ height: "150px" }}>
                    <p className="card-text">{post.name}</p>
                    <button
                      onClick={() => toggleLike(post._id)}
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <FaHeart
                        style={{
                          color: likedPosts.includes(userObjectId)
                            ? "red"
                            : "black",
                        }}
                      />
                    </button>
                    <button
                      onClick={() => toggleBookmark(post._id)}
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      <FaBookmark
                        style={{
                          color: bookmarkedPosts.includes(post._id)
                            ? "blue"
                            : "black",
                        }}
                      />
                    </button>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPost && (
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
                <h5 className="modal-title" id="postModalLabel">
                  Post Details
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
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "4%",
                    }}
                  >
                    <FaEllipsisH />
                  </button>
                )}
              </div>
              <div
                className="modal-body"
                style={{
                  maxHeight: "calc(100vh - 250px)",
                  overflowY: "auto",
                }}
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
                            {` ${selectedPost.likes.length} likes`}
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
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h4
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {username}
                        :<br />
                        Ingredients:
                      </h4>
                      <ul
                        style={{
                          fontSize: "0.9rem",
                          maxHeight: "calc(100vh - 350px)",
                          overflowY: "auto",
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
                        <p style={{ fontSize: "0.9rem" }}>
                          <span
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: "bold",
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
                              color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
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
                      onChange={(e) => setUserReview(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mt-2 text-center">
                    <button
                      className="btn btn-info"
                      style={{
                        backgroundColor: "#f89656",
                        borderColor: "#f89656",
                      }}
                      onClick={postRatingAndReview}
                    >
                      Post
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: "1.0rem",
                      color: "#6c757d",
                      marginTop: "10px",
                      cursor: "pointer",
                      textAlign: "right",
                    }}
                  >
                    View All Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showOptions && selectedPost && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Options</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeOptions}
                ></button>
              </div>
              <div className="modal-body">
                <div
                  onClick={handleEditCaption}
                  style={{ cursor: "pointer" }}
                >
                  <FaPencilAlt /> Edit Caption
                </div>
                <div
                  onClick={handleDeletePost}
                  style={{ cursor: "pointer", marginTop: "10px" }}
                >
                  <FaTrashAlt /> Delete Post
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saved;