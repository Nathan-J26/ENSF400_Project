import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./Homepage.css";
import axios from "axios";

function Homepage() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [includeExamples, setIncludeExamples] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) {
      alert("Prompt cannot be empty");
      return;
    }

    setSummary("");
    try {
      const res = await axios.post("http://localhost:5000/summarize", {
        text: input,
        include_examples: includeExamples,
      });
      setSummary(res.data.summary);
      console.log(res.data.summary);
    } catch (err) {
      console.error(err);
      alert("Error processing request");
    }
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="controls">
          <label>
            <input
              type="checkbox"
              checked={includeExamples}
              onChange={() => setIncludeExamples(!includeExamples)}
            />
            Include example code
          </label>

          <button onClick={handleSubmit}>Summarize</button>
        </div>

        <div className="output">
          <h3>Summary:</h3>
          <pre className="summary-text">{summary}</pre>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
