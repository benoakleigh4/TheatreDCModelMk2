import React from "react";
import {
  XCircle,
  FileUp,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  FileClock,
  History,
  LineChart as LineChartIcon,
  Target,
  Play,
  FlaskConical,
  ListChecks,
  UserPlus,
  CheckSquare,
  Users2,
} from "lucide-react";

export default function GuidePanel({ onClose }) {
  return (
    <div className="guide-overlay" onClick={onClose}>
      <div className="guide-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="guide-close-button">
          <XCircle size={20} />
        </button>
        <h2>D&C Model User Guide</h2>
        <p>
          Welcome, Ben Oakleigh! This Demand & Capacity tool helps you model the
          impact of theatre planning on your waiting list performance and RTT
          targets. Follow these steps for an accurate simulation.
        </p>

        <div className="guide-section-header">
          <FileUp size={20} /> Section 1: Data Setup & Management
        </div>
        <p>
          Accurate results depend on clean input data. Use the **Data
          Management** sidebar tab for all uploads.
        </p>
        <ol>
          <li>
            <strong>Historical Activity:</strong> Required for calculating
            **Surgeon-Level Throughput** (Live Mode) and **Historical
            Averages**. Ensure the date column is in the correct **DD/MM/YYYY**
            format.
          </li>
          <li>
            <strong>Current Backlog (PTL):</strong> Sets the starting position
            for the WL simulation. Required for **Current RTT %** and **WL
            Analysis** forecasts.
          </li>
          <li>
            <strong>Activity Plan (Contract):</strong> Allows comparison of your
            planned capacity against your contractual obligations (KPI:
            *Variance vs Contract*).
          </li>
          <li>
            <strong>Demand Profile (Optional):</strong> Upload a weekly DTA
            profile to override the manual demand assumption for more accurate
            forecasting.
          </li>
        </ol>
        <p
          style={{
            marginTop: "0.5rem",
            fontStyle: "italic",
            fontSize: "0.875rem",
            color: "#f97316",
          }}
        >
          <AlertTriangle
            size={14}
            style={{
              marginRight: "0.25rem",
              color: "#f97316",
              verticalAlign: "middle",
            }}
          />
          If the file upload shows **rows skipped**, use the **Download Error
          Log** to identify and fix validation issues in your source data.
        </p>

        <div className="guide-section-header">
          <SlidersHorizontal size={20} /> Section 2: Scenario Controls &
          Assumptions
        </div>
        <p>
          Use the toggles at the top and the configuration tabs in the sidebar
          to define your scenario.
        </p>
        <ul>
          <li>
            <strong>Mode Toggle (Live/Sandbox):</strong> Use **Sandbox** (
            <FlaskConical
              size={14}
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                color: "#f97316",
              }}
            />
            ) to test "what-if" assumptions before applying them to **Live** (
            <Play
              size={14}
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                color: "#16a34a",
              }}
            />
            ).
          </li>
          <li>
            <strong>Calculation Toggle (Forecast WL/Target RTT):</strong>
            <ul>
              <li>
                <strong>Forecast WL:</strong> Projects the WL using the actual
                historical activity rate (**Live**) or the ideal planned
                capacity (**Sandbox**).
              </li>
              <li>
                <strong>Target RTT:</strong> Calculates the **Required
                Activity** (cases/hours/sessions) needed to hit your RTT target.
              </li>
            </ul>
          </li>
          <li>
            <strong>Pathway Filter (KPI Filter):</strong> Use the toggle (
            <CheckSquare
              size={14}
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                color: "#00a499",
              }}
            />
            /
            <Users2
              size={14}
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                color: "#6366f1",
              }}
            />
            ) to filter **Current KPIs** and the **WL Analysis** chart to focus
            on **Admitted Only** or **All Pathways**.
          </li>
        </ul>

        <div className="guide-section-header">
          <TrendingUp size={20} /> Section 3: Analysis & Interpretation
        </div>
        <p>Review the main content tabs for simulation outputs:</p>
        <ol>
          <li>
            <strong>WL Analysis:</strong> Tracks the core metrics (*WL Size* and
            *RTT %*) over the forecast period. Use the **Timeframe Toggle**
            (3m/6m/1y) to zoom in on short-term changes.
          </li>
          <li>
            <strong>D&C Summary:</strong> Provides a high-level comparison of
            the **Activity Rate Used** (Capacity/Actual) vs. **Demand** and
            **Required Plan** (Target Mode).
          </li>
          <li>
            <strong>WL Cohorts:</strong> Shows a stacked breakdown of the
            waiting list by **weeks wait bands** over the forecast period,
            highlighting the movement of long-waiters.
          </li>
          <li>
            <strong>KPI Panel:</strong> The top panels show key summaries. Note
            that the **Surplus/Deficit** and **Variance (vs Contract)** KPIs
            adapt their underlying formula based on the Live/Sandbox mode.
          </li>
        </ol>
      </div>
    </div>
  );
}
