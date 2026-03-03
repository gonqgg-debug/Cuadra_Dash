import { useState, useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DonutChart, BarList } from "@tremor/react"
import { useMockData } from "@/hooks/useMockData"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { AlertTriangle, Info } from "lucide-react"

const INDICE_COLOR = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#6b7280",
}

const INDICE_BADGE_CLASS = {
  Critical: "border-red-200 bg-red-50 text-red-700",
  High: "border-amber-200 bg-amber-50 text-amber-700",
  Medium: "border-yellow-200 bg-yellow-50 text-yellow-700",
  Low: "border-gray-200 bg-gray-100 text-gray-600",
}

function indiceBadgeClass(indice) {
  return INDICE_BADGE_CLASS[indice] ?? "border-gray-200 bg-gray-100 text-gray-600"
}

function zonaCalienteStyle(nivel) {
  const map = {
    critical: { container: "border-red-200 bg-red-50", icon: AlertTriangle, iconClass: "text-red-500" },
    warning: { container: "border-amber-200 bg-amber-50", icon: AlertTriangle, iconClass: "text-amber-500" },
    info: { container: "border-blue-200 bg-blue-50", icon: Info, iconClass: "text-blue-500" },
  }
  return map[nivel] ?? map.info
}

function IncidentMap({ markers }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        Cargando mapa…
      </div>
    )
  }

  return (
    <MapContainer
      center={[23.6345, -102.5528]}
      zoom={5}
      style={{ height: "480px", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='© OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <CircleMarker
          key={m.zona}
          center={[m.lat, m.lng]}
          radius={Math.max(8, m.count * 2.5)}
          pathOptions={{
            color: INDICE_COLOR[m.indice] ?? "#6b7280",
            fillColor: INDICE_COLOR[m.indice] ?? "#6b7280",
            fillOpacity: 0.7,
            weight: 1,
          }}
        >
          <Popup>
            <div style={{ minWidth: "140px" }}>
              <strong>{m.zona}</strong>
              <br />
              Siniestros: {m.count}
              <br />
              Tipo: {m.tipo}
              <br />
              Riesgo: {m.indice}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}

export function MapaIncidentes() {
  const mock = useMockData()
  const {
    indiceRiesgoZona,
    razonesSiniestro,
    zonasCalientes,
    severidadDistribucion,
    mapMarkers,
  } = mock

  const topZonas = (mapMarkers ?? []).slice().sort((a, b) => b.count - a.count).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1 — Mapa + Leyenda */}
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">
                Mapa de incidentes — México
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-visible p-4 pt-0">
              <div className="h-[480px] w-full rounded-lg">
                <IncidentMap markers={mapMarkers ?? []} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 space-y-4">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">
                Leyenda de riesgo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#ef4444]" />
                  <span className="text-sm">Critical — Acción inmediata</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#f97316]" />
                  <span className="text-sm">High — Monitoreo activo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#eab308]" />
                  <span className="text-sm">Medium — Seguimiento</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#6b7280]" />
                  <span className="text-sm">Low — Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">
                Top zonas activas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {topZonas.map((m) => (
                  <div
                    key={m.zona}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">{m.zona}</span>
                    <Badge
                      variant="secondary"
                      className={cn("border text-xs", indiceBadgeClass(m.indice))}
                    >
                      {m.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN 2 — grid 2 cols */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Índice de riesgo por zona
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Zona
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Siniestros/mes
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Monto prom
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Tipo frecuente
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Índice
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(indiceRiesgoZona ?? []).map((row) => (
                  <TableRow key={row.zona} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {row.zona}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {row.siniestrosMes}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {formatCurrency(row.montoProm)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {row.tipoFrecuente}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border text-xs",
                          indiceBadgeClass(row.indice)
                        )}
                      >
                        {row.indice}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Distribución por tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {(razonesSiniestro ?? []).map((item) => (
                <div key={item.name} className="space-y-1">
                  <BarList
                    data={[{ name: item.name, value: item.value }]}
                    valueFormatter={(v) => `${v}%`}
                    color="orange"
                  />
                  {item.trend != null && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        item.trend > 0
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : item.trend < 0
                            ? "border-red-200 bg-red-50 text-red-600"
                            : "border-gray-200 bg-gray-100 text-gray-600"
                      )}
                    >
                      {item.trend > 0 ? "↑" : item.trend < 0 ? "↓" : "→"}{" "}
                      {item.trend !== 0 ? `${Math.abs(item.trend)}%` : "—"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN 3 — grid 2 cols */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Zonas calientes — últimas 48h
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {(zonasCalientes ?? []).map((item) => {
                const style = zonaCalienteStyle(item.nivel)
                const Icon = style.icon
                return (
                  <div
                    key={item.zona}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3",
                      style.container
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", style.iconClass)} />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {item.zona}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {item.count} reportes · {item.tipo} · {item.periodo}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Distribución por severidad
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <DonutChart
              data={severidadDistribucion ?? []}
              index="rango"
              category="pct"
              colors={["gray", "orange", "amber", "red"]}
              valueFormatter={(v) => `${v}%`}
              className="h-44"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
