import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  subtitle,
  compact = false,
  flash = false,
}) {
  const isPositive = trend != null && trend >= 0
  const hasTrend = trend != null

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm",
        compact ? "p-4" : "p-5",
        flash && "ring-2 ring-blue-400 ring-offset-1 transition-all duration-300"
      )}
    >
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-semibold text-gray-900 font-mono",
            compact ? "text-xl" : "text-2xl"
          )}
        >
          {value}
        </span>
        {hasTrend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-600"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {trendLabel && (
        <span className="mt-1 block text-xs text-gray-500">{trendLabel}</span>
      )}
      {subtitle && (
        <span className="mt-1 block text-xs text-gray-500">{subtitle}</span>
      )}
    </div>
  )
}
