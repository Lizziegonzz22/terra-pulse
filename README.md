# TERRA-PULSE // NASA Earth System Trend Detective

**Live Interactive Web App:** [https://terra-pulse-gamma.vercel.app](https://terra-pulse-gamma.vercel.app)  
**GitHub Repository:** [https://github.com/Lizziegonzz22/terra-pulse](https://github.com/Lizziegonzz22/terra-pulse)  
**Challenge:** *Be An Earth System Trend Detective!* — 2026 NASA Space Apps Challenge

---

## 1. Overview & Scientific Problem

**TERRA-PULSE** is an interactive Earth observation and statistical analytics web application built for the 2026 NASA Space Apps Challenge, enabling users to explore 40 years of NASA satellite records (1984–2023), compare contrasting regional trends, and separate true climate signals from interannual weather variability. It pairs live NASA satellite telemetry with an automated statistical significance engine (\(p < 0.05\)) and a dual-region dipole comparator to examine phenomena like the El Niño–Southern Oscillation (ENSO), Arctic Amplification, and wildfire smoke transport.

---

## 2. Core Features & Capabilities

* **Mission Overview & 3D Orbital Globe (`MissionOverview.tsx`, `OrbitalGlobe.tsx`):** Features an HTML5 Canvas 3D globe with smooth drag rotation, day/night shading, location pins, and one-click access to three real-world teleconnection cases (Montevideo vs. Santiago, Svalbard vs. Galápagos, and Central Saskatchewan vs. Madison).
* **3-Step Guided Investigation Wizard (`DetectiveWizard.tsx`):** Guides learners through choosing environments, physical changes, and temporal windows (long-term 35+ year records versus short ~13-year windows) to test statistical significance (\(p < 0.05\)).
* **Dual-Region Trend Lab (`RegionPanel.tsx`, `TrendChart.tsx`, `TrajectoryBar.tsx`):** Side-by-side analysis across 6 pre-configured global monitoring regions or custom coordinate sampling, featuring SVG telemetry charts, Ordinary Least Squares (OLS) regression lines, 2050 linear trajectories, co-located multi-sensor readouts, and one-click CSV export.
* **Teleconnection Dipole Meter & Multi-Sensor Radar (`TeleconnectionMeter.tsx`, `AnomalyRadar.tsx`):** Computes inter-regional Pearson correlation coefficients (\(r\)) to identify inverse or synchronized dipoles and overlays normalized decadal anomalies across multiple sensor axes.

---

## 3. NASA Earth Science Data & Sensors

Queries homogenized annual time-series data from the NASA Langley Research Center (LaRC) POWER Project (`power.larc.nasa.gov`), integrated with request caching and a climatological fallback engine:

* **`T2M` (NASA MERRA-2 / GEOS):** Surface air temperature at 2m (`°C`) for quantifying warming rates and polar amplification.
* **`PRECTOTCORR` (NASA GPM / IMERG):** Bias-corrected total precipitation (`mm/day`) for detecting wetting trends and megadroughts.
* **`ALLSKY_SFC_SW_DWN` (NASA CERES / MODIS):** All-sky surface shortwave irradiance (`kWh/m²/day`) for tracking wildfire smoke dimming.
* **`QV2M` (NASA AIRS / MERRA-2):** Specific humidity at 2m (`g/kg`) for tracking atmospheric water vapor capacity.

---

## 4. Statistical Methodology (`src/engine/statistics.ts`)

Evaluates selected time series in real time using Ordinary Least Squares (OLS) linear regression (slopes, decadal change, percentage shifts, 95% confidence intervals), the non-parametric Mann-Kendall Trend Test (calculating \(S\), variance, standardized \(Z\)-score, and two-tailed \(p\)-values against the \(p < 0.05\) threshold), and Pearson linear correlation (\(r\)).

---

## 5. Project Architecture & Folder Structure

```text
terra-pulse/
├── index.html                      # Application entry HTML & metadata
├── package.json                    # Dependencies and build scripts
├── tailwind.config.js              # Custom dark orbital UI theme configuration
├── tsconfig.json                   # TypeScript compiler configuration
├── vite.config.ts                  # Vite bundler setup
└── src/
    ├── main.tsx                    # React DOM root initialization
    ├── index.css                   # Global styles and custom utility classes
    ├── App.tsx                     # Main navigation state (Overview, Wizard, Trend Lab)
    ├── types/climate.ts            # TypeScript interfaces for sensors, regions, and stats
    ├── services/nasaPowerApi.ts    # NASA LaRC POWER API client + calibrated fallback engine
    ├── engine/statistics.ts        # OLS regression, 95% CI, Mann-Kendall (S, Z, p), & Pearson r
    └── components/
        ├── MissionOverview.tsx     # Landing view, KPI banner, featured cases & sensor guide
        ├── DetectiveWizard.tsx     # 3-step guided investigation builder for learners
        ├── OrbitalGlobe.tsx        # Interactive 3D orthographic Earth canvas with Pin A/B
        ├── WorldPickerMap.tsx      # Interactive coordinate & region selector
        ├── RegionPanel.tsx         # Telemetry card, OLS stats, CSV export & co-located sensors
        ├── TrendChart.tsx          # SVG time-series chart with baseline mean & OLS trend line
        ├── TrajectoryBar.tsx       # Linear projection indicator toward 2050
        ├── TeleconnectionMeter.tsx # Dual-region dipole detector & Pearson r readout
        └── AnomalyRadar.tsx        # 4-sensor comparative anomaly radar visualization
```

---

## 6. Tech Stack & Local Installation

* **Stack:** React 18, TypeScript, Vite, Tailwind CSS, custom HTML5 3D Orthographic Canvas, NASA LaRC POWER API, and Vercel hosting.
* **Local Setup:** Clone the repository (`git clone https://github.com.git`), navigate into `terra-pulse`, run `npm install`, and launch with `npm run dev`.

---

## 7. References, AI Disclosure & License

* **Data Citations:** NASA POWER Project (LaRC); MERRA-2 (NASA GMAO); GPM / IMERG (NASA GES DISC); CERES (NASA LaRC); Mann (1945) & Kendall (1975) statistical methods. Full details available in repository citations.
* **AI Assistance Disclosure:** AI assistants (Claude, GitHub Copilot and Google Gemini) were utilized during the hackathon for initial brainstorming, documentation structure, and UI copy refinement. All system architecture, statistical engines, and scientific integrations were independently built and verified.
* **License:** Open-source and licensed under the **MIT License**.
