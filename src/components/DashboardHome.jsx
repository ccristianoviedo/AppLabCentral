import ModuleCard from './ModuleCard'

function DashboardHome({ modules, onModuleSelect }) {
  return (
    <main className="content">
      <header className="topbar">
        <div className="top-actions">🔔 <span className="badge">3</span></div>
        <div className="top-avatar">LC</div>
      </header>

      <section className="cards-grid" aria-label="Módulos">
        {modules.map((module) => (
          <ModuleCard key={module.name} module={module} onSelect={onModuleSelect} />
        ))}
      </section>

      <footer className="footer">AppLabo Central v1.0.0 · Laboratorio Clínico · Confidencial</footer>
    </main>
  )
}

export default DashboardHome
