function ModuleCard({ module }) {
  return (
    <article className="module-card">
      <div className="card-top">
        <span className="icon" aria-hidden="true">{module.icon}</span>
        <div>
          <h2>{module.name}</h2>
          <small>{module.section}</small>
        </div>
      </div>
      <p>{module.detail}</p>
      <button type="button" className="open-btn">Abrir módulo <span aria-hidden="true">›</span></button>
    </article>
  )
}

export default ModuleCard
