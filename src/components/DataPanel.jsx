import React from "react";
import {
  Plus,
  Trash2,
  Repeat,
  FileUp,
  XCircle,
  Info,
  Download,
  Upload,
  FileClock,
  History,
  Briefcase,
  LineChart as LineChartIcon,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function DataPanel({
  isSandbox,
  onReset,
  onSave,
  onFileUpload,
  onClearData,
  onExportErrorLog,
  activityData,
  icbPlanData,
  backlogData,
  demandPlanData,
  uploadErrors,
  isPapaReady,
  skippedCounts,
  TooltipComponent: InfoTooltip,
  onSetActiveTab, // Not directly used here, but passed down.
}) {
  const isParserLoading = !isPapaReady;

  // Unified file change handler calls the prop function
  const handleFileChange = (e, type) => {
    if (isParserLoading) {
      alert("CSV Parser is still loading. Please wait a moment and try again.");
      return;
    }
    // Only upload if a file is selected
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0], type);
    }
    // Clear the input value so the same file can be uploaded again
    e.target.value = null;
  };

  const getUploadButtonContent = (dataType, data) => {
    if (isParserLoading) {
      return (
        <>
          <Clock size={16} className="mr-2 animate-spin" /> Loading Parser...
        </>
      );
    }
    const buttonText =
      data.length > 0 ? `Upload New ${dataType}` : `Upload ${dataType} CSV`;
    return (
      <>
        <Upload size={16} /> {buttonText}
      </>
    );
  };

  // Helper to get Data Status message based on current state (CRITICAL RENDER LOGIC)
  const getDataStatusMessage = (dataType, data, skippedCountKey) => {
    const dataCount = data.length;
    const skippedCount = skippedCounts[skippedCountKey] || 0;
    const errorText = uploadErrors[skippedCountKey];

    // --- State 1: Error Display ---
    if (errorText && errorText !== "Parsing...") {
      return <p className="error-message">{errorText}</p>;
    }
    // --- State 2: Parsing Display ---
    if (errorText === "Parsing...") {
      return (
        <p className="disabled-message" style={{ color: "#00a499" }}>
          Parsing data, please wait...
        </p>
      );
    }
    // --- State 3: No Data ---
    if (dataCount === 0 && skippedCount === 0) return null;

    // --- State 4: Loaded Status Display ---
    let loadedMsg;
    switch (dataType) {
      case "Backlog":
        loadedMsg = `Backlog loaded (${dataCount} aggregated rows)`;
        break;
      case "Activity":
        loadedMsg = `Historical Activity loaded (${dataCount} valid rows)`;
        break;
      case "Monthly Plan":
        loadedMsg = `Activity Plan loaded (${dataCount} weekly entries)`;
        break;
      case "Demand Profile":
        loadedMsg = `Demand Profile loaded (${dataCount} weekly entries)`;
        break;
      default:
        loadedMsg = `Data loaded (${dataCount} rows)`;
    }

    return (
      <div
        className="data-status"
        style={{ flexDirection: "column", alignItems: "flex-start" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              whiteSpace: "nowrap",
              fontWeight: 600,
            }}
          >
            {loadedMsg}
          </p>
          <button
            className="btn-danger-text"
            onClick={() => onClearData(skippedCountKey)}
            style={{ flexShrink: 0 }}
          >
            <XCircle size={16} /> Clear Data
          </button>
        </div>

        {/* Skipped Rows/Error Log Display */}
        {skippedCount > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              color: "#dc2626",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AlertTriangle size={16} style={{ marginRight: "0.25rem" }} />
              {skippedCount} rows skipped
              <button
                className="btn-danger-text"
                onClick={() => onExportErrorLog(skippedCountKey)}
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                <Download size={14} /> Download Log
              </button>
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="data-panel">
      {/* Sandbox Controls */}
      {isSandbox ? (
        <div className="data-upload-section">
          <h3>
            Sandbox Controls
            <InfoTooltip text="Changes made in Sandbox mode are temporary and won't affect the 'Live' data until applied." />
          </h3>
          <p>
            You are in Sandbox mode. Your changes will not be saved until you
            apply them to Live.
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-secondary" onClick={onReset}>
              <Repeat size={16} /> Reset Sandbox
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              <FileUp size={16} /> Apply to Live
            </button>
          </div>
        </div>
      ) : (
        <div className="data-upload-section">
          <h3>
            Live Mode
            <InfoTooltip text="Changes made in Live mode are automatically used for calculations." />
          </h3>
          <p>
            You are in Live mode. All changes to assumptions and data are saved
            automatically.
          </p>
        </div>
      )}

      {/* Backlog Upload */}
      <div className="data-upload-section">
        <h3>
          <FileClock size={20} /> Current Backlog (PTL)
          <InfoTooltip
            text={`Upload patient-level PTL. Auto-detects columns like 'Specialty', 'Weeks Wait', and pathway type ('PathwayType', 'Status', etc.). Aggregates by these fields.`}
          />
        </h3>
        <p>
          Required columns: <strong>Specialty</strong>,
          <strong>Weeks Wait</strong>, <strong>Pathway Type</strong>.
        </p>
        <label
          className={`btn btn-primary ${isParserLoading ? "disabled" : ""}`}
        >
          {getUploadButtonContent("Backlog", backlogData)}
          <input
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "backlog")}
            disabled={isParserLoading}
          />
        </label>
        {getDataStatusMessage("Backlog", backlogData, "backlog")}
      </div>

      {/* Historical Activity Upload */}
      <div className="data-upload-section">
        <h3>
          <History size={20} /> Historical Activity
          <InfoTooltip text="Upload historical completed cases. Calculates throughput. Auto-detects columns: 'Specialty', 'Surgeon', 'Date', 'SessionID', 'Completed'." />
        </h3>
        <p>
          Required columns: <strong>Specialty</strong>,<strong>Surgeon</strong>,{" "}
          <strong>Date</strong>, <strong>SessionID</strong>. (Optional:
          Completed, Week).
        </p>
        <label
          className={`btn btn-primary ${isParserLoading ? "disabled" : ""}`}
        >
          {getUploadButtonContent("Activity", activityData)}
          <input
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "activity")}
            disabled={isParserLoading}
          />
        </label>
        {getDataStatusMessage("Activity", activityData, "activity")}
      </div>

      {/* Activity Plan (Contract) Upload */}
      <div className="data-upload-section">
        <h3>
          <Briefcase size={20} /> Activity Plan (Contract)
          <InfoTooltip text="Upload monthly plan. Expects 'Specialty' column and month columns (e.g., 'Apr-25'). Converts to weekly average." />
        </h3>
        <p>
          Required columns: <strong>Specialty</strong>,<strong>MMM-YY</strong>{" "}
          month columns.
        </p>
        <label
          className={`btn btn-primary ${isParserLoading ? "disabled" : ""}`}
        >
          {getUploadButtonContent("Monthly Plan", icbPlanData)}
          <input
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "icb")}
            disabled={isParserLoading}
          />
        </label>
        {getDataStatusMessage("Monthly Plan", icbPlanData, "icb")}
      </div>

      {/* Historical Weekly Demand Profile Upload */}
      <div className="data-upload-section">
        <h3>
          <LineChartIcon size={20} /> Historical Weekly Demand Profile
          <InfoTooltip
            text={`Optional: Upload a CSV with a weekly demand profile (new DTAs). This will override the manual 'Avg. Weekly Demand' assumption for more precise modelling.`}
          />
        </h3>
        <p>
          Required columns: <strong>Specialty</strong>,<strong>Week</strong> (or
          Date), <strong>Additions / DTA</strong>.
        </p>
        <label
          className={`btn btn-primary ${isParserLoading ? "disabled" : ""}`}
        >
          {getUploadButtonContent("Demand Profile", demandPlanData)}
          <input
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "demandProfile")}
            disabled={isParserLoading}
          />
        </label>
        {getDataStatusMessage(
          "Demand Profile",
          demandPlanData,
          "demandProfile"
        )}
      </div>
    </div>
  );
}
