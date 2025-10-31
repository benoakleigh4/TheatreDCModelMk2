export const initialAssumptions = {
  // Demand
  currentWL: 1500, // Starting waiting list size
  avgWeeklyDemandDTAs: 100, // Weekly demand (DTAs)
  demandShock: 0, // % increase in demand

  // Capacity
  hoursPerSession: 4.0,
  theatreEfficiency: 85, // %
  avgCasesPerSession: 5.0, // Sandbox default
  additionalLists: 0, // Extra lists per week

  // Target RTT
  rttTargetPercent: 92,
  timeframeToAchieve: 52, // weeks
};

export const initialTimetableData = [
  {
    id: "t1",
    specialty: "110 - Trauma and Orthopaedics",
    surgeon: "Smith, Mr John",
    site: "MT",
    sessionsOdd: 3,
    sessionsEven: 3,
  },
  {
    id: "t2",
    specialty: "100 - General Surgery",
    surgeon: "Patel, Miss Sunita",
    site: "MT",
    sessionsOdd: 4,
    sessionsEven: 4,
  },
  {
    id: "t3",
    specialty: "101 - Urology",
    surgeon: "Davis, Dr Emily",
    site: "SDCC",
    sessionsOdd: 3,
    sessionsEven: 3,
  },
];

export const initialActivityData = [];
export const initialIcbPlanData = [];
export const initialBacklogData = [];
export const initialDemandPlanData = [];

export const siteOptions = ["MT", "SDCC", "Other"];
