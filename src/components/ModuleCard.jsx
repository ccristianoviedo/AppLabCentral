function ModuleCard({ module }) {
  return (
    <article className="module-card">
      <span className="icon" aria-hidden="true">{module.icon}</span>
      <h2>{module.name}</h2>
      <small>{module.section}</small>
      <p>{module.detail}</p>
      <button type="button" className="open-btn">Abrir módulo</button>
    </article>
  )
}

export default ModuleCard
