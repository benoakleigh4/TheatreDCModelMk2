// src/utils/helpers.js

/**
 * Converts "JOHN SMITH" or "john smith" to "John Smith"
 */
export function toTitleCase(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts surgeon names like "SHARIFF, MR SAJID" to "Shariff, Mr Sajid"
 */
export function normalizeSurgeon(name) {
  if (!name || typeof name !== "string") return "Unknown";
  if (name.toLowerCase().trim() === "unknown") return "Unknown";

  if (name.includes(",")) {
    // Format: "LAST, MR FIRST"
    return name
      .split(",")
      .map((part) => toTitleCase(part.trim()))
      .join(", ");
  } else {
    // Format: "FIRST LAST"
    return toTitleCase(name.trim());
  }
}

/**
 * Normalizes T&O, ENT, Gen Surg, etc., and handles case insensitivity, TFC codes, and aliases.
 */
export function normalizeSpecialty(specialtyName) {
  if (!specialtyName || typeof specialtyName !== "string") return "Unknown";

  if (specialtyName.toLowerCase().trim() === "unknown") return "Unknown";

  // --- CANONICAL CLEANING STEP ---
  const canonicalKey = specialtyName
    .toLowerCase()
    .replace(/\s/g, "") // Remove all whitespace
    .replace(/-/g, "") // Remove hyphens
    .replace(/&/g, "") // Remove ampersands
    .replace(/\./g, "") // Remove dots
    .replace(/and/g, "") // Remove 'and'
    .replace(/_/g, "") // Remove underscores
    .replace(/[()]/g, "") // Remove parentheses
    .trim();

  // The aliasMap now uses the canonical keys
  const canonicalAliasMap = {
    // 1. General Surgery (100)
    generalsurgery: "100 - General Surgery",
    "100generalsurgery": "100 - General Surgery",
    gensurg: "100 - General Surgery",
    colorectalsurgery: "100 - General Surgery",
    "100colorectalsurgery": "100 - General Surgery",
    breastsurgery: "100 - General Surgery",
    "103breastsurgery": "100 - General Surgery",
    "104colorectalsurgery": "100 - General Surgery",

    // 2. Urology (101)
    urology: "101 - Urology",
    "101urology": "101 - Urology",
    urologyekhuft: "101 - Urology",

    // 3. Trauma & Orthopaedics (110)
    traumaorthopaedics: "110 - Trauma and Orthopaedics",
    "110traumaorthopaedics": "110 - Trauma and Orthopaedics",
    to: "110 - Trauma and Orthopaedics",
    "110to": "110 - Trauma and Orthopaedics",
    traumaorthopaedic: "110 - Trauma and Orthopaedics",
    "110orthopaedic": "110 - Trauma and Orthopaedics",
    spinalsurgeryto: "110 - Trauma and Orthopaedics",
    fractureclinic: "110 - Trauma and Orthopaedics",
    bone: "110 - Trauma and Orthopaedics",
    "110spinalsurgeryto": "110 - Trauma and Orthopaedics",
    "110traumaorthopaedic": "110 - Trauma and Orthopaedics",

    // 4. ENT (120)
    ent: "120 - ENT",
    "120ent": "120 - ENT",
    earnsethroat: "120 - ENT",
    "120earnsethroat": "120 - ENT",
    "120earnosethroat": "120 - ENT",

    // 5. Oral & Max Fax (130)
    oralsurgery: "130 - Oral & Maxillo Facial Surgery",
    "130oralsurgery": "130 - Oral & Maxillo Facial Surgery",
    maxillofacialsurgery: "130 - Oral & Maxillo Facial Surgery",
    "130maxillofacialsurgery": "130 - Oral & Maxillo Facial Surgery",
    dentaloralmedicine: "135 - Oral Medicine",

    // Other Specialties (Simplified for canonical key lookup)
    orthodontics: "133 - Orthodontics",
    ophthalmology: "140 - Ophthalmology",
    "140ophthalmology": "140 - Ophthalmology",
    plasticsurgery: "150 - Plastic Surgery",
    "150plasticsurgery": "150 - Plastic Surgery",
    paediatricsurgery: "171 - Paediatric Surgery",
    "171paediatricsurgery": "171 - Paediatric Surgery",
    paediatricurology: "171 - Paediatric Surgery",
    "171paediatricurology": "171 - Paediatric Surgery",
    anaesthetics: "190 - Anaesthetics",
    painmanagement: "192 - Pain Management",
    chronicpain: "192 - Pain Management",
    chronicpainspinal: "192 - Pain Management",
    medicaloncology: "250 - Medical Oncology",
    generaltmedicine: "300 - General Medicine",
    "300generalmedicine": "300 - General Medicine",
    gastroenterology: "301 - Gastroenterology",
    "301gastroenterology": "301 - Gastroenterology",
    hepatology: "301 - Gastroenterology",
    bowelscreening: "301 - Gastroenterology",
    elderlymedicine: "303 - Geriatric Medicine",
    sleepservice: "304 - Sleep Medicine",
    endocrinologydiabetes: "310 - Endocrinology and Diabetes",
    diabeticmedicine: "310 - Endocrinology and Diabetes",
    paediatricdiabeticmedicine: "310 - Endocrinology and Diabetes",
    thyroid: "310 - Endocrinology and Diabetes",
    endocrinology: "310 - Endocrinology and Diabetes",
    "310endocrinology": "310 - Endocrinology and Diabetes",
    cardiology: "320 - Cardiology",
    rheumatology: "330 - Rheumatology",
    thoracicmedicine: "340 - Thoracic Medicine",
    chest: "340 - Thoracic Medicine",
    neurology: "400 - Neurology",
    chemicalpathology: "501 - Chemical Pathology",
    "501chemicalpathology": "501 - Chemical Pathology",
    gynaecology: "502 - Gynaecology",
    paediatrics: "710 - General Paediatrics",
    communitypaediatrics: "711 - Community Paediatrics",
    paediatricendocrinologydiabetes:
      "712 - Paediatric Endocrinology and Diabetes",
    nuclearmedicine: "810 - Nuclear Medicine",
    diagnosticimaging: "811 - Diagnostic Imaging",
    interventionalradiology: "811 - Diagnostic Imaging",
    clinicalhaematology: "820 - Clinical Haematology",
  };

  if (canonicalAliasMap[canonicalKey]) {
    return canonicalAliasMap[canonicalKey];
  }

  // Step 3: Fallback - use cleaned version
  return toTitleCase(specialtyName.trim());
}

/**
 * Finds the first header in the list that matches any alias (case-insensitive, trimmed)
 */
export function findHeader(headers, aliases) {
  if (!headers || !aliases) return null;
  const lowerAliases = aliases.map((a) => a.toLowerCase().trim());
  for (const header of headers) {
    if (header && lowerAliases.includes(header.toLowerCase().trim())) {
      return header; // Return the exact header found in the file
    }
  }
  return null; // Not found
}

/**
 * Robustly parses date strings in common UK formats (DD/MM/YYYY or DD-MM-YYYY).
 */
export function parseUKDate(dateString) {
  if (!dateString || typeof dateString !== "string") return null;

  // Check for DD/MM/YYYY or DD-MM-YYYY format
  const parts = dateString.match(/(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})/);

  if (parts) {
    const [_, day, month, year] = parts;
    // Create date using YYYY, MM-1, DD format to prevent US locale interpretation
    const date = new Date(year, parseInt(month, 10) - 1, day);

    // Check if the resulting date is valid AND the year matches (basic validation)
    if (!isNaN(date) && date.getFullYear() === parseInt(year)) {
      return date;
    }
  }
  // Fallback to generic parsing for other formats (like ISO, text dates)
  const genericDate = new Date(dateString);
  if (!isNaN(genericDate)) {
    return genericDate;
  }

  return null;
}

