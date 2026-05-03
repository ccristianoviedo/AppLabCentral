const alinityOptions = [
  { name: 'IN-OUT', emoji: '📦', key: 'inout' },
  { name: 'REACTIVOS', emoji: '🧪', key: 'reactivos' },
  { name: 'CONTROLES', emoji: '🗂️', key: 'controles' },
  { name: 'CALIBRADORES', emoji: '🧫', key: 'calibradores' },
  { name: 'OnBoard', emoji: '🏷️', key: 'onboard' },
]

function AlinityModule({ onBack, onOpen }) {
  return (
    <main className="content">
      <header className="topbar">
        <button type="button" className="crumb-btn" onClick={onBack}>HOME</button>
        <span className="crumb-sep">›</span>
        <strong>ALINITY</strong>
      </header>

      <section className="alinity-grid" aria-label="Opciones Alinity">
        {alinityOptions.map((item) => (
          <article key={item.name} className="alinity-card" role="button" tabIndex={0} onClick={() => onOpen(item.key)}>
            <div className="alinity-media">{item.emoji}</div>
            <p>{item.name}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default AlinityModule
