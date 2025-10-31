import React from "react";
import {
  FlaskConical,
  Play,
  Package,
  Clock,
  TrendingUp,
  Target,
  CheckSquare,
  Users2,
} from "lucide-react";
import InfoTooltip from "./InfoTooltip";

export default function TogglesBar({
  isSandbox,
  onModeToggle,
  viewMode,
  onViewToggle,
  calcMode,
  onCalcModeToggle,
  pathwayFilter,
  onPathwayToggle,
}) {
  // The main toggles-bar div applies flex and justify-space-evenly via CSS
  return (
    // The toggles-bar class in index.css is designed to apply space-evenly across the full width of its parent container.
    <div className="toggles-bar">
      {/* Live/Sandbox Toggle */}
      <div className="toggle-wrapper">
        <span className="toggle-label">Mode:</span>
        <InfoTooltip text="Live mode uses historical averages for calculation realism. Sandbox mode uses manual throughput assumptions for 'what-if' testing." />
        <div
          className={`toggle-btn ${isSandbox ? "sandbox" : "live"}`}
          onClick={onModeToggle}
        >
          <div className="knob">
            <div className="knob-icon">
              {isSandbox ? <FlaskConical size={16} /> : <Play size={16} />}
            </div>
          </div>
          <div className="label-text live-text">Live</div>
          <div className="label-text sandbox-text">Sandbox</div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="toggle-wrapper">
        <span className="toggle-label">View:</span>
        <InfoTooltip text="Switches the main KPI and comparison units between Case Count and Theatre Hours." />
        <div
          className={`toggle-btn view-mode ${viewMode}`}
          onClick={onViewToggle}
        >
          <div className="knob">
            <div className="knob-icon">
              {viewMode === "cases" ? (
                <Package size={16} />
              ) : (
                <Clock size={16} />
              )}
            </div>
          </div>
          <div className="label-text cases-text">Cases</div>
          <div className="label-text hours-text">Hours</div>
        </div>
      </div>

      {/* Calc Mode Toggle */}
      <div className="toggle-wrapper">
        <span className="toggle-label">Calculation:</span>
        <InfoTooltip text="'Forecast WL' predicts the WL based on your timetable. 'Target RTT' calculates the activity needed to meet an RTT goal." />
        <div
          className={`toggle-btn calc-mode ${calcMode}`}
          onClick={onCalcModeToggle}
        >
          <div className="knob">
            <div className="knob-icon">
              {calcMode === "forecast" ? (
                <TrendingUp size={16} />
              ) : (
                <Target size={16} />
              )}
            </div>
          </div>
          <div className="label-text forecast-text">Forecast WL</div>
          <div className="label-text target-text">Target RTT</div>
        </div>
      </div>

      {/* Pathway Filter Toggle */}
      <div className="toggle-wrapper">
        <span className="toggle-label">KPI Filter:</span>
        <InfoTooltip text="Filters the 'Current' KPIs (RTT % and Longest Wait) and the main WL forecast." />
        <div
          className={`toggle-btn pathway ${pathwayFilter}`}
          onClick={onPathwayToggle}
        >
          <div className="knob">
            <div className="knob-icon">
              {pathwayFilter === "admitted" ? (
                <CheckSquare size={16} />
              ) : (
                <Users2 size={16} />
              )}
            </div>
          </div>
          <div className="label-text admitted-text">Admitted Only</div>
          <div className="label-text all-text">All Pathways</div>
        </div>
      </div>
    </div>
  );
}