/**
 * Gets the 0-indexed ISO week number (0-51 or 52) of a date.
 */
export function getWeekIndex(date) {
  if (!date || isNaN(new Date(date))) return -1;
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  // Set to nearest Thursday: current date + 4 - current day number
  const dayOfWeek = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayOfWeek);
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return 0-indexed week number (0 to 51/52)
  return weekNo - 1;
}

/**
 * Gets all week start dates (Mondays) that begin within a given month and year.
 */
export function getWeeksInMonth(year, month) {
  // month is 0-indexed (0=Jan, 11=Dec)
  const weeks = [];
  const getMon = (d) => {
    const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(d.setDate(diff));
  };

  let date = new Date(year, month, 1);
  let currentMonday = getMon(date);

  // Find the first Monday that starts in the target month (or is the first day of the month)
  if (currentMonday.getMonth() !== month) {
    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  // Add subsequent Mondays as long as they start within the month
  while (currentMonday.getMonth() === month) {
    weeks.push(new Date(currentMonday));
    currentMonday.setDate(currentMonday.getDate() + 7);
  }
  return weeks;
}

/**
 * Converts JS array data into a CSV string.
 */
export function convertToCSV(data, headers) {
  const headerRow = headers.join(",") + "\n";
  const rows = data.map((row) => {
    return (
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === "number") {
            // Format RTT% with 2 decimals, others as integers (ceil)
            if (
              header === "projectedRttPercent" ||
              header === "currentRttPercent"
            ) {
              return typeof value === "number" ? value.toFixed(2) : "";
            }
            return typeof value === "number" ? Math.ceil(value).toFixed(0) : "";
          }
          const stringValue = value ?? "";
          // Escape double quotes and wrap in quotes for CSV safety
          return `"${String(stringValue).replace(/"/g, '""')}"`;
        })
        .join(",") + "\n"
    );
  });
  return [headerRow, ...rows].join("");
}

/**
 * Initiates the browser download of a CSV file.
 */
export function downloadCSV(csvString, filename) {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
