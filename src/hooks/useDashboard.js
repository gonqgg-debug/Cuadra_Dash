import { useState, useEffect, useCallback } from "react"

const SERVER = import.meta.env.VITE_SERVER_URL || "https://cuadrainsurance-production.up.railway.app"

const MOCK_EVENTS = [
  { id: "e1", canal: "whatsapp", tool: "cotizador", summary: "Cotización auto - Juan Pérez", timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: "e2", canal: "chatgpt", tool: "asistente", summary: "Consulta cobertura hogar", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: "e3", canal: "website", tool: "landing", summary: "Lead desde formulario contacto", timestamp: new Date(Date.now() - 420000).toISOString() },
  { id: "e4", canal: "agente", tool: "fnol", summary: "Reporte siniestro #4521", timestamp: new Date(Date.now() - 600000).toISOString() },
]

export function useDashboard() {
  const [events, setEvents] = useState(MOCK_EVENTS)
  const [kpis, setKpis] = useState({
    cotizaciones: 142,
    siniestros: 8,
    leads: 89,
    conversion: 0.182,
    primaPromedio: 12500,
    intentScore: 78,
    cac: 85,
    leadsSinCerrar: 12,
  })
  const [historico, setHistorico] = useState([])
  const [connected, setConnected] = useState(false)
  const [flashKeys, setFlashKeys] = useState(new Set())

  const activateFlash = useCallback((key) => {
    setFlashKeys((prev) => new Set(prev).add(key))
    setTimeout(() => {
      setFlashKeys((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }, 1000)
  }, [])

  // Fetch KPIs
  useEffect(() => {
    if (!SERVER) return

    const fetchStats = async () => {
      try {
        const res = await fetch(`${SERVER}/dashboard/stats`)
        if (res.ok) {
          const data = await res.json()
          setKpis((prev) => ({
            ...prev,
            ...data,
          }))
        }
      } catch (err) {
        console.warn("Dashboard stats fetch failed:", err)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // SSE events
  useEffect(() => {
    if (!SERVER) return

    const url = `${SERVER}/events`
    const es = new EventSource(url)

    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)

    es.addEventListener("event", (e) => {
      try {
        const data = JSON.parse(e.data)
        setEvents((prev) => [data, ...prev].slice(0, 50))
        setHistorico((prev) => [data, ...prev].slice(0, 100))

        if (data.tipo === "cotizacion") {
          setKpis((prev) => ({ ...prev, cotizaciones: prev.cotizaciones + 1 }))
          activateFlash("cotizaciones")
        }
        if (data.tipo === "siniestro") {
          setKpis((prev) => ({ ...prev, siniestros: prev.siniestros + 1 }))
          activateFlash("siniestros")
        }
      } catch (err) {
        console.warn("SSE parse error:", err)
      }
    })

    return () => {
      es.close()
      setConnected(false)
    }
  }, [activateFlash])

  return {
    events,
    kpis,
    historico,
    connected,
    flash: (key) => flashKeys.has(key),
  }
}
