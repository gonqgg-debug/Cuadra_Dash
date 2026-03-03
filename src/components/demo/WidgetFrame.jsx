import { useRef, useEffect } from "react"

const SERVER =
  import.meta.env.VITE_SERVER_URL ||
  "https://cuadrainsurance-production.up.railway.app"

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
  const url = WIDGET_URLS[toolName]

  const sendData = () => {
    const payload = {
      jsonrpc: "2.0",
      method: "ui/notifications/tool-result",
      params: { structuredContent: data ?? {} },
    }
    iframeRef.current?.contentWindow?.postMessage(payload, "*")
  }

  useEffect(() => {
    if (!url || !iframeRef.current?.contentWindow) return
    sendData()
  }, [url, data])

  if (!url) return null

  const handleLoad = () => {
    sendData()
  }

  return (
    <div
      className="my-2 w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm"
      style={{ minHeight: 200 }}
    >
      <iframe
        ref={iframeRef}
        src={url}
        onLoad={handleLoad}
        className="w-full"
        style={{ height: 320, border: "none" }}
        sandbox="allow-scripts allow-same-origin"
        title={`Widget ${toolName}`}
      />
    </div>
  )
}
