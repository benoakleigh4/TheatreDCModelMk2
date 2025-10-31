import React from "react";
import WLAnalysisTab from "./WLAnalysisTab";
import WLCohortTab from "./WLCohortTab";
import SummaryTab from "./SummaryTab";
import DataViewTab from "./DataViewTab";
import ForecastTab from "./ForecastTab";

export default function MainContent({ activeTab }) {
  return (
    <div className="chart-container">
      {activeTab === "wlAnalysis" && <WLAnalysisTab />}
      {activeTab === "cohort" && <WLCohortTab />}
      {activeTab === "summary" && <SummaryTab />}
      {activeTab === "dataView" && <DataViewTab />}
      {activeTab === "forecast" && <ForecastTab />}
    </div>
  );
}
