import React from "react";
import { LayoutDashboard, Wrench } from "lucide-react";

export default function AppTabs({ appMode, setAppMode }) {
  return (
    <div className="app-tabs-bar">
      <div className="container">
        <button
          className={appMode === "execSummary" ? "active" : ""}
          onClick={() => setAppMode("execSummary")}
        >
          <LayoutDashboard size={18} />
          Exec Summary
        </button>
        <button
          className={appMode === "mainTool" ? "active" : ""}
          onClick={() => setAppMode("mainTool")}
        >
          <Wrench size={18} />
          Main Tool
        </button>
      </div>
    </div>
  );
}
