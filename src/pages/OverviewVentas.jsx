import { useState } from "react"
import { DonutChart } from "@tremor/react"
import { StatCard } from "@/components/dashboard/StatCard"
import { FunnelChart } from "@/components/dashboard/FunnelChart"
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
import { formatNumber, formatCurrency, cn } from "@/lib/utils"

const CANAL_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "website", label: "Website" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "agentes", label: "Agentes" },
]

const CANAL_LABELS = {
  todos: "Todos los canales",
  website: "Website",
  whatsapp: "WhatsApp",
  chatgpt: "ChatGPT",
  agentes: "Agentes",
}

const PIPELINE_DATA = [
  { canal: "ChatGPT", perfil: "Honda CR-V 2024, 34 años, CP 11560", intent: 92, tiempo: "2h", accion: "Seguimiento WhatsApp" },
  { canal: "WhatsApp", perfil: "VW Tiguan 2023, 41 años, CP 03100", intent: 88, tiempo: "4h", accion: "Recordatorio precio" },
  { canal: "Website", perfil: "Nissan X-Trail 2022, 29 años, CP 44100", intent: 85, tiempo: "1h", accion: "Enviar cotización" },
  { canal: "ChatGPT", perfil: "Toyota RAV4 2024, 38 años, CP 64000", intent: 83, tiempo: "6h", accion: "Seguimiento WhatsApp" },
  { canal: "WhatsApp", perfil: "Mazda CX-5 2023, 45 años, CP 06600", intent: 81, tiempo: "3h", accion: "Recordatorio precio" },
  { canal: "Website", perfil: "KIA Sportage 2022, 33 años, CP 11560", intent: 80, tiempo: "8h", accion: "Enviar cotización" },
  { canal: "ChatGPT", perfil: "Ford Explorer 2024, 52 años, CP 54000", intent: 78, tiempo: "5h", accion: "Seguimiento WhatsApp" },
  { canal: "Agentes", perfil: "BMW X3 2023, 47 años, CP 11000", intent: 76, tiempo: "12h", accion: "Llamar ahora" },
  { canal: "WhatsApp", perfil: "Hyundai Tucson 2022, 36 años, CP 44600", intent: 74, tiempo: "9h", accion: "Recordatorio precio" },
  { canal: "Website", perfil: "Audi Q5 2024, 43 años, CP 45010", intent: 71, tiempo: "7h", accion: "Enviar cotización" },
]

function IntentBadge({ score }) {
  const style =
    score >= 85
      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
      : score >= 70
        ? "border border-amber-200 bg-amber-50 text-amber-700"
        : "border border-gray-200 bg-gray-100 text-gray-600"
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-xs font-medium",
        style
      )}
    >
      {score}%
    </span>
  )
}

export function OverviewVentas() {
  const [canalFilter, setCanalFilter] = useState("todos")
  const mock = useMockData()

  const {
    funnelSteps,
    funnelData,
    mixProductos,
    crossSellTableData,
  } = mock

  const activeFunnel = funnelData[canalFilter] ?? funnelData.todos
  const mixProductosChart = mixProductos.map((item) => ({
    name: item.nombre,
    value: item.pct,
  }))

  return (
    <div className="space-y-6">
      {/* Canal filter tabs */}
      <div className="flex gap-1">
        {CANAL_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setCanalFilter(f.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              canalFilter === f.id
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* SECCIÓN 1 — KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Cotizaciones"
          value={formatNumber(funnelSteps[0]?.count)}
          trend={-41}
          trendLabel="vs. 30 días"
        />
        <StatCard
          label="Tasa de conversión"
          value={`${funnelSteps[4]?.pct ?? 47}%`}
          trend={2.1}
        />
        <StatCard
          label="Click en Contratar"
          value={formatNumber(funnelSteps[3]?.count)}
          trend={null}
          subtitle="59%"
        />
        <StatCard
          label="Firmaron póliza"
          value={formatNumber(funnelSteps[4]?.count)}
          trend={null}
          subtitle="47%"
        />
      </div>

      {/* SECCIÓN 2 — Funnel completo */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Funnel de conversión — {CANAL_LABELS[canalFilter]}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <FunnelChart data={activeFunnel} />
        </CardContent>
      </Card>

      {/* SECCIÓN 3 — grid 2 cols */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Mix de productos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <DonutChart
              data={mixProductosChart}
              index="name"
              category="value"
              colors={["orange", "blue", "violet"]}
              valueFormatter={(v) => `${v}%`}
              className="h-48"
            />
            <p className="mt-2 text-xs text-orange-600">
              Hogar +8% MoM — oportunidad cross-sell
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Cross-sell pairs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Combinación
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Pólizas
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Prima promedio
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crossSellTableData.map((row) => (
                  <TableRow
                    key={row.combo}
                    className="border-gray-100 hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{row.combo}</TableCell>
                    <TableCell className="font-mono">
                      {formatNumber(row.polizas)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(row.prima)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN 4 — Top 10 Pipeline */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Top 10 Pipeline de alta intención
          </CardTitle>
          <p className="text-xs text-gray-500">
            Conversaciones con intent score &gt;80% que no cerraron. Dinero en la
            mesa.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Canal
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Resumen del perfil
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Intent score
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Tiempo desde última int.
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Acción sugerida
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PIPELINE_DATA.map((row, i) => (
                <TableRow
                  key={i}
                  className="border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="font-medium">{row.canal}</TableCell>
                  <TableCell className="text-gray-600">{row.perfil}</TableCell>
                  <TableCell>
                    <IntentBadge score={row.intent} />
                  </TableCell>
                  <TableCell className="text-gray-500">{row.tiempo}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="h-7 text-xs"
                    >
                      {row.accion}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
