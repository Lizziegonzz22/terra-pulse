import { DataPoint, NasaVariableOption, PresetCase } from '../types/climate';

export const NASA_VARIABLES: NasaVariableOption[] = [
  {
    id: 'T2M',
    label: 'Surface Air Temperature (2m)',
    shortName: 'Temp 2m',
    unit: '°C',
    missionSource: 'NASA MERRA-2 / GEOS',
    simpleDefinition:
      'Average air temperature measured 2 meters above land or ocean. Tracks regional warming, heatwaves, and polar amplification.',
    ecosystems: ['polar', 'urban', 'forest', 'agriculture'],
  },
  {
    id: 'PRECTOTCORR',
    label: 'Precipitation Rate (Satellite-Gauge)',
    shortName: 'Rainfall',
    unit: 'mm/day',
    missionSource: 'NASA GPM / IMERG',
    simpleDefinition:
      'Total daily rain and snowfall averaged per year. Reveals long-term droughts or intensifying storm belts.',
    ecosystems: ['agriculture', 'forest', 'estuary', 'desert'],
  },
  {
    id: 'GWETTOP',
    label: 'Topsoil Moisture Saturation',
    shortName: 'Soil Moisture',
    unit: '0–1 Index',
    missionSource: 'NASA SMAP / GLDAS',
    simpleDefinition:
      'Water content in the top 5 cm of soil (0 = completely dry, 1 = saturated). Critical for crops, wildfire risk, and river runoff.',
    ecosystems: ['agriculture', 'forest', 'desert'],
  },
  {
    id: 'ALLSKY_SFC_SW_DWN',
    label: 'Surface Solar Irradiance (Cloud & Aerosol Effect)',
    shortName: 'Solar Flux',
    unit: 'kWh/m²/day',
    missionSource: 'NASA CERES / MODIS',
    simpleDefinition:
      'Sunlight energy reaching the ground. Drops when wildfire smoke, aerosols, or thick cloud cover block solar radiation.',
    ecosystems: ['urban', 'forest', 'polar'],
  },
  {
    id: 'QV2M',
    label: 'Atmospheric Specific Humidity',
    shortName: 'Humidity',
    unit: 'g/kg',
    missionSource: 'NASA AIRS / MERRA-2',
    simpleDefinition:
      'Mass of water vapor per kilogram of air. Warmer air holds more moisture, fueling extreme storms.',
    ecosystems: ['estuary', 'urban', 'forest'],
  },
];

export const DEMO_CASES: PresetCase[] = [
  {
    id: 'enso_dipole',
    title: 'ENSO Teleconnection: Río de la Plata vs. Central Chile',
    badge: 'OPPOSITE TRENDS',
    variableId: 'PRECTOTCORR',
    regionA: { name: 'Montevideo / Río de la Plata (Uruguay)', lat: -34.9, lon: -56.2 },
    regionB: { name: 'Central Valley (Santiago, Chile)', lat: -33.4, lon: -70.6 },
    startYear: 1985,
    endYear: 2024,
    scientificStory:
      'Driven by Pacific ocean-atmosphere oscillations, southeastern South America experiences wetting trends while central Chile undergoes a multi-decade megadrought.',
  },
  {
    id: 'arctic_amplification',
    title: 'Polar Amplification: High Arctic vs. Tropical Ocean',
    badge: 'p < 0.0001 SIGNIFICANCE',
    variableId: 'T2M',
    regionA: { name: 'Svalbard Archipelago (High Arctic)', lat: 78.2, lon: 15.6 },
    regionB: { name: 'Galápagos Marine Reserve (Equator)', lat: -0.9, lon: -90.9 },
    startYear: 1985,
    endYear: 2024,
    scientificStory:
      'Sea-ice loss reduces surface albedo in the Arctic, causing temperatures to rise nearly 3–4× faster than at equatorial latitudes.',
  },
  {
    id: 'boreal_smoke_radiation',
    title: 'Wildfire Aerosols & Dimming: Boreal Canada vs. US Midwest',
    badge: 'VIDEO CASE STUDY',
    variableId: 'ALLSKY_SFC_SW_DWN',
    regionA: { name: 'Central Saskatchewan (Boreal Fire Zone)', lat: 54.5, lon: -105.5 },
    regionB: { name: 'Madison, Wisconsin (Downwind Smoke Path)', lat: 43.0, lon: -89.4 },
    startYear: 1990,
    endYear: 2024,
    scientificStory:
      'Inspired by Dr. James Acker’s briefing: intense boreal wildfire plumes increase atmospheric optical depth and alter surface solar radiation downwind.',
  },
];

export async function fetchNasaAnnualTrend(
  lat: number,
  lon: number,
  parameter: string,
  startYear: number,
  endYear: number
): Promise<DataPoint[]> {
  const url = `https://nasa.gov{parameter}&community=AG&longitude=${lon}&latitude=${lat}&start=${startYear}&end=${endYear}&format=JSON`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA POWER API error (${response.status})`);
  }

  const json = await response.json();
  const paramData: Record<string, number> = json?.properties?.parameter?.[parameter] || {};

  const points: DataPoint[] = [];
  for (const [yearStr, val] of Object.entries(paramData)) {
    const year = parseInt(yearStr, 10);
    if (!isNaN(year) && typeof val === 'number' && val > -900) {
      points.push({ year, value: Number(val.toFixed(3)) });
    }
  }

  return points.sort((a, b) => a.year - b.year);
}
