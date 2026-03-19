import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./Homepage.css";

function Homepage() {
  const handleSubmit = async () => {
    console.log("Handel submit");
  };

  const MAX_HEIGHT = 500;
  function handleTextareaInput(e) {
    const el = e.target;

    el.style.height = "auto"; // reset so it can shrink if needed
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <h2>DocReader</h2>

        <textarea
          id="user-input"
          placeholder="Paste your documentation here..."
          onInput={handleTextareaInput}
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
          <p className="summary-text"></p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
