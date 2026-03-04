import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/StatCard"
import { LiveFeed } from "@/components/dashboard/LiveFeed"
import { WidgetFrame } from "@/components/demo/WidgetFrame"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle2, Loader2, Circle, Paperclip } from "lucide-react"

const SERVER =
  import.meta.env.VITE_SERVER_URL ||
  "https://cuadrainsurance-production.up.railway.app"

const WIDGET_TOOLS = [
  "render_quotes_widget",
  "render_siniestro_widget",
  "render_coverage_recommendation",
  "render_policy_summary",
  "render_renewal_alert",
  "render_policy_confirmation",
]

const QUICK_PROMPTS = [
  "Quiero cotizar mi Honda CR-V 2024, vivo en Polanco",
  "Tuve un accidente, me chocaron por atrás en Insurgentes",
  "¿Qué cubre el seguro de auto amplio?",
]

function getSummary(tool, data) {
  if (tool?.includes?.("quote") || data?.quotes) {
    const p = data?.quotes?.[0]?.prima_anual ?? data?.quotes?.[0]?.precio ?? 0
    return `Cotización · desde $${Number(p).toLocaleString("es-MX")}/año`
  }
  if (tool === "report_siniestro" || data?.folio) {
    return `Siniestro ${data?.folio ?? ""} · ${data?.tipo ?? "accidente"}`
  }
  return tool || "Tool"
}

