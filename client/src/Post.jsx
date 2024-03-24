import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Post = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileInputText, setFileInputText] = useState("Choose File");
  const [success, setSuccess] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [ingredients, setIngredients] = useState([""]);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "username") {
        setUsername(value);
        break;
      }
    }
  }, []);

  const predefinedKeywords = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Easy",
    "Advanced",
    "Quick",
    "Holiday",
    "Vegetarian",
    "Vegan",
    "Meat-Based",
    "Mexican",
    "Asian",
    "American",
    "African",
    "Main Course",
    "Side Dish",
    "Sweet",
    "Savory",
    "Soup",
    "Salad"
  ];

  // change image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
    setFileInputText("Change Picture");
  };

  //change post name
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  //change caption
  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  // change ingredients
  const handleIngredientChange = (e) => {
    setIngredients(e.target.value.split(","));
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  // remove ingredients
  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  // select keywords
  const handleKeywordToggle = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((kw) => kw !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      setFileInputText("Change Picture");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name.trim() || !caption.trim() || selectedKeywords.length === 0 || ingredients.length === 0) {
        setError("Name, caption, and keywords are necessary");
        return;
      }

      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("caption", caption);
      formData.append("image", image);
      formData.append("ingredients", ingredients);
      formData.append("keywords", JSON.stringify(selectedKeywords));

      const response = await fetch("http://localhost:3001/createpost", {
        method: "POST",
        body: formData,
        headers: {
          Username: username,
        },
      });

      if (response.ok) {
        setSuccess(true);
        onSubmit();
      } else {
        setError("Failed to create post. Please try again later.");
      }
    } catch (error) {
      setError("Error submitting post. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    console.log("Next button clicked");
  };

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  const postPopupStyle = {
    width: "300px",
    height: "auto",
    maxHeight: "600px",
    backgroundColor: "#ffffff",
    padding: "40px 20px",
    borderRadius: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "2px",
    right: "5px",
    cursor: "pointer",
  };

  const labelStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "5px",
    width: "100px",
    height: "50px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
    display: "inline-block",
    position: "relative",
  };

  const dropSectionStyle = {
    border: "2px dashed #007bff",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
  };

  const dropTextStyle = {
    color: "#007bff",
    fontSize: "16px",
  };

  const captionInputStyle = {
    border: "1px solid #dbdbdb",
    borderRadius: "5px",
    padding: "8px",
    width: "100%",
    marginBottom: "20px",
    fontSize: "14px",
    display: imageUrl ? "block" : "none",
  };

  const roundedImageStyle = {
    maxWidth: "100%",
    marginBottom: "20px",
    borderRadius: "10px",
    display: imageUrl ? "block" : "none",
  };

  const buttonContainerStyle = {
    marginTop: "20px",
  };

  const keywordContainerStyle = {
    marginTop: "10px",
  };

  const keywordButtonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    margin: "5px",
    cursor: "pointer",
    border: "1px solid #007bff",
  };

  return (
    <div className="post-popup-overlay" style={postPopupStyle}>
      <div className="post-popup">
        <div style={closeButtonStyle} onClick={onClose}>
          <FaTimes />
        </div>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {imageUrl && !success && (
            <>
              <img src={imageUrl} alt="Selected" style={roundedImageStyle} />
              <div>
                <input
                  type="text"
                  id="recipe-name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Write recipe name"
                  style={captionInputStyle}
                />
              </div>
    
              <input
                type="text"
                value={caption}
                onChange={handleCaptionChange}
                placeholder="Write a caption..."
                style={captionInputStyle}
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              
              <div style={keywordContainerStyle}>
                <p>Select Keywords:</p>
                {predefinedKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordToggle(keyword)}
                    style={{
                      backgroundColor: selectedKeywords.includes(keyword) ? "#007bff" : "#fff",
                      color: selectedKeywords.includes(keyword) ? "#fff" : "#000",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      margin: "5px",
                      cursor: "pointer",
                      border: "1px solid #007bff",
                      position: "relative",
                    }}
                  >
                    {keyword}
                    {selectedKeywords.includes(keyword) && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKeywordToggle(keyword);
                        }}
                        style={{
                          marginLeft: "5px",
                          cursor: "pointer",
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)"
                        }}
                      >
                      </span>
                    )}
                  </button>
                ))}
              </div>
    
              <div style={{ marginBottom: "20px", position: "relative" }}>
                <p style={{ display: "inline-block", marginRight: "10px" }}>Ingredients:</p>
                <textarea
                  value={ingredients}
                  placeholder="Enter ingredients separated by commas"
                  onChange={handleIngredientChange}
                  style={{ ...captionInputStyle, minHeight: "100px" }}
                />
              </div>
    
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </>
          )}
          {success && (
            <div style={{ textAlign: "center" }}>
              <p>Post created successfully</p>
              <button onClick={handleClose}>OK</button>
            </div>
          )}
          {!imageUrl && (
            <div
              style={dropSectionStyle}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <label
                htmlFor="image-upload"
                style={{ ...labelStyle, display: !imageUrl ? "block" : "none" }}
              >
                {fileInputText}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <p style={dropTextStyle}>Drop your file here or click to select</p>
            </div>
          )}
          {!imageUrl && !success && (
            <div style={buttonContainerStyle}>
              <button
                onClick={handleNext}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  
};

export default Post;
