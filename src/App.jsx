import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { DemoLayout } from "@/layouts/DemoLayout"
import { Home } from "@/pages/Home"
import { OverviewVentas } from "@/pages/OverviewVentas"
import { Canales } from "@/pages/Canales"
import { Conversaciones } from "@/pages/Conversaciones"
import { Retencion } from "@/pages/Retencion"
import { Siniestros } from "@/pages/Siniestros"
import { MapaIncidentes } from "@/pages/MapaIncidentes"
import { Riesgo } from "@/pages/Riesgo"
import { Configuracion } from "@/pages/Configuracion"
import { Demo } from "@/pages/Demo"

const basename = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "") || "/"

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="overview" element={<OverviewVentas />} />
          <Route path="canales" element={<Canales />} />
          <Route path="conversaciones" element={<Conversaciones />} />
          <Route path="retencion" element={<Retencion />} />
          <Route path="siniestros" element={<Siniestros />} />
          <Route path="mapa" element={<MapaIncidentes />} />
          <Route path="riesgo" element={<Riesgo />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
        <Route path="/demo" element={<DemoLayout />}>
          <Route index element={<Demo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
