function HistoryPanel({ history, activeId, onSelect, onClear, collapsed=false, onToggle }) {
  return (
    <aside className={`history-panel ${collapsed ? 'collapsed' : ''}`} aria-hidden={collapsed}>
      <div className="history-hdr">
        <div>
          <p className="step-label">History</p>
          <h2 className="history-title">Previous chats</h2>
        </div>
        <div style={{display: 'flex', gap: 8}}>
          <button className="btn-ghost btn-ghost-sm" onClick={onClear}>Clear</button>
          <button className="btn-ghost btn-ghost-sm" onClick={() => onToggle && onToggle(!collapsed)}>{collapsed ? 'Open' : 'Close'}</button>
        </div>
      </div>
      <div className="history-list">
        {history.length === 0 ? (
          <p className="history-empty">No history yet. Your searches will appear here.</p>
        ) : (
          history.map(item => (
            <button
              key={item.id}
              type="button"
              className={`history-item ${item.id === activeId ? 'active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <div className="history-item-q">
                {item.analysis?.name || item.query || "Previous search"}
              </div>
              <div className="history-item-m">
                {item.location || ""} • {new Date(item.updatedAt || item.createdAt).toLocaleString()}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}

export default HistoryPanel