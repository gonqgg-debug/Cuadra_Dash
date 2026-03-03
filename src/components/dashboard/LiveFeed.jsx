import { cn } from "@/lib/utils"

const CANAL_DOT = {
  chatgpt: "bg-emerald-500",
  whatsapp: "bg-green-500",
  website: "bg-blue-500",
  agente: "bg-violet-500",
  demo: "bg-orange-500",
}

function getCanalDot(canal) {
  return CANAL_DOT[canal] ?? "bg-gray-400"
}

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)

  if (diffSec < 60) return "hace un momento"
  if (diffMin < 60) return `hace ${diffMin} min`
  if (diffHr < 24) return `hace ${diffHr}h`
  return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
}

export function LiveFeed({ events = [], maxItems = 15, embedded = false }) {
  const items = events.slice(0, maxItems)

  return (
    <div
      className={cn(
        "divide-y divide-gray-100",
        embedded
          ? "rounded-b-lg"
          : "rounded-lg border border-gray-200 bg-white shadow-sm"
      )}
    >
      {items.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">
          Sin eventos recientes
        </div>
      ) : (
        items.map((event, i) => (
          <div
            key={event.id ?? i}
            className={cn(
              "flex items-center gap-3 py-2.5 px-4",
              i === 0
                ? "animate-slide-in bg-orange-50/40"
                : "bg-white hover:bg-gray-50/50"
            )}
          >
            <div
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                getCanalDot(event.canal)
              )}
            />
            <div className="min-w-0 flex-1">
              <span className="font-mono text-xs text-gray-600">
                {event.tool ?? event.canal ?? "event"}
              </span>
              <p className="truncate text-sm text-gray-900">{event.summary}</p>
            </div>
            <span className="ml-auto shrink-0 text-xs text-gray-400">
              {formatRelativeTime(event.timestamp ?? event.createdAt ?? new Date())}
            </span>
          </div>
        ))
      )}
    </div>
  )
}
