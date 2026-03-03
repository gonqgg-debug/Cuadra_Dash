import { createContext, useContext } from "react"
import { useDashboard } from "@/hooks/useDashboard"

const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {
  const value = useDashboard()
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboardContext must be used within DashboardProvider")
  return ctx
}
