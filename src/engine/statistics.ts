import { DataPoint, TrendAnalysis } from '../types/climate';

function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - prob : prob;
}

export function analyzeTimeSeries(data: DataPoint[]): TrendAnalysis {
  const n = data.length;
  if (n < 4) {
    return {
      slopePerDecade: 0,
      totalChange: 0,
      percentChange: 0,
      rSquared: 0,
      mannKendallS: 0,
      zScore: 0,
      pValue: 1,
      confidenceLow: 0,
      confidenceHigh: 0,
      isSignificant: false,
      direction: 'STABLE',
      intercept: data?.value || 0,
      mean: data?.value || 0,
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += data[i].year;
    sumY += data[i].value;
    sumXY += data[i].year * data[i].value;
    sumXX += data[i].year * data[i].year;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;
  const sxx = sumXX - n * meanX * meanX;
  const slope = (sumXY - n * meanX * meanY) / sxx;
  const intercept = meanY - slope * meanX;

  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const predicted = slope * data[i].year + intercept;
    ssTot += Math.pow(data[i].value - meanY, 2);
    ssRes += Math.pow(data[i].value - predicted, 2);
  }
  const rSquared = ssTot === 0 ? 0 : Math.max(0, 1 - ssRes / ssTot);

  const stdErrReg = Math.sqrt(ssRes / Math.max(1, n - 2));
  const stdErrSlope = stdErrReg / Math.sqrt(sxx);
  const margin95 = 1.96 * stdErrSlope * 10;

  let s = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const diff = data[j].value - data[i].value;
      if (diff > 0) s += 1;
      else if (diff < 0) s -= 1;
    }
  }

  const varS = (n * (n - 1) * (2 * n + 5)) / 18;
  const stdS = Math.sqrt(varS);
  let zScore = 0;
  if (s > 0) zScore = (s - 1) / stdS;
  else if (s < 0) zScore = (s + 1) / stdS;

  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  const isSignificant = pValue < 0.05;

  const yearsSpan = data[n - 1].year - data.year;
  const totalChange = slope * yearsSpan;
  const percentChange = meanY !== 0 ? (totalChange / Math.abs(meanY)) * 100 : 0;

  let direction: 'INCREASING' | 'DECREASING' | 'STABLE' = 'STABLE';
  if (isSignificant) {
    direction = slope > 0 ? 'INCREASING' : 'DECREASING';
  }

  return {
    slopePerDecade: Number((slope * 10).toFixed(3)),
    totalChange: Number(totalChange.toFixed(2)),
    percentChange: Number(percentChange.toFixed(1)),
    rSquared: Number(rSquared.toFixed(3)),
    mannKendallS: s,
    zScore: Number(zScore.toFixed(2)),
    pValue: Number(pValue.toFixed(4)),
    confidenceLow: Number((slope * 10 - margin95).toFixed(3)),
    confidenceHigh: Number((slope * 10 + margin95).toFixed(3)),
    isSignificant,
    direction,
    intercept,
    mean: Number(meanY.toFixed(2)),
  };
}
