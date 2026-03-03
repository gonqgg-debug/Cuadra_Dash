import { Link } from "react-router-dom"
import { AlertTriangle, TrendingDown, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const STYLES = {
  critica: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: AlertTriangle,
    iconClass: "text-red-500",
    linkClass: "text-red-700 hover:text-red-800",
  },
  advertencia: {
    container: "bg-amber-50 border-amber-200 text-amber-800",
    icon: TrendingDown,
    iconClass: "text-amber-500",
    linkClass: "text-amber-700 hover:text-amber-800",
  },
  info: {
    container: "bg-orange-50 border-orange-200 text-orange-800",
    icon: Info,
    iconClass: "text-orange-500",
    linkClass: "text-orange-700 hover:text-orange-800",
  },
}

export function AlertBanner({ alertas = [] }) {
  if (alertas.length === 0) return null

  return (
    <div className="space-y-3">
      {alertas.map((alerta, i) => {
        const style = STYLES[alerta.tipo] ?? STYLES.info
        const Icon = style.icon

        return (
          <div
            key={i}
            className={cn(
              "flex items-center justify-between gap-4 rounded-lg border p-4",
              style.container
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className={cn("h-5 w-5 shrink-0", style.iconClass)} />
              <p className="text-sm font-medium">{alerta.texto}</p>
            </div>
            {alerta.to && (
              <Link
                to={alerta.to}
                className={cn(
                  "shrink-0 text-sm font-medium",
                  style.linkClass
                )}
              >
                Ver detalle →
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
