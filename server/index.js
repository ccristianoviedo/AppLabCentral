import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Database from 'better-sqlite3'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const db = new Database(process.env.SQLITE_PATH || './server/stock.db')

db.exec(`
CREATE TABLE IF NOT EXISTS stock_movimientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  movimiento TEXT NOT NULL,
  tipo TEXT NOT NULL,
  reactivo TEXT NOT NULL,
  lote TEXT NOT NULL,
  vencimiento TEXT,
  cantidad REAL NOT NULL,
  cajas INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`)

const ALERTS_VTO_DAYS_WARN = Number(process.env.ALERTS_VTO_DAYS_WARN || 45)
const REACTIVO_QTY_THRESHOLDS = {
  aghbe: 200, 'anti hbe': 200, 'anti hbs': 400, 'cmv g': 400, 'cmv m': 400,
  'core m': 200, ebna: 400, 'ebv vca g': 400, 'ebv vca m': 400, 'hbc core': 3600,
  hbsag: 3600, hiv: 3600, 'rubeola g': 400, sifilis: 3600, 'vha g': 400, 'vha m': 400, vhc: 3000,
}

const normalizeName = (s = '') => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[-_/]+/g, ' ').replace(/\s+/g, ' ').trim()
const daysLeft = (value) => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  const t = new Date()
  const a = new Date(t.getFullYear(), t.getMonth(), t.getDate())
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return Math.floor((b - a) / 86400000)
}

app.post('/api/stock/inout', (req, res) => {
  try {
    const { fecha, movimiento, tipo, reactivo, lote, vencimiento, cantidad, cajas } = req.body
    const stmt = db.prepare(`INSERT INTO stock_movimientos (fecha,movimiento,tipo,reactivo,lote,vencimiento,cantidad,cajas) VALUES (?,?,?,?,?,?,?,?)`)
    stmt.run(fecha, movimiento, tipo, reactivo, lote, vencimiento || null, Number(cantidad), Number(cajas || 1))
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'No se pudo guardar movimiento en SQLite' })
  }
})

app.get('/api/stock/movimientos', (req, res) => {
  try {
    const { fecha } = req.query
    const rows = fecha
      ? db.prepare(`SELECT fecha,movimiento,tipo,reactivo,lote,cantidad,cajas FROM stock_movimientos WHERE fecha = ? ORDER BY id DESC`).all(fecha)
      : db.prepare(`SELECT fecha,movimiento,tipo,reactivo,lote,cantidad,cajas FROM stock_movimientos ORDER BY id DESC LIMIT 500`).all()
    res.json({ rows })
  } catch {
    res.status(500).json({ error: 'No se pudo leer movimientos' })
  }
})

app.get('/api/stock/resumen/:sheetKey', (req, res) => {
  try {
    const tipo = req.params.sheetKey.toUpperCase().slice(0, -1) // REACTIVOS -> REACTIVO
    const rows = db.prepare(`
      SELECT reactivo as nombre, lote,
      SUM(CASE WHEN movimiento='INGRESO' THEN cantidad ELSE -cantidad END) as stock_actual,
      MAX(vencimiento) as vencimiento
      FROM stock_movimientos
      WHERE UPPER(tipo)=?
      GROUP BY reactivo,lote
      ORDER BY reactivo,lote
    `).all(tipo)

    const totals = {}
    rows.forEach((r) => { const k = normalizeName(r.nombre); totals[k] = (totals[k] || 0) + Number(r.stock_actual || 0) })

    const formatted = rows.map((r) => {
      const total = totals[normalizeName(r.nombre)] || 0
      const thr = REACTIVO_QTY_THRESHOLDS[normalizeName(r.nombre)]
      const d = daysLeft(r.vencimiento)
      const alerts = []
      if (d !== null) { if (d <= 0) alerts.push('⚠️ VENCIDO'); else if (d <= ALERTS_VTO_DAYS_WARN) alerts.push(`VTO ${d} días`) }
      if (Number(r.stock_actual) === 0) alerts.push('🟥')
      if (typeof thr === 'number') {
        if (total === 0) alerts.push('🟥 SIN STOCK!')
        else if (total <= Math.floor(thr / 2)) alerts.push('🟥 CRÍTICO')
        else if (total <= thr) alerts.push('🟨 PEDIR')
      }
      return {
        [req.params.sheetKey.toUpperCase()]: r.nombre,
        LOTE: r.lote,
        'STOCK ACTUAL': Number(r.stock_actual || 0),
        VENCIMIENTO: r.vencimiento || '',
        ALERTA: alerts.join(' | '),
      }
    })

    res.json({ rows: formatted })
  } catch {
    res.status(500).json({ error: 'No se pudo generar resumen' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API SQLite listening on ${PORT}`))
