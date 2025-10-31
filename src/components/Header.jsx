import React from "react";
import { BookOpen } from "lucide-react";
import PaLogo from "./PaLogo";
import MedwayLogoWhite from "./MedwayLogoWhite";

export default function Header({ onGuideClick }) {
  return (
    // The top-level header bar is defined by the CSS to stretch across the page
    <header className="header">
      {/* The inner container structure is simplified and relies on 'justify-content: space-between' from flex setup in CSS */}
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between", // Pushes content to the edges
          alignItems: "center",
          padding: "1.5rem 2rem",
        }}
      >
        <div className="header-content">
          <h1>Theatre D&C Model</h1>
          <p>Demand & Capacity Simulation Tool</p>
        </div>
        <div
          className="header-logos"
          style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
        >
          <button className="btn btn-secondary" onClick={onGuideClick}>
            <BookOpen size={16} /> Open Guide
          </button>
          <MedwayLogoWhite />
          <PaLogo />
        </div>
      </div>
    </header>
  );
}
