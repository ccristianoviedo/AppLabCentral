import { useEffect, useMemo, useState } from 'react'

function SheetTableView({ title, sheetName, onBack }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = `/api/stock/resumen/${encodeURIComponent(sheetName)}`
    setLoading(true)
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('No se pudo leer la hoja')
        return r.json()
      })
      .then((json) => {
        if (!Array.isArray(json.rows)) throw new Error('Respuesta inválida del servidor')
        setRows(json.rows)
        setError('')
      })
      .catch(() => setError('No se pudo cargar la hoja desde el backend. Verificá API/credenciales.'))
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
        <p className="sheet-source">Origen: React → Node/Express → Google Sheets API</p>
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
