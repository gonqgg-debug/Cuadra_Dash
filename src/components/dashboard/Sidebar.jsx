import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  BarChart3,
  Radio,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  MapPin,
  ShieldAlert,
  Settings,
  Play,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    section: "RESUMEN",
    items: [{ to: "/dashboard", icon: LayoutDashboard, label: "Home" }],
  },
  {
    section: "DISTRIBUCIÓN & GROWTH",
    items: [
      { to: "/dashboard/overview", icon: BarChart3, label: "Overview de Ventas" },
      { to: "/dashboard/canales", icon: Radio, label: "Canales & CAC" },
      { to: "/dashboard/conversaciones", icon: MessageSquare, label: "Conversaciones & Intent" },
      { to: "/dashboard/retencion", icon: RefreshCw, label: "Retención & Pipeline" },
    ],
  },
  {
    section: "OPERACIONES & SINIESTROS",
    items: [
      { to: "/dashboard/siniestros", icon: AlertTriangle, label: "FNOL Dashboard" },
      { to: "/dashboard/mapa", icon: MapPin, label: "Mapa de Incidentes" },
      { to: "/dashboard/riesgo", icon: ShieldAlert, label: "Análisis de Riesgo" },
    ],
  },
  {
    section: "SISTEMA",
    items: [
      { to: "/dashboard/configuracion", icon: Settings, label: "Configuración" },
      { to: "/demo", icon: Play, label: "Demo Live" },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-gray-100 px-5">
          <img src="/cuadra_logo.png?v=2" alt="Cuadra" className="h-7 w-auto" />
          <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
            demo
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          {navItems.map((group) => (
            <div key={group.section} className="mb-4">
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {group.section}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/dashboard"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "border-l-2 border-orange-500 bg-orange-50 font-semibold text-orange-700 rounded-r-lg"
                            : "rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <p className="text-[11px] text-gray-400">
            v1.0.0 · Cuadra Insurance Intelligence
          </p>
        </div>
      </div>
    </aside>
  )
}
