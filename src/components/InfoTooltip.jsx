import React from "react";
import { Info } from "lucide-react";

/**
 * Renders a clickable question mark icon that displays a tooltip on hover.
 */
export default function InfoTooltip({ text }) {
  return (
    <span className="tooltip-container">
      <Info size={14} className="tooltip-icon" />
      <span className="tooltip-text">{text}</span>
    </span>
  );
}
