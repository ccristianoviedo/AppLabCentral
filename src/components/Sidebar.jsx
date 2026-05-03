function Sidebar({ items }) {
  return (
    <aside className="sidebar" aria-label="Menú principal">
      <div>
        <div className="brand">AppLabo Central</div>
        <nav>
          {items.map((item, idx) => (
            <button key={item} type="button" className={`menu-item ${idx === 0 ? 'active' : ''}`}>
              <span aria-hidden="true">◦</span>{item}
            </button>
          ))}
        </nav>
      </div>

      <div className="user-card">
        <div className="avatar">LC</div>
        <div>
          <strong>Laura Correa</strong>
          <small>Bioquímica</small>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
