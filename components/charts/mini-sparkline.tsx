"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import { ChartPoint } from "@/data/demo-stocks";

export function MiniSparkline({
  data,
  positive = true,
  height = 48,
}: {
  data: ChartPoint[];
  positive?: boolean;
  height?: number;
}) {
  const color = positive ? "var(--emerald)" : "var(--red)";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.75}
          dot={false}
          isAnimationActive
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
