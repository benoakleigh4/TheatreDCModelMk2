import React from "react";
import { FileSpreadsheet } from "lucide-react";

export default function DataViewTab({
  activityData,
  icbPlanData,
  backlogData,
  demandPlanData,
}) {
  const hasBacklog = backlogData && backlogData.length > 0;
  const hasActivity = activityData && activityData.length > 0;
  const hasIcb = icbPlanData && icbPlanData.length > 0;
  const hasDemand = demandPlanData && demandPlanData.length > 0;

  return (
    <div className="card">
      <h3>
        <FileSpreadsheet size={18} /> Data View
      </h3>

      {!hasBacklog && !hasActivity && !hasIcb && !hasDemand && (
        <p className="no-data-msg">
          No data uploaded yet. Go to 'Data Management' in the sidebar to upload
          CSV files.
        </p>
      )}

      {hasBacklog && (
        <>
          <h4>Current Backlog (Aggregated)</h4>
          <div className="table-container" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Specialty</th>
                  <th>Weeks Wait</th>
                  <th>Pathway Type</th>
                  <th>Patient Count</th>
                </tr>
              </thead>
              <tbody>
                {[...backlogData]
                  .sort((a, b) => a.specialty.localeCompare(b.specialty))
                  .map((row, i) => (
                    <tr key={i}>
                      <td>{row.specialty}</td>
                      <td>{row.weeksWait}</td>
                      <td>{row.pathwayType}</td>
                      <td>{row.patientCount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {hasActivity && (
        <>
          <h4>Historical Activity (Raw)</h4>
          <div className="table-container" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Specialty</th>
                  <th>Surgeon</th>
                  <th>Week Index</th>
                  <th>Date</th>
                  <th>Session ID</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {[...activityData]
                  .sort((a, b) => a.specialty.localeCompare(b.specialty))
                  .map((row, i) => (
                    <tr key={i}>
                      <td>{row.specialty}</td>
                      <td>{row.surgeon}</td>
                      <td>{row.weekIndex}</td>
                      <td>{row.date}</td>
                      <td>{row.sessionId}</td>
                      <td>{row.completed}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {hasIcb && (
        <>
          <h4>Activity Plan (Weekly Avg)</h4>
          <div className="table-container" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Specialty</th>
                  <th>Week Index</th>
                  <th>Weekly Amount</th>
                </tr>
              </thead>
              <tbody>
                {[...icbPlanData]
                  .sort((a, b) => a.specialty.localeCompare(b.specialty))
                  .map((row, i) => (
                    <tr key={i}>
                      <td>{row.specialty}</td>
                      <td>{row.weekIndex}</td>
                      <td>{row.weeklyAmount?.toFixed(1)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {hasDemand && (
        <>
          <h4>Demand Profile (Weekly)</h4>
          <div className="table-container" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Specialty</th>
                  <th>Week Index</th>
                  <th>Demand (DTAs)</th>
                </tr>
              </thead>
              <tbody>
                {[...demandPlanData]
                  .sort((a, b) => a.specialty.localeCompare(b.specialty))
                  .map((row, i) => (
                    <tr key={i}>
                      <td>{row.specialty}</td>
                      <td>{row.weekIndex}</td>
                      <td>{row.demand}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
