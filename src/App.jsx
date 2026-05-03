import './App.css'

const modules = [
  { name: 'ALINITY', icon: '🧪', detail: 'Analizador químico automatizado' },
  { name: 'ELISAS', icon: '🧫', detail: 'Panel inmunológico y serología' },
  { name: 'HIV', icon: '🦠', detail: 'Seguimiento y control VIH' },
  { name: 'GESTIÓN PENDIENTES', icon: '☁️', detail: 'Resultados y tareas por validar' },
  { name: 'STOCK Z. FRÍA', icon: '❄️', detail: 'Reactivos y cadena de frío' },
  { name: 'CC', icon: '🎚️', detail: 'Control de calidad interno' },
  { name: 'ANOTACIONES', icon: '📝', detail: 'Bitácora y observaciones críticas' },
  { name: 'PARÁSITO', icon: '🪲', detail: 'Registro parasitológico' },
  { name: 'SÍFILIS', icon: '🧬', detail: 'Pruebas treponémicas y no treponémicas' },
]

function App() {
  return (
    <div className="app-shell">
      <aside className="left-rail" aria-label="Navegación principal">
        <div className="logo-dot">LC</div>
        <button type="button" className="rail-btn active">⌂</button>
        <button type="button" className="rail-btn">◫</button>
        <button type="button" className="rail-btn">⌁</button>
        <button type="button" className="rail-btn">⚙</button>
      </aside>

      <main className="main-panel">
        <header className="header-bar">
          <div>
            <p className="micro">Plataforma científica</p>
            <h1>AppLabo · Laboratorio Central</h1>
          </div>
          <div className="status-chip">Online · 9 módulos</div>
        </header>

        <section className="module-grid">
          {modules.map((module) => (
            <article className="module-card" key={module.name}>
              <div className="module-top">
                <span className="module-icon" aria-hidden="true">{module.icon}</span>
                <span className="module-tag">Activo</span>
              </div>
              <h2>{module.name}</h2>
              <p>{module.detail}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
