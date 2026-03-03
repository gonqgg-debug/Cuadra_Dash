import { useState, useMemo } from "react"
import { AreaChart } from "@tremor/react"
import { Zap } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { LiveFeed } from "@/components/dashboard/LiveFeed"
import { AlertBanner } from "@/components/dashboard/AlertBanner"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useDashboardContext } from "@/contexts/DashboardContext"
import { useMockData } from "@/hooks/useMockData"
import { formatNumber, formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

const AVG30 = 42
const CANAL_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "website", label: "Website" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "agentes", label: "Agentes" },
]

export function Home() {
  const [canalFilter, setCanalFilter] = useState("todos")
  const { events, kpis, flash } = useDashboardContext()
  const mock = useMockData()

  const {
    hourlyHoyAyer,
    siniestrosActivos,
    siniestrosSlaRiesgo,
    objecion1,
    crossSellRate,
    insightDia,
  } = mock

  const leadsSinCerrar = kpis.leadsSinCerrar ?? 12
  const kpiData = {
    primaPromedio: kpis.primaPromedio ?? 12500,
    intentScore: kpis.intentScore ?? 78,
    cac: kpis.cac ?? 85,
  }

  const cotizacionesTrend = useMemo(() => {
    const cot = kpis.cotizaciones ?? 0
    if (AVG30 === 0) return 0
    return Math.round(((cot - AVG30) / AVG30) * 100)
  }, [kpis.cotizaciones])

  const chartData = useMemo(() => {
    const currentHour = new Date().getHours()
    const totalHoy = hourlyHoyAyer
      .slice(0, currentHour + 1)
      .reduce((sum, h) => sum + h.hoy, 0)
    const scale = totalHoy > 0 ? (kpis.cotizaciones ?? 0) / totalHoy : 1

    return hourlyHoyAyer.map((h, i) => ({
      hora: h.hora,
      Hoy: i <= currentHour ? Math.round(h.hoy * scale) : 0,
      Ayer: h.ayer,
    }))
  }, [hourlyHoyAyer, kpis.cotizaciones])

  const showAlertBanner =
    siniestrosSlaRiesgo > 0 || leadsSinCerrar > 8

  const alertas = useMemo(() => {
    const items = []
    if (siniestrosSlaRiesgo > 0) {
      items.push({
        tipo: "critica",
        texto: `${siniestrosSlaRiesgo} siniestro(s) con SLA en riesgo de incumplimiento.`,
        to: "/dashboard/siniestros",
      })
    }
    if (leadsSinCerrar > 8) {
      items.push({
        tipo: "advertencia",
        texto: `${leadsSinCerrar} leads de alta intención sin cerrar en las últimas 24h.`,
        to: "/dashboard/conversaciones",
      })
    }
    return items
  }, [siniestrosSlaRiesgo, leadsSinCerrar])

  const insightTexto = insightDia[insightDia.length - 1] ?? insightDia[0]

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: Canal filter tabs */}
      <div className="flex gap-1">
        {CANAL_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setCanalFilter(f.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              canalFilter === f.id
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* SECCIÓN 2: AlertBanner (condicional) */}
      {showAlertBanner && <AlertBanner alertas={alertas} />}

      {/* SECCIÓN 3: KPIs primarios */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Cotizaciones hoy"
          value={formatNumber(kpis.cotizaciones)}
          trend={cotizacionesTrend}
          trendLabel="vs avg 30 días"
          flash={flash("cotizaciones")}
        />
        <StatCard
          label="Prima promedio"
          value={formatCurrency(kpiData.primaPromedio)}
          trend={5.2}
          trendLabel="vs. semana pasada"
        />
        <StatCard
          label="Intent score promedio"
          value={`${kpiData.intentScore}%`}
          trend={2.1}
          trendLabel="conversaciones alta intención"
        />
        <StatCard
          label="Costo por cotización"
          value={formatCurrency(kpiData.cac)}
          trend={null}
          subtitle="vs $180 canal tradicional"
        />
      </div>

      {/* SECCIÓN 4: KPIs secundarios */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          compact
          label="Leads alta intención sin cerrar"
          value={formatNumber(leadsSinCerrar)}
          trend={null}
          trendLabel="últimas 24h, intent >80%"
        />
        <StatCard
          compact
          label="Cross-sell rate"
          value={`${crossSellRate}%`}
          trend={null}
          trendLabel="más de un producto en sesión"
        />
        <StatCard
          compact
          label="Objeción #1"
          value={
            ((t) => (t.length > 22 ? `${t.slice(0, 22)}…` : t))(
              objecion1?.texto ?? "—"
            )
          }
          trend={null}
          trendLabel={`${objecion1?.porcentaje ?? 0}% de abandonos`}
        />
        <StatCard
          compact
          label="Siniestros activos"
          value={formatNumber(siniestrosActivos)}
          trend={null}
          subtitle={
            siniestrosSlaRiesgo > 0
              ? `${siniestrosSlaRiesgo} con SLA en riesgo`
              : undefined
          }
        />
      </div>

      {/* SECCIÓN 5: Chart + Live Feed */}
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-4 pb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Cotizaciones — hoy vs. ayer
              </h3>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <AreaChart
                data={chartData}
                index="hora"
                categories={["Hoy", "Ayer"]}
                colors={["blue", "gray"]}
                showLegend={true}
                showGridLines={false}
                curveType="monotone"
                className="h-52"
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-4 pb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Actividad en tiempo real
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <LiveFeed events={events} maxItems={12} embedded />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECCIÓN 6: Insight del día */}
      <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 shrink-0 text-orange-500" />
          <p className="font-display text-sm italic text-orange-900">
            {insightTexto}
          </p>
        </div>
      </div>
    </div>
  )
}
