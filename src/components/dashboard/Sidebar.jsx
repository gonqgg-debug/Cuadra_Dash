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
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-[#0F172A]">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-14 items-center gap-2 border-b border-slate-700/50 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            C
          </div>
          <span className="font-semibold text-white">cuadra</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
            demo
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          {navItems.map((group) => (
            <div key={group.section} className="mb-4">
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
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
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
        <div className="border-t border-slate-700/50 p-4">
          <p className="text-[11px] text-slate-600">
            v1.0.0 · Cuadra Insurance Intelligence
          </p>
        </div>
      </div>
    </aside>
  )
}
