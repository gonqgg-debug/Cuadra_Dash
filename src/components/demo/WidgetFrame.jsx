import { useState, useEffect } from "react"

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
  const [html, setHtml] = useState("")
  const url = WIDGET_URLS[toolName]

  useEffect(() => {
    if (!url) return
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        const injected = text.replace(
          "</body>",
          `<script>
            window.__WIDGET_DATA__ = ${JSON.stringify(data ?? {})};
            if (typeof render === 'function') render(window.__WIDGET_DATA__);
            else document.addEventListener('DOMContentLoaded', () => {
              if (typeof render === 'function') render(window.__WIDGET_DATA__);
            });
          </script></body>`
        )
        setHtml(injected)
      })
  }, [url, data])

  if (!url) return null
  if (!html) return (
    <div className="my-2 h-40 rounded-xl bg-gray-50 animate-pulse" />
  )

  return (
    <div
      className="my-2 w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
