export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') // YYYY-MM-DD

  if (!date) {
    return new Response(JSON.stringify({ error: 'date param required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const [y, m, d] = date.split('-')
  const dd = d.padStart(2, '0')
  const mm = m.padStart(2, '0')
  const cbrUrl = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${dd}/${mm}/${y}`

  try {
    const res = await fetch(cbrUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!res.ok) throw new Error(`CBR HTTP ${res.status}`)
    const xml = await res.text()

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=windows-1251',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=3600',
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}
