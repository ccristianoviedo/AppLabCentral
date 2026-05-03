const alinityOptions = [
  { name: 'IN-OUT', emoji: '📦' },
  { name: 'REACTIVOS', emoji: '🧪' },
  { name: 'CONTROLES', emoji: '🗂️' },
  { name: 'CALIBRADORES', emoji: '🧫' },
  { name: 'OnBoard', emoji: '🏷️' },
]

function AlinityModule({ onBack }) {
  return (
    <main className="content">
      <header className="topbar">
        <button type="button" className="crumb-btn" onClick={onBack}>HOME</button>
        <span className="crumb-sep">›</span>
        <strong>ALINITY</strong>
      </header>

      <section className="alinity-grid" aria-label="Opciones Alinity">
        {alinityOptions.map((item) => (
          <article key={item.name} className="alinity-card" role="button" tabIndex={0}>
            <div className="alinity-media">{item.emoji}</div>
            <p>{item.name}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default AlinityModule
