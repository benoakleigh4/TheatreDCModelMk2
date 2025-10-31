import React from "react";
import { Download, FileSpreadsheet } from "lucide-react";

export default function ForecastTab({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3>
          <FileSpreadsheet size={18} /> Forecast Table
        </h3>
        <p className="no-data-msg">No forecast data available.</p>
      </div>
    );
  }

  const headers = [
    "Week",
    "Demand",
    "Capacity",
    "Net Change",
    "Projected WL",
    "Projected RTT %",
    "0-18w",
    "18-26w",
    "26-52w",
    "52+w",
  ];

  const handleExport = () => {
    const csvRows = [];
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      csvRows.push(
        [
          row.week,
          row.demandCases,
          row.capacityCases,
          row.netChange,
          row.totalWL,
          row.projectedRttPercent.toFixed(1),
          row.wl_0_18w,
          row.wl_18_26w,
          row.wl_26_52w,
          row.wl_52wplus,
        ].join(",")
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "forecast_export.csv";
    link.click();
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
          alignItems: "center",
        }}
      >
        <h3>
          <FileSpreadsheet size={18} /> Forecast Table
        </h3>
        <button onClick={handleExport} className="btn btn-primary">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="table-container" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    backgroundColor: "#f1f5f9",
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.week}>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {row.week}
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {Math.ceil(row.demandCases)}
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {Math.ceil(row.capacityCases)}
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {Math.ceil(row.netChange)}
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {row.totalWL}
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {row.projectedRttPercent.toFixed(1)}%
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {row.wl_0_18w}
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {row.wl_18_26w}
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {row.wl_26_52w}
                </td>
                <td
                  style={{ padding: "8px", borderBottom: "1px solid #e2e8f0" }}
                >
                  {row.wl_52wplus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
