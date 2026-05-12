"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  {
    day: "Mon",
    production: 120,
  },
  {
    day: "Tue",
    production: 210,
  },
  {
    day: "Wed",
    production: 180,
  },
  {
    day: "Thu",
    production: 260,
  },
  {
    day: "Fri",
    production: 310,
  },
  {
    day: "Sat",
    production: 280,
  },
  {
    day: "Sun",
    production: 340,
  },
]

export function AnalyticsChart() {
  return (
    <div className="h-[320px] w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart data={data}>

          {/* Gradient */}

          <defs>

            <linearGradient
              id="productionGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#A3E635"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#A3E635"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          {/* Grid */}

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
          />

          {/* X */}

          <XAxis
            dataKey="day"
            stroke="#71717A"
            tickLine={false}
            axisLine={false}
          />

          {/* Y */}

          <YAxis
            stroke="#71717A"
            tickLine={false}
            axisLine={false}
          />

          {/* Tooltip */}

          <Tooltip
            contentStyle={{
              background:
                "rgba(10,10,12,0.92)",
              border:
                "1px solid rgba(255,255,255,0.06)",
              borderRadius: "18px",
              backdropFilter: "blur(12px)",
              color: "#fff",
            }}
          />

          {/* Area */}

          <Area
            type="monotone"
            dataKey="production"
            stroke="#A3E635"
            strokeWidth={3}
            fill="url(#productionGradient)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  )
}