function Sidebar({ items }) {
  return (
    <aside className="sidebar" aria-label="Menú principal">
      <div className="brand">AppLabo<br />Central</div>
      <nav>
        {items.map((item, idx) => (
          <button key={item} type="button" className={`menu-item ${idx === 0 ? 'active' : ''}`}>
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
