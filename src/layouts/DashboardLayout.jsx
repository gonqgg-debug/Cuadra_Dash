import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar } from "@/components/dashboard/Topbar"
import { DashboardProvider, useDashboardContext } from "@/contexts/DashboardContext"

function DashboardLayoutInner() {
  const { connected } = useDashboardContext()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-60">
        <Topbar connected={connected} />
        <main className="pt-14">
          <div className="min-h-screen bg-gray-50 p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <DashboardProvider>
      <DashboardLayoutInner />
    </DashboardProvider>
  )
}
