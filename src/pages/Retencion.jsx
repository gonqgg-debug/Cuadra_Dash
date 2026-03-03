import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@tremor/react"
import { useMockData } from "@/hooks/useMockData"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

function retentionCellClass(value) {
  if (value == null) return ""
  if (value >= 90) return "font-semibold text-emerald-700"
  if (value >= 80) return "text-emerald-600"
  if (value >= 70) return "text-amber-600"
  return "text-red-600"
}

function intentColor(value) {
  if (value < 40) return "red"
  if (value <= 60) return "orange"
  return "emerald"
}

function diasBadge(dias) {
  if (dias <= 15)
    return (
      <Badge className="border-red-200 bg-red-50 text-red-700">Urgente</Badge>
    )
  if (dias <= 30)
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-700">
        Próximo
      </Badge>
    )
  return null
}

export function Retencion() {
  const mock = useMockData()
  const { cohortes, polizasVencer, churnRisk } = mock

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1 — Cohortes de retención */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Cohortes de retención
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            De los clientes que contrataron en cada mes, % que renovó en cada mes
            siguiente.
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Mes de adquisición
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Clientes
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Mes 1
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Mes 2
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Mes 3
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Mes 4
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Mes 5
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Mes 6
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(cohortes ?? []).map((row) => (
                <TableRow key={row.mes} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {row.mes}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {row.clientes}
                  </TableCell>
                  {["mes1", "mes2", "mes3", "mes4", "mes5", "mes6"].map(
                    (key) => (
                      <TableCell
                        key={key}
                        className={cn(
                          "text-sm",
                          retentionCellClass(row[key])
                        )}
                      >
                        {row[key] != null ? `${row[key]}%` : "—"}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-xs text-gray-500">
            WhatsApp muestra +8pts vs website en retención al mes 3.
          </p>
        </CardContent>
      </Card>

      {/* SECCIÓN 2 — grid 2 cols */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Pólizas próximas a vencer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Póliza
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Canal
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Prima
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Días restantes
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(polizasVencer ?? []).map((row) => (
                  <TableRow key={row.poliza} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm text-gray-700">
                      {row.poliza}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {row.canal}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {formatCurrency(row.prima)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm",
                            row.diasRestantes <= 15 &&
                              "font-semibold text-red-600",
                            row.diasRestantes > 15 &&
                              row.diasRestantes <= 30 &&
                              "text-amber-600",
                            row.diasRestantes > 30 && "text-gray-600"
                          )}
                        >
                          {row.diasRestantes} días
                        </span>
                        {diasBadge(row.diasRestantes)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Renovar
                      </Button>
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
              Clientes en riesgo de churn
            </CardTitle>
            <p className="mt-1 text-xs text-gray-500">
              Sin interacción reciente y bajo intent de renovación
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Póliza
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Última interacción
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Intent renovación
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(churnRisk ?? []).map((row) => (
                  <TableRow key={row.poliza} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm text-gray-700">
                      {row.poliza}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {row.ultimaInteraccion}
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <ProgressBar
                          value={row.intentRenovacion ?? 0}
                          color={intentColor(row.intentRenovacion ?? 0)}
                          showAnimation
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Contactar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN 3 — Insight */}
      <Card className="border-orange-100 bg-orange-50 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm italic text-orange-900">
            Los clientes adquiridos por WhatsApp tienen 8pts más de retención al
            año. Migrar el 20% del volumen web a WhatsApp representaría ~$340k
            MXN adicionales en primas renovadas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
