export function FunnelChart({ data = [] }) {
  const maxCount = data[0]?.count ?? 1

  return (
    <div className="space-y-2">
      {data.map((row, i) => {
        const pctWidth = maxCount > 0 ? (row.count / maxCount) * 100 : 0
        const dropOff = i > 0 ? (data[i - 1].pct - row.pct) : 0

        return (
          <div key={row.paso} className="flex items-center gap-3">
            <div className="w-32 shrink-0 text-xs font-medium text-gray-600">
              {row.paso}
            </div>
            <div className="flex-1">
              <div className="flex h-8 items-center overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all"
                  style={{ width: `${pctWidth}%` }}
                />
              </div>
            </div>
            <div className="flex w-24 shrink-0 justify-end gap-2">
              <span className="font-mono text-xs font-semibold text-gray-900">
                {row.count}
              </span>
              {i > 0 && dropOff > 0 && (
                <span className="font-mono text-xs font-medium text-red-600">
                  -{dropOff}%
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
