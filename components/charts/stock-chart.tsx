"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartPoint } from "@/data/demo-stocks";

interface StockChartProps {
  data: ChartPoint[];
  positive: boolean;
  height?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border border-border-strong bg-surface-2 px-3 py-2 text-xs shadow-xl">
      <p className="text-muted">{label}</p>
      <p className="font-mono-tab font-semibold text-foreground">
        ₹{payload[0].value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export function StockChart({ data, positive, height = 280 }: StockChartProps) {
  const color = positive ? "var(--emerald)" : "var(--red)";
  const gradientId = `chartGradient-${positive ? "up" : "down"}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted)", fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-strong)", strokeDasharray: "3 3" }} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
