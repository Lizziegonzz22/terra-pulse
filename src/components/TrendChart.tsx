import React, { useState } from 'react';
import { DataPoint, TrendAnalysis } from '../types/climate';

interface Props {
  data: DataPoint[];
  analysis: TrendAnalysis;
  unit: string;
}

export const TrendChart: React.FC<Props> = ({ data, analysis, unit }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (data.length === 0) return null;

  const width = 600;
  const height = 240;
  const padL = 48;
  const padR = 16;
  const padT = 20;
  const padB = 30;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const yMin = minVal - range * 0.14;
  const yMax = maxVal + range * 0.14;

  const xScale = (idx: number) =>
    padL + (idx / Math.max(1, data.length - 1)) * (width - padL - padR);
  const yScale = (val: number) =>
    height - padB - ((val - yMin) / (yMax - yMin)) * (height - padT - padB);

  const meanY = yScale(analysis.mean);
  const firstYear = data.at(0)!.year;
  const lastYear = data.at(-1)!.year;
  const trendStartVal = (analysis.slopePerDecade / 10) * firstYear + analysis.intercept;
  const trendEndVal = (analysis.slopePerDecade / 10) * lastYear + analysis.intercept;
  const hoveredPoint = hoverIdx !== null ? data.at(hoverIdx) : null;

  return (
    <div className="relative bg-[#111318] border border-slate-800 rounded-xl p-3.5">
      {hoveredPoint && (
        <div className="absolute top-3 right-3 bg-[#1E222D] border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono-code z-10 shadow-lg">
          <span className="text-slate-400">YEAR {hoveredPoint.year}: </span>
          <span className="text-white font-bold">
            {hoveredPoint.value} {unit}
          </span>
          <span
            className={`ml-2 font-semibold ${
              hoveredPoint.value >= analysis.mean ? 'text-[#E5A93B]' : 'text-[#4F9CF9]'
            }`}
          >
            ({hoveredPoint.value >= analysis.mean ? '+' : ''}
            {(hoveredPoint.value - analysis.mean).toFixed(2)})
          </span>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const val = yMin + t * (yMax - yMin);
          const y = yScale(val);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#1E2330" strokeWidth="1" />
              <text x={padL - 6} y={y + 3} textAnchor="end" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        <line x1={padL} y1={meanY} x2={width - padR} y2={meanY} stroke="#64748B" strokeDasharray="4 4" strokeWidth="1.2" />

        {data.map((pt, idx) => {
          const x = xScale(idx);
          const y = yScale(pt.value);
          const isAbove = pt.value >= analysis.mean;
          const barW = Math.max(4, (width - padL - padR) / data.length - 3);
          return (
            <rect
              key={pt.year}
              x={x - barW / 2}
              y={isAbove ? y : meanY}
              width={barW}
              height={Math.max(2, Math.abs(y - meanY))}
              fill={isAbove ? 'rgba(229, 169, 59, 0.35)' : 'rgba(79, 156, 249, 0.35)'}
              rx="1.5"
            />
          );
        })}

        <polyline fill="none" stroke="#CBD5E1" strokeWidth="1.6" points={data.map((pt, idx) => `${xScale(idx)},${yScale(pt.value)}`).join(' ')} />

        <line
          x1={xScale(0)}
          y1={yScale(trendStartVal)}
          x2={xScale(data.length - 1)}
          y2={yScale(trendEndVal)}
          stroke={analysis.isSignificant ? '#F8FAFC' : '#E5A93B'}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {data.map((pt, idx) => (
          <circle
            key={pt.year}
            cx={xScale(idx)}
            cy={yScale(pt.value)}
            r={hoverIdx === idx ? 5.5 : 3}
            fill={pt.value >= analysis.mean ? '#E5A93B' : '#4F9CF9'}
            stroke="#111318"
            strokeWidth="1"
            className="cursor-pointer transition-all"
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
          />
        ))}

        {[0, Math.floor(data.length / 2), data.length - 1].map((idx) => (
          <text key={idx} x={xScale(idx)} y={height - 8} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
            {data.at(idx)?.year}
          </text>
        ))}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code text-slate-400 mt-1 pt-2 border-t border-slate-800">
        <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
          <span className="w-3.5 h-1 inline-block rounded bg-slate-100" />
          Trend Line ({analysis.slopePerDecade > 0 ? '+' : ''}
          {analysis.slopePerDecade} {unit}/decade)
        </span>
        <span>Dashed: Historical Mean ({analysis.mean} {unit})</span>
      </div>
    </div>
  );
};
