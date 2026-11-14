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
  const yMin = minVal - range * 0.12;
  const yMax = maxVal + range * 0.12;

  const xScale = (idx: number) =>
    padL + (idx / Math.max(1, data.length - 1)) * (width - padL - padR);
  const yScale = (val: number) =>
    height - padB - ((val - yMin) / (yMax - yMin)) * (height - padT - padB);

  const meanY = yScale(analysis.mean);

  const firstYear = data.year;
  const lastYear = data[data.length - 1].year;
  const trendStartVal = (analysis.slopePerDecade / 10) * firstYear + analysis.intercept;
  const trendEndVal = (analysis.slopePerDecade / 10) * lastYear + analysis.intercept;

  const hoveredPoint = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <div className="relative bg-[#060A14] border border-slate-800/90 rounded-xl p-3">
      {hoveredPoint && (
        <div className="absolute top-3 right-3 bg-slate-900/95 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-mono-code z-10">
          <span className="text-slate-400">YEAR {hoveredPoint.year}: </span>
          <span className="text-white font-bold">
            {hoveredPoint.value} {unit}
          </span>
          <span
            className={`ml-2 ${
              hoveredPoint.value >= analysis.mean ? 'text-amber-400' : 'text-cyan-400'
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
              <line
                x1={padL}
                y1={y}
                x2={width - padR}
                y2={y}
                stroke="rgba(148, 163, 184, 0.1)"
                strokeWidth="1"
              />
              <text
                x={padL - 6}
                y={y + 3}
                textAnchor="end"
                fill="#64748B"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        <line
          x1={padL}
          y1={meanY}
          x2={width - padR}
          y2={meanY}
          stroke="rgba(148, 163, 184, 0.45)"
          strokeDasharray="4 4"
          strokeWidth="1"
        />

        {data.map((pt, idx) => {
          const x = xScale(idx);
          const y = yScale(pt.value);
          const isAbove = pt.value >= analysis.mean;
          const barW = Math.max(3, (width - padL - padR) / data.length - 3);
          return (
            <rect
              key={pt.year}
              x={x - barW / 2}
              y={isAbove ? y : meanY}
              width={barW}
              height={Math.max(2, Math.abs(y - meanY))}
              fill={isAbove ? 'rgba(251, 191, 36, 0.35)' : 'rgba(56, 189, 248, 0.35)'}
              rx="1.5"
            />
          );
        })}

        <polyline
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.5"
          points={data.map((pt, idx) => `${xScale(idx)},${yScale(pt.value)}`).join(' ')}
        />

        <line
          x1={xScale(0)}
          y1={yScale(trendStartVal)}
          x2={xScale(data.length - 1)}
          y2={yScale(trendEndVal)}
          stroke={analysis.isSignificant ? '#10B981' : '#F59E0B'}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {data.map((pt, idx) => (
          <circle
            key={pt.year}
            cx={xScale(idx)}
            cy={yScale(pt.value)}
            r={hoverIdx === idx ? 5 : 2.5}
            fill={pt.value >= analysis.mean ? '#FBBF24' : '#38BDF8'}
            className="cursor-pointer transition-all"
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
          />
        ))}

        {[0, Math.floor(data.length / 2), data.length - 1].map((idx) => (
          <text
            key={idx}
            x={xScale(idx)}
            y={height - 8}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
          >
            {data[idx]?.year}
          </text>
        ))}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code text-slate-400 mt-1 pt-2 border-t border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-3 h-1 inline-block rounded ${
              analysis.isSignificant ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          OLS Trend Line ({analysis.slopePerDecade > 0 ? '+' : ''}
          {analysis.slopePerDecade} {unit}/decade)
        </span>
        <span>Dashed: Historical Mean ({analysis.mean} {unit})</span>
      </div>
    </div>
  );
};
