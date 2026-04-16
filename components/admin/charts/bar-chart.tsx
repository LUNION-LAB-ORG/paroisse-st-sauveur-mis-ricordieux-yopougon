"use client"

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from "recharts"

interface BarChartProps {
  data: { name: string; value: number }[]
  highlightIndex?: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-base font-bold text-[#2d2d83]">
        {payload[0].value.toLocaleString("fr-FR")} 000 FCFA
      </p>
    </div>
  )
}

export function BarChart({ data, highlightIndex = 4 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsBarChart data={data} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(45, 45, 131, 0.05)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index === highlightIndex ? "#98141f" : "#2d2d83"} fillOpacity={index === highlightIndex ? 1 : 0.2} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
