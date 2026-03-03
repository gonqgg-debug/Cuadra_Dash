import { useState } from "react"
import { BarList, BarChart, DonutChart } from "@tremor/react"
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
import { useMockData } from "@/hooks/useMockData"
import { cn } from "@/lib/utils"

const INTENT_DISTRIBUCION = [
  { rango: "0-20%", count: 180 },
  { rango: "20-40%", count: 240 },
  { rango: "40-60%", count: 300 },
  { rango: "60-80%", count: 240 },
  { rango: "80-100%", count: 240 },
]

const OBJECIONES_DATA = [
  { name: '"El precio está muy alto"', value: 34 },
  { name: '"¿Cubren robo con violencia?"', value: 22 },
  { name: '"No entiendo la cobertura amplia"', value: 18 },
  { name: '"¿Hay descuento por buen historial?"', value: 15 },
  { name: '"El proceso de contratación es largo"', value: 11 },
]

const EXTRACTOS_MOCK = {
  '"El precio está muy alto"': [
    { usuario: "¿No hay forma de bajar el precio?", asistente: "Le ofrezco el plan Limitada que es 30% más económico.", cerro: false },
    { usuario: "Está caro comparado con mi aseguradora actual", asistente: "Podemos revisar descuentos por pago anual.", cerro: true },
  ],
  '"¿Cubren robo con violencia?"': [
    { usuario: "¿Qué pasa si me roban el carro a mano armada?", asistente: "Sí, la cobertura amplia incluye robo total.", cerro: true },
  ],
  '"No entiendo la cobertura amplia"': [
    { usuario: "¿Qué incluye exactamente la amplia?", asistente: "Incluye daños materiales, robo, RC y asistencia vial.", cerro: false },
  ],
  '"¿Hay descuento por buen historial?"': [
    { usuario: "Nunca he tenido siniestros, ¿hay descuento?", asistente: "Sí, aplicamos hasta 15% por buen historial.", cerro: true },
  ],
  '"El proceso de contratación es largo"': [
    { usuario: "Son muchos pasos, ¿no hay forma más rápida?", asistente: "Por WhatsApp puede completar en 5 minutos.", cerro: false },
  ],
}

const SEÑALES_ALTA_INTENCION = [
  { frase: '"¿Cuánto me sale al mes?"', factor: "3.2x probabilidad" },
  { frase: '"¿Aceptan pagos con tarjeta?"', factor: "2.8x probabilidad" },
  { frase: '"¿Cuándo entraría en vigor?"', factor: "2.5x probabilidad" },
  { frase: '"¿Tienen app?"', factor: "2.1x probabilidad" },
]

const SEÑALES_CROSS_SELL = [
  { frase: '"¿También hacen seguros de casa?"', conversiones: "89 conversiones" },
  { frase: '"Me voy de viaje la próxima semana"', conversiones: "67 conversiones" },
  { frase: '"Acabo de comprar un depa"', conversiones: "54 conversiones" },
  { frase: '"Tenemos 2 autos en casa"', conversiones: "41 conversiones" },
]

const EDAD_DATA = [
  { name: "18-25", value: 8 },
  { name: "26-35", value: 31 },
  { name: "36-45", value: 38 },
  { name: "46-55", value: 18 },
  { name: "56+", value: 5 },
]

const COBERTURA_DATA = [
  { nombre: "Amplia", pct: 58 },
  { nombre: "Limitada", pct: 29 },
  { nombre: "RC", pct: 13 },
]

const CP_ZONA_DATA = [
  { cp: "11560", zona: "Polanco/Condesa", count: 89 },
  { cp: "03100", zona: "Roma/Condesa", count: 72 },
  { cp: "06600", zona: "Juárez/Cuauhtémoc", count: 65 },
  { cp: "44100", zona: "Guadalajara Centro", count: 58 },
  { cp: "64000", zona: "Monterrey Valle", count: 52 },
  { cp: "54000", zona: "Toluca", count: 48 },
  { cp: "44600", zona: "Guadalajara Providencia", count: 44 },
  { cp: "11000", zona: "CDMX Sur", count: 41 },
  { cp: "44610", zona: "Guadalajara Americana", count: 38 },
  { cp: "54090", zona: "Querétaro", count: 35 },
]

const MARCAS_DATA = [
  { name: "Nissan", value: 28 },
  { name: "Volkswagen", value: 22 },
  { name: "Chevrolet", value: 17 },
  { name: "Toyota", value: 14 },
  { name: "KIA", value: 11 },
]

