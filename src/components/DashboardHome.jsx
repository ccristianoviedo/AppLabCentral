import { useMemo, useState } from 'react'
import ModuleCard from './ModuleCard'

function DashboardHome({ modules }) {
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
  }, [modules, query])

  return (
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
          <ModuleCard key={module.name} module={module} />
        ))}
      </section>
    </main>
  )
}

export default DashboardHome
