import React from "react";
import InfoTooltip from "./InfoTooltip";

// A self-contained, reusable KPI Card
export default function KpiCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  textColor,
  tooltipText,
  TooltipComponent, // Accept TooltipComponent as a prop
}) {
  // Use the passed TooltipComponent, or default to InfoTooltip if not provided
  const Tooltip = TooltipComponent || InfoTooltip;

  // Format value: display one decimal unless >= 1000, then display zero decimals.
  const formattedValue =
    typeof value === "number" ? value.toFixed(value >= 1000 ? 0 : 1) : value;

  return (
    <div className="kpi-card">
      <div className={`icon-kpi ${color}`}>
        {Icon && <Icon size={24} className={textColor} />}
      </div>
      {/* This div contains the text content */}
      <div>
        <div className="text-sm">
          {title}
          {tooltipText && <Tooltip text={tooltipText} />}
        </div>
        {/* UPDATED: Value and Unit are now stacked */}
        <h3 className="text-2xl">{formattedValue}</h3>
        <div className="unit">{unit}</div>
      </div>
    </div>
  );
}
