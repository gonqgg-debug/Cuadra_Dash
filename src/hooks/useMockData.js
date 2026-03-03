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

    const step0 = random(450, 650)
    const step1 = random(280, 380)
    const step2 = random(180, 250)
    const step3 = random(120, 180)
    const step4 = random(80, 140)

    const funnelSteps = [
      { etapa: "Cotizaciones", count: step0, pct: 100 },
      { etapa: "Vieron precio", count: step1, pct: Math.round((step1 / step0) * 100) },
      { etapa: "Click en Cotizar", count: step2, pct: Math.round((step2 / step0) * 100) },
      { etapa: "Click en Contratar", count: step3, pct: Math.round((step3 / step0) * 100) },
      { etapa: "Firmaron póliza", count: step4, pct: Math.round((step4 / step0) * 100) },
    ]

    const funnelData = {
      todos: funnelSteps.map((s) => ({
        paso: s.etapa,
        count: s.count,
        pct: s.pct,
      })),
      website: funnelSteps.map((s, i) => ({
        paso: s.etapa,
        count: Math.round(s.count * (random(80, 120) / 100)),
        pct: i === 0 ? 100 : random(55, 75),
      })),
      whatsapp: funnelSteps.map((s, i) => ({
        paso: s.etapa,
        count: Math.round(s.count * (random(90, 110) / 100)),
        pct: i === 0 ? 100 : random(60, 80),
      })),
      chatgpt: funnelSteps.map((s, i) => ({
        paso: s.etapa,
        count: Math.round(s.count * (random(85, 115) / 100)),
        pct: i === 0 ? 100 : random(58, 78),
      })),
      agentes: funnelSteps.map((s, i) => ({
        paso: s.etapa,
        count: Math.round(s.count * (random(70, 120) / 100)),
        pct: i === 0 ? 100 : random(50, 70),
      })),
    }

    const mixProductos = [
      { nombre: "Auto", pct: 68 },
      { nombre: "Hogar", pct: 21 },
      { nombre: "Viaje", pct: 11 },
    ]

    const crossSellPairs = [
      { producto: "Auto", crossSell: "Hogar", tasa: random(12, 28) },
      { producto: "Hogar", crossSell: "Vida", tasa: random(8, 22) },
      { producto: "Vida", crossSell: "GMM", tasa: random(15, 35) },
      { producto: "Auto", crossSell: "GMM", tasa: random(10, 25) },
    ]

    const crossSellTableData = [
      { combo: "Auto + Hogar", polizas: 142, prima: 14200 },
      { combo: "Auto + Viaje", polizas: 89, prima: 11800 },
      { combo: "Hogar + Viaje", polizas: 31, prima: 8900 },
    ]

    const objeciones = [
      { objecion: "Muy caro", count: random(45, 120), tendencia: random(-5, 5) },
      { objecion: "Ya tengo cobertura", count: random(30, 90), tendencia: random(-3, 3) },
      { objecion: "Necesito pensarlo", count: random(55, 140), tendencia: random(-8, 2) },
      { objecion: "Comparar con otros", count: random(25, 75), tendencia: random(-2, 6) },
    ]

    const MOCK_SINIESTROS = [
      {
        folio: "SIN-2026-00921",
        tipo: "colision",
        poliza: "POL-48821",
        zona: "CDMX Polanco",
        canalFnol: "whatsapp",
        severidad: "media",
        reserva: 45000,
        descripcion: "Choque en Insurgentes esquina Chapultepec.",
        lesionados: false,
        estado: "en_documentacion",
        completitud: 60,
        horasAbiertas: 2,
        timeline: [
          { paso: "Reporte levantado", status: "completado", hora: "12:48" },
          { paso: "Ajustador asignado", status: "en_proceso", hora: null },
          { paso: "Documentación completa", status: "pendiente", hora: null },
          { paso: "Valuación", status: "pendiente", hora: null },
          { paso: "Resolución", status: "pendiente", hora: null },
        ],
        documentos: [
          "Descripción ✅",
          "Datos tercero ✅",
          "Fotos del daño ⬜",
          "Parte policial ⬜",
        ],
      },
      {
        folio: "SIN-2026-00918",
        tipo: "dano",
        poliza: "POL-71209",
        zona: "CDMX Tlalpan",
        canalFnol: "website",
        severidad: "menor",
        reserva: 22000,
        descripcion: "Granizo dañó el cofre y techo del vehículo.",
        lesionados: false,
        estado: "en_valuacion",
        completitud: 90,
        horasAbiertas: 51,
        timeline: [
          { paso: "Reporte levantado", status: "completado", hora: "09:15" },
          { paso: "Ajustador asignado", status: "completado", hora: "11:30" },
          { paso: "Documentación completa", status: "completado", hora: "14:00" },
          { paso: "Valuación", status: "en_proceso", hora: null },
          { paso: "Resolución", status: "pendiente", hora: null },
        ],
        documentos: [
          "Descripción ✅",
          "Fotos del daño ✅",
          "Reporte taller ✅",
        ],
      },
      {
        folio: "SIN-2026-00920",
        tipo: "robo",
        poliza: "POL-33104",
        zona: "CDMX Iztapalapa",
        canalFnol: "chatgpt",
        severidad: "total",
        reserva: 185000,
        descripcion: "Robo de vehículo en estacionamiento público.",
        lesionados: false,
        estado: "en_documentacion",
        completitud: 40,
        horasAbiertas: 5,
        timeline: [
          { paso: "Reporte levantado", status: "completado", hora: "08:20" },
          { paso: "Ajustador asignado", status: "en_proceso", hora: null },
          { paso: "Documentación completa", status: "pendiente", hora: null },
          { paso: "Valuación", status: "pendiente", hora: null },
          { paso: "Resolución", status: "pendiente", hora: null },
        ],
        documentos: ["Descripción ✅", "Denuncia MP ⬜", "Fotos ⬜"],
      },
    ]

    const fnolMetricas = {
      tiempoReporte: { digital: 4, callCenter: 22, unidad: "min" },
      completitudPrimerReporte: { digital: 87, callCenter: 52 },
      costoPorFnol: { digital: 18, callCenter: 120 },
      slaCumplimiento: { digital: 94, callCenter: 71 },
    }

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

    const comparativaCanales = [
      { canal: "Website", cotizaciones: 412, conversion: 52, tiempoProm: "4.2m", ticketProm: 1847, intentScore: 58, cierreDias: 2.8, crossSell: 12 },
      { canal: "WhatsApp", cotizaciones: 298, conversion: 61, tiempoProm: "3.1m", ticketProm: 1920, intentScore: 71, cierreDias: 1.8, crossSell: 22 },
      { canal: "ChatGPT", cotizaciones: 156, conversion: 48, tiempoProm: "5.8m", ticketProm: 2100, intentScore: 68, cierreDias: 2.4, crossSell: 15 },
      { canal: "Agentes", cotizaciones: 89, conversion: 72, tiempoProm: "2.4m", ticketProm: 2250, intentScore: 75, cierreDias: 1.2, crossSell: 28 },
    ]

    const kpiDataByCanal = {
      todos: { cotizaciones: 955, primaPromedio: 2029, conversion: 58, cac: 25 },
      website: { cotizaciones: 412, primaPromedio: 1847, conversion: 52, cac: 18 },
      whatsapp: { cotizaciones: 298, primaPromedio: 1920, conversion: 61, cac: 9 },
      chatgpt: { cotizaciones: 156, primaPromedio: 2100, conversion: 48, cac: 4 },
      agentes: { cotizaciones: 89, primaPromedio: 2250, conversion: 72, cac: 85 },
    }

    const historico30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      const base = { website: 12, whatsapp: 9, chatgpt: 5, agente: 3 }
      return {
        fecha: d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
        website: base.website + random(-3, 4),
        whatsapp: base.whatsapp + random(-2, 3),
        chatgpt: base.chatgpt + random(-1, 2),
        agente: base.agente + random(-1, 1),
      }
    })

    const horaBase = (h) => {
      if (h >= 10 && h <= 18) return random(8, 18)
      if (h >= 8 && h <= 20) return random(3, 10)
      return random(0, 4)
    }
    const websiteH = Array.from({ length: 24 }, (_, h) => ({ hora: `${h.toString().padStart(2, "0")}:00`, count: horaBase(h) }))
    const whatsappH = Array.from({ length: 24 }, (_, h) => ({ hora: `${h.toString().padStart(2, "0")}:00`, count: horaBase(h) + random(0, 2) }))
    const chatgptH = Array.from({ length: 24 }, (_, h) => ({ hora: `${h.toString().padStart(2, "0")}:00`, count: Math.max(0, horaBase(h) - 2) }))
    const agentesH = Array.from({ length: 24 }, (_, h) => ({ hora: `${h.toString().padStart(2, "0")}:00`, count: Math.max(0, horaBase(h) - 4) }))
    const horaDistribucion = {
      todos: websiteH.map((r, i) => ({ hora: r.hora, count: r.count + whatsappH[i].count + chatgptH[i].count + agentesH[i].count })),
      website: websiteH,
      whatsapp: whatsappH,
      chatgpt: chatgptH,
      agentes: agentesH,
    }

    const cohortes = [
      { mes: "Sep 2025", clientes: 142, mes1: 94, mes2: 88, mes3: 82, mes4: 78, mes5: 75, mes6: 72 },
      { mes: "Oct 2025", clientes: 168, mes1: 92, mes2: 86, mes3: 80, mes4: 76, mes5: 73, mes6: null },
      { mes: "Nov 2025", clientes: 195, mes1: 91, mes2: 85, mes3: 79, mes4: 74, mes5: null, mes6: null },
      { mes: "Dic 2025", clientes: 212, mes1: 93, mes2: 87, mes3: 81, mes4: null, mes5: null, mes6: null },
      { mes: "Ene 2026", clientes: 189, mes1: 95, mes2: 89, mes3: null, mes4: null, mes5: null, mes6: null },
      { mes: "Feb 2026", clientes: 156, mes1: 94, mes2: null, mes3: null, mes4: null, mes5: null, mes6: null },
    ]

    const polizasVencer = [
      { poliza: "POL-44821", canal: "WhatsApp", prima: 12400, diasRestantes: 8 },
      { poliza: "POL-71209", canal: "Website", prima: 8900, diasRestantes: 12 },
      { poliza: "POL-33104", canal: "ChatGPT", prima: 15200, diasRestantes: 18 },
      { poliza: "POL-88912", canal: "Agentes", prima: 18500, diasRestantes: 22 },
      { poliza: "POL-55231", canal: "WhatsApp", prima: 11200, diasRestantes: 28 },
      { poliza: "POL-66103", canal: "Website", prima: 7600, diasRestantes: 35 },
      { poliza: "POL-22345", canal: "ChatGPT", prima: 13800, diasRestantes: 42 },
      { poliza: "POL-99187", canal: "WhatsApp", prima: 9500, diasRestantes: 55 },
    ]

    const churnRisk = [
      { poliza: "POL-11234", ultimaInteraccion: "Hace 45 días", intentRenovacion: 28 },
      { poliza: "POL-22389", ultimaInteraccion: "Hace 32 días", intentRenovacion: 45 },
      { poliza: "POL-33456", ultimaInteraccion: "Hace 28 días", intentRenovacion: 52 },
      { poliza: "POL-44567", ultimaInteraccion: "Hace 21 días", intentRenovacion: 68 },
      { poliza: "POL-55678", ultimaInteraccion: "Hace 18 días", intentRenovacion: 35 },
    ]

    const indiceRiesgoZona = [
      { zona: "Iztapalapa", siniestrosMes: 18, montoProm: 42000, tipoFrecuente: "Colisión", indice: "Critical" },
      { zona: "Gustavo A. Madero", siniestrosMes: 14, montoProm: 38500, tipoFrecuente: "Robo", indice: "High" },
      { zona: "Benito Juárez", siniestrosMes: 11, montoProm: 31200, tipoFrecuente: "Colisión", indice: "High" },
      { zona: "Álvaro Obregón", siniestrosMes: 9, montoProm: 28900, tipoFrecuente: "Daño material", indice: "Medium" },
      { zona: "Coyoacán", siniestrosMes: 7, montoProm: 24500, tipoFrecuente: "Colisión", indice: "Medium" },
      { zona: "Miguel Hidalgo", siniestrosMes: 5, montoProm: 19800, tipoFrecuente: "RC", indice: "Low" },
    ]

    const razonesSiniestro = [
      { name: "Colisión trasera", value: 31, trend: 2 },
      { name: "Robo total", value: 24, trend: -1 },
      { name: "Daño por granizo", value: 18, trend: 5 },
      { name: "Colisión lateral", value: 14, trend: 0 },
      { name: "Responsabilidad civil", value: 8, trend: -2 },
      { name: "Otros", value: 5, trend: 1 },
    ]

    const zonasCalientes = [
      { zona: "Iztapalapa", count: 5, tipo: "Colisión", periodo: "48h", nivel: "critical" },
      { zona: "Gustavo A. Madero", count: 3, tipo: "Robo", periodo: "48h", nivel: "warning" },
      { zona: "Benito Juárez", count: 2, tipo: "Colisión", periodo: "24h", nivel: "info" },
    ]

    const severidadDistribucion = [
      { rango: "Menor", pct: 42 },
      { rango: "Media", pct: 35 },
      { rango: "Alta", pct: 18 },
      { rango: "Total", pct: 5 },
    ]

    const senalesFraude = [
      { patron: "2 pólizas con siniestro <30 días desde emisión", cp: "54000", badge: "Revisión recomendada" },
      { patron: "1 asegurado con 3 siniestros en 12 meses", detalle: "POL-71209", badge: "Alta prioridad" },
      { patron: "Cluster de 3 reportes similares en 48h", zona: "Tlalpan", badge: "Monitoreo activo" },
    ]

    const fnolPorCanal = [
      { canal: "WhatsApp", reportes: 156, completitud: 92, tiempoProm: "3.1min", docsAdjuntos: 2.4, sla: 96 },
      { canal: "ChatGPT", reportes: 89, completitud: 88, tiempoProm: "3.8min", docsAdjuntos: 2.2, sla: 94 },
      { canal: "Website", reportes: 124, completitud: 82, tiempoProm: "4.5min", docsAdjuntos: 2.1, sla: 91 },
      { canal: "Llamada", reportes: 78, completitud: 52, tiempoProm: "23min", docsAdjuntos: 1.2, sla: 71 },
    ]

    const mapMarkers = [
      { zona: "CDMX Iztapalapa", lat: 19.3574, lng: -99.0591, count: 18, tipo: "Robo total", indice: "Critical" },
      { zona: "CDMX Tepito", lat: 19.4449, lng: -99.1286, count: 14, tipo: "Robo parcial", indice: "Critical" },
      { zona: "CDMX Tlalpan", lat: 19.2926, lng: -99.1695, count: 12, tipo: "Granizo", indice: "High" },
      { zona: "Ecatepec", lat: 19.6084, lng: -99.0603, count: 10, tipo: "Colisión", indice: "High" },
      { zona: "CDMX Polanco", lat: 19.4319, lng: -99.1972, count: 6, tipo: "Robo total", indice: "Medium" },
      { zona: "MTY San Pedro", lat: 25.6589, lng: -100.4026, count: 5, tipo: "Robo", indice: "Medium" },
      { zona: "GDL Providencia", lat: 20.6868, lng: -103.3742, count: 4, tipo: "Colisión", indice: "Low" },
      { zona: "MTY Valle", lat: 25.6714, lng: -100.3176, count: 4, tipo: "Colisión", indice: "Low" },
      { zona: "Querétaro", lat: 20.5888, lng: -100.3899, count: 3, tipo: "Granizo", indice: "Low" },
      { zona: "Puebla Centro", lat: 19.0414, lng: -98.2063, count: 2, tipo: "Colisión", indice: "Low" },
    ]

    return {
      hourlyHoyAyer,
      canalKpis,
      pipelineLeads,
      funnelSteps,
      funnelData,
      mixProductos,
      crossSellPairs,
      crossSellTableData,
      objeciones,
      siniestros,
      MOCK_SINIESTROS,
      fnolMetricas,
      siniestrosActivos,
      siniestrosSlaRiesgo,
      objecion1: {
        texto: objecion1.objecion,
        porcentaje: objecion1Porcentaje,
      },
      crossSellRate,
      insightDia,
      comparativaCanales,
      kpiDataByCanal,
      historico30,
      horaDistribucion,
      cohortes,
      polizasVencer,
      churnRisk,
      indiceRiesgoZona,
      razonesSiniestro,
      zonasCalientes,
      severidadDistribucion,
      senalesFraude,
      fnolPorCanal,
      mapMarkers,
    }
  }, [])
}
