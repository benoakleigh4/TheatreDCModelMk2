import React from "react";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import ChartHeader from "./ChartHeader";

export default function WLAnalysisTab({
  data,
  timeframe,
  onTimeframeChange,
  rttTargetPercent,
  calcMode,
  sustainableWlSize,
}) {
  if (!data || data.length === 0) {
    return <p className="no-data-msg">No WL analysis data available.</p>;
  }

  const chartTitle = "WL Analysis";
  const chartSubtitle =
    calcMode === "target"
      ? "Impact of required activity on waiting list size and RTT performance."
      : "Projected impact of timetable capacity on waiting list size and RTT performance.";

  const sliceWeeks = { "3m": 13, "6m": 26, "1y": 52 };
  const slicedData = data.slice(0, sliceWeeks[timeframe] || 52);

  return (
    <div className="card">
      <ChartHeader
        Icon={TrendingUp}
        title={chartTitle}
        subtitle={chartSubtitle}
        timeframe={timeframe}
        onTimeframeChange={onTimeframeChange}
      />

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={slicedData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="week" />
          <YAxis
            yAxisId="left"
            label={{ value: "WL Size", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "RTT %", angle: -90, position: "insideRight" }}
          />
          <Tooltip />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="totalWL"
            fill="#90caf9"
            stroke="#1976d2"
            name="WL Size"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="projectedRttPercent"
            stroke="#d32f2f"
            name="RTT %"
          />
          {calcMode === "target" && sustainableWlSize > 0 && (
            <ReferenceLine
              yAxisId="left"
              y={sustainableWlSize}
              label="Sustainable WL"
              stroke="#388e3c"
              strokeDasharray="3 3"
            />
          )}
          {rttTargetPercent > 0 && (
            <ReferenceLine
              yAxisId="right"
              y={rttTargetPercent}
              label="RTT Target"
              stroke="#f57c00"
              strokeDasharray="3 3"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
