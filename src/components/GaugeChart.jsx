import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

// Custom label component to show the value in the center
// UPDATED: The props are cx and cy, not viewBox
const CustomizedLabel = ({ cx, cy, value, unit, color }) => {
  // Guard clause to prevent rendering before coordinates are calculated
  if (cx === undefined || cy === undefined || !cx || !cy) {
    return null;
  }

  return (
    <>
      <text
        x={cx}
        y={cy - 10} // Position value slightly above center
        fill={color}
        fontSize="2.25rem"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${value.toFixed(1)}%`}
      </text>
      <text
        x={cx}
        y={cy + 20} // Position unit slightly below center
        fill="#64748b"
        fontSize="0.875rem"
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {unit}
      </text>
    </>
  );
};

export default function GaugeChart({ title, value, unit, target }) {
  const roundedValue = value ? Math.round(value) : 0;
  // Ensure value doesn't exceed 100 for visual representation
  const displayValue = Math.min(roundedValue, 100);

  const data = [
    { name: "Achieved", value: displayValue },
    { name: "Remaining", value: 100 - displayValue },
  ];

  // Determine color based on target
  const color = value >= target ? "#16a34a" : "#f97316"; // Green if >= target, else orange

  return (
    <div className="card" style={{ height: "100%" }}>
      <h3 style={{ textAlign: "center", margin: 0 }}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            dataKey="value"
            innerRadius={80}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            stroke="none"
            labelLine={false}
            // UPDATED: Pass the custom label component as an *instance*
            // Recharts will automatically pass cx and cy to it.
            label={<CustomizedLabel value={value} unit={unit} color={color} />}
          >
            <Cell key="achieved" fill={color} />
            <Cell key="remaining" fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
