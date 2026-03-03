import { useMemo } from "react"

const CANALES = ["chatgpt", "whatsapp", "website", "agente"]

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[random(0, arr.length - 1)]
}

export function useMockData() {
  return useMemo(() => {
    const now = new Date()
    const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const ayer = new Date(hoy)
    ayer.setDate(ayer.getDate() - 1)

    const hourlyHoyAyer = Array.from({ length: 24 }, (_, h) => {
      const baseHoy = random(40, 120)
      const baseAyer = Math.round(baseHoy * (random(70, 130) / 100))
      return {
        hora: `${h.toString().padStart(2, "0")}:00`,
        hoy: baseHoy + random(-15, 15),
        ayer: baseAyer,
      }
    })

    const canalKpis = CANALES.map((c) => ({
      canal: c,
      cotizaciones: random(80, 450),
      leads: random(120, 600),
      cac: random(45, 180),
      conversion: (random(8, 28) / 100).toFixed(2),
    }))

    const pipelineLeads = [
      { etapa: "Nuevo", count: random(120, 280), color: "blue" },
      { etapa: "Contactado", count: random(80, 180), color: "purple" },
      { etapa: "Cotizado", count: random(50, 120), color: "amber" },
      { etapa: "Negociación", count: random(25, 70), color: "orange" },
      { etapa: "Ganado", count: random(15, 45), color: "emerald" },
    ]

    const crossSellPairs = [
      { producto: "Auto", crossSell: "Hogar", tasa: random(12, 28) },
      { producto: "Hogar", crossSell: "Vida", tasa: random(8, 22) },
      { producto: "Vida", crossSell: "GMM", tasa: random(15, 35) },
      { producto: "Auto", crossSell: "GMM", tasa: random(10, 25) },
    ]

    const objeciones = [
      { objecion: "Muy caro", count: random(45, 120), tendencia: random(-5, 5) },
      { objecion: "Ya tengo cobertura", count: random(30, 90), tendencia: random(-3, 3) },
      { objecion: "Necesito pensarlo", count: random(55, 140), tendencia: random(-8, 2) },
      { objecion: "Comparar con otros", count: random(25, 75), tendencia: random(-2, 6) },
    ]

    const siniestros = Array.from({ length: random(8, 18) }, (_, i) => {
      const tipos = ["Colisión", "Robo", "Daño material", "Responsabilidad civil"]
      const estados = ["Reportado", "En evaluación", "Aprobado", "Pagado"]
      const estado = pick(estados)
      const d = new Date()
      d.setHours(d.getHours() - random(1, 72))
      const slaRiesgo = i < 4 && (estado === "Reportado" || estado === "En evaluación")
      return {
        id: `s-${i + 1}`,
        tipo: pick(tipos),
        estado,
        monto: random(5000, 85000),
        fecha: d.toISOString(),
        canal: pick(CANALES),
        slaRiesgo,
      }
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    const siniestrosActivos = siniestros.filter((s) => s.estado !== "Pagado").length
    const siniestrosSlaRiesgo = siniestros.filter((s) => s.slaRiesgo).length

    const totalObjeciones = objeciones.reduce((sum, o) => sum + o.count, 0)
    const objecion1 = objeciones[0]
    const objecion1Porcentaje = totalObjeciones > 0
      ? Math.round((objecion1.count / totalObjeciones) * 100)
      : 0

    const crossSellRate = Math.round(
      crossSellPairs.reduce((sum, p) => sum + p.tasa, 0) / crossSellPairs.length
    )

    const insightDia = [
      "Los leads por WhatsApp subieron 23% vs ayer. Mejor horario: 14-16h.",
      "CAC en website bajó 12% tras optimización de landing.",
      "3 siniestros críticos pendientes de evaluación > 24h.",
      "Conversión chatgpt hoy: 18.2%, +2.1pp vs promedio semanal.",
      "El canal ChatGPT generó un ticket promedio 43% más alto que website con 4x menos costo por cotización.",
    ]

    return {
      hourlyHoyAyer,
      canalKpis,
      pipelineLeads,
      crossSellPairs,
      objeciones,
      siniestros,
      siniestrosActivos,
      siniestrosSlaRiesgo,
      objecion1: {
        texto: objecion1.objecion,
        porcentaje: objecion1Porcentaje,
      },
      crossSellRate,
      insightDia,
    }
  }, [])
}
