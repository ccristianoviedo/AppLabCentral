import { useMemo, useState } from 'react'
import './App.css'

const modules = [
  { name: 'ALINITY', section: 'Procesamiento', detail: 'Analizador químico automatizado', icon: '⚗️' },
  { name: 'ELISAS', section: 'Procesamiento', detail: 'Panel inmunológico y serología', icon: '🧪' },
  { name: 'HIV', section: 'Serología', detail: 'Seguimiento y control VIH', icon: '🦠' },
  { name: 'GESTIÓN PENDIENTES', section: 'Gestión', detail: 'Resultados y tareas por validar', icon: '📋' },
  { name: 'STOCK Z. FRÍA', section: 'Stock', detail: 'Reactivos y cadena de frío', icon: '❄️' },
  { name: 'CC', section: 'Gestión', detail: 'Control de calidad interno', icon: '📈' },
  { name: 'ANOTACIONES', section: 'Gestión', detail: 'Bitácora y observaciones críticas', icon: '📝' },
  { name: 'PARÁSITO', section: 'Serología', detail: 'Registro parasitológico', icon: '🔬' },
  { name: 'SÍFILIS', section: 'Serología', detail: 'Pruebas treponémicas y no treponémicas', icon: '🧬' },
]

const navItems = ['Inicio', 'Serología', 'Procesamiento', 'Gestión', 'Stock', 'Reportes', 'Configuración']

function App() {
  const [query, setQuery] = useState('')

  const filteredModules = useMemo(() => {
    const text = query.toLowerCase().trim()
    if (!text) return modules

    return modules.filter((module) => {
      return (
        module.name.toLowerCase().includes(text) ||
        module.detail.toLowerCase().includes(text) ||
        module.section.toLowerCase().includes(text)
      )
    })
  }, [query])

  return (
    <div className="layout">
      <aside className="sidebar" aria-label="Menú principal">
        <div className="brand">AppLabo<br />Central</div>
        <nav>
          {navItems.map((item, idx) => (
            <button key={item} type="button" className={`menu-item ${idx === 0 ? 'active' : ''}`}>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="header">
          <div>
            <h1>Panel principal</h1>
            <p>Gestión central del laboratorio</p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar módulo..."
            aria-label="Buscar módulo"
          />
        </header>

        <section className="cards-grid" aria-label="Módulos">
          {filteredModules.map((module) => (
            <article key={module.name} className="module-card">
              <span className="icon" aria-hidden="true">{module.icon}</span>
              <h2>{module.name}</h2>
              <small>{module.section}</small>
              <p>{module.detail}</p>
              <button type="button" className="open-btn">Abrir módulo</button>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
