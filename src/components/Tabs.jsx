import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button
        className={activeTab === "wlAnalysis" ? "active" : ""}
        onClick={() => setActiveTab("wlAnalysis")}
      >
        WL Analysis
      </button>
      <button
        className={activeTab === "cohort" ? "active" : ""}
        onClick={() => setActiveTab("cohort")}
      >
        WL Cohorts
      </button>
      <button
        className={activeTab === "summary" ? "active" : ""}
        onClick={() => setActiveTab("summary")}
      >
        D&C Summary
      </button>
      <button
        className={activeTab === "dataView" ? "active" : ""}
        onClick={() => setActiveTab("dataView")}
      >
        Data View
      </button>
      <button
        className={activeTab === "forecast" ? "active" : ""}
        onClick={() => setActiveTab("forecast")}
      >
        Forecast Table
      </button>
    </div>
  );
}
