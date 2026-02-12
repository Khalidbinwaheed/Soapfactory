"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatCompactNumber, formatCurrency } from "@/lib/format"

interface RevenueChartProps {
  data: { name: string; total: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Trend (PKR)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
              tickFormatter={(value) => formatCompactNumber(value)}
            />
             <Tooltip 
                formatter={(value: any) => [formatCurrency(Number(value)), "Revenue"]}
                labelStyle={{ color: "black" }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#f97316" // Orange-500
              strokeWidth={2}
              activeDot={{ r: 6, fill: "#f97316" }}
              dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
