import { useEffect, useMemo, useState } from 'react'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

function SheetTableView({ title, sheetName, onBack }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!APPS_SCRIPT_URL) {
      setError('Falta configurar VITE_APPS_SCRIPT_URL para consumir Google Sheets vía Apps Script.')
      setLoading(false)
      return
    }

    const url = `${APPS_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`
    setLoading(true)
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('No se pudo leer la hoja')
        return r.json()
      })
      .then((json) => {
        if (!Array.isArray(json.rows)) throw new Error('Respuesta inválida del Apps Script')
        setRows(json.rows)
        setError('')
      })
      .catch(() => setError('No se pudo cargar la hoja desde Apps Script. Verificá despliegue y permisos.'))
      .finally(() => setLoading(false))
  }, [sheetName])

  const headers = useMemo(() => (rows.length ? Object.keys(rows[0]) : []), [rows])

  return (
    <main className="content">
      <header className="topbar">
        <button type="button" className="crumb-btn" onClick={onBack}>ALINITY</button>
        <span className="crumb-sep">›</span>
        <strong>{title}</strong>
      </header>

      <section className="sheet-wrap">
        <p className="sheet-source">Origen: Apps Script → Google Sheets | Hoja: {sheetName}</p>
        {loading && <p className="sheet-source">Cargando...</p>}
        {!loading && error ? (
          <p className="sheet-error">{error}</p>
        ) : (
          <table className="sheet-table">
            <thead>
              <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={`${sheetName}-${idx}`}>
                  {headers.map((h) => <td key={h}>{row[h] ?? '-'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default SheetTableView
