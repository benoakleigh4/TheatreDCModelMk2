import React, { useState, useMemo, useEffect } from "react";
import { ComposedChart } from "recharts";
import Header from "./Header";
import TogglesBar from "./TogglesBar";
import Slicers from "./Slicers";
import KPIPanel from "./KPIPanel";
import WLAnalysisTab from "./WLAnalysisTab";
import WLCohortTab from "./WLCohortTab";
import SummaryTab from "./SummaryTab";
import DataViewTab from "./DataViewTab";
import ForecastTab from "./ForecastTab";
import Sidebar from "./Sidebar";
import GuidePanel from "./GuidePanel";
import InfoTooltip from "./InfoTooltip";
import { Info } from "lucide-react";

import {
  initialAssumptions,
  initialTimetableData,
  initialActivityData,
  initialIcbPlanData,
  initialBacklogData,
  initialDemandPlanData,
  siteOptions as siteOptionsStatic, // Alias static list
} from "../data/initialData";
import {
  normalizeSpecialty,
  normalizeSurgeon,
  findHeader,
  parseUKDate,
  getWeekIndex,
  getWeeksInMonth,
  convertToCSV,
  downloadCSV,
} from "../utils/helpers";

export default function App() {
  // --- Core State ---
  const [activeMainTab, setActiveMainTab] = useState("wlAnalysis");
  const [activeSidebarTab, setActiveSidebarTab] = useState("rttTarget");
  const [isSandbox, setIsSandbox] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [timeframe, setTimeframe] = useState("1y");
  const [viewMode, setViewMode] = useState("cases");
  const [calcMode, setCalcMode] = useState("forecast");
  const [isPapaReady, setIsPapaReady] = useState(false); // PapaParse status
  const [pathwayFilter, setPathwayFilter] = useState("admitted");

  // --- Live/Sandbox State Separation (Full implementation from App.js) ---
  const [liveAssumptions, setLiveAssumptions] = useState(initialAssumptions);
  const [sandboxAssumptions, setSandboxAssumptions] =
    useState(initialAssumptions);

  const [liveTimetable, setLiveTimetable] = useState(initialTimetableData);
  const [sandboxTimetable, setSandboxTimetable] =
    useState(initialTimetableData);

  const [liveActivityData, setLiveActivityData] = useState(initialActivityData);
  const [sandboxActivityData, setSandboxActivityData] =
    useState(initialActivityData);

  const [liveIcbPlanData, setLiveIcbPlanData] = useState(initialIcbPlanData);
  const [sandboxIcbPlanData, setSandboxIcbPlanData] =
    useState(initialIcbPlanData);

  const [liveBacklogData, setLiveBacklogData] = useState(initialBacklogData);
  const [sandboxBacklogData, setSandboxBacklogData] =
    useState(initialBacklogData);

  const [liveDemandPlan, setLiveDemandPlan] = useState(initialDemandPlanData);
  const [sandboxDemandPlan, setSandboxDemandPlan] = useState(
    initialDemandPlanData
  );

  // --- Error & Count State ---
  const [skippedCounts, setSkippedCounts] = useState({
    backlog: 0,
    activity: 0,
    icb: 0,
    demandProfile: 0,
  });
  const [skippedDataMap, setSkippedDataMap] = useState({
    backlog: [],
    activity: [],
    icb: [],
    demandProfile: [],
  });
  const [uploadErrors, setUploadErrors] = useState({});

  // --- Slicer State ---
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedSurgeons, setSelectedSurgeons] = useState(["All Surgeons"]);
  const [selectedSite, setSelectedSite] = useState("All Sites"); // NEW STATE: Site Filter

  // --- State Selectors ---
  const assumptions = isSandbox ? sandboxAssumptions : liveAssumptions;
  const setAssumptions = isSandbox ? setSandboxAssumptions : setLiveAssumptions;
  const timetableData = isSandbox ? sandboxTimetable : liveTimetable;
  const setTimetableData = isSandbox ? setSandboxTimetable : setLiveTimetable;
  const activityData = isSandbox ? sandboxActivityData : liveActivityData;
  const setActivityData = isSandbox
    ? setSandboxActivityData
    : setLiveActivityData;
  const icbPlanData = isSandbox ? sandboxIcbPlanData : liveIcbPlanData;
  const setIcbPlanData = isSandbox ? setSandboxIcbPlanData : setLiveIcbPlanData;
  const backlogData = isSandbox ? sandboxBacklogData : liveBacklogData;
  const setBacklogData = isSandbox ? setSandboxBacklogData : setLiveBacklogData;
  const demandPlanData = isSandbox ? sandboxDemandPlan : liveDemandPlan;
  const setDemandPlanData = isSandbox
    ? setSandboxDemandPlan
    : setLiveDemandPlan;

  // --- Effect to load PapaParse (External Library) ---
  useEffect(() => {
    // Check if PapaParse is already available globally
    if (
      typeof window.Papa !== "undefined" &&
      typeof window.Papa.parse === "function"
    ) {
      setIsPapaReady(true);
      return;
    }

    // Load PapaParse script dynamically if not available
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js";
    script.async = true;

    script.onload = () => {
      setIsPapaReady(true);
    };

    script.onerror = () => {
      console.error("Failed to load PapaParse script.");
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // --- Dynamic Options ---
  const specialtyOptions = useMemo(() => {
    const tData = timetableData || [];
    const bData = backlogData || [];
    const aData = activityData || [];
    const iData = icbPlanData || [];
    const dData = demandPlanData || [];

    try {
      const allSpecs = new Set([
        ...tData.map((t) => normalizeSpecialty(t.specialty)),
        ...bData.map((b) => normalizeSpecialty(b.specialty)),
        ...aData.map((a) => normalizeSpecialty(a.specialty)),
        ...iData.map((i) => normalizeSpecialty(i.specialty)),
        ...dData.map((d) => normalizeSpecialty(d.specialty)),
      ]);
      const sortedSpecs = Array.from(allSpecs)
        .filter(Boolean)
        .filter((s) => s !== "Unknown")
        .sort();
      return ["All Specialties", ...sortedSpecs, "Unknown"];
    } catch (e) {
      return ["All Specialties", "Unknown"];
    }
  }, [timetableData, backlogData, activityData, icbPlanData, demandPlanData]);

  const surgeonOptions = useMemo(() => {
    const relevantData = [...(timetableData || []), ...(activityData || [])];
    const normalizedSelectedSpecialty = normalizeSpecialty(selectedSpecialty);
    try {
      let filteredData = relevantData;
      if (normalizedSelectedSpecialty !== "All Specialties") {
        filteredData = relevantData.filter(
          (d) => normalizeSpecialty(d.specialty) === normalizedSelectedSpecialty
        );
      }
      const surgeons = new Set(
        filteredData
          .map((d) => normalizeSurgeon(d.surgeon))
          .filter(Boolean)
          .filter((s) => s !== "Unknown")
      );
      return ["All Surgeons", ...Array.from(surgeons).sort()];
    } catch (e) {
      return ["All Surgeons"];
    }
  }, [timetableData, activityData, selectedSpecialty]);

  // Dynamic Site Options
  const siteOptions = useMemo(() => {
    const sitesInUse = new Set(
      (timetableData || []).map((t) => t.site).filter(Boolean)
    );

    // Combine sites in use with the static list to get a complete, sorted list
    const allSites = Array.from(new Set([...sitesInUse, ...siteOptionsStatic]));

    const sortedSites = allSites.sort();

    return ["All Sites", ...sortedSites];
  }, [timetableData]);

  // --- CORE CALCULATION ENGINE ---
  const calculation = useMemo(() => {
    // 1. --- Data Filtering ---
    const normalizedSelectedSpecialty = normalizeSpecialty(selectedSpecialty);
    const isAllSpecialties = selectedSpecialty === "All Specialties";
    const isAllSurgeons = selectedSurgeons.includes("All Surgeons");
    const isAllSites = selectedSite === "All Sites";

    const filterBySpecialty = (item) =>
      isAllSpecialties ||
      normalizeSpecialty(item.specialty) === normalizedSelectedSpecialty;
    const filterBySurgeon = (item) =>
      isAllSurgeons ||
      selectedSurgeons.includes(normalizeSurgeon(item.surgeon));
    const filterBySite = (item) => isAllSites || item.site === selectedSite;

    const filteredTimetableData = timetableData
      .filter(filterBySpecialty)
      .filter(filterBySurgeon)
      .filter(filterBySite);

    const filteredActivityData = activityData
      .filter(filterBySpecialty)
      .filter(filterBySurgeon);

    const filteredFullBacklog = backlogData.filter(filterBySpecialty);
    const filteredDemandPlan = demandPlanData.filter(filterBySpecialty);
    const filteredIcbPlanData = icbPlanData.filter(filterBySpecialty);

    // 2. --- Pathway Splitting & Initial Metrics ---
    const isAdmitted = (row) => row.pathwayType === "Admitted";
    const admittedBacklog = filteredFullBacklog.filter(isAdmitted);
    const nonAdmittedBacklog = filteredFullBacklog.filter(
      (row) => !isAdmitted(row)
    );

    const getBacklogMetrics = (list) => {
      const totalCount = list.reduce((sum, row) => sum + row.patientCount, 0);
      const countUnder18w = list
        .filter((r) => r.weeksWait <= 18)
        .reduce((sum, row) => sum + row.patientCount, 0);
      const longestWait = Math.max(0, ...list.map((r) => r.weeksWait));
      const rttPercent =
        totalCount > 0
          ? (countUnder18w / totalCount) * 100
          : backlogData.length > 0
          ? 0
          : 100;

      const wl_0_18w = list
        .filter((r) => r.weeksWait <= 18)
        .reduce((sum, row) => sum + row.patientCount, 0);
      const wl_18_26w = list
        .filter((r) => r.weeksWait > 18 && r.weeksWait <= 26)
        .reduce((sum, row) => sum + row.patientCount, 0);
      const wl_26_52w = list
        .filter((r) => r.weeksWait > 26 && r.weeksWait <= 52)
        .reduce((sum, row) => sum + row.patientCount, 0);
      const wl_52wplus = list
        .filter((r) => r.weeksWait > 52)
        .reduce((sum, row) => sum + row.patientCount, 0);

      return {
        totalCount,
        rttPercent,
        longestWait,
        wl_0_18w,
        wl_18_26w,
        wl_26_52w,
        wl_52wplus,
      };
    };

    const admittedMetrics = getBacklogMetrics(admittedBacklog);
    const nonAdmittedMetrics = getBacklogMetrics(nonAdmittedBacklog);
    const allMetrics = getBacklogMetrics(filteredFullBacklog);

    // 3. --- Calculate Historical Averages & Throughput ---
    const sessionHours = assumptions.hoursPerSession;
    const efficiency = assumptions.theatreEfficiency / 100;
    let totalCompletedCases = 0;
    let totalUniqueSessions = 0;
    let surgeonThroughputMap = new Map();

    if (filteredActivityData.length > 0) {
      const surgeonActivity = filteredActivityData.reduce((acc, row) => {
        const key = normalizeSurgeon(row.surgeon);
        const sessionKey = `${row.date}-${row.sessionId}`;
        if (!acc[key]) {
          acc[key] = { totalCases: 0, sessions: new Set() };
        }
        acc[key].totalCases += row.completed;
        acc[key].sessions.add(sessionKey);
        return acc;
      }, {});

      Object.keys(surgeonActivity).forEach((surgeon) => {
        const { totalCases, sessions } = surgeonActivity[surgeon];
        const uniqueSessions = sessions.size;
        totalCompletedCases += totalCases;
        totalUniqueSessions += uniqueSessions;
        const casesPerSession =
          uniqueSessions > 0 ? totalCases / uniqueSessions : 0;
        surgeonThroughputMap.set(surgeon, casesPerSession);
      });
    }

    const overallAvgCasesPerSession =
      totalUniqueSessions > 0
        ? totalCompletedCases / totalUniqueSessions
        : assumptions.avgCasesPerSession;
    let avgCasesPerSession = isSandbox
      ? assumptions.avgCasesPerSession
      : overallAvgCasesPerSession;
    let avgCaseDuration = sessionHours / (avgCasesPerSession || 1);
    avgCaseDuration =
      avgCaseDuration > 0 && isFinite(avgCaseDuration) ? avgCaseDuration : 1;

    let avgActualCases = 0;
    let avgActualHours = 0;
    if (filteredActivityData.length > 0) {
      const actualByWeek = filteredActivityData.reduce((acc, row) => {
        acc[row.weekIndex] = (acc[row.weekIndex] || 0) + row.completed;
        return acc;
      }, {});
      const weeksWithActuals = Object.keys(actualByWeek).length;
      if (weeksWithActuals > 0) {
        avgActualCases = totalCompletedCases / weeksWithActuals;
        avgActualHours = avgActualCases * avgCaseDuration;
      }
    }

    // 4. --- Calculate Timetable Capacity (Ideal/Plan Capacity) ---
    let capacityCases = assumptions.additionalLists * avgCasesPerSession;

    const calculatedTimetableCases = filteredTimetableData.reduce(
      (sum, row) => {
        const sessionsPerWeek = (row.sessionsOdd + row.sessionsEven) / 2;
        const surgeon = normalizeSurgeon(row.surgeon);

        let rateToUse =
          isSandbox || !surgeonThroughputMap.has(surgeon)
            ? avgCasesPerSession
            : surgeonThroughputMap.get(surgeon);

        return sum + sessionsPerWeek * rateToUse;
      },
      0
    );

    capacityCases += calculatedTimetableCases;
    capacityCases = Math.ceil(capacityCases * efficiency);
    const capacityHours = capacityCases * avgCaseDuration;

    // 5. --- Demand & Contract Plan ---
    let avgDemandCases =
      assumptions.avgWeeklyDemandDTAs * (1 + assumptions.demandShock / 100);
    const demandMap = new Map();
    let isDemandProfileUsed = false;
    if (filteredDemandPlan.length > 0) {
      isDemandProfileUsed = true;
      let totalDemandFromProfile = 0;
      let weeksInProfile = 0;
      filteredDemandPlan.forEach((row) => {
        const currentDemand = demandMap.get(row.weekIndex) || 0;
        demandMap.set(row.weekIndex, currentDemand + row.demand);
        totalDemandFromProfile += row.demand;
        weeksInProfile++;
      });
      if (weeksInProfile > 0) {
        avgDemandCases = totalDemandFromProfile / weeksInProfile;
      }
    }
    let avgDemandHours = avgDemandCases * avgCaseDuration;

    let avgContractPlanCases = 0;
    let avgContractPlanHours = 0;
    const icbMap = new Map();
    if (filteredIcbPlanData.length > 0) {
      let totalIcbCases = 0;
      let weeksInIcb = 0;
      filteredIcbPlanData.forEach((row) => {
        const currentPlan = icbMap.get(row.weekIndex) || 0;
        icbMap.set(row.weekIndex, currentPlan + row.weeklyAmount);
        totalIcbCases += row.weeklyAmount;
        weeksInIcb++;
      });
      if (weeksInIcb > 0) {
        avgContractPlanCases = totalIcbCases / weeksInIcb;
        avgContractPlanHours = avgContractPlanCases * avgCaseDuration;
      }
    }

    // 6. --- 52-Week Simulation Function (Admitted Only) ---
    const weeksToSimulate = 52;
    const initialAdmittedBacklogMap = admittedBacklog.reduce((acc, row) => {
      acc[row.weeksWait] = (acc[row.weeksWait] || 0) + row.patientCount;
      return acc;
    }, {});
    const initialAdmittedWlSize = admittedMetrics.totalCount;

    const runSimulation = (startWLMap, weeklyActivity) => {
      let currentBacklogMap = { ...startWLMap };
      const forecast = [];

      for (let i = 0; i < weeksToSimulate; i++) {
        const agedBacklog = {};
        let nextWlSize = 0;

        // Age backlog (wait + 1 week)
        Object.keys(currentBacklogMap).forEach((wait) => {
          const count = currentBacklogMap[wait];
          if (count > 0) {
            agedBacklog[parseInt(wait) + 1] = count;
            nextWlSize += count;
          }
        });

        // Add Demand
        let demandThisWeek = isDemandProfileUsed
          ? demandMap.get(i) || avgDemandCases
          : avgDemandCases;
        demandThisWeek = Math.ceil(demandThisWeek);
        agedBacklog[0] = (agedBacklog[0] || 0) + demandThisWeek;
        nextWlSize += demandThisWeek;

        // Apply Capacity
        let capacityThisWeek = Math.ceil(weeklyActivity);
        const sortedWaits = Object.keys(agedBacklog)
          .map(Number)
          .sort((a, b) => b - a);
        let treatedThisWeek = 0;

        for (const wait of sortedWaits) {
          if (capacityThisWeek <= 0) break;
          const patientsAvailable = agedBacklog[wait] || 0;
          if (patientsAvailable > 0) {
            const patientsToTreat = Math.min(
              capacityThisWeek,
              patientsAvailable
            );
            agedBacklog[wait] -= patientsToTreat;
            capacityThisWeek -= patientsToTreat;
            treatedThisWeek += patientsToTreat;
          }
        }

        // Calculate Next State
        const nextBacklogMap = {};
        nextWlSize = 0;
        let nextCountUnder18w = 0;
        let wl_0_18w = 0;
        let wl_18_26w = 0;
        let wl_26_52w = 0;
        let wl_52wplus = 0;

        Object.keys(agedBacklog).forEach((wait) => {
          const count = agedBacklog[wait];
          if (count > 0) {
            const waitNum = parseInt(wait);
            nextBacklogMap[waitNum] = count;
            nextWlSize += count;

            if (waitNum <= 18) {
              wl_0_18w += count;
              nextCountUnder18w += count;
            } else if (waitNum > 18 && waitNum <= 26) {
              wl_18_26w += count;
            } else if (waitNum > 26 && waitNum <= 52) {
              wl_26_52w += count;
            } else {
              wl_52wplus += count;
            }
          }
        });

        const rttPercent =
          nextWlSize > 0 ? (nextCountUnder18w / nextWlSize) * 100 : 100;
        const planCases = icbMap.get(i) || 0;
        const actualCases = avgActualCases;

        forecast.push({
          week: i + 1,
          totalWL: Math.ceil(nextWlSize),
          demandCases: demandThisWeek,
          capacityCases: Math.ceil(weeklyActivity), // NOTE: This reflects the ACTIVITY RATE USED FOR THE SIMULATION
          netChange: Math.ceil(weeklyActivity) - demandThisWeek,
          projectedRttPercent: rttPercent,
          demandHours: demandThisWeek * avgCaseDuration,
          capacityHours: Math.ceil(weeklyActivity) * avgCaseDuration,
          netChangeHours:
            (Math.ceil(weeklyActivity) - demandThisWeek) * avgCaseDuration,
          activityPlanContract: planCases,
          actualActivity: actualCases,
          wl_0_18w: Math.ceil(wl_0_18w),
          wl_18_26w: Math.ceil(wl_18_26w),
          wl_26_52w: Math.ceil(wl_26_52w),
          wl_52wplus: Math.ceil(wl_52wplus),
        });
        currentBacklogMap = nextBacklogMap;
      }
      return forecast;
    };

    // 7. --- Determine Required Activity (Target Mode) via Binary Search ---
    let requiredActivity = capacityCases;
    let requiredHours = 0;
    let requiredSessions = 0;
    let sustainableWlSize = 0;

    if (calcMode === "target") {
      let low = 0,
        high = Math.max(
          capacityCases * 2,
          avgDemandCases * 2 +
            initialAdmittedWlSize / (assumptions.timeframeToAchieve || 1)
        );
      let bestGuess = capacityCases;
      const targetTimeframe = assumptions.timeframeToAchieve;

      for (let iter = 0; iter < 15; iter++) {
        let mid = (low + high) / 2;
        const simResult = runSimulation(initialAdmittedBacklogMap, mid);
        const finalWeekData = simResult[targetTimeframe - 1];
        const rttAtTarget = finalWeekData
          ? finalWeekData.projectedRttPercent
          : 100;

        if (rttAtTarget >= assumptions.rttTargetPercent) {
          bestGuess = mid;
          high = mid;
        } else {
          low = mid;
        }
        if (high - low < 0.1) break;
      }
      requiredActivity = Math.ceil(bestGuess);
    }

    requiredHours = requiredActivity * avgCaseDuration;
    requiredSessions =
      avgCasesPerSession > 0 ? requiredActivity / avgCasesPerSession : 0;

    // 8. --- DETERMINE ACTIVITY RATE FOR FORECAST SIMULATION ---
    let activityRateForForecastSim = capacityCases; // Default: Timetable plan

    if (calcMode === "forecast") {
      if (!isSandbox) {
        // LIVE MODE (Forecast WL): Use historical delivered activity rate (avgActualCases)
        // Fallback to Timetable capacity if no activity data is loaded
        activityRateForForecastSim =
          avgActualCases > 0 && totalCompletedCases > 0
            ? avgActualCases
            : capacityCases;
      } else {
        // SANDBOX MODE (Forecast WL): Use the current calculated Timetable capacity (capacityCases)
        activityRateForForecastSim = capacityCases;
      }
    } else {
      // TARGET RTT MODE: Always use the calculated required activity
      activityRateForForecastSim = requiredActivity;
    }

    // 9. --- Generate Final Forecast Data ---
    const admittedForecastData = runSimulation(
      initialAdmittedBacklogMap,
      activityRateForForecastSim
    );

    if (admittedForecastData.length > 0) {
      sustainableWlSize =
        admittedForecastData[admittedForecastData.length - 1].totalWL;
    }

    // 10. --- Create Combined Forecast (Admitted + Non-Admitted) ---
    const combinedForecastData = admittedForecastData.map((weekData) => {
      const combinedTotalWL = weekData.totalWL + nonAdmittedMetrics.totalCount;
      const combinedUnder18w = weekData.wl_0_18w + nonAdmittedMetrics.wl_0_18w;
      const combinedRttPercent =
        combinedTotalWL > 0 ? (combinedUnder18w / combinedTotalWL) * 100 : 100;

      const combined_wl_18_26w =
        weekData.wl_18_26w + nonAdmittedMetrics.wl_18_26w;
      const combined_wl_26_52w =
        weekData.wl_26_52w + nonAdmittedMetrics.wl_26_52w;
      const combined_wl_52wplus =
        weekData.wl_52wplus + nonAdmittedMetrics.wl_52wplus;

      return {
        ...weekData,
        totalWL: Math.ceil(combinedTotalWL),
        projectedRttPercent: combinedRttPercent,
        wl_0_18w: Math.ceil(combinedUnder18w),
        wl_18_26w: Math.ceil(combined_wl_18_26w),
        wl_26_52w: Math.ceil(combined_wl_26_52w),
        wl_52wplus: Math.ceil(combined_wl_52wplus),
      };
    });

    // 11. --- Final KPIs ---

    // --- Determine Base for Variance (vs Contract) ---
    let varianceBaseCases = capacityCases; // Default: Timetable Capacity
    let varianceBaseHours = capacityHours; // Default: Timetable Capacity

    if (!isSandbox) {
      // In Live Mode, the Variance vs Contract reflects HISTORICAL PERFORMANCE vs Contract
      varianceBaseCases = avgActualCases;
      varianceBaseHours = avgActualHours;
    }

    // --- Calculate Variances ---
    const varianceVsContractCases = varianceBaseCases - avgContractPlanCases;
    const varianceVsContractHours = varianceBaseHours - avgContractPlanHours;

    const varianceVsDeliveredCases = capacityCases - avgActualCases;
    const varianceVsDeliveredHours = capacityHours - avgActualHours;

    const hypotheticalListsFreed =
      varianceVsContractCases > 0 && avgCasesPerSession > 0
        ? varianceVsContractCases / avgCasesPerSession
        : 0;

    const kpis = {
      currentWL:
        pathwayFilter === "admitted"
          ? admittedMetrics.totalCount
          : allMetrics.totalCount,
      currentRttPercent:
        pathwayFilter === "admitted"
          ? admittedMetrics.rttPercent
          : allMetrics.rttPercent,
      currentLongestWait:
        pathwayFilter === "admitted"
          ? admittedMetrics.longestWait
          : allMetrics.longestWait,

      capacityCases: capacityCases,
      capacityHours: capacityHours,
      demandCases: avgDemandCases,
      demandHours: avgDemandHours,

      // Surplus/Deficit KPI uses the Sim Rate (activityRateForForecastSim)
      netChangeCases: activityRateForForecastSim - avgDemandCases,
      netChangeHours:
        activityRateForForecastSim * avgCaseDuration - avgDemandHours,

      requiredActivity: requiredActivity,
      requiredHours: requiredHours,
      requiredSessions: requiredSessions,
      sustainableWlSize: sustainableWlSize,

      // VARIANCE (VS CONTRACT) UPDATED
      varianceVsContract:
        viewMode === "cases"
          ? varianceVsContractCases
          : varianceVsContractHours,

      // Timetable vs Actual (Unchanged: Timetable Capacity - Actual)
      varianceVsDelivered:
        viewMode === "cases"
          ? varianceVsDeliveredCases
          : varianceVsDeliveredHours,
      hypotheticalListsFreed: hypotheticalListsFreed,

      avgCasesPerSession: overallAvgCasesPerSession,
      isBacklogLoaded: backlogData.length > 0,
      isActivityLoaded: activityData.length > 0,
      pathwayFilter: pathwayFilter,
      isSandbox: isSandbox,
    };

    return { admittedForecastData, combinedForecastData, kpis };
  }, [
    assumptions,
    timetableData,
    activityData,
    icbPlanData,
    backlogData,
    demandPlanData,
    selectedSpecialty,
    selectedSurgeons,
    selectedSite, // NEW DEPENDENCY
    isSandbox,
    calcMode,
    viewMode,
    pathwayFilter,
  ]);

  // --- Data Selectors ---
  const rawForecastData =
    (pathwayFilter === "admitted"
      ? calculation.admittedForecastData
      : calculation.combinedForecastData) || [];
  const currentKpis = calculation.kpis;

  const sliceForecastData = (data, timeframe) => {
    const weeks = { "3m": 13, "6m": 26, "1y": 52 };
    const sliceIndex = weeks[timeframe] || 52;
    return data.slice(0, Math.min(sliceIndex, data.length));
  };

  const currentForecastData = useMemo(() => {
    return sliceForecastData(rawForecastData, timeframe);
  }, [rawForecastData, timeframe]);

  // --- Handlers for Inputs and Data Management ---
  const handleTimetableChange = (id, field, value) => {
    setTimetableData((prevData) =>
      prevData.map((row) => {
        if (row.id === id) {
          let processedValue = value;
          if (field === "sessionsOdd" || field === "sessionsEven") {
            const numVal = parseFloat(value);
            processedValue = isNaN(numVal) || numVal < 0 ? 0 : numVal;
          } else if (field === "surgeon") {
            processedValue = normalizeSurgeon(value || "Unknown");
          } else if (field === "specialty") {
            processedValue = normalizeSpecialty(value || "Unknown");
          }
          return { ...row, [field]: processedValue };
        }
        return row;
      })
    );
  };

  const addTimetableRow = () => {
    const newId = `t${Date.now()}`;
    let defaultSpecialty = "Unknown";
    const availableSpecs = specialtyOptions.filter(
      (s) => s !== "All Specialties" && s !== "Unknown"
    );
    if (availableSpecs.includes("110 - Trauma and Orthopaedics")) {
      defaultSpecialty = "110 - Trauma and Orthopaedics";
    } else if (availableSpecs.length > 0) {
      defaultSpecialty = availableSpecs[0];
    }

    setTimetableData((prevData) => [
      ...prevData,
      {
        id: newId,
        specialty: defaultSpecialty,
        surgeon: "Unknown",
        site: siteOptionsStatic[0] || "Other",
        sessionsOdd: 0,
        sessionsEven: 0,
      },
    ]);
  };

  const removeTimetableRow = (id) => {
    setTimetableData((prevData) => prevData.filter((row) => row.id !== id));
  };

  const handleAssumptionChange = (key, value) => {
    let numValue = parseFloat(value);
    if (key === "theatreEfficiency" && (numValue < 0 || numValue > 100)) return;
    if (key === "rttTargetPercent" && (numValue < 0 || numValue > 100)) return;
    if (key === "timeframeToAchieve" && numValue < 1) numValue = 1;
    if (key === "hoursPerSession" && numValue < 0.1) numValue = 0.1;
    if (
      (key === "avgCasesPerSession" ||
        key === "avgWeeklyDemandDTAs" ||
        key === "additionalLists") &&
      numValue < 0
    )
      numValue = 0;

    setAssumptions((prev) => ({
      ...prev,
      [key]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleSurgeonChange = (surgeon) => {
    setSelectedSurgeons((prevSelected) => {
      // Check if 'All Surgeons' is the current only selection
      const isAllSelected =
        prevSelected.length === 1 && prevSelected[0] === "All Surgeons";

      // Case 1: Clicked 'All Surgeons' -> reset selection
      if (surgeon === "All Surgeons") {
        return ["All Surgeons"];
      }

      // Case 2: Clicked a specific surgeon
      if (prevSelected.includes(surgeon)) {
        // Deselect the surgeon
        const newSelection = prevSelected.filter(
          (s) => s !== surgeon && s !== "All Surgeons"
        );
        // If the list is now empty, default back to 'All Surgeons'
        return newSelection.length === 0 ? ["All Surgeons"] : newSelection;
      } else {
        // Select the surgeon
        // If 'All Surgeons' was previously selected, clicking a new surgeon removes 'All Surgeons'
        const newSelection = isAllSelected
          ? [surgeon]
          : [...prevSelected, surgeon];
        return newSelection;
      }
    });
  };

  // NEW HANDLER: Site Change
  const handleSiteChange = (site) => {
    setSelectedSite(site);
  };

  const handleExportErrorLog = (type) => {
    const skippedRows = skippedDataMap[type];
    if (!skippedRows || skippedRows.length === 0) {
      alert(`No validation error log available for ${type}.`);
      return;
    }

    let headers = new Set(["ValidationError"]);
    skippedRows.forEach((row) => {
      Object.keys(row)
        .filter((k) => k !== "ValidationError")
        .forEach((k) => headers.add(k));
    });

    const finalHeaders = [
      "ValidationError",
      ...Array.from(headers).filter((h) => h !== "ValidationError"),
    ];

    const filename = `data_validation_errors_${type}.csv`;
    const csvString = convertToCSV(skippedRows, finalHeaders);
    downloadCSV(csvString, filename);
  };

  const resetSandbox = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all sandbox data and assumptions to the current Live values?"
      )
    ) {
      setSandboxAssumptions(liveAssumptions);
      setSandboxTimetable(liveTimetable);
      setSandboxActivityData(liveActivityData);
      setSandboxIcbPlanData(liveIcbPlanData);
      setSandboxBacklogData(liveBacklogData);
      setSandboxDemandPlan(liveDemandPlan);
      setUploadErrors({});
      setSkippedCounts({ backlog: 0, activity: 0, icb: 0, demandProfile: 0 });
      setSkippedDataMap({
        backlog: [],
        activity: [],
        icb: [],
        demandProfile: [],
      });
      alert("Sandbox data and assumptions have been reset to Live values.");
    }
  };

  const saveSandboxToLive = () => {
    if (
      window.confirm(
        "Are you sure you want to apply current sandbox data and assumptions to the Live simulation? This action cannot be undone."
      )
    ) {
      setLiveAssumptions(sandboxAssumptions);
      setLiveTimetable(sandboxTimetable);
      setLiveActivityData(sandboxActivityData);
      setLiveIcbPlanData(sandboxIcbPlanData);
      setLiveBacklogData(sandboxBacklogData);
      setLiveDemandPlan(sandboxDemandPlan);
      setIsSandbox(false);
      alert("Sandbox changes applied successfully to Live environment.");
    }
  };

  const clearData = (dataType) => {
    if (
      window.confirm(
        `Are you sure you want to clear the loaded ${dataType} data from the current session?`
      )
    ) {
      if (dataType === "activity") setActivityData([]);
      if (dataType === "icb") setIcbPlanData([]);
      if (dataType === "backlog") setBacklogData([]);
      if (dataType === "demandProfile") setDemandPlanData([]);

      setUploadErrors((prev) => ({ ...prev, [dataType]: null }));
      setSkippedCounts((prev) => ({ ...prev, [dataType]: 0 }));
      setSkippedDataMap((prev) => ({ ...prev, [dataType]: [] }));
      alert(`Cleared ${dataType} data.`);
    }
  };

  const handleExport = () => {
    let dataToExport = [];
    let filename = "theatre_export.csv";
    let headers = [];

    if (!currentForecastData || currentForecastData.length === 0) {
      alert("No data generated to export for this view/filter combination.");
      return;
    }

    if (
      activeMainTab === "wlAnalysis" ||
      activeMainTab === "forecastTable" ||
      activeMainTab === "wlCohort"
    ) {
      dataToExport = rawForecastData;
      filename = `theatre_forecast_export_${pathwayFilter}.csv`;
      headers = [
        "week",
        "demandCases",
        "capacityCases",
        "netChange",
        "totalWL",
        "projectedRttPercent",
        "demandHours",
        "capacityHours",
        "netChangeHours",
        "activityPlanContract",
        "actualActivity",
        "wl_0_18w",
        "wl_18_26w",
        "wl_26_52w",
        "wl_52wplus",
      ];
    } else if (activeMainTab === "summary") {
      if (calcMode === "target") {
        dataToExport = [
          {
            name: viewMode === "cases" ? "Cases per Week" : "Hours per Week",
            "Average Demand": currentKpis.demandCases,
            "Required Plan": currentKpis.requiredActivity,
          },
        ];
      } else {
        dataToExport = rawForecastData;
      }
      filename = "theatre_summary_export.csv";
      headers = Object.keys(dataToExport[0] || {});
    } else if (activeMainTab === "dataView") {
      if (activityData.length > 0) {
        dataToExport = activityData;
        filename = "activity_data_export.csv";
        headers = Object.keys(activityData[0] || {});
      } else if (backlogData.length > 0) {
        dataToExport = backlogData;
        filename = "backlog_data_export.csv";
        headers = Object.keys(backlogData[0] || {});
      } else if (icbPlanData.length > 0) {
        dataToExport = icbPlanData;
        filename = "icb_plan_export.csv";
        headers = Object.keys(icbPlanData[0] || {});
      } else if (demandPlanData.length > 0) {
        dataToExport = demandPlanData;
        filename = "demand_profile_export.csv";
        headers = Object.keys(demandPlanData[0] || {});
      } else {
        alert("No raw data available to export for Data View.");
        return;
      }
    } else {
      alert("No export defined for this view.");
      return;
    }

    try {
      const csvString = convertToCSV(dataToExport, headers);
      downloadCSV(csvString, filename);
    } catch (csvError) {
      alert(`Error generating CSV: ${csvError.message}`);
    }
  };

  // --- Papa Parse File Upload Logic (Full Implementation) ---
  const handleFileUpload = (file, type) => {
    if (!isPapaReady || typeof window.Papa === "undefined") {
      setUploadErrors((prev) => ({
        ...prev,
        [type]: "CSV Parsing library failed to load or is not ready yet.",
      }));
      return;
    }
    const Papa = window.Papa;

    if (!file) return;
    setUploadErrors((prev) => ({ ...prev, [type]: "Parsing..." }));

    let setDataFunction;
    if (type === "activity") setDataFunction = setActivityData;
    else if (type === "icb") setDataFunction = setIcbPlanData;
    else if (type === "backlog") setDataFunction = setBacklogData;
    else if (type === "demandProfile") setDataFunction = setDemandPlanData;
    else {
      setUploadErrors((prev) => ({
        ...prev,
        [type]: "Error: Unknown data type.",
      }));
      return;
    }

    // --- Define Aliases ---
    const specialtyAliases = [
      "Specialty",
      "Spec",
      "Service",
      "Treatment Function",
    ];
    const weeksWaitAliases = [
      "Weeks Wait",
      "Weeks_Wait",
      "Wait (Weeks)",
      "Current Wait",
    ];
    const pathwayTypeAliases = [
      "PathwayType",
      "Pathway Type",
      "Status",
      "PTL Type",
      "pathwayType",
    ];
    const surgeonAliases = [
      "Surgeon",
      "Consultant",
      "Operator",
      "Primary Surgeon",
    ];
    const weekAliases = ["Week", "Week Starting", "Week Of"];
    const dateAliases = [
      "Date",
      "Session Date",
      "Activity Date",
      "Procedure Date",
    ];
    const sessionIdAliases = [
      "SessionID",
      "Session ID",
      "List ID",
      "Session Code",
    ];
    const completedAliases = [
      "Completed",
      "Cases Done",
      "Actual Cases",
      "Finished",
    ];
    const demandAliases = [
      "Additions",
      "DTA",
      "Demand",
      "New DTAs",
      "Referrals",
    ];
    const monthMap = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const { data, errors: parseErrors, meta } = results;

        if (parseErrors.length > 0) {
          setUploadErrors((prev) => ({
            ...prev,
            [type]: `Error parsing CSV: ${parseErrors[0].message}.`,
          }));
          return;
        }

        let totalRows = data.length;
        const headers = meta.fields;
        let validRows = 0;
        let skippedLog = [];
        let errorMessages = [];

        // --- Header Detection ---
        const detectedHeaders = {};
        const findAndStoreHeader = (fieldName, aliases, isOptional = false) => {
          const foundHeader = findHeader(headers, aliases);
          if (!foundHeader && !isOptional) {
            errorMessages.push(
              `Required column for '${fieldName}' not found (tried: ${aliases.join(
                ", "
              )})`
            );
          }
          detectedHeaders[fieldName] = foundHeader;
        };

        let monthColumns = [];
        switch (type) {
          case "activity":
            findAndStoreHeader("specialty", specialtyAliases);
            findAndStoreHeader("surgeon", surgeonAliases);
            findAndStoreHeader("date", dateAliases);
            findAndStoreHeader("sessionId", sessionIdAliases);
            findAndStoreHeader("completed", completedAliases, true);
            break;
          case "icb":
            findAndStoreHeader("specialty", specialtyAliases);
            const monthRegex =
              /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2})$/i;
            headers.forEach((header) => {
              if (header && monthRegex.test(header)) {
                monthColumns.push(header);
              }
            });
            if (monthColumns.length === 0) {
              errorMessages.push(
                "No month columns found (e.g., Apr-25, May-25). Required for ICB Plan."
              );
            }
            break;
          case "backlog":
            findAndStoreHeader("specialty", specialtyAliases);
            findAndStoreHeader("weeksWait", weeksWaitAliases);
            findAndStoreHeader("pathwayType", pathwayTypeAliases);
            break;
          case "demandProfile":
            findAndStoreHeader("specialty", specialtyAliases);
            findAndStoreHeader("demand", demandAliases);
            findAndStoreHeader("date", dateAliases, true);
            findAndStoreHeader("week", weekAliases, true);
            if (!detectedHeaders.date && !detectedHeaders.week) {
              errorMessages.push(
                "Required column for 'date' OR 'week' not found."
              );
            }
            break;
          default:
            errorMessages.push("Unknown upload type.");
        }

        if (errorMessages.length > 0) {
          setUploadErrors((prev) => ({
            ...prev,
            [type]: `Header errors: ${errorMessages.join("; ")}`,
          }));
          return;
        }

        // --- Data Transformation & Processing ---
        try {
          let processedData = [];

          if (type === "backlog") {
            const patientLevelData = data
              .map((row) => {
                const specialty = normalizeSpecialty(
                  row[detectedHeaders.specialty] || ""
                );
                const weeksWait = parseInt(row[detectedHeaders.weeksWait], 10);
                const pathwayType =
                  row[detectedHeaders.pathwayType] || "Admitted";

                let error = "";
                if (!specialty || specialty === "Unknown")
                  error += "Missing/Invalid Specialty; ";
                if (isNaN(weeksWait) || weeksWait < 0)
                  error += "Non-numeric/Negative Weeks Wait; ";

                if (error) {
                  skippedLog.push({ ...row, ValidationError: error.trim() });
                  return null;
                }
                return { specialty, weeksWait, pathwayType };
              })
              .filter(Boolean);

            validRows = patientLevelData.length;
            const aggregated = patientLevelData.reduce((acc, row) => {
              const key = `${row.specialty}|${row.weeksWait}|${row.pathwayType}`;
              if (!acc[key]) {
                acc[key] = { ...row, patientCount: 0 };
              }
              acc[key].patientCount += 1;
              return acc;
            }, {});
            processedData = Object.values(aggregated);
          } else if (type === "activity") {
            processedData = data
              .map((row) => {
                const specialty = normalizeSpecialty(
                  row[detectedHeaders.specialty] || ""
                );
                const surgeon = normalizeSurgeon(
                  row[detectedHeaders.surgeon] || "Unknown"
                );
                const sessionId = row[detectedHeaders.sessionId] || "N/A";
                let dateString = row[detectedHeaders.date] || "";
                const completedRaw = row[detectedHeaders.completed];

                let error = "";
                let completedCount = 1;

                if (detectedHeaders.completed) {
                  const parsedCompleted = parseFloat(completedRaw);
                  if (
                    Number.isFinite(parsedCompleted) &&
                    parsedCompleted >= 0
                  ) {
                    completedCount = parsedCompleted;
                  } else {
                    error += `Non-numeric/Negative Completed Cases value ('${completedRaw}'); `;
                  }
                }

                let weekIndex = -1;
                let procDate;
                procDate = parseUKDate(dateString);

                if (procDate === null) {
                  error +=
                    "Invalid Date format (must be DD/MM/YYYY or similar); ";
                } else {
                  weekIndex = getWeekIndex(procDate);
                  dateString = procDate.toISOString().split("T")[0];
                }

                if (error) {
                  skippedLog.push({ ...row, ValidationError: error.trim() });
                  return null;
                }

                return {
                  specialty,
                  surgeon,
                  sessionId,
                  date: dateString,
                  weekIndex: weekIndex,
                  completed: completedCount,
                };
              })
              .filter(Boolean);

            validRows = processedData.length;
          } else if (type === "icb") {
            const weeklyAggregated = {};
            data.forEach((row) => {
              let specialtyError = "";
              const specialty = normalizeSpecialty(
                row[detectedHeaders.specialty] || ""
              );
              if (!specialty) specialtyError = "Missing/Invalid Specialty; ";

              let rowHasValidMonthData = false;
              if (specialtyError) {
                skippedLog.push({
                  ...row,
                  ValidationError: specialtyError.trim(),
                });
                return;
              }

              monthColumns.forEach((col) => {
                const monthlyTotalRaw =
                  row[col] !== undefined && row[col] !== null
                    ? String(row[col]).trim()
                    : "";
                if (monthlyTotalRaw === "") return;

                const monthlyTotal = parseInt(monthlyTotalRaw, 10);
                if (isNaN(monthlyTotal) || monthlyTotal < 0) return;

                const [monthStr, yearStr] = col.split("-");
                const year = parseInt(yearStr, 10) + 2000;
                const month = monthMap[monthStr.toLowerCase()];

                if (month === undefined || isNaN(year)) return;

                const weeksInMonth = getWeeksInMonth(year, month);
                if (weeksInMonth.length === 0) return;

                rowHasValidMonthData = true;
                const weeklyAverage = monthlyTotal / weeksInMonth.length;

                weeksInMonth.forEach((weekStartDate) => {
                  const weekIndex = getWeekIndex(weekStartDate);
                  if (weekIndex === -1) return;

                  const key = `${specialty}|${weekIndex}`;
                  if (!weeklyAggregated[key]) {
                    weeklyAggregated[key] = {
                      specialty: specialty,
                      weekIndex: weekIndex,
                      weeklyAmount: 0,
                      week: weekStartDate.toISOString().split("T")[0],
                    };
                  }
                  weeklyAggregated[key].weeklyAmount += weeklyAverage;
                });
              });

              if (!rowHasValidMonthData) {
                skippedLog.push({
                  ...row,
                  ValidationError:
                    "Specialty is valid but no monthly plan data found/is valid.",
                });
              } else {
                validRows++;
              }
            });
            processedData = Object.values(weeklyAggregated);
          } else if (type === "demandProfile") {
            const weeklyAggregated = {};
            const validatedData = data
              .map((row) => {
                const specialty = normalizeSpecialty(
                  row[detectedHeaders.specialty] || ""
                );
                const demand = parseInt(row[detectedHeaders.demand], 10);
                const dateString = row[detectedHeaders.date];
                const weekString = row[detectedHeaders.week];

                let error = "";
                if (!specialty || specialty === "Unknown")
                  error += "Missing/Invalid Specialty; ";
                if (isNaN(demand) || demand <= 0)
                  error += "Non-numeric/Negative Demand (DTA); ";

                let weekIndex = -1;
                if (dateString && parseUKDate(dateString)) {
                  weekIndex = getWeekIndex(parseUKDate(dateString));
                } else if (weekString) {
                  const weekMatch = String(weekString).match(/^W(\d{1,2})$/i);
                  if (weekMatch) {
                    weekIndex = parseInt(weekMatch[1], 10) - 1;
                  }
                }

                if (error) {
                  skippedLog.push({ ...row, ValidationError: error.trim() });
                  return null;
                }

                return { specialty, weekIndex, demand };
              })
              .filter(Boolean);

            validRows = validatedData.length;
            const finalAggregated = validatedData.reduce((acc, row) => {
              const key = `${row.specialty}|${row.weekIndex}`;
              if (!acc[key]) {
                acc[key] = {
                  specialty: row.specialty,
                  weekIndex: row.weekIndex,
                  demand: 0,
                };
              }
              acc[key].demand += row.demand;
              return acc;
            }, {});
            processedData = Object.values(finalAggregated);
          }

          if (processedData.length === 0 && totalRows > 0) {
            setUploadErrors((prev) => ({
              ...prev,
              [type]:
                "No valid records found after filtering. Check the error log for details.",
            }));
            setDataFunction([]);
          } else if (processedData.length > 0) {
            setDataFunction(processedData);
          } else {
            setDataFunction([]);
          }

          setSkippedCounts((prev) => ({
            ...prev,
            [type]: totalRows - validRows,
          }));
          setSkippedDataMap((prev) => ({ ...prev, [type]: skippedLog }));

          // --- CRITICAL FIX: Explicitly clear "Parsing..." status on success ---
          setUploadErrors((prev) => ({ ...prev, [type]: null }));

          setActiveMainTab("dataView");
          if (validRows > 0) {
            alert(
              `Successfully loaded ${validRows} rows for ${type}. Check Data View tab.`
            );
          }
        } catch (transformError) {
          setUploadErrors((prev) => ({
            ...prev,
            [type]: `Internal processing error: ${transformError.message}`,
          }));
          setDataFunction([]);
          setSkippedCounts((prev) => ({ ...prev, [type]: totalRows }));
          setSkippedDataMap((prev) => ({ ...prev, [type]: skippedLog }));
        }
      },
      error: (err) => {
        setUploadErrors((prev) => ({
          ...prev,
          [type]: `File parsing failed: ${err.message}`,
        }));
      },
    });
  };

  // --- Final Render ---
  return (
    <>
      {showGuide && <GuidePanel onClose={() => setShowGuide(false)} />}

      <Header onGuideClick={() => setShowGuide(true)} />

      {/* UPDATED: Container now holds Toggles Bar */}
      <div className="container" style={{ paddingTop: "0" }}>
        {/* Toggles Bar is now a standalone component inside the container */}
        <TogglesBar
          isSandbox={isSandbox}
          onModeToggle={() => setIsSandbox(!isSandbox)}
          viewMode={viewMode}
          onViewToggle={() =>
            setViewMode(viewMode === "cases" ? "hours" : "cases")
          }
          calcMode={calcMode}
          onCalcModeToggle={() =>
            setCalcMode(calcMode === "forecast" ? "target" : "forecast")
          }
          pathwayFilter={pathwayFilter}
          onPathwayToggle={() =>
            setPathwayFilter(pathwayFilter === "admitted" ? "all" : "admitted")
          }
        />

        <div className="main-grid">
          {/* --- Sidebar --- */}
          <div className="sidebar">
            {/* Slicers (Refactored to use Slicers component) */}
            <Slicers
              specialtyOptions={specialtyOptions}
              selectedSpecialty={selectedSpecialty}
              onSpecialtyChange={setSelectedSpecialty}
              surgeonOptions={surgeonOptions}
              selectedSurgeons={selectedSurgeons}
              onSurgeonChange={handleSurgeonChange}
              siteOptions={siteOptions}
              selectedSite={selectedSite}
              onSiteChange={handleSiteChange}
            />
            {/* Config Panels - Use Sidebar Component */}
            <div className="card">
              <Sidebar
                activeSidebarTab={activeSidebarTab}
                setActiveSidebarTab={setActiveSidebarTab}
                assumptions={assumptions}
                onAssumptionChange={handleAssumptionChange}
                timetableData={timetableData}
                onTimetableChange={handleTimetableChange}
                onAddRow={addTimetableRow}
                onRemoveRow={removeTimetableRow}
                specialtyOptions={specialtyOptions}
                activityData={activityData}
                icbPlanData={icbPlanData}
                backlogData={backlogData}
                demandPlanData={demandPlanData}
                isSandbox={isSandbox}
                historicalAvgCases={currentKpis?.avgCasesPerSession}
                calcMode={calcMode}
                // Data Management Props
                onReset={resetSandbox}
                onSave={saveSandboxToLive}
                onFileUpload={handleFileUpload}
                onClearData={clearData}
                onExportErrorLog={handleExportErrorLog}
                uploadErrors={uploadErrors}
                skippedCounts={skippedCounts}
                isPapaReady={isPapaReady}
                onSetActiveTab={setActiveMainTab} // <-- PASSING THE CORRECT SETTER
              />
            </div>
          </div>

          {/* --- Main Content --- */}
          <div className="main-content">
            {/* UPDATED: KPI Panel is now wrapped in a card */}
            <div className="card">
              <KPIPanel
                kpis={currentKpis}
                calcMode={calcMode}
                viewMode={viewMode}
                TooltipComponent={InfoTooltip}
              />
            </div>

            {/* Main Tabs (Inline in final version) */}
            <div className="main-tabs">
              <button
                className={activeMainTab === "wlAnalysis" ? "active" : ""}
                onClick={() => setActiveMainTab("wlAnalysis")}
              >
                WL Analysis
              </button>
              <button
                className={activeMainTab === "wlCohort" ? "active" : ""}
                onClick={() => setActiveMainTab("wlCohort")}
              >
                WL Cohorts
              </button>
              <button
                className={activeMainTab === "summary" ? "active" : ""}
                onClick={() => setActiveMainTab("summary")}
              >
                D&C Summary
              </button>
              <button
                className={activeMainTab === "dataView" ? "active" : ""}
                onClick={() => setActiveMainTab("dataView")}
              >
                Data View
              </button>
              <button
                className={activeMainTab === "forecastTable" ? "active" : ""}
                onClick={() => setActiveMainTab("forecastTable")}
              >
                Forecast Table
              </button>
            </div>

            {/* Tab Content */}
            {activeMainTab === "wlAnalysis" && (
              <WLAnalysisTab
                data={currentForecastData}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                rttTargetPercent={assumptions.rttTargetPercent}
                calcMode={calcMode}
                sustainableWlSize={currentKpis?.sustainableWlSize}
                pathwayFilter={pathwayFilter}
              />
            )}
            {activeMainTab === "wlCohort" && (
              <WLCohortTab
                data={currentForecastData}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                pathwayFilter={pathwayFilter}
              />
            )}
            {activeMainTab === "summary" && (
              <SummaryTab
                data={currentForecastData}
                viewMode={viewMode}
                calcMode={calcMode}
                requiredActivity={currentKpis?.requiredActivity}
                avgDemand={
                  viewMode === "cases"
                    ? currentKpis?.demandCases
                    : currentKpis?.demandHours
                }
              />
            )}
            {activeMainTab === "dataView" && (
              <DataViewTab
                activityData={activityData}
                icbPlanData={icbPlanData}
                backlogData={backlogData}
                demandPlanData={demandPlanData}
              />
            )}
            {activeMainTab === "forecastTable" && (
              <ForecastTab
                data={currentForecastData}
                viewMode={viewMode}
                onExport={handleExport}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
