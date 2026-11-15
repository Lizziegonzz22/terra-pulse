import React from 'react';
import { FastForward } from 'lucide-react';
import { TrendAnalysis } from '../types/climate';

interface Props {
  analysis: TrendAnalysis;
  unit: string;
  accent: 'amber' | 'sky';
}

export const TrajectoryBar: React.FC<Props> = ({ analysis, unit, accent }) => {
  // Proyección lineal simple de 25 años hacia adelante (2025 -> 2050)
  const projected2050 = Number((analysis.slopePerDecade * 2.5).toFixed(2));
  const barWidth = Math.min(100, Math.max(12, Math.abs(analysis.percentChange) * 2.8));

  return (
    <div className="bg-[#05070C] border border-white/15 rounded-xl p-3 flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[10px] font-mono-code">
        <span className="text-slate-300 font-bold flex items-center gap-1">
          <FastForward className="w-3 h-3 text-amber-400" /> 2050 LINEAR TRAJECTORY
        </span>
        <span className={accent === 'amber' ? 'text-amber-400 font-bold' : 'text-sky-400 font-bold'}>
          {projected2050 > 0 ? '+' : ''}{projected2050} {unit}
        </span>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            accent === 'amber'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-300'
              : 'bg-gradient-to-r from-blue-500 to-sky-300'
          }`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
};
