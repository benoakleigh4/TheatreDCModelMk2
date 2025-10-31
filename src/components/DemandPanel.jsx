import React from "react";
import { UserPlus, Info } from "lucide-react";

export default function DemandPanel({
  assumptions,
  onAssumptionChange,
  isDemandProfileLoaded,
  TooltipComponent: InfoTooltip,
}) {
  return (
    <div>
      <h3>
        <UserPlus size={20} /> Demand Assumptions
      </h3>
      {isDemandProfileLoaded && (
        <p
          className="disabled-message"
          style={{
            color: "#059669",
            backgroundColor: "#ecfdf5",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid #6ee7b7",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Info size={14} style={{ marginRight: "0.25rem" }} />
          Weekly Demand Profile is loaded and overrides the manual input below.
        </p>
      )}
      <div className={`input-group ${isDemandProfileLoaded ? "disabled" : ""}`}>
        <label>
          Avg. Weekly Demand (DTAs)
          <InfoTooltip text="Manual input for the average number of new cases (DTAs) arriving each week. Used if no Demand Profile is uploaded." />
        </label>
        <div className="input-wrapper">
          <input
            type="number"
            value={assumptions.avgWeeklyDemandDTAs}
            onChange={(e) =>
              onAssumptionChange("avgWeeklyDemandDTAs", e.target.value)
            }
            min="0"
            disabled={isDemandProfileLoaded}
          />
          <span className="unit">cases</span>
        </div>
      </div>
      <div className="input-group">
        <label>
          Demand Shock
          <InfoTooltip text="Apply a % increase or decrease to the weekly demand input (e.g., 10 for 10% increase, -5 for 5% decrease). Applied to profile or manual input." />
        </label>
        <div className="input-wrapper">
          <input
            type="number"
            value={assumptions.demandShock}
            onChange={(e) => onAssumptionChange("demandShock", e.target.value)}
          />
          <span className="unit">%</span>
        </div>
      </div>
    </div>
  );
}
