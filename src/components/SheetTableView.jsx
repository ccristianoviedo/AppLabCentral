import { useEffect, useMemo, useState } from 'react'

const SHEET_ID = '17bsID3RXNAwHtDJWWDHELh9M4FP-EsmVNj97itfuEcA'

function csvToRows(csvText) {
  const lines = csvText.trim().split('\n')
  return lines.map((line) => line.split(',').map((cell) => cell.replace(/^"|"$/g, '').trim()))
}

function SheetTableView({ title, sheetName, onBack }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('No se pudo leer la hoja')
        return r.text()
      })
      .then((csv) => setRows(csvToRows(csv)))
      .catch(() => setError('No se pudo cargar la hoja. Verificá permisos de publicación en Google Sheets.'))
  }, [sheetName])

  const headers = useMemo(() => (rows.length ? rows[0] : []), [rows])
  const dataRows = useMemo(() => (rows.length > 1 ? rows.slice(1) : []), [rows])

  return (
    <main className="content">
      <header className="topbar">
        <button type="button" className="crumb-btn" onClick={onBack}>ALINITY</button>
        <span className="crumb-sep">›</span>
        <strong>{title}</strong>
      </header>

      <section className="sheet-wrap">
        <p className="sheet-source">Hoja: {sheetName} · ID: {SHEET_ID}</p>
        {error ? (
          <p className="sheet-error">{error}</p>
        ) : (
          <table className="sheet-table">
            <thead>
              <tr>{headers.map((h) => <th key={h}>{h || '-'}</th>)}</tr>
            </thead>
            <tbody>
              {dataRows.map((row, idx) => (
                <tr key={`${sheetName}-${idx}`}>
                  {headers.map((_, i) => <td key={i}>{row[i] || '-'}</td>)}
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
