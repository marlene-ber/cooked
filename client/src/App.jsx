import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Signup";
import Home from "./Home";
import Feed from "./Feed";
import Explore from "./Explore";
import Guide from "./Guide";
import Profile from "./Profile";
import Saved from "./Saved";
import Admin from "./Admin";
import Report from "./Report";
import OtherProfile from "./OtherProfile";
import Login from "./Login"; // Add this import statement
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/feed" element={<Feed />}></Route>
          <Route path="/explore" element={<Explore />}></Route>
          <Route path="/guide" element={<Guide />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/saved" element={<Saved />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/report" element={<Report />}></Route>
          <Route path="/user/:username" element={<OtherProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
