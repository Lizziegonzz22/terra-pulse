export interface DataPoint {
  year: number;
  value: number;
}

export interface TrendAnalysis {
  slopePerDecade: number;
  totalChange: number;
  percentChange: number;
  rSquared: number;
  mannKendallS: number;
  zScore: number;
  pValue: number;
  confidenceLow: number;
  confidenceHigh: number;
  isSignificant: boolean;
  direction: 'INCREASING' | 'DECREASING' | 'STABLE';
  intercept: number;
  mean: number;
}

export interface NasaVariableOption {
  id: string;
  label: string;
  shortName: string;
  unit: string;
  missionSource: string;
  simpleDefinition: string;
  ecosystems: string[];
}

export interface PresetCase {
  id: string;
  title: string;
  badge: string;
  variableId: string;
  regionA: { name: string; lat: number; lon: number };
  regionB: { name: string; lat: number; lon: number };
  startYear: number;
  endYear: number;
  scientificStory: string;
}
