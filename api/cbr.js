export default async function handler(req, res) {
  const { date } = req.query
  if (!date) return res.status(400).json({ error: 'date param required' })

  const [y, m, d] = date.split('-')
  const dd = String(d).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  const cbrUrl = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${dd}/${mm}/${y}`

  try {
    const response = await fetch(cbrUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    if (!response.ok) throw new Error(`CBR HTTP ${response.status}`)
    const xml = await response.text()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=3600')
    res.setHeader('Content-Type', 'text/xml; charset=windows-1251')
    res.status(200).send(xml)
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(502).json({ error: e.message })
  }
}
