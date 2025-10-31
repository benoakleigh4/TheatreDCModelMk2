import React from "react";
import { SlidersHorizontal } from "lucide-react";

export default function CapacityPanel({
  assumptions,
  onAssumptionChange,
  isSandbox,
  historicalAvgCases,
  isActivityLoaded,
  TooltipComponent: InfoTooltip,
}) {
  const isHistoricalAvgValid =
    isActivityLoaded &&
    historicalAvgCases !== null &&
    historicalAvgCases !== undefined;

  return (
    <div>
      <h3>
        <SlidersHorizontal size={20} /> Capacity & Throughput Assumptions
      </h3>
      <div className="input-group">
        <label>
          Hours per Session
          <InfoTooltip text="The average duration of one standard theatre session (e.g., 4.0 for a half-day list)." />
        </label>
        <div className="input-wrapper">
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={assumptions.hoursPerSession}
            onChange={(e) =>
              onAssumptionChange("hoursPerSession", e.target.value)
            }
          />
          <span className="unit">hours</span>
        </div>
      </div>

      <div className="input-group">
        <label>
          Theatre Efficiency
          <InfoTooltip text="The average percentage of scheduled theatre session time used productively for cases (accounts for delays, setup, etc.)." />
        </label>
        <div className="input-wrapper">
          <input
            type="number"
            min="0"
            max="100"
            value={assumptions.theatreEfficiency}
            onChange={(e) =>
              onAssumptionChange("theatreEfficiency", e.target.value)
            }
          />
          <span className="unit">%</span>
        </div>
      </div>

      {/* Conditional Throughput Input */}
      {isSandbox ? (
        <div className="input-group">
          <label>
            Avg. Cases per Session (Sandbox)
            <InfoTooltip text="Your 'what-if' assumption for the average number of cases completed per session in Sandbox mode." />
          </label>
          <div className="input-wrapper">
            <input
              type="number"
              step="0.1"
              min="0"
              value={assumptions.avgCasesPerSession}
              onChange={(e) =>
                onAssumptionChange("avgCasesPerSession", e.target.value)
              }
            />
            <span className="unit">cases</span>
          </div>
        </div>
      ) : (
        <div
          className={`input-group ${!isHistoricalAvgValid ? "disabled" : ""}`}
        >
          <label>
            Historical Avg. Cases/Session (Live)
            <InfoTooltip text="The overall average cases per session for the currently filtered activity data. Used for Live mode forecast simulation." />
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              value={
                isHistoricalAvgValid ? historicalAvgCases.toFixed(1) : "N/A"
              }
              readOnly
              disabled
            />
            <span className="unit">cases</span>
          </div>
          {!isActivityLoaded && (
            <span className="disabled-message">
              Upload Historical Activity data to enable Live throughput.
            </span>
          )}
        </div>
      )}

      {/* Additional Lists */}
      <div className="input-group">
        <label>
          Additional/Outsource Lists
          <InfoTooltip text="Add a fixed number of extra sessions per week (e.g., from outsourcing, waiting list initiatives)." />
        </label>
        <div className="input-wrapper">
          <input
            type="number"
            step="0.5"
            min="0"
            value={assumptions.additionalLists}
            onChange={(e) =>
              onAssumptionChange("additionalLists", e.target.value)
            }
          />
          <span className="unit">lists/wk</span>
        </div>
      </div>
    </div>
  );
}
