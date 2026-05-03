import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { google } from 'googleapis'

dotenv.config()

const app = express()
app.use(cors())

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID
const SHEET_MAP = {
  REACTIVOS: 'REACTIVOS',
  CONTROLES: 'CONTROLES',
  CALIBRADORES: 'CALIBRADORES',
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

const sheets = google.sheets({ version: 'v4', auth })

app.get('/api/sheets/:sheetKey', async (req, res) => {
  try {
    const key = req.params.sheetKey.toUpperCase()
    const sheetName = SHEET_MAP[key]
    if (!sheetName) return res.status(400).json({ error: 'Hoja no soportada' })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:Z1000`,
    })

    const values = response.data.values || []
    if (values.length === 0) return res.json({ rows: [] })

    const [headers, ...data] = values
    const rows = data.map((row) => {
      const obj = {}
      headers.forEach((h, i) => {
        obj[h] = row[i] ?? ''
      })
      return obj
    })

    res.json({ rows })
  } catch (error) {
    res.status(500).json({ error: 'Error al leer Google Sheets' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API listening on ${PORT}`))
