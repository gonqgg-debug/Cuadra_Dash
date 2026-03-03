import { useState, useEffect } from "react"

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
  const [blobUrl, setBlobUrl] = useState(null)
  const url = WIDGET_URLS[toolName]

  useEffect(() => {
    if (!url || !data) return

    fetch(url)
      .then(r => r.text())
      .then(html => {
        const injected = html.replace(
          "<head>",
          `<head><script>window.__WIDGET_DATA__ = ${JSON.stringify(data)};</script>`
        )
        const blob = new Blob([injected], { type: "text/html" })
        const objectUrl = URL.createObjectURL(blob)
        setBlobUrl(prev => {
          if (prev) URL.revokeObjectURL(prev)
          return objectUrl
        })
      })
      .catch(console.error)

    return () => setBlobUrl(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [url, JSON.stringify(data)])

  if (!blobUrl) return (
    <div className="h-48 bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
  )

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm my-2">
      <iframe
        src={blobUrl}
        className="w-full"
        style={{ height: 340, border: "none" }}
        sandbox="allow-scripts"
      />
    </div>
  )
}
