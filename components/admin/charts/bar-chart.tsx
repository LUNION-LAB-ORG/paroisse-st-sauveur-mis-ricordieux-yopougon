"use client"

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

interface BarChartProps {
  data: { name: string; value: number }[]
  highlightIndex?: number
}

export function BarChart({ data, highlightIndex = 4 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsBarChart data={data} barCategoryGap="20%">
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
        <YAxis hide />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index === highlightIndex ? "#8B1538" : "#E8E0F0"} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
