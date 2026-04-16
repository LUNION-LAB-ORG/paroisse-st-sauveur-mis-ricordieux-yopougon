"use client"

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PieChartProps {
  data: { name: string; value: number; color: string }[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.payload.color }} />
        <p className="text-xs text-gray-500">{d.name}</p>
      </div>
      <p className="text-base font-bold text-[#2d2d83]">{d.value}%</p>
    </div>
  )
}

export function PieChart({ data }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={90}
          dataKey="value"
          strokeWidth={2}
          stroke="#fff"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => <span className="text-xs text-gray-500">{value}</span>}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
