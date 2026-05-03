import './App.css'

const modules = [
  { name: 'ALINITY', icon: '🧪' },
  { name: 'ELISAS', icon: '📁' },
  { name: 'HIV', icon: '🦠' },
  { name: 'GESTIÓN PENDIENTES', icon: '☁️' },
  { name: 'STOCK Z. FRÍA', icon: '🧊' },
  { name: 'CC', icon: '🎚️' },
  { name: 'ANOTACIONES', icon: '📝' },
  { name: 'PARÁSITO', icon: '🪲' },
  { name: 'SÍFILIS', icon: '🧬' },
]

function App() {
  return (
    <div className="lab-layout">
      <aside className="sidebar" aria-label="Navegación principal">
        <button type="button" className="nav-btn active">🏠</button>
        <button type="button" className="nav-btn">🧾</button>
        <button type="button" className="nav-btn">⚙️</button>
        <button type="button" className="nav-btn">⬇️</button>
        <button type="button" className="nav-btn">⚠️</button>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="brand">AppLabo · Laboratorio Central</div>
          <div className="user-pill">A</div>
        </header>

        <section className="content">
          <h1>HOME</h1>
          <div className="module-grid">
            {modules.map((module) => (
              <article key={module.name} className="module-card">
                <div className="module-icon" aria-hidden="true">{module.icon}</div>
                <p>{module.name}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
