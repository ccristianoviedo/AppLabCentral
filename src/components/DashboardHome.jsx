import { useMemo, useState } from 'react'
import ModuleCard from './ModuleCard'

function DashboardHome({ modules }) {
  const [query, setQuery] = useState('')

  const filteredModules = useMemo(() => {
    const text = query.toLowerCase().trim()
    if (!text) return modules

    return modules.filter((module) => (
      module.name.toLowerCase().includes(text)
      || module.detail.toLowerCase().includes(text)
      || module.section.toLowerCase().includes(text)
    ))
  }, [modules, query])

  return (
    <main className="content">
      <header className="topbar">
        <div className="top-actions">🔔 <span className="badge">3</span></div>
        <div className="top-avatar">LC</div>
      </header>

      <section className="header">
        <div>
          <h1>Panel principal</h1>
          <p>Gestión central del laboratorio</p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar módulos, muestras, pacientes..."
          aria-label="Buscar módulo"
        />
      </section>

      <section className="cards-grid" aria-label="Módulos">
        {filteredModules.map((module) => (
          <ModuleCard key={module.name} module={module} />
        ))}
      </section>

      <footer className="footer">AppLabo Central v1.0.0 · Laboratorio Clínico · Confidencial</footer>
    </main>
  )
}

export default DashboardHome
