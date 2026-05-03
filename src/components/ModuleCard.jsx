function ModuleCard({ module, onSelect }) {
  return (
    <article
      className="module-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(module)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(module)
        }
      }}
    >
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
