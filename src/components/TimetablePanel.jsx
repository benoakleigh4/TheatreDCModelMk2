import React from "react";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { siteOptions } from "../data/initialData";

export default function TimetablePanel({
  timetableData,
  onTimetableChange,
  onAddRow,
  onRemoveRow,
  specialtyOptions,
  surgeonOptions, // <-- NEW PROP RECEIVED
}) {
  return (
    <div>
      <h3>
        <ListChecks size={20} /> Theatre Timetable
      </h3>
      <p>Define the regular weekly theatre sessions.</p>

      {/* Use wrapper for horizontal scroll on mobile */}
      <div className="timetable-table-wrapper">
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Specialty</th>
              <th>Surgeon</th>
              <th>Site</th>
              <th>Odd Wks</th>
              <th>Even Wks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {timetableData.map((row) => (
              <tr key={row.id}>
                <td>
                  <select
                    value={row.specialty}
                    onChange={(e) =>
                      onTimetableChange(row.id, "specialty", e.target.value)
                    }
                  >
                    {(specialtyOptions || []).map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {/* UPDATED: Changed from <input> to <select> */}
                  <select
                    value={row.surgeon}
                    onChange={(e) =>
                      onTimetableChange(row.id, "surgeon", e.target.value)
                    }
                  >
                    {(surgeonOptions || []).map((surgeon) => (
                      <option key={surgeon} value={surgeon}>
                        {surgeon}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={row.site}
                    onChange={(e) =>
                      onTimetableChange(row.id, "site", e.target.value)
                    }
                  >
                    {(siteOptions || []).map((site) => (
                      <option key={site} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={row.sessionsOdd}
                    onChange={(e) =>
                      onTimetableChange(row.id, "sessionsOdd", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={row.sessionsEven}
                    onChange={(e) =>
                      onTimetableChange(row.id, "sessionsEven", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => onRemoveRow(row.id)}
                    title="Remove row"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-secondary timetable-add-row"
        onClick={onAddRow}
      >
        <Plus size={16} /> Add Row
      </button>
    </div>
  );
}
