import "./Sidebar.css";

function Sidebar({ conversations = [], onSelectConversation }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="brand-icon">&lt;/&gt;</span>
        <span className="brand-text">DocReader</span>
      </div>

      {/* New Chat Button */}
      <button className="new-chat-btn" onClick={() => window.location.reload()}> 
      {/* Once the user clicks this, conversationId in Homepage.js will be set to null, causing a new conversation to be initiated */}
        <span className="btn-icon">+</span>
        New Session
      </button>

      {/* History */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">History</h4>
        <div className="history-list">
          {conversations.length > 0 ? (
            conversations.map(convo => (
              <div key={convo.id} className="history-item" onClick={() => onSelectConversation(convo.id)}>
                <span className="history-dot"></span>
                <span className="history-text">{convo.title || "Untitled Session"}</span>
              </div>
            ))
          ) : (
            <div className="history-item">
              <span className="history-dot"></span>
              <span className="history-text">No sessions yet</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <span className="footer-text">Powered by AI</span>
        <div className="footer-pulse"></div>
      </div>
    </aside>
  );
}

export default Sidebar;
