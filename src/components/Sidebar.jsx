import React from "react";
import {
  Target,
  UserPlus,
  SlidersHorizontal,
  ListChecks,
  FileSpreadsheet,
  Repeat,
  FileUp,
  XCircle,
  Info,
} from "lucide-react";
import RttTargetPanel from "./RttTargetPanel";
import DemandPanel from "./DemandPanel";
import CapacityPanel from "./CapacityPanel";
import TimetablePanel from "./TimetablePanel";
import DataPanel from "./DataPanel";
import InfoTooltip from "./InfoTooltip";

export default function Sidebar({
  activeSidebarTab,
  setActiveSidebarTab,
  assumptions,
  onAssumptionChange,
  timetableData,
  onTimetableChange,
  onAddRow,
  onRemoveRow,
  specialtyOptions,
  surgeonOptions, // <-- NEW PROP RECEIVED
  activityData,
  icbPlanData,
  backlogData,
  demandPlanData,
  isSandbox,
  historicalAvgCases,
  calcMode,

  // Data Management Props
  onReset,
  onSave,
  onFileUpload,
  onClearData,
  onExportErrorLog,
  uploadErrors,
  skippedCounts,
  isPapaReady,
  onSetActiveTab,
}) {
  const isActivityLoaded = activityData.length > 0;
  const isDemandProfileLoaded = demandPlanData.length > 0;

  // --- Component Map for cleaner rendering ---
  const PanelMap = {
    rttTarget: (
      <RttTargetPanel
        assumptions={assumptions}
        onAssumptionChange={onAssumptionChange}
        TooltipComponent={InfoTooltip}
      />
    ),
    demand: (
      <DemandPanel
        assumptions={assumptions}
        onAssumptionChange={onAssumptionChange}
        isDemandProfileLoaded={isDemandProfileLoaded}
        TooltipComponent={InfoTooltip}
      />
    ),
    capacity: (
      <CapacityPanel
        assumptions={assumptions}
        onAssumptionChange={onAssumptionChange}
        isSandbox={isSandbox}
        historicalAvgCases={historicalAvgCases}
        isActivityLoaded={isActivityLoaded}
        TooltipComponent={InfoTooltip}
      />
    ),
    timetable:
      calcMode === "forecast" ? (
        <TimetablePanel
          timetableData={timetableData}
          onTimetableChange={onTimetableChange}
          onAddRow={onAddRow}
          onRemoveRow={onRemoveRow}
          specialtyOptions={(specialtyOptions || []).filter(
            (s) => s !== "All Specialties" && s !== "Unknown"
          )}
          surgeonOptions={(surgeonOptions || []).filter(
            // <-- NEW PROP PASSED
            (s) => s !== "All Surgeons"
          )}
        />
      ) : (
        <div className="disabled-message-box">
          <ListChecks size={24} /> <p>Timetable is Disabled</p>
          <span>Switch to "Forecast WL" mode to edit.</span>
        </div>
      ),
    data: (
      <DataPanel
        isSandbox={isSandbox}
        onReset={onReset}
        onSave={onSave}
        onFileUpload={onFileUpload}
        onClearData={onClearData}
        onExportErrorLog={onExportErrorLog}
        activityData={activityData}
        icbPlanData={icbPlanData}
        backlogData={backlogData}
        demandPlanData={demandPlanData}
        uploadErrors={uploadErrors}
        isPapaReady={isPapaReady}
        skippedCounts={skippedCounts}
        TooltipComponent={InfoTooltip}
        onSetActiveTab={onSetActiveTab}
      />
    ),
  };
  // ---------------------------------------------

  return (
    <>
      {/* Navigation Section */}
      <div className="sidebar-tabs">
        <button
          className={activeSidebarTab === "rttTarget" ? "active" : ""}
          onClick={() => setActiveSidebarTab("rttTarget")}
        >
          <Target size={18} /> RTT Target
        </button>
        <button
          className={activeSidebarTab === "demand" ? "active" : ""}
          onClick={() => setActiveSidebarTab("demand")}
        >
          <UserPlus size={18} /> Demand
        </button>
        <button
          className={activeSidebarTab === "capacity" ? "active" : ""}
          onClick={() => setActiveSidebarTab("capacity")}
        >
          <SlidersHorizontal size={18} /> Capacity
        </button>
        <button
          className={activeSidebarTab === "timetable" ? "active" : ""}
          onClick={() => setActiveSidebarTab("timetable")}
          disabled={calcMode === "target"} // Disable timetable edit in target mode
        >
          <ListChecks size={18} /> Timetable
        </button>
        <button
          className={activeSidebarTab === "data" ? "active" : ""}
          onClick={() => setActiveSidebarTab("data")}
        >
          <FileSpreadsheet size={18} /> Data Management
        </button>
      </div>

      {/* Config Panels Section: Now uses the Component Map */}
      <div className="sidebar-content">{PanelMap[activeSidebarTab]}</div>
    </>
  );
}
