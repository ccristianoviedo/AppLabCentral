import { useEffect, useState } from 'react'

const today = new Date().toISOString().slice(0, 10)

function InOutModule({ onBack }) {
  const [form, setForm] = useState({ fecha: today, movimiento: 'SALIDA', tipo: 'REACTIVOS', reactivo: '', lote: '', vencimiento: '', cantidad: '', cajas: 1 })
  const [movements, setMovements] = useState([])
  const [msg, setMsg] = useState('')

  const loadMovements = async (fecha) => {
    const r = await fetch(`/api/stock/movimientos?fecha=${encodeURIComponent(fecha)}`)
    const j = await r.json()
    setMovements(j.rows || [])
  }

  useEffect(() => { loadMovements(form.fecha) }, [form.fecha])

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setMsg('')
    const r = await fetch('/api/stock/inout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!r.ok) return setMsg('Error al guardar en Google Sheets')
    setMsg('Movimiento guardado ✅')
    setForm((prev) => ({ ...prev, reactivo: '', lote: '', vencimiento: '', cantidad: '', cajas: 1 }))
    loadMovements(form.fecha)
  }

  return (
    <main className="content">
      <header className="topbar"><button type="button" className="crumb-btn" onClick={onBack}>ALINITY</button><span className="crumb-sep">›</span><strong>IN-OUT</strong></header>
      <section className="inout-wrap">
        <form className="inout-form" onSubmit={submit}>
          <label>FECHA<input type="date" value={form.fecha} onChange={(e) => update('fecha', e.target.value)} /></label>
          <label>MOVIMIENTO<select value={form.movimiento} onChange={(e) => update('movimiento', e.target.value)}><option>SALIDA</option><option>INGRESO</option></select></label>
          <label>TIPO<select value={form.tipo} onChange={(e) => update('tipo', e.target.value)}><option>REACTIVOS</option><option>CONTROLES</option><option>CALIBRADORES</option></select></label>
          <label>REACTIVO<input value={form.reactivo} onChange={(e) => update('reactivo', e.target.value)} required /></label>
          <label>LOTE<input value={form.lote} onChange={(e) => update('lote', e.target.value)} required /></label>
          <label>VENCIMIENTO<input type="date" value={form.vencimiento} onChange={(e) => update('vencimiento', e.target.value)} /></label>
          <label>CANTIDAD<input value={form.cantidad} onChange={(e) => update('cantidad', e.target.value)} required /></label>
          <label>CAJAS<input type="number" min="1" value={form.cajas} onChange={(e) => update('cajas', Number(e.target.value))} /></label>
          <button className="save-btn" type="submit">Guardar movimiento</button>
          {msg && <small>{msg}</small>}
        </form>

        <div className="movements"><h3>Movimientos del día ({form.fecha})</h3>
          <table><thead><tr><th>Mov.</th><th>Tipo</th><th>Reactivo</th><th>Lote</th><th>Cantidad</th></tr></thead>
            <tbody>{movements.length === 0 ? <tr><td colSpan="5">Sin movimientos cargados.</td></tr> : movements.map((item, idx) => <tr key={idx}><td>{item.movimiento}</td><td>{item.tipo}</td><td>{item.reactivo}</td><td>{item.lote}</td><td>{item.cantidad}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default InOutModule
