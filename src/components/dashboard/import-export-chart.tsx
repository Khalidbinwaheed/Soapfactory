"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ImportExportChartProps {
  data: { name: string; imports: number; exports: number }[]
}

export function ImportExportChart({ data }: ImportExportChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Imports vs Exports</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} barGap={8}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
             <Tooltip cursor={{fill: 'transparent'}} labelStyle={{ color: 'black' }} />
             <Legend />
            <Bar
              dataKey="imports"
              name="Imports"
              fill="#1e293b" // Slate-800
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="exports"
              name="Exports"
              fill="#f59e0b" // Amber-500
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
