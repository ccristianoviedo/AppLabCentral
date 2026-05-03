const sidebarIcons = ['⌂', '🩸', '⚗', '📋', '🧊', '📊', '⚙']

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menú principal">
      <div>
        <div className="brand">ALC</div>
        <nav>
          {sidebarIcons.map((icon, idx) => (
            <button key={icon} type="button" className={`menu-item ${idx === 0 ? 'active' : ''}`} aria-label={`Opción ${idx + 1}`}>
              <span aria-hidden="true">{icon}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="user-card">
        <div className="avatar">LC</div>
      </div>
    </aside>
  )
}

export default Sidebar
