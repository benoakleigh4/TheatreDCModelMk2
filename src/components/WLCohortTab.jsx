import React from "react";
import ChartHeader from "./ChartHeader";
import { BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function WLCohortTab({ data, timeframe, onTimeframeChange }) {
  if (!data || data.length === 0) {
    return <p className="no-data-msg">No cohort data available.</p>;
  }

  // Slice data based on timeframe
  const sliceWeeks = { "3m": 13, "6m": 26, "1y": 52 };
  const slicedData = data.slice(0, sliceWeeks[timeframe] || 52);

  const chartTitle = "WL Cohort Breakdown";
  const chartSubtitle =
    "Projected waiting list size split by time bands (weeks) over the forecast period.";

  return (
    <div className="card">
      {/* Chart Header */}
      <ChartHeader
        Icon={BarChart3}
        title={chartTitle}
        subtitle={chartSubtitle}
        timeframe={timeframe}
        onTimeframeChange={onTimeframeChange}
      />

      {/* Stacked Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={slicedData}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="wl_0_18w"
            stackId="a"
            fill="#6366f1"
            name="0-18 Weeks"
          />
          <Bar
            dataKey="wl_18_26w"
            stackId="a"
            fill="#f97316"
            name="18-26 Weeks"
          />
          <Bar
            dataKey="wl_26_52w"
            stackId="a"
            fill="#ca8a04"
            name="26-52 Weeks"
          />
          <Bar
            dataKey="wl_52wplus"
            stackId="a"
            fill="#dc2626"
            name="52+ Weeks"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
