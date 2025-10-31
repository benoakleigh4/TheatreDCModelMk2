import React from "react";
import {
  Package,
  Clock,
  Target,
  Box,
  Percent,
  Hourglass,
  Scale,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
} from "lucide-react";

// KpiCard helper component (extracted from monolithic file)
function KpiCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  textColor,
  tooltipText,
  TooltipComponent: InfoTooltip, // Receive the custom tooltip component
}) {
  // Format value: display one decimal unless >= 1000, then display zero decimals.
  const formattedValue =
    typeof value === "number" ? value.toFixed(value >= 1000 ? 0 : 1) : value;

  return (
    <div className="kpi-card">
      <div className={`icon-kpi ${color}`}>
        {Icon && <Icon size={24} className={textColor} />}
      </div>
      {/* This div contains the text content */}
      <div>
        <div className="text-sm">
          {title}
          {tooltipText && <InfoTooltip text={tooltipText} />}
        </div>
        {/* UPDATED: Value and Unit are now stacked */}
        <h3 className="text-2xl">{formattedValue}</h3>
        <div className="unit">{unit}</div>
      </div>
    </div>
  );
}

export default function KPIPanel({
  kpis,
  calcMode,
  viewMode,
  TooltipComponent,
}) {
  if (!kpis) return null;

  const Tooltip = TooltipComponent; // Use the passed component

  // --- Define Primary KPIs (Row 1) ---
  let primaryKpis = [];

  if (calcMode === "target") {
    // Target Mode KPIs
    primaryKpis = [
      {
        title: "Required Cases",
        value: kpis.requiredActivity ?? "N/A",
        unit: "per week",
        icon: Package,
        color: "bg-pink-100",
        textColor: "text-pink-600",
        tooltipText:
          "Calculated weekly cases needed to meet the RTT target within the timeframe, based on the admitted waiting list simulation.",
      },
      {
        title: "Required Hours",
        value: kpis.requiredHours ?? "N/A",
        unit: "per week",
        icon: Clock,
        color: "bg-pink-100",
        textColor: "text-pink-600",
        tooltipText:
          "Calculated weekly theatre hours needed to meet the RTT target.",
      },
      {
        title: "Required Sessions",
        value: kpis.requiredSessions ?? "N/A",
        unit: "per week",
        icon: Calendar,
        color: "bg-pink-100",
        textColor: "text-pink-600",
        tooltipText:
          "Calculated weekly theatre sessions (lists) needed to meet the RTT target, based on historical throughput.",
      },
      {
        title: "Sustainable Backlog",
        value: kpis.sustainableWlSize ?? "N/A",
        unit: "admitted cases",
        icon: Users,
        color: "bg-pink-100",
        textColor: "text-pink-600",
        tooltipText:
          "The projected admitted waiting list size once the RTT target is achieved and maintained (based on the admitted patient simulation).",
      },
    ];
  } else {
    // Forecast Mode KPIs
    const activityRateUsed =
      viewMode === "cases"
        ? kpis.netChangeCases + kpis.demandCases
        : kpis.netChangeHours + kpis.demandHours;

    if (viewMode === "hours") {
      primaryKpis = [
        {
          title: "Timetable Capacity",
          value: kpis.capacityHours ?? "N/A",
          unit: "hours/wk",
          icon: Clock,
          color: "bg-green-100",
          textColor: "text-green-600",
          tooltipText:
            "Total weekly theatre hours available based on filtered timetable, efficiency, and additional lists.",
        },
        {
          title: "Avg. Demand",
          value: kpis.demandHours ?? "N/A",
          unit: "hours/wk",
          icon: Target,
          color: "bg-red-100",
          textColor: "text-red-600",
          tooltipText:
            "Average weekly theatre hours required based on DTA demand (profile or manual input).",
        },
        {
          title: "Surplus/Deficit",
          value: kpis.netChangeHours ?? "N/A",
          unit: "hours/wk",
          icon: kpis.netChangeHours >= 0 ? TrendingUp : TrendingDown,
          color: kpis.netChangeHours >= 0 ? "bg-blue-100" : "bg-orange-100",
          textColor:
            kpis.netChangeHours >= 0 ? "text-blue-600" : "text-orange-600",
          tooltipText: kpis.isSandbox
            ? "Difference between planned capacity and average demand."
            : `Difference between historical delivered activity (${activityRateUsed.toFixed(
                0
              )} hrs/wk) and average demand.`,
        },
        {
          title: "Lists (vs Contract)",
          value: kpis.hypotheticalListsFreed ?? "N/A",
          unit: "lists/wk freed",
          icon: Box,
          color: "bg-purple-100",
          textColor: "text-purple-600",
          tooltipText:
            "Estimated weekly lists potentially available above the average Activity Plan (Contract), based on variance base.",
        },
      ];
    } else {
      // Cases View
      primaryKpis = [
        {
          title: "Timetable Capacity",
          value: kpis.capacityCases ?? "N/A",
          unit: "cases/wk",
          icon: Package,
          color: "bg-green-100",
          textColor: "text-green-600",
          tooltipText:
            "Total weekly cases capacity based on filtered timetable, efficiency, throughput, and additional lists.",
        },
        {
          title: "Avg. Demand",
          value: kpis.demandCases ?? "N/A",
          unit: "cases/wk",
          icon: Target,
          color: "bg-red-100",
          textColor: "text-red-600",
          tooltipText:
            "Average weekly new cases (DTAs) arriving based on demand profile or manual input).",
        },
        {
          title: "Surplus/Deficit",
          value: kpis.netChangeCases ?? "N/A",
          unit: "cases/wk",
          icon: kpis.netChangeCases >= 0 ? TrendingUp : TrendingDown,
          color: kpis.netChangeCases >= 0 ? "bg-blue-100" : "bg-orange-100",
          textColor:
            kpis.netChangeCases >= 0 ? "text-blue-600" : "text-orange-600",
          tooltipText: kpis.isSandbox
            ? "Difference between planned capacity and average demand."
            : `Difference between historical delivered activity (${activityRateUsed.toFixed(
                0
              )} cases/wk) and average demand.`,
        },
        {
          title: "Lists (vs Contract)",
          value: kpis.hypotheticalListsFreed ?? "N/A",
          unit: "lists/wk freed",
          icon: Box,
          color: "bg-purple-100",
          textColor: "text-purple-600",
          tooltipText:
            "Estimated weekly lists potentially available above the average Activity Plan (Contract), based on variance base.",
        },
      ];
    }
  }

  // --- Define Secondary KPIs (Row 2 - always shown) ---
  const secondaryKpis = [
    {
      title: `Current RTT % (${
        kpis.pathwayFilter === "admitted" ? "Admitted" : "All"
      })`,
      value: kpis.currentRttPercent ?? "N/A",
      unit: "% <18w",
      icon: Percent,
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      tooltipText: `Percentage of the currently uploaded waiting list (filtered by pathway: ${kpis.pathwayFilter}) waiting 18 weeks or less.`,
    },
    {
      title: "Current Longest Wait",
      value: kpis.currentLongestWait ?? "N/A",
      unit: "weeks",
      icon: Hourglass,
      color: "bg-yellow-100",
      textColor: "text-yellow-600",
      tooltipText: `The longest wait time (in weeks) in the currently uploaded waiting list (filtered by pathway: ${kpis.pathwayFilter}).`,
    },
    {
      title: kpis.isSandbox
        ? "Variance (vs Contract)"
        : "Performance (vs Contract)",
      value: kpis.varianceVsContract ?? "N/A",
      unit: viewMode === "cases" ? "cases/wk" : "hours/wk",
      icon: Scale,
      color: "bg-cyan-100",
      textColor: "text-cyan-600",
      tooltipText: kpis.isSandbox
        ? `Difference between filtered Timetable Capacity and the Contract Plan.`
        : `Difference between Historical Delivered Activity and the Contract Plan.`,
    },
    {
      title: "Timetable vs Actual",
      value: kpis.varianceVsDelivered ?? "N/A",
      unit: viewMode === "cases" ? "cases/wk" : "hours/wk",
      icon: Activity,
      color: "bg-cyan-100",
      textColor: "text-cyan-600",
      tooltipText: `Difference between filtered Timetable Capacity and Avg. Historical Delivered Activity.`,
    },
  ];

  // --- Combine all KPIs into one list ---
  let allKpis = [...primaryKpis];

  if (kpis.isBacklogLoaded || kpis.isActivityLoaded) {
    allKpis = [...allKpis, ...secondaryKpis];
  }

  return (
    <>
      {/* Title is now outside the grid */}
      <h3 style={{ marginBottom: "1rem" }}>Key Performance Indicators</h3>

      {/* A single grid now wraps all KPIs */}
      <div className="kpi-grid">
        {allKpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} TooltipComponent={Tooltip} />
        ))}
      </div>
    </>
  );
}