export function Demo() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [kpis, setKpis] = useState({
    cotizaciones: 0,
    siniestros: 0,
    primaTotal: 0,
  })
  const [localEvents, setLocalEvents] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const [connected, setConnected] = useState(false)
  const [pendingImages, setPendingImages] = useState([])
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const lastSentImagesRef = useRef([])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // SSE para estado Live/Offline
  useEffect(() => {
    if (!SERVER) return
    let lastPoll = new Date().toISOString()

    const poll = async () => {
      try {
        const res = await fetch(
          `${SERVER}/dashboard/events/poll?since=${lastPoll}`
        )
        if (!res.ok) return
        const { events, serverTime } = await res.json()

        if (events?.length > 0) {
          setLocalEvents((prev) =>
            [...events.reverse(), ...prev].slice(0, 20)
          )
        }

        if (serverTime) lastPoll = serverTime
        setConnected(true)
      } catch {
        setConnected(false)
      }
    }

    poll()
    const interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleReset = () => {
    setMessages([])
    setHistory([])
    setInput("")
    setPendingImages([])
    setKpis({ cotizaciones: 0, siniestros: 0, primaTotal: 0 })
    setLocalEvents([])
    setLastResult(null)
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)

    const normalizeMediaType = (type) => {
      if (type === "image/jpg") return "image/jpeg"
      if (
        !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(type)
      )
        return "image/jpeg"
      return type
    }

    const converted = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              const base64 = reader.result.split(",")[1]
              resolve({
                source: {
                  type: "base64",
                  media_type: normalizeMediaType(file.type),
                  data: base64,
                },
                preview: reader.result,
              })
            }
            reader.readAsDataURL(file)
          })
      )
    )
    setPendingImages((prev) => [...prev, ...converted])
  }

  const addEvent = useCallback((tool, summary, extra = {}) => {
    const ev = {
      id: `ev-${Date.now()}`,
      canal: "demo",
      tool,
      summary,
      timestamp: new Date().toISOString(),
      ...extra,
    }
    setLocalEvents((prev) => [ev, ...prev].slice(0, 50))
  }, [])

  const handleToolResult = useCallback(
    (toolUse, toolResult, allContent) => {
      let parsed = null
      try {
        const text = toolResult?.content?.[0]?.text || ""
        parsed = JSON.parse(text)
      } catch {
        parsed = toolUse?.input || {}
      }

      const tool = toolUse?.name || ""

      if (WIDGET_TOOLS.includes(tool)) {
        // Para widgets, combinar el input del tool (que tiene quotes)
        // con el structuredContent del result (que puede tener coberturas_tabla)
        // Para render_quotes_widget, el resultado viene del get_auto_quotes previo
        let structuredContent = null
        try {
          const content = allContent || []
          const allToolResults =
            content.filter((b) => b.type === "mcp_tool_result") || []

          // Encontrar el tool_result que corresponde por tool_use_id
          const matchingResult = allToolResults.find(
            (r) => r.tool_use_id === toolUse.id
          )

          // Si no hay match (render_widgets no tienen result propio),
          // usar el primer tool_result que tenga quotes/coberturas_tabla
          const resultToUse =
            matchingResult ||
            allToolResults.find((r) => {
              try {
                const parsed = JSON.parse(r?.content?.[0]?.text || "{}")
                return parsed.coberturas_tabla || parsed.quotes
              } catch {
                return false
              }
            })

          const resultText = resultToUse?.content?.[0]?.text || "{}"
          const resultParsed = JSON.parse(resultText)
          structuredContent =
            resultParsed?.structuredContent || resultParsed
        } catch {}

        console.log("toolResult raw:", JSON.stringify(toolResult, null, 2))

        const widgetData = {
          ...(toolUse?.input || {}),
          ...(structuredContent || {}),
        }
        console.log("toolUse.input:", JSON.stringify(toolUse?.input, null, 2))
        console.log("structuredContent:", JSON.stringify(structuredContent, null, 2))
        console.log("widgetData para widget:", JSON.stringify(widgetData, null, 2))
        setMessages((prev) => [
          ...prev,
          { role: "widget", toolName: tool, data: widgetData },
        ])
      }

      if (tool === "get_auto_quotes") {
        const prima =
          toolUse?.input?.quotes?.[0]?.precio_anual ??
          parsed?.quotes?.[0]?.prima_anual ??
          parsed?.quotes?.[0]?.precio ??
          0
        setKpis((prev) => ({
          ...prev,
          cotizaciones: prev.cotizaciones + 1,
          primaTotal: prev.primaTotal + Number(prima),
        }))
      }
      if (tool === "report_siniestro") {
        setKpis((prev) => ({ ...prev, siniestros: prev.siniestros + 1 }))
      }

      setLocalEvents((prev) =>
        [
          {
            id: Date.now(),
            tool,
            canal: "demo",
            summary: getSummary(tool, toolUse?.input || parsed),
            timestamp: Date.now(),
          },
          ...prev,
        ].slice(0, 20)
      )

      if (!WIDGET_TOOLS.includes(tool)) {
        if (tool === "get_auto_quotes") {
          setLastResult({
            tool: "quote",
            quotes: parsed?.quotes ?? parsed?.cotizaciones ?? [],
          })
        } else if (tool === "report_siniestro") {
          const fnolData = { ...(toolUse?.input || {}), ...(parsed || {}) }
          console.log("fnolData actual:", fnolData)
          setLastResult({
            tool: "report_siniestro",
            folio: parsed?.folio ?? parsed?.folioSiniestro ?? "SIN-XXXX",
            timeline: parsed?.timeline ?? parsed?.pasos ?? [],
            siguientePaso: parsed?.siguientePaso ?? parsed?.nextStep ?? "",
          })
          fetch(`${SERVER}/fnol`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              folio: fnolData.folio,
              tipo: fnolData.tipo,
              descripcion: fnolData.descripcion,
              nombre: fnolData.nombre,
              poliza_numero: fnolData.poliza_numero,
              lugar: fnolData.lugar,
              fecha: fnolData.fecha,
              lesionados: fnolData.lesionados,
              ai_analysis: fnolData.ai_analysis,
              imagen_urls: lastSentImagesRef.current || [],
            }),
          }).catch(console.error)
        } else {
          setLastResult({ tool, data: parsed })
        }
      }
    },
    []
  )

  const handleSend = useCallback(
    async (text) => {
      const userText = text || input.trim()
      const hasContent = userText || pendingImages.length > 0
      if (!hasContent || isLoading) return
      setInput("")

      const userContent =
        pendingImages.length > 0
          ? [
              ...pendingImages.map((img) => ({
                type: "image",
                source: img.source,
              })),
              ...(userText.trim() ? [{ type: "text", text: userText }] : []),
            ]
          : userText

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userText || `📷 ${pendingImages.length} foto(s)`,
          images: pendingImages.map((i) => i.preview),
        },
      ])
      lastSentImagesRef.current = pendingImages.map((i) => i.preview).slice(0, 4)
      setPendingImages([])

      const newHistory = [...history, { role: "user", content: userContent }]
      setHistory(newHistory)
      setIsLoading(true)
      setLastResult(null)

      try {
        const cleanHistory = newHistory.filter(
          (msg) => msg.role === "user" || msg.role === "assistant"
        )
        console.log("userContent[0] final:", JSON.stringify(
          Array.isArray(userContent) ? userContent[0] : "string"
        , null, 2))
        const res = await fetch(`${SERVER}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: cleanHistory }),
        })

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        console.log(
          "Tools ejecutados:",
          data.content
            ?.filter((b) => b.type === "mcp_tool_use")
            ?.map((b) => ({ name: b.name, input: b.input }))
        )
        const assistantBlocks = Array.isArray(data.content) ? data.content : []
        const textContent =
          assistantBlocks
            .filter((b) => b?.type === "text")
            .map((b) => b?.text ?? "")
            .join("\n") ||
          data.text ||
          data.message ||
          ""
        const toolUses =
          data.content?.filter((b) => b.type === "mcp_tool_use") || []
        const toolResults =
          data.content?.filter((b) => b.type === "mcp_tool_result") || []

        if (textContent) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: textContent },
          ])
        }
        // Extraer texto de la respuesta
        const textBlocks =
          data.content?.filter((b) => b.type === "text") || []

        // Construir contenido del asistente incluyendo contexto de tools
        let assistantContent = textBlocks.map((b) => b?.text ?? "").join("\n")

        // Si hubo tool calls, agregar resumen para que Claude recuerde el contexto
        if (toolUses.length > 0) {
          const toolSummary = toolUses
            .map((t) => {
              if (
                t.name === "render_quotes_widget" ||
                t.name === "get_auto_quotes"
              ) {
                const quotes = t.input?.quotes || []
                const tipo = t.input?.tipo || "auto"
                const aseguradora = quotes[0]?.aseguradora || ""
                const planesStr = quotes
                  .map(
                    (q) =>
                      `${q.plan || q.aseguradora}: $${q.precio_anual ?? q.precio ?? 0}/año`
                  )
                  .join(", ")
                return `[Ya mostré cotizaciones de ${aseguradora} para seguro de ${tipo}: ${planesStr}]`
              }
              return `[Ejecuté: ${t.name}]`
            })
            .join("\n")

          assistantContent = assistantContent + "\n" + toolSummary
        }

        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: assistantContent },
        ])

        toolUses.forEach((toolUse, i) => {
          handleToolResult(toolUse, toolResults[i] ?? {}, data.content)
        })
      } catch (err) {
        console.warn("Chat error:", err)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "No pude conectar con el servidor. Verifica que el backend esté activo en " +
              SERVER,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, history, handleToolResult, pendingImages]
  )

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      {/* TOPBAR */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <img src="/cuadra_logo.png" alt="Cuadra" className="h-6 w-auto" />
        <span className="text-sm font-semibold text-gray-700">
          Demo en vivo
        </span>
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className={
              connected
                ? "border border-orange-200 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-gray-100 text-gray-600"
            }
          >
            {connected && (
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
            )}
            {connected ? "Live" : "Offline"}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reiniciar
          </Button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel izquierdo — Chat */}
        <div className="flex w-[55%] flex-col border-r border-gray-200 bg-white">
          <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Cuadra AI</p>
              <p className="text-xs text-gray-400">
                Asistente de seguros · En línea
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="mb-3 text-center text-sm text-gray-400">
                  Prueba preguntando:
                </p>
                <div className="w-full max-w-sm space-y-2">
                  {QUICK_PROMPTS.map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => handleSend(text)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:border-orange-300 hover:text-orange-700"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, i) => {
                  if (message.role === "user") {
                    return (
                      <div key={i} className="flex flex-col items-end gap-1">
                        {message.images?.map((src, j) => (
                          <img
                            key={j}
                            src={src}
                            alt=""
                            className="mt-1 max-w-xs rounded-lg border border-gray-200"
                          />
                        ))}
                        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-orange-500 px-4 py-2 text-sm text-white">
                          {message.content}
                        </div>
                      </div>
                    )
                  }
                  if (message.role === "assistant") {
                    const text =
                      typeof message.content === "string"
                        ? message.content
                        : message.content?.filter?.((b) => b?.type === "text")
                            ?.map?.((b) => b?.text ?? "")
                            ?.join("\n") || ""
                    return (
                      <div key={i} className="flex justify-start">
                        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 whitespace-pre-wrap">
                          {text}
                        </div>
                      </div>
                    )
                  }
                  if (message.role === "widget") {
                    return (
                      <div key={i} className="w-full px-1">
                        <WidgetFrame
                          toolName={message.toolName}
                          data={message.data}
                        />
                      </div>
                    )
                  }
                  return null
                })}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-2">
                      <span
                        className="mr-1 inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="mr-1 inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col border-t border-gray-100">
            {pendingImages.length > 0 && (
              <div className="flex gap-2 px-4 py-2">
                {pendingImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img.preview}
                      alt=""
                      className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPendingImages((prev) =>
                          prev.filter((_, j) => j !== i)
                        )
                      }
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-800 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 px-4 py-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:border-orange-300 hover:text-orange-600 disabled:opacity-50"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none disabled:opacity-50"
              />
              <Button
                onClick={() => handleSend()}
                disabled={
                  isLoading ||
                  (!input.trim() && pendingImages.length === 0)
                }
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>

        {/* Panel derecho — Dashboard */}
        <div className="flex w-[45%] flex-col gap-4 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Cotizaciones"
              value={kpis.cotizaciones}
              compact
            />
            <StatCard
              label="Siniestros reportados"
              value={kpis.siniestros}
              compact
            />
            <StatCard
              label="Prima generada"
              value={formatCurrency(kpis.primaTotal)}
              compact
            />
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Canal activo
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="font-display text-xl font-semibold text-gray-900">
                  Demo Live
                </span>
              </div>
            </div>
          </div>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">
                Actividad en tiempo real
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LiveFeed events={localEvents} maxItems={10} embedded />
            </CardContent>
          </Card>

          {lastResult && (
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900">
                  {lastResult.tool === "quote"
                    ? "Cotizaciones generadas"
                    : "Siniestro reportado"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {lastResult.tool === "quote" && lastResult.quotes?.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {lastResult.quotes.map((q, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 p-3"
                      >
                        <p className="font-semibold text-gray-900">
                          {q.aseguradora ?? q.nombre ?? "Aseguradora"}
                        </p>
                        <p className="font-display text-xl font-semibold text-orange-600">
                          {formatCurrency(q.prima ?? q.precio ?? q.precio_anual ?? q.monto ?? 0)}
                        </p>
                        {q.cobertura && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {q.cobertura}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : lastResult.tool === "report_siniestro" ? (
                  <div className="space-y-3">
                    <p className="font-mono text-2xl font-bold text-orange-600">
                      {lastResult.folio}
                    </p>
                    {(lastResult.timeline ?? []).length > 0 && (
                      <ul className="space-y-2">
                        {(lastResult.timeline ?? []).map((step, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            {step.status === "completado" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : step.status === "en_proceso" ? (
                              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                            <span
                              className={
                                step.status === "pendiente"
                                  ? "text-gray-400"
                                  : ""
                              }
                            >
                              {step.paso ?? step.nombre ?? step}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {lastResult.siguientePaso && (
                      <div className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm">
                        {lastResult.siguientePaso}
                      </div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
