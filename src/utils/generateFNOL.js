import { jsPDF } from "jspdf"

export function generateFNOLReport(siniestroData, images = []) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const W = 210
  const margin = 20
  let y = 20

  // Colores Cuadra
  const orange = [232, 93, 30]
  const dark = [26, 32, 44]
  const gray = [113, 128, 150]
  const lightGray = [247, 250, 252]
  const border = [226, 232, 240]

  // Helper: línea horizontal
  const hline = (yy, color = border) => {
    doc.setDrawColor(...color)
    doc.line(margin, yy, W - margin, yy)
  }

  // Helper: sección header
  const sectionHeader = (title, yy) => {
    doc.setFillColor(...lightGray)
    doc.rect(margin, yy, W - margin * 2, 8, "F")
    doc.setTextColor(...orange)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.text(title.toUpperCase(), margin + 3, yy + 5.5)
    return yy + 12
  }

  // Helper: campo label + valor
  const field = (label, value, x, yy, colW = 80) => {
    doc.setTextColor(...gray)
    doc.setFontSize(7.5)
    doc.setFont("helvetica", "normal")
    doc.text(label, x, yy)
    doc.setTextColor(...dark)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(String(value || "—"), x, yy + 5)
    return yy + 12
  }

  // ── HEADER ──────────────────────────────────────────
  doc.setFillColor(...orange)
  doc.rect(0, 0, W, 28, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("REPORTE FNOL", margin, 12)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("First Notice of Loss — Reporte Inicial de Siniestro", margin, 19)

  // Folio badge (esquina derecha)
  const folio = siniestroData.folio || "SIN-XXXXXX"
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text(folio, W - margin, 12, { align: "right" })
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.text("FOLIO", W - margin, 18, { align: "right" })

  y = 36

  // ── METADATA BAR ────────────────────────────────────
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...gray)
  const now = new Date()
  const fechaReporte = now.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  doc.text(`Generado: ${fechaReporte}`, margin, y)
  doc.text(`Canal: Cuadra AI · Demo Live`, W - margin, y, { align: "right" })
  y += 8
  hline(y)
  y += 6

  // ── 1. DATOS DEL ASEGURADO ───────────────────────────
  y = sectionHeader("1. Datos del Asegurado y Póliza", y)
  field("Nombre completo", siniestroData.nombre, margin, y)
  field("Número de póliza", siniestroData.poliza_numero, margin + 90, y)
  y += 14
  field("Aseguradora", siniestroData.aseguradora || "GNP", margin, y)
  field("Tipo de cobertura", siniestroData.cobertura || "Amplia", margin + 90, y)
  y += 6
  hline(y)
  y += 6

  // ── 2. DESCRIPCIÓN DEL SINIESTRO ────────────────────
  y = sectionHeader("2. Descripción y Folio del Siniestro", y)
  field("Tipo de siniestro", siniestroData.tipo, margin, y)
  field("Folio asignado", folio, margin + 90, y)
  y += 14
  field("Fecha del incidente", siniestroData.fecha || "—", margin, y)
  field("Lugar", siniestroData.lugar || "—", margin + 90, y)
  y += 14

  // Descripción (multiline)
  doc.setTextColor(...gray)
  doc.setFontSize(7.5)
  doc.setFont("helvetica", "normal")
  doc.text("Descripción del incidente", margin, y)
  y += 5
  doc.setTextColor(...dark)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  const descLines = doc.splitTextToSize(
    siniestroData.descripcion || "Sin descripción.",
    W - margin * 2
  )
  doc.text(descLines, margin, y)
  y += descLines.length * 5 + 4

  field(
    "¿Hay lesionados?",
    siniestroData.lesionados ? "SÍ — Requiere atención urgente" : "No reportados",
    margin,
    y
  )
  y += 6
  hline(y)
  y += 6

  // ── 3. ANÁLISIS DE DAÑO POR IA ──────────────────────
  y = sectionHeader("3. Análisis de Daño por IA (Cuadra Vision)", y)

  doc.setFillColor(255, 247, 243)
  doc.roundedRect(margin, y, W - margin * 2, 20, 2, 2, "F")
  doc.setDrawColor(...orange)
  doc.roundedRect(margin, y, W - margin * 2, 20, 2, 2, "S")

  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("ANÁLISIS AUTOMÁTICO", margin + 4, y + 6)

  doc.setTextColor(...dark)
  doc.setFontSize(8.5)
  doc.setFont("helvetica", "normal")
  const analisis =
    siniestroData.ai_analysis ||
    "Impacto trasero detectado. Daño estimado en defensas y cajuela. Gravedad: moderada. Se recomienda peritaje físico para evaluar daño estructural en largueros."
  const analisisLines = doc.splitTextToSize(analisis, W - margin * 2 - 8)
  doc.text(analisisLines, margin + 4, y + 12)
  y += 26
  hline(y)
  y += 6

  // ── 4. TIMELINE ─────────────────────────────────────
  y = sectionHeader("4. Timeline del Reporte", y)

  const timeline = [
    { label: "Reporte recibido", time: fechaReporte, status: "done" },
    { label: "Análisis IA completado", time: fechaReporte, status: "done" },
    {
      label: "Asignación de ajustador",
      time: "Pendiente — máx. 2 horas",
      status: "pending",
    },
    { label: "Inspección física", time: "Por programar", status: "pending" },
    { label: "Resolución y pago", time: "Por determinar", status: "pending" },
  ]

  timeline.forEach((item) => {
    const isDone = item.status === "done"
    doc.setFillColor(...(isDone ? [240, 255, 244] : lightGray))
    doc.roundedRect(margin, y, W - margin * 2, 9, 1, 1, "F")

    // Dot
    doc.setFillColor(...(isDone ? [56, 161, 105] : [203, 213, 224]))
    doc.circle(margin + 5, y + 4.5, 2, "F")

    doc.setTextColor(...dark)
    doc.setFontSize(8.5)
    doc.setFont("helvetica", isDone ? "bold" : "normal")
    doc.text(item.label, margin + 10, y + 5.5)

    doc.setTextColor(...gray)
    doc.setFontSize(7.5)
    doc.setFont("helvetica", "normal")
    doc.text(item.time, W - margin - 2, y + 5.5, { align: "right" })
    y += 11
  })

  y += 2
  hline(y)
  y += 6

  // ── 5. DOCUMENTOS REQUERIDOS ─────────────────────────
  y = sectionHeader("5. Documentos Requeridos Pendientes", y)

  const docs = [
    "Identificación oficial del asegurado",
    "Licencia de conducir vigente",
    "Tarjeta de circulación",
    "Fotos del daño (mínimo 4 ángulos)",
    "Denuncia ante MP (si aplica por robo)",
    "Datos del tercero involucrado (si aplica)",
  ]

  docs.forEach((d) => {
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(...border)
    doc.roundedRect(margin, y, W - margin * 2, 7, 1, 1, "FD")
    doc.setTextColor(203, 213, 224)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("[ ]", margin + 3, y + 5)
    doc.setTextColor(...dark)
    doc.text(d, margin + 9, y + 5)
    y += 9
  })

  y += 4
  hline(y)
  y += 6

  // ── 6. FOTOS ADJUNTAS ───────────────────────────────
  if (images.length > 0) {
    y = sectionHeader("6. Evidencia Fotográfica Adjunta", y)
    let imgX = margin
    images.slice(0, 4).forEach((imgData, i) => {
      try {
        doc.addImage(imgData, "JPEG", imgX, y, 38, 28)
        doc.setFontSize(7)
        doc.setTextColor(...gray)
        doc.text(`Foto ${i + 1}`, imgX + 19, y + 31, { align: "center" })
        imgX += 42
      } catch (e) {
        console.warn("Error adding image to PDF:", e)
      }
    })
    y += 38
  }

  // ── FOOTER ──────────────────────────────────────────
  const pageH = 297
  doc.setFillColor(...lightGray)
  doc.rect(0, pageH - 16, W, 16, "F")
  doc.setTextColor(...gray)
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.text(
    "Documento generado automáticamente por Cuadra AI · Uso interno — Equipo de Ajustadores",
    margin,
    pageH - 8
  )
  doc.text(folio, W - margin, pageH - 8, { align: "right" })

  return doc
}
