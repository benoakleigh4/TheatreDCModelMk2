import React from "react";
import { BarChart3, TrendingUp, Clock, Package } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line, // Used for Forecast Mode
} from "recharts";
import ChartHeader from "./ChartHeader"; // Assumed to be available/defined locally

export default function SummaryTab({
  data,
  viewMode,
  calcMode,
  requiredActivity,
  avgDemand,
}) {
  const Icon = BarChart3;

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <ChartHeader
          Icon={Icon}
          title="D&C Summary"
          subtitle="Comparison of demand and capacity over time."
        />
        <p className="no-data-msg">No forecast data available to summarise.</p>
      </div>
    );
  }

  let chartData = data; // Use forecast data for forecast mode
  let chartTitle = "D&C Summary";
  let chartDesc =
    "Comparison of demand and capacity over the simulation period.";
  const yAxisLabel = viewMode === "cases" ? "Cases" : "Hours";

  const capacityKey = viewMode === "cases" ? "capacityCases" : "capacityHours";
  const demandKey = viewMode === "cases" ? "demandCases" : "demandHours";

  if (calcMode === "target") {
    chartTitle = "Target Activity vs. Average Demand";
    chartDesc = "Required activity to meet RTT target vs. average demand.";
    // Create simple data structure for target mode bar chart
    chartData = [
      {
        name: yAxisLabel,
        Demand: avgDemand,
        "Required Plan":
          // Use the correct required activity in terms of cases or hours
          viewMode === "cases"
            ? requiredActivity
            : requiredActivity *
              (data[0]?.capacityHours / data[0]?.capacityCases || 1),
      },
    ];
  }

  return (
    <div className="card">
      <ChartHeader Icon={Icon} title={chartTitle} subtitle={chartDesc} />
      <div
        className="chart-container"
        style={{ height: "400px", marginTop: "0" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {calcMode === "forecast" ? (
            // Forecast Mode: Trend Line for Capacity vs Bar for Demand
            <ComposedChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="week"
                interval="preserveStartEnd"
                ticks={
                  data.length > 26
                    ? [1, 13, 26, 39, 52].filter((t) => t <= data.length)
                    : undefined
                }
              />
              <YAxis
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "#475569",
                }}
                stroke="#475569"
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip
                formatter={(value, name) => [
                  Math.ceil(value).toLocaleString(),
                  name,
                ]}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ padding: "10px 0 0 0" }}
              />

              {/* Demand (Bar Chart - Red) */}
              <Bar
                dataKey={demandKey}
                name="Demand"
                fill="#ef4444"
                opacity={0.7}
              />
              {/* Capacity (Line Chart - Green) */}
              <Line
                type="monotone"
                dataKey={capacityKey}
                name="Activity Rate Used"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          ) : (
            // Target Mode: Simple Bar Chart Comparison
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "#475569",
                }}
                stroke="#475569"
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip
                formatter={(value, name) => [
                  Math.ceil(value).toLocaleString(),
                  name,
                ]}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ padding: "10px 0 0 0" }}
              />

              <Bar dataKey="Demand" fill="#ef4444" opacity={0.7} />
              <Bar dataKey="Required Plan" fill="#16a34a" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
