import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n) {
  return new Intl.NumberFormat("es-MX").format(n || 0)
}

export function formatCurrency(n) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n || 0)
}

export function canalColor(canal) {
  return (
    {
      chatgpt: "emerald",
      whatsapp: "green",
      website: "blue",
      agente: "violet",
    }[canal] ?? "gray"
  )
}
