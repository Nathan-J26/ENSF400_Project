import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Homepage.css";
import axios from "axios";
import { supabase } from "./supabaseClient";

function Homepage({ session }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [includeExamples, setIncludeExamples] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null) // null on first conversation

  useEffect(() => {
    fetchConversations();
  }, [session.access_token]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/conversations", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  };

  const loadConversation = async (id) => {
    setConversationId(id);
    setIsLoading(true);
    setMessages([]);
    try {
      const res = await axios.get(`http://localhost:5000/conversations/${id}/messages`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      alert("Prompt cannot be empty");
      return;
    }

    const currentInput = input;
    setMessages(prev => [...prev, { role: "user", content: currentInput }]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/summarize", {
        text: currentInput,
        include_examples: includeExamples,
        conversation_id: conversationId,
      }, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      setMessages(prev => [...prev, { role: "llm", content: res.data.summary }]);
      if (!conversationId && res.data.conversation_id) {
        setConversationId(res.data.conversation_id);
        fetchConversations();
      }
    } catch (err) {
      if(err.response?.status === 401) {
        alert("Your session has expired. This may be caused by logging in on another device. Please log in again.");
        await supabase.auth.signOut(); // clears out old session
      }
      else {
        console.error(err);
        alert("Error processing request");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container">
      <Sidebar conversations={conversations} onSelectConversation={loadConversation} />

      <div className="main">
        {/* Header */}
        <div className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="title">
              <span className="title-bracket">&lt;</span>
              DocReader
              <span className="title-bracket">/&gt;</span>
            </h1>
            <p className="subtitle">
              AI-powered documentation summarizer &amp; code cleanup
            </p>
          </div>
          <button 
            className="logout-btn"
            onClick={() => supabase.auth.signOut()} 
            style={{ 
              backgroundColor: 'transparent', 
              color: 'var(--accent-green)', 
              border: '1px solid var(--accent-green)', 
              padding: '8px 16px', 
              fontFamily: 'inherit', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'var(--transition-fast)'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--accent-green)'; e.target.style.color = '#000'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--accent-green)'; }}
          >
            [ LOG OUT ]
          </button>
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
        <div className={`output ${messages.length > 0 || isLoading ? "has-content" : ""}`}>
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
          <div className="output-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '15px' }}>
            {messages.length > 0 ? (
              <div className="messages-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`} style={{ borderLeft: `2px solid ${msg.role === 'user' ? '#fff' : 'var(--accent-green)'}`, paddingLeft: '10px' }}>
                    <div className="message-role" style={{ color: msg.role === 'user' ? '#fff' : 'var(--accent-green)', fontWeight: 'bold', marginBottom: '5px' }}>
                      [{msg.role === 'user' ? 'YOU' : 'DOCREADER'}]
                    </div>
                    <pre className="summary-text">{msg.content}</pre>
                  </div>
                ))}
                {isLoading && (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </div>
            ) : isLoading ? (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
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
