//USING SPOONACULAR API

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const Guide = () => {
  const [substitutes, setSubstitutes] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const initialOptions = [
    "Maple syrup",
    "Honey",
    "Flour",
    "Butter",
    "Soy sauce",
    "Sour cream",
    "Olive oil",
    "Baking soda",
    "Quinoa",
    "Margarine",
    "Chicken broth",
    "Chilli powder",
    "Ketchup",
    "Nut",
    "Cayenne",
    "Corn starch",
  ];

  const additionalOptions = [
    "Corn syrup",
    "Pepper",
    "Broccoli",
    "Cheddar Cheese",
    "Onion",
    "Beef Broth",
    "Tahini",
    "Peanut butter",
    "Chives",
    "Veg broth",
    "Watermelon",
    "Bread crumbs",
    "Cottage cheese",
    "Brown sugar",
    "Oregano",
    "Evaporated milk",
    "Gelatin",
    "Radish",
    "Hot pepper sauce",
    "Lemon juice",
    "Mayonnaise",
    "Pepperoni",
    "Rum",
    "Saffron",
    "Kale",
    "Sweetened condensed milk",
    "Cauliflower",
    "Condensed milk",
    "Parmesan cheese",
    "Avocado",
    "Molasses",
    "Herring",
    "Hazelnuts",
    "Crème fraiche",
    "Chervil",
    "Tuna",
    "Pears",
    "Buttermilk",
    "Brandy",
    "Apple juice",
  ];

  let optionsToShow = showAllOptions
    ? [...initialOptions, ...additionalOptions]
    : initialOptions;
  optionsToShow = optionsToShow.sort();

  useEffect(() => {
    const fetchSubstitutes = async () => {
      try {
        if (!ingredientName) {
          setSubstitutes([]);
          return;
        }

        //API URL
        const response = await fetch(
          `https://api.spoonacular.com/food/ingredients/substitutes?ingredientName=${ingredientName}&apiKey=1d73629b998c4e338a6edf572c57bea6`
        );
        const data = await response.json();

        if (data.substitutes && data.substitutes.length > 0) {
          setSubstitutes(data.substitutes);
        } else {
          setSubstitutes([]);
          console.warn(`No substitutes found for ${ingredientName}.`);
        }
      } catch (error) {
        console.error("Error fetching substitutes:", error);
      }
    };

    fetchSubstitutes();
  }, [ingredientName]);

  const handleViewAllClick = () => {
    setShowAllOptions(true);
  };

  const handleBackClick = () => {
    setShowAllOptions(false);
  };

  const handleClickIngredient = (option) => {
    setIngredientName(option);
    setSelectedOption(option);
    window.scrollTo(0, 0); // Scroll to top
  };

  // Alphabetization of Ingredients
  const groupIngredientsByLetter = () => {
    const groupedIngredients = {};
    optionsToShow.forEach((option) => {
      const firstLetter = option[0].toUpperCase();
      if (!groupedIngredients[firstLetter]) {
        groupedIngredients[firstLetter] = [];
      }
      groupedIngredients[firstLetter].push(option);
    });
    return groupedIngredients;
  };

  const scrollToLetter = (letter) => {
    const element = document.getElementById(letter);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setSelectedLetter(letter);
  };

  const headingStyle = {
    position: "relative",
    fontFamily: "STIX Two Text, helvetica, sans-serif",
    fontWeight: "bold",
  };

  const underlineStyle = {
    position: "absolute",
    bottom: "-5px",
    left: "50%",
    width: "200px", // Adjusted width for better visibility
    borderBottom: "2px solid red",
    transform: "translateX(-50%)",
  };

  const textStyle = {
    fontFamily: "STIX Two Text, helvetica, sans-serif",
    fontWeight: "bold",
  };

  return (
    <div className="container mt-4">
      <Navbar />
      <div className="mt-4">
        <motion.h2
          className="text-center mb-4"
          style={headingStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to the Guide Page!<span style={underlineStyle}></span>
        </motion.h2>

        <div className="form-group d-flex justify-content-center align-items-center">
          <div className="input-group">
            <input
              type="text"
              id="ingredientInput"
              className="form-control"
              placeholder="Type an Ingredient"
              value={ingredientName}
              onChange={(e) => {
                setIngredientName(e.target.value);
                setSelectedOption("");
              }}
            />
            <div className="input-group-append">
              <span className="input-group-text bg-white border-left rounded-right">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
        </div>

        {ingredientName && (
          <>
            <motion.h3
              className="text-center mt-4"
              style={textStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Ingredient Substitutes for {ingredientName}:
            </motion.h3>
            {substitutes.length > 0 ? (
              <motion.ul
                className="list-group w-50 mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {substitutes.map((substitute, index) => (
                  <motion.li
                    key={index}
                    className="list-group-item"
                    style={textStyle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {substitute}
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.p
                className="text-center mt-4"
                style={textStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                No substitutes found for {ingredientName}.
              </motion.p>
            )}
          </>
        )}

        <div className="grocery-list mt-4">
          <motion.h3
            className="text-center mb-3"
            style={textStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {showAllOptions ? "All Ingredients" : "Frequently Searched"}
          </motion.h3>

          {showAllOptions && (
            <div className="text-center mb-3">
              {[...Array(26)].map((_, i) => (
                <motion.button
                  key={i}
                  className={`btn ${
                    selectedLetter === String.fromCharCode(65 + i)
                      ? "btn-dark"
                      : "btn-outline-dark"
                  } mx-1`}
                  onClick={() => scrollToLetter(String.fromCharCode(65 + i))}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {String.fromCharCode(65 + i)}
                </motion.button>
              ))}
            </div>
          )}
          {showAllOptions ? (
            Object.entries(groupIngredientsByLetter()).map(
              ([letter, ingredients], index) => (
                <div key={index} id={letter}>
                  <div className="row mb-3">
                    <div className="col-12">
                      <motion.h4
                        className="mt-3"
                        style={textStyle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        {letter}
                      </motion.h4>
                      <hr />
                    </div>
                  </div>
                  <div className="row">
                    {ingredients.map((option, index) => (
                      <motion.div
                        key={index}
                        className="col-md-3 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        <motion.div
                          className={`card ${
                            selectedOption === option ? "bg-primary" : ""
                          }`}
                          onClick={() => handleClickIngredient(option)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                        >
                          <div
                            className="card-body text-center"
                            style={textStyle}
                          >
                            {option}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="row">
              {optionsToShow.map((option, index) => (
                <motion.div
                  key={index}
                  className="col-md-3 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <motion.div
                    className={`card ${
                      selectedOption === option ? "bg-primary" : ""
                    }`}
                    onClick={() => handleClickIngredient(option)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <div className="card-body text-center" style={textStyle}>
                      {option}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
          {!showAllOptions && (
            <div className="text-right mt-4">
              <motion.button
                className="btn btn-dark btn-lg"
                onClick={handleViewAllClick}
                style={textStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                View All
              </motion.button>
            </div>
          )}
          {showAllOptions && (
            <div className="text-left mt-4">
              <motion.button
                className="btn btn-dark btn-lg"
                onClick={handleBackClick}
                style={textStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Frequently
                Searched
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guide;
