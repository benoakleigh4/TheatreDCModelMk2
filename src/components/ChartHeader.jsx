import React from "react";
import { Info } from "lucide-react";

export default function ChartHeader({
  Icon,
  title,
  subtitle,
  timeframe,
  onTimeframeChange,
}) {
  const options = [
    { key: "3m", label: "3m" },
    { key: "6m", label: "6m" },
    { key: "1y", label: "1y" },
  ];

  return (
    <div className="chart-header">
      <div>
        {/* Use h3 for consistent heading style, with optional Icon */}
        <h3 style={{ margin: "0 0 0.5rem 0" }}>
          {Icon && <Icon size={20} />}
          {title} <Info size={16} style={{ color: "#94a3b8" }} />
        </h3>
        <p style={{ margin: 0 }}>{subtitle}</p>
      </div>
      <div className="timeframe-toggle">
        {options.map((opt) => (
          <button
            key={opt.key}
            // Use existing classes and add 'active' class for styling
            className={`btn btn-secondary ${
              timeframe === opt.key ? "active" : ""
            }`}
            onClick={() => onTimeframeChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
