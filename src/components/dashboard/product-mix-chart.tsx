"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductMixChartProps {
    data: { name: string; value: number }[]
}

const COLORS = ['#f59e0b', '#1e293b', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6'];

export function ProductMixChart({ data }: ProductMixChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Product Mix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full items-center justify-center flex">
             <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                </Pie>
                 <Tooltip />
                 <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
