import React from "react";
import { List, User, MapPin } from "lucide-react"; // Import MapPin
import InfoTooltip from "./InfoTooltip"; // Assuming InfoTooltip is available

export default function Slicers({
  specialtyOptions,
  selectedSpecialty,
  onSpecialtyChange,
  surgeonOptions,
  selectedSurgeons, // Now expects array
  onSurgeonChange,
  siteOptions, // NEW PROP
  selectedSite, // NEW PROP
  onSiteChange, // NEW PROP
}) {
  return (
    <div className="slicer-group">
      {/* This row will be 2-columns */}
      <div className="slicer-row">
        {/* Specialty Slicer */}
        <div className="slicer-container">
          <div className="slicer-header">
            <List size={16} /> Filter by Specialty
            <InfoTooltip text="Filter the entire model (calculations, KPIs, forecast) by a specific specialty." />
          </div>
          <div className="slicer-items">
            {(specialtyOptions || []).map((spec) => (
              <button
                key={spec}
                className={`slicer-item ${
                  selectedSpecialty === spec ? "selected" : ""
                }`}
                onClick={() => onSpecialtyChange(spec)}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Surgeon Slicer */}
        <div className="slicer-container">
          <div className="slicer-header">
            <User size={16} /> Filter by Surgeon
            <InfoTooltip text="Filter the model by a specific surgeon. This filter only affects data where the surgeon name is explicitly captured." />
          </div>
          <div className="slicer-items">
            {(surgeonOptions || []).map((surgeon) => (
              <button
                key={surgeon}
                className={`slicer-item ${
                  selectedSurgeons.includes(surgeon) ? "selected" : ""
                }`}
                onClick={() => {
                  onSurgeonChange(surgeon);
                }}
              >
                {surgeon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* This slicer will be full-width on its own row */}
      <div className="slicer-container">
        <div className="slicer-header">
          <MapPin size={16} /> Filter by Site
          <InfoTooltip text="Filter the model by the site where the theatre sessions take place. This filter only affects Timetable Capacity." />
        </div>
        <div className="slicer-items">
          {(siteOptions || []).map((site) => (
            <button
              key={site}
              className={`slicer-item ${
                selectedSite === site ? "selected" : ""
              }`}
              onClick={() => onSiteChange(site)}
            >
              {site}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