const PREGUNTAS_KB = [
  { pregunta: "¿Cuánto tiempo tarda en llegar el ajustador?", frecuencia: "23 veces", canal: "WhatsApp" },
  { pregunta: "¿Puedo agregar a mi esposa como conductora adicional?", frecuencia: "18 veces", canal: "ChatGPT" },
  { pregunta: "¿El seguro cubre si manejaba mi hijo?", frecuencia: "15 veces", canal: "Website" },
  { pregunta: "¿Qué pasa si choco en EE.UU.?", frecuencia: "12 veces", canal: "WhatsApp" },
  { pregunta: "¿Puedo pausar mi seguro si no uso el carro?", frecuencia: "9 veces", canal: "ChatGPT" },
]

export function Conversaciones() {
  const [expandedObjecion, setExpandedObjecion] = useState(null)
  const [toastId, setToastId] = useState(null)

  const mock = useMockData()

  function handleObjecionClick(payload) {
    setExpandedObjecion((prev) => (prev === payload?.name ? null : payload?.name))
  }

  function handleAgregarKB(index) {
    setToastId(index)
    setTimeout(() => setToastId(null), 2000)
  }

  const extractos = expandedObjecion ? (EXTRACTOS_MOCK[expandedObjecion] ?? []) : []

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1 — Intent Score Distribution */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Intent Score Distribution
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            Segmento 80-100% = oportunidades de alta intención sin cerrar.
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <BarChart
            data={INTENT_DISTRIBUCION}
            index="rango"
            categories={["count"]}
            colors={["orange"]}
            className="h-36"
            showLegend={false}
          />
        </CardContent>
      </Card>

      {/* SECCIÓN 2 — Mapa de objeciones */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Mapa de objeciones
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            Frases que generan abandono. Click para ver extractos de conversaciones.
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <BarList
            data={OBJECIONES_DATA}
            valueFormatter={(v) => `${v}%`}
            color="orange"
            onValueChange={handleObjecionClick}
          />
          {expandedObjecion && extractos.length > 0 && (
            <div className="mt-4 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4">
              {extractos.map((ex, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-500">Usuario:</span>{" "}
                    <span className="text-gray-800">{ex.usuario}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-500">Asistente:</span>{" "}
                    <span className="text-gray-800">{ex.asistente}</span>
                  </p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      ex.cerro
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    )}
                  >
                    {ex.cerro ? "Cerró" : "No cerró"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECCIÓN 3 — Señales de intent */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Señales de alta intención (abandono)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 rounded-lg bg-red-50 p-3">
              {SEÑALES_ALTA_INTENCION.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{s.frase}</span>
                  <span className="font-bold text-red-700">{s.factor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Señales de cross-sell detectadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 rounded-lg bg-orange-50 p-3">
              {SEÑALES_CROSS_SELL.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{s.frase}</span>
                  <span className="font-bold text-orange-700">
                    {s.conversiones}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN 4 — Demografía 2x2 */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Distribución por edad
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <BarList
              data={EDAD_DATA}
              valueFormatter={(v) => `${v}%`}
              color="orange"
            />
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Cobertura más cotizada
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <DonutChart
              data={COBERTURA_DATA}
              index="nombre"
              category="pct"
              colors={["orange", "slate", "gray"]}
              valueFormatter={(v) => `${v}%`}
              className="h-44"
            />
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Top 10 CP / zona de cotizaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ol className="space-y-2">
              {CP_ZONA_DATA.map((row, i) => (
                <li
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {i + 1}. {row.cp} — {row.zona}
                  </span>
                  <span className="font-mono font-semibold text-gray-900">
                    {row.count}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Top 5 marcas cotizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <BarList
              data={MARCAS_DATA}
              valueFormatter={(v) => `${v}%`}
              color="orange"
            />
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN 5 — Preguntas sin respuesta satisfactoria */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Preguntas sin respuesta satisfactoria
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            Estas preguntas generaron respuestas que el usuario rechazó o
            abandonó. Actualizar KB.
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Pregunta
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Frecuencia
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Canal
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PREGUNTAS_KB.map((row, i) => (
                <TableRow key={i} className="hover:bg-gray-50">
                  <TableCell className="text-sm text-gray-700">
                    {row.pregunta}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.frecuencia}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.canal}
                  </TableCell>
                  <TableCell>
                    {toastId === i ? (
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        ✓ Guardado
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleAgregarKB(i)}
                      >
                        Agregar a KB
                      </Button>
                    )}
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
