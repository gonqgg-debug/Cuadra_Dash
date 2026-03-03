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
import { Button } from "@/components/ui/button"
import { BarList } from "@tremor/react"
import { useMockData } from "@/hooks/useMockData"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { ShieldAlert } from "lucide-react"

const CANAL_DOT = {
  WhatsApp: "bg-green-500",
  ChatGPT: "bg-emerald-500",
  Website: "bg-blue-500",
  Llamada: "bg-gray-400",
}

function getCanalDot(canal) {
  return CANAL_DOT[canal] ?? "bg-gray-400"
}

function slaBadgeClass(sla) {
  if (sla >= 90) return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (sla >= 70) return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-red-200 bg-red-50 text-red-700"
}

export function Riesgo() {
  const mock = useMockData()
  const { senalesFraude, fnolPorCanal, indiceRiesgoZona } = mock

  const barListData = (indiceRiesgoZona ?? []).map((r) => ({
    name: r.zona,
    value: r.siniestrosMes,
  }))

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1 — Señales de fraude potencial */}
      <Card className="border-amber-200 bg-amber-50/30 shadow-sm">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">
              Señales de fraude potencial
            </CardTitle>
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Patrones detectados por IA en los últimas 30 días. Requieren
            revisión manual.
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {(senalesFraude ?? []).map((item, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {item.patron}
                  </p>
                  {(item.cp || item.detalle || item.zona) && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {item.cp && `CP ${item.cp}`}
                      {item.detalle && ` · ${item.detalle}`}
                      {item.zona && ` · ${item.zona}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                    {item.badge}
                  </Badge>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Ver detalle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2 — FNOL por canal */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Comparativa FNOL por canal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Canal
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Reportes
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Completitud
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Tiempo prom
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Docs adjuntos
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  SLA
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(fnolPorCanal ?? []).map((row) => (
                <TableRow
                  key={row.canal}
                  className={cn(
                    "hover:bg-gray-50",
                    row.canal === "Llamada" && "text-gray-500"
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          getCanalDot(row.canal)
                        )}
                      />
                      <span
                        className={cn(
                          row.canal === "Llamada"
                            ? "text-gray-500"
                            : "text-gray-900"
                        )}
                      >
                        {row.canal}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-sm",
                      row.canal === "Llamada" ? "text-gray-500" : "text-gray-700"
                    )}
                  >
                    {row.reportes}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-sm",
                      row.canal === "Llamada" ? "text-gray-500" : "text-gray-700"
                    )}
                  >
                    {row.completitud}%
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-sm",
                      row.canal === "Llamada" ? "text-gray-500" : "text-gray-700"
                    )}
                  >
                    {row.tiempoProm}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-sm",
                      row.canal === "Llamada" ? "text-gray-500" : "text-gray-700"
                    )}
                  >
                    {row.docsAdjuntos}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border text-xs",
                        slaBadgeClass(row.sla)
                      )}
                    >
                      {row.sla}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SECCIÓN 3 — grid 2 cols */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Índice de riesgo por zona
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <BarList
              data={barListData}
              valueFormatter={(v) => `${v} reportes`}
              color="orange"
            />
          </CardContent>
        </Card>

        <Card className="border-orange-100 bg-orange-50 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Insight de riesgo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-orange-900">
              Las zonas de alto riesgo concentran el 68% de la reserva total. Los
              canales digitales reportan fraude potencial 3.2% de los casos —
              comparable al promedio de la industria. La IA detectó 3 patrones
              anómalos este mes.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-orange-100 bg-white p-3">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Fraude detectado
                </div>
                <p className="mt-1 font-display text-lg font-semibold text-gray-900">
                  3.2%
                </p>
                <p className="text-xs text-gray-500">vs 3.8% industria</p>
              </div>
              <div className="rounded-lg border border-orange-100 bg-white p-3">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Falsos positivos
                </div>
                <p className="mt-1 font-display text-lg font-semibold text-gray-900">
                  0.4%
                </p>
                <p className="text-xs text-gray-500">últimos 30 días</p>
              </div>
              <div className="rounded-lg border border-orange-100 bg-white p-3">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Ahorro estimado
                </div>
                <p className="mt-1 font-display text-lg font-semibold text-gray-900">
                  $180k
                </p>
                <p className="text-xs text-gray-500">por detección temprana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
