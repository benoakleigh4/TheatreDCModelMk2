import React from "react";
import { Target } from "lucide-react";

export default function RttTargetPanel({
  assumptions,
  onAssumptionChange,
  TooltipComponent: InfoTooltip,
}) {
  return (
    <div>
      <h3>
        <Target size={20} /> RTT Target Inputs
      </h3>
      <p>Set the strategic RTT goal for the simulation.</p>
      <div className="input-group">
        <label>
          Target RTT % (at 18 weeks)
          <InfoTooltip text="The percentage of the waiting list that should be at or below 18 weeks wait." />
        </label>
        <div className="input-wrapper">
          <input
            type="number"
            value={assumptions.rttTargetPercent}
            onChange={(e) =>
              onAssumptionChange("rttTargetPercent", e.target.value)
            }
            min="0"
            max="100"
          />
          <span className="unit">%</span>
        </div>
      </div>
      <div className="input-group">
        <label>
          Timeframe to Achieve
          <InfoTooltip text="The number of weeks over which to achieve the RTT target. Used in 'Target RTT' calculation mode." />
        </label>
        <div className="input-wrapper">
          <input
            type="number"
            value={assumptions.timeframeToAchieve}
            onChange={(e) =>
              onAssumptionChange("timeframeToAchieve", e.target.value)
            }
            min="1"
          />
          <span className="unit">weeks</span>
        </div>
      </div>
    </div>
  );
}
