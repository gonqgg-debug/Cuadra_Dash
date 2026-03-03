import { useLocation } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const PAGE_TITLES = {
  "/dashboard": "Resumen ejecutivo",
  "/dashboard/overview": "Overview de Ventas",
  "/dashboard/canales": "Canales & CAC",
  "/dashboard/conversaciones": "Conversaciones & Intent",
  "/dashboard/retencion": "Retención & Pipeline",
  "/dashboard/siniestros": "FNOL Dashboard",
  "/dashboard/mapa": "Mapa de Incidentes",
  "/dashboard/riesgo": "Análisis de Riesgo",
  "/dashboard/configuracion": "Configuración",
  "/demo": "Demo Live",
}

function getPageTitle(pathname) {
  return PAGE_TITLES[pathname] ?? "Dashboard"
}

function formatDate() {
  return new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function Topbar({ connected = false }) {
  const location = useLocation()
  const title = getPageTitle(location.pathname)
  const date = formatDate()

  return (
    <header className="fixed left-60 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <span className="text-sm text-gray-500">{date}</span>
      </div>

      <div className="flex items-center gap-4">
        <Badge
          variant="secondary"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
            connected
              ? "border border-orange-200 bg-orange-50 text-orange-700"
              : "border-gray-200 bg-gray-100 text-gray-600"
          )}
        >
          {connected && (
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          )}
          {connected ? "Live" : "Offline"}
        </Badge>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-orange-500 text-xs font-medium text-white">
            AS
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
