import { useState, useEffect, useRef } from "react"

const SERVER = import.meta.env.VITE_SERVER_URL || "https://cuadrainsurance-production.up.railway.app"

const WIDGET_URLS = {
  render_quotes_widget: `${SERVER}/widget/quote-widget.html`,
  render_siniestro_widget: `${SERVER}/widget/siniestro-widget.html`,
  render_coverage_recommendation: `${SERVER}/widget/recommendation-widget.html`,
  render_policy_summary: `${SERVER}/widget/policy-widget.html`,
  render_renewal_alert: `${SERVER}/widget/renewal-widget.html`,
  render_policy_confirmation: `${SERVER}/widget/confirmation-widget.html`,
}

export function WidgetFrame({ toolName, data }) {
  const iframeRef = useRef(null)
  const [htmlContent, setHtmlContent] = useState(null)
  const [iframeHeight, setIframeHeight] = useState(340)
  const url = WIDGET_URLS[toolName]

  // Cargar HTML del widget
  useEffect(() => {
    if (!url) return
    fetch(url)
      .then(r => r.text())
      .then(html => setHtmlContent(html))
      .catch(console.error)
  }, [url])

  // Escuchar mensajes de tamaño del widget
  useEffect(() => {
    const handleMessage = (event) => {
      const msg = event.data
      if (!msg || msg.jsonrpc !== "2.0") return
      if (msg.method === "ui/notifications/size-changed" && msg.params?.height) {
        setIframeHeight(msg.params.height + 32)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Enviar datos al widget cuando carga
  const handleLoad = () => {
    if (!iframeRef.current || !data) return
    iframeRef.current.contentWindow?.postMessage({
      jsonrpc: "2.0",
      method: "ui/notifications/tool-result",
      params: { structuredContent: data }
    }, "*")
  }

  if (!htmlContent) return (
    <div className="h-48 bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
  )

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm my-2">
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        onLoad={handleLoad}
        className="w-full"
        style={{ height: iframeHeight, border: "none", transition: "height 0.3s ease" }}
        sandbox="allow-scripts"
      />
    </div>
  )
}
