import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import "./Homepage.css";
import axios from "axios";

function Homepage() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [includeExamples, setIncludeExamples] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) {
      alert("Prompt cannot be empty");
      return;
    }

    setSummary("");
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        {/* Header */}
        <div className="main-header">
          <h1 className="title">
            <span className="title-bracket">&lt;</span>
            DocReader
            <span className="title-bracket">/&gt;</span>
          </h1>
          <p className="subtitle">
            AI-powered documentation summarizer &amp; code cleanup
          </p>
        </div>

        {/* Input Area */}
        <div className="input-wrapper">
          <div className="input-header">
            <span className="input-label">
              <span className="label-dot"></span>
              Paste Documentation
            </span>
            <span className="char-count">{input.length} chars</span>
          </div>
          <textarea
            id="user-input"
            placeholder="// Paste your documentation, code, or API reference here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Controls */}
        <div className="controls">
          <button
            className={`example-btn ${includeExamples ? "active" : ""}`}
            onClick={() => setIncludeExamples(!includeExamples)}
          >
            <span className="btn-icon">{includeExamples ? "☑" : "☐"}</span>
            Include example code
          </button>
          <br />
          <button
            className={`submit-btn ${isLoading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Processing...
              </span>
            ) : (
              <>
                <span className="btn-spark">➤ </span>
                Summarize
              </>
            )}
          </button>
          <br />
        </div>

        {/* Output */}
        <br />
        <div className={`output ${summary || isLoading ? "has-content" : ""}`}>
          <div className="output-header">
            <div className="terminal-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <span className="output-title">output.md</span>
            <div className="window-controls">
              <span className="win-btn win-min">_</span>
              <span className="win-btn win-max">□</span>
              <span className="win-btn win-close">×</span>
            </div>
          </div>
          <div className="output-body">
            {isLoading ? (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : summary ? (
              <pre className="summary-text">{summary}</pre>
            ) : (
              <p className="placeholder-text">
                Summary will appear here after processing...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
