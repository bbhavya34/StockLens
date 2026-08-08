"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Slice {
  name: string;
  value: number;
  color: string;
}

export function PortfolioChart({ data, size = 220 }: { data: Slice[]; size?: number }) {
  return (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="92%"
          paddingAngle={3}
          strokeWidth={0}
          animationDuration={900}
        >
          {data.map((slice) => (
            <Cell key={slice.name} fill={slice.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;
            const d = payload[0].payload as Slice;
            return (
              <div className="rounded-md border border-border-strong bg-surface-2 px-3 py-1.5 text-xs shadow-xl">
                <span className="font-medium text-foreground">{d.name}</span>{" "}
                <span className="text-muted">{d.value}%</span>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
