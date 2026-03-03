import { useState } from "react"
import { BarChart } from "@tremor/react"
import { StatCard } from "@/components/dashboard/StatCard"
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
import { Badge } from "@/components/ui/badge"
import { useMockData } from "@/hooks/useMockData"
import { formatNumber, formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

const CANAL_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "website", label: "Website" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "agentes", label: "Agentes" },
]

const INSIGHT_POR_CANAL = {
  todos: "ChatGPT genera 4.7x más prima por peso invertido que agentes. La adopción de AI reduce el CAC en 95%.",
  website: "El canal web tiene el mayor volumen pero el peor CAC ($18). Redirigir tráfico a WhatsApp mejoraría el margen ~35%.",
  whatsapp: "WhatsApp combina el segundo menor CAC ($9) con la conversión más alta (61%) y cierre más rápido (1.8 días).",
  chatgpt: "ChatGPT genera el ticket más alto ($11,200) al menor costo ($4 CAC). Los usuarios de AI tienen mayor poder adquisitivo.",
  agentes: "Agentes tienen conversión del 72% pero a $85 por cotización — 21x más caro que ChatGPT.",
}

export function Canales() {
  const [canalFilter, setCanalFilter] = useState("todos")
  const mock = useMockData()

  const {
    comparativaCanales,
    kpiDataByCanal,
    historico30,
    horaDistribucion,
  } = mock

  const kpiData = kpiDataByCanal?.[canalFilter] ?? kpiDataByCanal?.todos ?? {}
  const historicoData = historico30 ?? []
  const horaData = horaDistribucion?.[canalFilter] ?? horaDistribucion?.todos ?? []

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

      {/* SECCIÓN 1 — KPIs grid 4 cols */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Cotizaciones"
          value={formatNumber(kpiData.cotizaciones)}
          trend={8.2}
          trendLabel="vs 30 días"
        />
        <StatCard
          label="Prima promedio"
          value={formatCurrency(kpiData.primaPromedio)}
        />
        <StatCard
          label="Tasa de conversión"
          value={`${kpiData.conversion ?? 0}%`}
          trend={2.1}
          trendLabel="vs 30 días"
        />
        <StatCard
          label="CAC"
          value={formatCurrency(kpiData.cac)}
          subtitle="vs $180 canal tradicional"
        />
      </div>

      {/* SECCIÓN 2 — Insight por canal */}
      <Card className="border-orange-100 bg-orange-50 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm italic text-orange-900">
            {INSIGHT_POR_CANAL[canalFilter] ?? INSIGHT_POR_CANAL.todos}
          </p>
        </CardContent>
      </Card>

      {/* SECCIÓN 3 — Comparativa de canales */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Comparativa de canales
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
                  Cotizaciones
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Conversión
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Tiempo prom
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Ticket prom
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Intent score
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Cierre (días)
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Cross-sell
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(comparativaCanales ?? []).map((row) => (
                <TableRow
                  key={row.canal}
                  className={cn(
                    "hover:bg-gray-50",
                    row.canal === "ChatGPT" && "bg-orange-50/30"
                  )}
                >
                  <TableCell className="font-medium text-gray-900">
                    {row.canal}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {formatNumber(row.cotizaciones)}
                  </TableCell>
                  <TableCell>
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      {row.conversion}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.tiempoProm}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {formatCurrency(row.ticketProm)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.intentScore}%
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.cierreDias}d
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.crossSell}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SECCIÓN 4 — Histórico 30 días */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Histórico 30 días
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <BarChart
            data={historicoData}
            index="fecha"
            categories={["website", "whatsapp", "chatgpt", "agente"]}
            colors={["blue", "green", "emerald", "violet"]}
            stack
            className="h-48"
            showLegend
          />
        </CardContent>
      </Card>

      {/* SECCIÓN 5 — Distribución horaria */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Distribución horaria
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            Pico de actividad entre 10:00 y 18:00 hrs
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <BarChart
            data={horaData}
            index="hora"
            categories={["count"]}
            colors={["orange"]}
            className="h-36"
            showLegend={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}
