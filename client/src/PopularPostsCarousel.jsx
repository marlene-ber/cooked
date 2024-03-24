// carousel in home page 

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { Modal } from "bootstrap";
import { FaHeart, FaStar } from 'react-icons/fa';


const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="slick-prev"
      style={{
        position: 'absolute',
        top: '50%',
        left: '-40px', 
        zIndex: 1,
        cursor: 'pointer',
        transform: 'translateY(-50%)',
        padding: '0',
        border: 'none',
        background: 'rgba(0,0,0,0.5)',
        color: 'white',
        width: '30px',
        height: '30px',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >&#60;</button> 
  );
};


const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="slick-next"
      style={{
        position: 'absolute',
        top: '50%',
        right: '-40px', 
        zIndex: 1,
        cursor: 'pointer',
        transform: 'translateY(-50%)',
        padding: '0',
        border: 'none',
        background: 'rgba(0,0,0,0.5)',
        color: 'white',
        width: '30px',
        height: '30px',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >&#62;</button> 
  );
};


const PopularPostsCarousel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [rating, setRating] = useState(0);
  const [userReview, setUserReview] = useState('');

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/posts/popular');
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.toString());
        setLoading(false);
      }
    };
    fetchPopularPosts();
  }, []);

  const handlePostSelect = (post) => {
    setSelectedPost(post);
    setRating(post.rating || 0);
    setUserReview('');
    const myModal = new Modal(document.getElementById('postDetailsModal'));
    myModal.show();
  };

  const underlineStyle = {
    position: 'absolute',
    bottom: '-5px',
    left: '50%',
    width: '90px',
    borderBottom: '2px solid red',
    transform: 'translateX(-50%)',
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

      
      await axios.post("http://localhost:3001/likepost", {
        postId: postId,
        userId: userObjectId,
      });

      
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };


  const submitRatingAndReview = async () => {
    
    console.log('Submitting rating and review:', rating, userReview);
    
  };

  const handleReviewChange = (event) => {
    setUserReview(event.target.value);
  };

  const postRatingAndReview = async () => {
    
    console.log('Submitting rating and review:', rating, userReview);
    
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="popular-posts-carousel" style={{ position: 'relative', textAlign: 'center' }}>
      <h2 style={{
        fontSize: '1.5em', 
        fontWeight: 'bold',
        fontFamily: 'STIX Two Text, helvetica, sans-serif',
        fontWeight: 'bold', 
        color: '#333', 
        margin: '20px 0', 
        textTransform: 'none',
        letterSpacing: 'normal', 
        position: 'relative', 
      }}>Trendy Recipes You Can't Miss<span style={{
        position: 'absolute', 
        bottom: '-5px', 
        left: '50%', 
        width: '150px', 
        borderBottom: '2px solid red', 
        transform: 'translateX(-50%)', 
      }}></span></h2>
      <Slider {...settings}>
        {posts.map((post) => (
          <div key={post._id} className="carousel-item" style={{ margin: '0 10px' }} onClick={() => handlePostSelect(post)}>
            <div className="post-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img src={`http://localhost:3001/${post.image}`} alt={post.name} style={{ maxHeight: '200px', width: '90%', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} /> {/* Adjusted image styling */}
              <div className="post-details">
                <h3 style={{ fontSize: '1.2em', marginBottom: '5px' }}>{post.name}</h3>
                <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '0' }}>Likes: {post.likes?.length || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      
      <div className="modal fade" id="postDetailsModal" tabIndex="-1" aria-labelledby="postDetailsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="postDetailsModalLabel"><span style={{ borderBottom: "2px solid red", fontFamily: "'STIX Two Text', 'Helvetica', sans-serif", fontWeight: 'bold' }}>
                Post Details
              </span></h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', textAlign: 'left', fontFamily: "'STIX Two Text', 'Helvetica', sans-serif" }}>
              {selectedPost && (
                <div className="row">
                  <div className="col-md-6">
                    <div style={{ position: 'sticky', top: '0' }}>
                      <img src={`http://localhost:3001/${selectedPost.image}`} className="img-fluid" alt="Post" style={{ maxHeight: '400px', width: '100%' }} />
                      <div style={{ marginTop: '10px', textAlign: 'left' }}>
                        <button onClick={() => toggleLike(selectedPost._id)} style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer', marginRight: '10px', position: 'sticky', top: '0' }}>
                          <FaHeart style={{ color: 'black' }} />
                          {` ${selectedPost.likes.length} likes`}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Ingredients:</h4>
                    <ul style={{ fontSize: '0.9rem', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
                      {selectedPost.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="mt-2" style={{ backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '10px' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Rate and review</p>
                <div style={{ position: 'relative', marginBottom: '10px', textAlign: 'left' }}>
                  {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index} style={{ marginRight: '5px' }}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                          style={{ display: 'none' }}
                        />
                        <FaStar
                          className="star"
                          color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
                          size={24}
                          style={{ cursor: 'pointer' }}
                        />
                      </label>
                    );
                  })}
                  <button onClick={() => setRating(0)} className="btn btn-link" style={{ position: 'absolute', top: '-25px', right: '0', padding: '0', color: '#007bff', fontSize: '0.9rem', fontFamily: "'STIX Two Text', 'Helvetica', sans-serif" }}>Discard Changes</button>
                </div>
                <textarea
                  className="form-control"
                  placeholder="Enter review here"
                  rows={2}
                  value={userReview}
                  onChange={handleReviewChange}
                  style={{ fontFamily: "'STIX Two Text', 'Helvetica', sans-serif", border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}
                ></textarea>

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

                <p style={{ fontSize: '1.0rem', color: '#6c757d', marginTop: '10px', cursor: 'pointer', textAlign: 'right', fontFamily: "'STIX Two Text', 'Helvetica', sans-serif" }}> </p>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>
  );

};

export default PopularPostsCarousel;