import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./Homepage.css";

function Homepage() {
  const handleSubmit = async () => {
    console.log("Handel submit");
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <h2>DocReader</h2>

        <textarea
          id="user-input"
          placeholder="Paste your documentation here..."
        />

        <div className="controls">
          <label>
            <input type="checkbox" />
            Include example code
          </label>

          <button onClick={handleSubmit}>Summarize</button>
        </div>

        <div className="output">
          <h3>Summary:</h3>
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
