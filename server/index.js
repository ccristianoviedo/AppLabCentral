import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { google } from 'googleapis'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const CFG = {
  summarySheetId: process.env.GOOGLE_SHEETS_ID,
  ingresosSheetId: process.env.SS_INGRESOS_ID,
  salidasSheetId: process.env.SS_SALIDAS_ID,
  ingresosSheetName: process.env.HOJA_INGRESOS || 'STOCK INGRESOS',
  salidasSheetName: process.env.HOJA_SALIDAS || 'STOCK SALIDAS',
}

const SHEET_MAP = { REACTIVOS: 'REACTIVOS', CONTROLES: 'CONTROLES', CALIBRADORES: 'CALIBRADORES' }

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const sheets = google.sheets({ version: 'v4', auth })


const ALERTS_VTO_DAYS_WARN = Number(process.env.ALERTS_VTO_DAYS_WARN || 45)
const ALERTS_COVERAGE_DAYS_WARN = Number(process.env.ALERTS_COVERAGE_DAYS_WARN || 10)
const REACTIVO_QTY_THRESHOLDS = {
  aghbe: 200, 'anti hbe': 200, 'anti hbs': 400, 'cmv g': 400, 'cmv m': 400,
  'core m': 200, ebna: 400, 'ebv vca g': 400, 'ebv vca m': 400, 'hbc core': 3600,
  hbsag: 3600, hiv: 3600, 'rubeola g': 400, sifilis: 3600, 'vha g': 400, 'vha m': 400, vhc: 3000,
}

function normalizeName(s=''){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[-_/]+/g,' ').replace(/\s+/g,' ').trim()}
function parseDate(value){const d=new Date(value); return Number.isNaN(d.getTime())?null:d}
function daysLeft(v){const d=parseDate(v); if(!d) return null; const t=new Date(); const a=new Date(t.getFullYear(),t.getMonth(),t.getDate()); const b=new Date(d.getFullYear(),d.getMonth(),d.getDate()); return Math.floor((b-a)/86400000)}
function buildAlert(row,totalByName){
  const msgs=[]
  const d=daysLeft(row['VENCIMIENTO'])
  if(d!==null){ if(d<=0) msgs.push('⚠️ VENCIDO'); else if(d<=ALERTS_VTO_DAYS_WARN) msgs.push(`VTO ${d} días`) }
  const stock=Number(row['STOCK ACTUAL']||0)
  if(stock===0) msgs.push('🟥')
  const key=normalizeName(row['REACTIVOS']||row['CONTROLES']||row['CALIBRADORES']||'')
  const thr=REACTIVO_QTY_THRESHOLDS[key]
  const total=totalByName[key]||0
  if(typeof thr==='number'){ if(total===0) msgs.push('🟥 SIN STOCK!'); else if(total<=Math.floor(thr/2)) msgs.push('🟥 CRÍTICO'); else if(total<=thr) msgs.push('🟨 PEDIR') }
  return msgs.join(' | ')
}

function toObjects(values = []) {
  if (!values.length) return []
  const [headers, ...rows] = values
  return rows.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])))
}

app.get('/api/sheets/:sheetKey', async (req, res) => {
  try {
    const sheetName = SHEET_MAP[req.params.sheetKey.toUpperCase()]
    if (!sheetName) return res.status(400).json({ error: 'Hoja no soportada' })
    const r = await sheets.spreadsheets.values.get({ spreadsheetId: CFG.summarySheetId, range: `${sheetName}!A1:Z2000` })
    res.json({ rows: toObjects(r.data.values || []) })
  } catch {
    res.status(500).json({ error: 'Error al leer Google Sheets' })
  }
})

app.post('/api/stock/inout', async (req, res) => {
  try {
    const { fecha, movimiento, tipo, reactivo, lote, vencimiento, cantidad, cajas } = req.body
    const targetSheetId = movimiento === 'INGRESO' ? CFG.ingresosSheetId : CFG.salidasSheetId
    const targetSheet = movimiento === 'INGRESO' ? CFG.ingresosSheetName : CFG.salidasSheetName

    const row = movimiento === 'INGRESO'
      ? [fecha, tipo, reactivo, lote, vencimiento, cantidad, '']
      : [fecha, reactivo, tipo, lote, cantidad, '', '']

    await sheets.spreadsheets.values.append({
      spreadsheetId: targetSheetId,
      range: `${targetSheet}!A:G`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    })

    res.json({ ok: true, movimiento: { fecha, movimiento, tipo, reactivo, lote, vencimiento, cantidad, cajas } })
  } catch {
    res.status(500).json({ error: 'No se pudo guardar movimiento en Sheets' })
  }
})

app.get('/api/stock/movimientos', async (req, res) => {
  try {
    const { fecha } = req.query
    const [ing, sal] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId: CFG.ingresosSheetId, range: `${CFG.ingresosSheetName}!A1:G2000` }),
      sheets.spreadsheets.values.get({ spreadsheetId: CFG.salidasSheetId, range: `${CFG.salidasSheetName}!A1:G2000` }),
    ])

    const ingresos = (ing.data.values || []).slice(1).map((r) => ({ fecha: r[0], movimiento: 'INGRESO', tipo: r[1], reactivo: r[2], lote: r[3], cantidad: r[5], cajas: '' }))
    const salidas = (sal.data.values || []).slice(1).map((r) => ({ fecha: r[0], movimiento: 'SALIDA', tipo: r[2], reactivo: r[1], lote: r[3], cantidad: r[4], cajas: '' }))
    const all = [...ingresos, ...salidas].filter((x) => (!fecha || x.fecha === fecha))
    res.json({ rows: all })
  } catch {
    res.status(500).json({ error: 'No se pudo leer movimientos' })
  }
})


app.get('/api/stock/resumen/:sheetKey', async (req, res) => {
  try {
    const sheetName = SHEET_MAP[req.params.sheetKey.toUpperCase()]
    if (!sheetName) return res.status(400).json({ error: 'Hoja no soportada' })
    const r = await sheets.spreadsheets.values.get({ spreadsheetId: CFG.summarySheetId, range: `${sheetName}!A1:Z2000` })
    const rows = toObjects(r.data.values || [])
    const nameCol = sheetName === 'REACTIVOS' ? 'REACTIVOS' : sheetName
    const totalByName = {}
    rows.forEach((row) => { const k = normalizeName(row[nameCol]); totalByName[k] = (totalByName[k] || 0) + Number(row['STOCK ACTUAL'] || 0) })
    const rowsWithAlerts = rows.map((row) => ({ ...row, ALERTA: buildAlert(row, totalByName) }))
    res.json({ rows: rowsWithAlerts, meta: { vtoWarnDays: ALERTS_VTO_DAYS_WARN, coverageWarnDays: ALERTS_COVERAGE_DAYS_WARN } })
  } catch {
    res.status(500).json({ error: 'Error al generar resumen' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API listening on ${PORT}`))
