import React from "react";
import GaugeChart from "./GaugeChart";
import KpiCard from "./KpiCard";
import InfoTooltip from "./InfoTooltip";
import {
  TrendingUp,
  TrendingDown,
  Hourglass,
  Package,
  Clock,
} from "lucide-react";

export default function ExecutiveSummaryTab({ kpis, rawForecastData }) {
  // Find the projected RTT % at 52 weeks
  const projectedRtt =
    rawForecastData && rawForecastData.length > 0
      ? rawForecastData[rawForecastData.length - 1].projectedRttPercent
      : 0;

  // Determine Surplus/Deficit KPI
  const viewMode = "cases"; // Default to 'cases' for this view
  const surplusKpi = {
    title: "Surplus/Deficit",
    value: kpis.netChangeCases ?? "N/A",
    unit: "cases/wk",
    icon: kpis.netChangeCases >= 0 ? TrendingUp : TrendingDown,
    color: kpis.netChangeCases >= 0 ? "bg-blue-100" : "bg-orange-100",
    textColor: kpis.netChangeCases >= 0 ? "text-blue-600" : "text-orange-600",
    tooltipText:
      "Difference between planned/historical activity and average weekly demand.",
  };

  // Determine Longest Wait KPI
  const longestWaitKpi = {
    title: "Current Longest Wait",
    value: kpis.currentLongestWait ?? "N/A",
    unit: "weeks",
    icon: Hourglass,
    color: "bg-yellow-100",
    textColor: "text-yellow-600",
    tooltipText:
      "The longest wait time (in weeks) in the currently uploaded waiting list.",
  };

  return (
    <div className="container exec-summary-grid">
      <GaugeChart
        title="Current RTT % (Admitted)"
        value={kpis.currentRttPercent ?? 0}
        unit="% <18w"
        target={92}
      />
      <GaugeChart
        title="Projected 52-Week RTT %"
        value={projectedRtt ?? 0}
        unit="% <18w"
        target={92}
      />
      <KpiCard {...surplusKpi} TooltipComponent={InfoTooltip} />
      <KpiCard {...longestWaitKpi} TooltipComponent={InfoTooltip} />
    </div>
  );
}
