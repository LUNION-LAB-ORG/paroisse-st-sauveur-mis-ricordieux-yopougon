"use client"

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface PieChartProps {
  data: { name: string; value: number; color: string }[]
}

export function PieChart({ data }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsPieChart>
        <Pie data={data} cx="50%" cy="45%" innerRadius={0} outerRadius={80} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
