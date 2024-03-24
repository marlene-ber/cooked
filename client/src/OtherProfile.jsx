import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Modal } from "bootstrap";
import { FaEllipsisH, FaCookieBite, FaPencilAlt, FaTrashAlt, FaHeart, FaBookmark, FaStar } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom'; 
import { IoFlag } from "react-icons/io5";

const OtherProfile = () => {
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
    const [userReview, setUserReview] = useState('');
    const { username } = useParams();
    const [follow, setFollow] = useState(false);
    const [account_id, setAccount_id] = useState('');   
    //const logged_in = localStorage.getItem("logged_in");
    const [logged_in, setLogged_in] = useState('');
    const [loggedUsername, setLoggedUsername] = useState('');
    const [x, setX] = useState('a');
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            const cookies = document.cookie.split("; ");
            for (const cookie of cookies) {
                const [name, value] = cookie.split("=");
                if (name === "username") {
                    setLoggedUsername(value);
                    getUserID(value);
                    break;
                }
            }
        }
            console.log(`Fetching data for user: ${username}`);
            fetchUserData(username);
            fetchUserPosts(username);

    }, []);
    


// fetch user data
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
            setAccount_id(userData._id);
            if (userData.followers.includes(logged_in)) {
                setFollow(true);
                setX('yeah');
            } else {
                setFollow(false);
                setX(logged_in);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // get user id
    const getUserID = async (loggedUsername) => {
        try {
            const response = await axios.post("http://localhost:3001/userdata", {
                username: loggedUsername,
            });
            setLogged_in(response.data.user._id);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    
    
// follow button
    const handleFollow = async () => {  
        axios.post("http://localhost:3001/updateFollow", {
            account_id: account_id,
            logged_in: logged_in,
            follow: follow        
        })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
        toggleFollow();
    };


    const toggleFollow = () => {
        setFollow(!follow);
    }

    //fetch user posts
    const fetchUserPosts = async (username) => {
        try {
            const response = await axios.post(`http://localhost:3001/posts`, {
                username,
            });
            const userPosts = response.data.posts;
            setPosts(userPosts);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

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

    //post ratings
    const postRatingAndReview = async () => {
        try {
            
            await axios.post("http://localhost:3001/rateandreview", {
                postId: selectedPost._id,
                userId: userObjectId,
                rating: rating,
                review: userReview
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


    //edit caption
    const handleEditCaption = () => {
        closeOptions();
        setIsEditingCaption('true'); 
        setEditCaption(selectedPost.caption); 
    };

    //save caption
    const handleSaveCaption = () => {
        
        updateCaption(selectedPost._id, editCaption)
            .then(() => {
                // Update the selected post with the new caption
                setSelectedPost(prevPost => ({ ...prevPost, caption: editCaption }));
                setIsEditingCaption(false); // Hide the edit caption box
            })
            .catch(error => console.error("Error updating caption:", error));
    };

    //review edit
    const handleReviewChange = (event) => {
        setUserReview(event.target.value);
    };

// delete post
    const handleDeletePost = () => {
        closeOptions();
    };

    const closeOptions = () => {
        setShowOptions(false);
    };

    //toggle save
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

// rating change
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const discardChanges = () => {
        setRating(originalRating); 
    };

    return (            
        <div className="container mt-4">
            <Navbar />
            <div className="content mt-4 text-center">
                <h1
                    className="mb-4"
                    style={{ fontFamily: "'STIX Two Text', 'Helvetica', sans-serif" }}
                >
                    <strong>{username}</strong>
                    <br />
                </h1>
                {follow ? (
                    <button
                        style={{
                            background: "red", 
                            color: "white", 
                            cursor: "pointer",
                            borderRadius: "20px",
                            border: "none", 
                            padding: "8px 16px", 
                        }}
                        onClick={handleFollow}
                    >
                        Following
                    </button>
                ) : (
                    <button
                        style={{
                            background: "white", 
                            color: "red", 
                            cursor: "pointer",
                            borderRadius: "20px",
                            borderColor: "red", 
                            padding: "8px 16px", 
                        }}
                        onClick={handleFollow}
                    >
                        Follow
                    </button>
                )}
                <button onClick={() => {
                          localStorage.setItem("filed_against", account_id);
                          localStorage.setItem("item_number", logged_in);
                          localStorage.setItem("item_type", "Account");
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
                            color: "black"}}
                          />
                        </button>

                <div className="row">
                    <div className="col-md-6 text-center">
                        <p
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                                marginBottom: 0,
                            }}
                        >
                            {followers}
                        </p>
                        <p style={{ fontSize: "0.8rem", marginTop: "0" }}>Followers</p>
                    </div>

                    <div className="col-md-6 text-center">
                        <p
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                                marginBottom: 0,
                            }}
                        >
                            {following}
                        </p>
                        <p style={{ fontSize: "0.8rem", marginTop: "0" }}>Following</p>
                    </div>




                </div>




                <div className="row">
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            const imageUrl = `http://localhost:3001/${post.image}`;

                            return imageUrl ? (
                                <div
                                    key={post._id}
                                    className="col-md-4 mb-4"
                                    onClick={() => openModal(post)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="card">
                                        <Link to={`/user/${post.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <img
                                                src={imageUrl}
                                                className="card-img-top"
                                                alt="Post"
                                                style={{ height: "350px", width: "100%" }}
                                            />
                                            <div className="card-body">
                                                <p
                                                    className="card-text"
                                                    style={{
                                                        fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {post.name}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ) : null;
                        })
                    ) : (
                        <p>
                            <span style={{
                                fontFamily: "'STIX Two Text', 'Helvetica', sans-serif",
                                fontWeight: "bold",
                                color: "black",
                            }}>

                                No recipes to display.
                            </span>
                            <br />
                            <FaCookieBite style={{ fontSize: '3rem', marginTop: '1rem' }} />
                        </p>

                    )}
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
                                                        {` ${likedPosts.includes(userObjectId)
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
                                >

                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showOptions && selectedPost && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
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
                                <div onClick={handleEditCaption} style={{ cursor: "pointer" }}>
                                    <FaPencilAlt /> Edit Caption
                                </div>
                                <div onClick={handleDeletePost} style={{ cursor: "pointer", marginTop: "10px" }}>
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

export default OtherProfile;