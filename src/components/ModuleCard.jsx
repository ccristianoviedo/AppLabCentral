function ModuleCard({ module }) {
  return (
    <article className="module-card" role="button" tabIndex={0}>
      <div className="card-top">
        <span className="icon" aria-hidden="true">{module.icon}</span>
        <div>
          <h2>{module.name}</h2>
          <small>{module.section}</small>
        </div>
      </div>
    </article>
  )
}

export default ModuleCard
