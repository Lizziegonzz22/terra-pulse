# TERRA-PULSE // NASA Earth System Trend Detective

**Live Interactive Web App:** [https://terra-pulse-2252.vercel.app](https://terra-pulse-2252.vercel.app)  
**Challenge:** Be An Earth System Trend Detective! — 2026 NASA Space Apps Challenge  

---

## Overview

**TERRA-PULSE** is an interactive scientific analytics platform I designed and built to help students, researchers, and citizen scientists uncover, compare, and statistically validate multi-decadal environmental trends across Earth's interconnected climate system.

A single planetary process—such as the El Niño–Southern Oscillation (ENSO) or Arctic amplification—often drives a trend in one direction in one region and the opposite direction in another. TERRA-PULSE solves this challenge by pairing **live NASA satellite telemetry** with an **automated statistical significance engine** and a **dual-region teleconnection comparator**.

---

## Key Features

1. **Interactive 3D Orbital Globe & Global Teleconnection Map:**
   - Rotate a 3D orthographic Earth model or click anywhere on the interactive global map to sample NASA satellite records at any latitude and longitude.
2. **Dual-Region Opposite Trend Comparator (Trend Lab):**
   - Compare two regions side-by-side across 40 years (1984–2023) to visualize how one driver produces contrasting regional shifts (e.g., wetting trends in the Río de la Plata Basin vs. multi-decade megadrought in Central Chile).
3. **Automated Statistical Significance Engine (`p < 0.05`):**
   - **Ordinary Least Squares (OLS) Linear Regression:** Computes decadal rate of change (`slope/decade`), total shift, and 95% confidence intervals.
   - **Non-Parametric Mann-Kendall Trend Test:** Computes Kendall's $S$, $Z$-score, and two-tailed $p$-value to distinguish true long-term climate signals from natural year-to-year variability.
   - **Dynamic Temporal Window Testing:** Adjust start and end years in real time to observe how extending observation baselines moves a trend past the $p < 0.05$ significance threshold.
4. **3-Step Guided Investigation Wizard:**
   - Helps high school and college learners match their scientific hypothesis with the right satellite sensors, physical definitions, and curated regional cases.
5. **Scientific CSV Data Export:**
   - One-click export of homogenized annual time series (`Year`, `Value`, `Latitude`, `Longitude`) ready for spreadsheet or Python/R analysis.

---

## NASA Earth Science Data & Missions Used

TERRA-PULSE queries annual time-series records from the **NASA Langley Research Center (LaRC) POWER Project** (`power.larc.nasa.gov`), integrating observations from:
- **NASA MERRA-2 / GEOS:** Surface Air Temperature at 2m (`T2M`, °C)
- **NASA GPM / IMERG:** Satellite-Gauge Corrected Precipitation (`PRECTOTCORR`, mm/day)
- **NASA CERES / MODIS:** All-Sky Surface Solar Irradiance (`ALLSKY_SFC_SW_DWN`, kWh/m²/day)
- **NASA AIRS / MERRA-2:** Atmospheric Specific Humidity at 2m (`QV2M`, g/kg)

*(Includes a deterministic NASA-calibrated climatological fallback engine to guarantee uninterrupted analysis during API rate limits).*

---

## Tech Stack

- **Frontend & Visualization:** React 18, TypeScript, Vite, Tailwind CSS, Custom HTML5 3D Orthographic Canvas & Interactive SVG Telemetry Charts
- **Statistical Engine:** Custom TypeScript implementation of OLS Linear Regression, 95% Confidence Intervals, and Mann-Kendall $Z$/$p$-value testing
- **Deployment:** Vercel

---

## Local Installation

```bash
git clone https://github.com
cd terra-pulse
npm install
npm run dev
```

---

## AI Disclosure

AI assistants (Claude and Google Gemini) were used during the initial phase of the hackathon for brainstorming challenge angles, organizing the project roadmap, and structuring the English documentation. All software development, statistical modeling, NASA POWER API integration, and scientific testing were carried out and verified by me as a solo participant.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
