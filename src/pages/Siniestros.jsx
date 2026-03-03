import { useState } from "react"
import { DonutChart, ProgressBar } from "@tremor/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useMockData } from "@/hooks/useMockData"
import { formatCurrency } from "@/lib/utils"
import { Shield, Clock, FileCheck, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FILTER_TABS = [
  { id: "todos", label: "Todos" },
  { id: "en_documentacion", label: "En documentación" },
  { id: "en_valuacion", label: "En valuación" },
  { id: "requiere_atencion", label: "Requiere atención" },
]

const CANAL_DOT = {
  chatgpt: "bg-emerald-500",
  whatsapp: "bg-green-500",
  website: "bg-blue-500",
  agente: "bg-violet-500",
  callcenter: "bg-gray-500",
}

const CANAL_LABEL = {
  chatgpt: "ChatGPT",
  whatsapp: "WhatsApp",
  website: "Website",
  agente: "Agentes",
  callcenter: "Call Center",
}

function getCanalDot(canal) {
  return CANAL_DOT[canal?.toLowerCase()] ?? "bg-gray-400"
}

function getCanalLabel(canal) {
  return CANAL_LABEL[canal?.toLowerCase()] ?? canal
}

function capitalizar(str) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function estadoLabel(estado) {
  const map = {
    en_documentacion: "En documentación",
    en_valuacion: "En valuación",
  }
  return map[estado] ?? estado
}

const FNOL_CANAL_DATA = [
  { canal: "WhatsApp", count: 42 },
  { canal: "ChatGPT", count: 31 },
  { canal: "Website", count: 18 },
  { canal: "Call Center", count: 9 },
]

export function Siniestros() {
  const [filterTab, setFilterTab] = useState("todos")
  const mock = useMockData()
  const { fnolMetricas, MOCK_SINIESTROS } = mock

  const filteredSiniestros = (MOCK_SINIESTROS ?? []).filter((s) => {
    if (filterTab === "todos") return true
    if (filterTab === "en_documentacion") return s.estado === "en_documentacion"
    if (filterTab === "en_valuacion") return s.estado === "en_valuacion"
    if (filterTab === "requiere_atencion") return s.horasAbiertas >= 48
    return true
  })

  const reservaTotal = (MOCK_SINIESTROS ?? []).reduce((sum, s) => sum + (s.reserva ?? 0), 0)
  const top3Reserva = (MOCK_SINIESTROS ?? [])
    .slice()
    .sort((a, b) => (b.reserva ?? 0) - (a.reserva ?? 0))
    .slice(0, 3)

  const m = fnolMetricas ?? {}
  const tiempo = m.tiempoReporte ?? { digital: 4, callCenter: 22, unidad: "min" }
  const completitud = m.completitudPrimerReporte ?? { digital: 87, callCenter: 52 }
  const costo = m.costoPorFnol ?? { digital: 18, callCenter: 120 }
  const sla = m.slaCumplimiento ?? { digital: 94, callCenter: 71 }

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1 — Métricas de impacto FNOL conversacional */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Métricas de impacto FNOL conversacional
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <div className="mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Tiempo de reporte
                </span>
              </div>
              <p className="font-display text-2xl font-semibold text-gray-900">
                {tiempo.digital} {tiempo.unidad ?? "min"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                vs {tiempo.callCenter} min call center
              </p>
              <Badge className="mt-2 border-emerald-200 bg-emerald-50 text-emerald-700">
                -82%
              </Badge>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <div className="mb-1 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-gray-400" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Completitud primer reporte
                </span>
              </div>
              <p className="font-display text-2xl font-semibold text-gray-900">
                {completitud.digital}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                vs {completitud.callCenter}% call center
              </p>
              <Badge className="mt-2 border-emerald-200 bg-emerald-50 text-emerald-700">
                +35pts
              </Badge>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <div className="mb-1 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-gray-400" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Costo por FNOL
                </span>
              </div>
              <p className="font-display text-2xl font-semibold text-gray-900">
                {formatCurrency(costo.digital)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                vs {formatCurrency(costo.callCenter)} call center
              </p>
              <Badge className="mt-2 border-emerald-200 bg-emerald-50 text-emerald-700">
                -85%
              </Badge>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <div className="mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  SLA cumplimiento
                </span>
              </div>
              <p className="font-display text-2xl font-semibold text-gray-900">
                {sla.digital}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                vs {sla.callCenter}% call center
              </p>
              <Badge className="mt-2 border-emerald-200 bg-emerald-50 text-emerald-700">
                +23pts
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2 — Filter tabs + tabla */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Siniestros activos
          </CardTitle>
          <div className="flex gap-1">
            {FILTER_TABS.map((tab) => {
              const isRequiereAtencion = tab.id === "requiere_atencion"
              const isActive = filterTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterTab(tab.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? isRequiereAtencion
                        ? "bg-red-500 text-white"
                        : "bg-orange-500 text-white"
                      : isRequiereAtencion
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Folio
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Tipo
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Canal FNOL
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Zona
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Severidad
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Completitud
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Horas abierto
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Estado
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSiniestros.map((s) => (
                <TableRow key={s.folio} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm text-gray-700">
                    {s.folio}
                  </TableCell>
                  <TableCell>{capitalizar(s.tipo)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          getCanalDot(s.canalFnol)
                        )}
                      />
                      <span className="text-sm">{getCanalLabel(s.canalFnol)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{s.zona}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border text-xs",
                        s.severidad === "total" &&
                          "border-red-200 bg-red-50 text-red-700",
                        s.severidad === "media" &&
                          "border-amber-200 bg-amber-50 text-amber-700",
                        s.severidad === "menor" &&
                          "border-gray-200 bg-gray-100 text-gray-600"
                      )}
                    >
                      {capitalizar(s.severidad)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <ProgressBar
                        value={s.completitud ?? 0}
                        color={s.completitud >= 70 ? "emerald" : "orange"}
                        showAnimation
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-sm",
                        s.horasAbiertas >= 48 && "font-semibold text-red-600"
                      )}
                    >
                      {s.horasAbiertas}h
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {estadoLabel(s.estado)}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSiniestros.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No hay siniestros que coincidan con el filtro
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECCIÓN 3 — grid 2 cols */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Canal FNOL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <DonutChart
              data={FNOL_CANAL_DATA}
              index="canal"
              category="count"
              colors={["green", "emerald", "blue", "gray"]}
              valueFormatter={(v) => v}
              className="h-48"
            />
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Reserva total activa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="font-display text-3xl font-semibold text-gray-900">
              {formatCurrency(reservaTotal)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              en siniestros activos
            </p>
            <div className="mt-4 space-y-3">
              {top3Reserva.map((s) => (
                <div key={s.folio} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-gray-700">{s.folio}</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(s.reserva)}
                    </span>
                  </div>
                  <ProgressBar
                    value={s.completitud ?? 0}
                    color={s.completitud >= 70 ? "emerald" : "orange"}
                    showAnimation
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
