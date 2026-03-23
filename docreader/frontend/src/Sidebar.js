import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="brand-icon">&lt;/&gt;</span>
        <span className="brand-text">DocReader</span>
      </div>

      {/* New Chat Button */}
      <button className="new-chat-btn" onClick={() => window.location.reload()}>
        <span className="btn-icon">+</span>
        New Session
      </button>

      {/* History */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">History</h4>
        <div className="history-list">
          <div className="history-item">
            <span className="history-dot"></span>
            <span className="history-text">No sessions yet</span>
          </div>
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
