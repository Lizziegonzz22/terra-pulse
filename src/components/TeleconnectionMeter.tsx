import React, { useEffect, useState } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { fetchNasaAnnualTrend } from '../services/nasaPowerApi';
import { analyzeTimeSeries } from '../engine/statistics';
import { NasaVariableOption } from '../types/climate';

interface Props {
  regionA: { name: string; lat: number; lon: number };
  regionB: { name: string; lat: number; lon: number };
  variable: NasaVariableOption;
  startYear: number;
  endYear: number;
}

export const TeleconnectionMeter: React.FC<Props> = ({
  regionA, regionB, variable, startYear, endYear,
}) => {
  const [slopeA, setSlopeA] = useState(0);
  const [slopeB, setSlopeB] = useState(0);
  const [corr, setCorr] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    async function compute() {
      const [resA, resB] = await Promise.all([
        fetchNasaAnnualTrend(regionA.lat, regionA.lon, variable.id, startYear, endYear),
        fetchNasaAnnualTrend(regionB.lat, regionB.lon, variable.id, startYear, endYear),
      ]);
      if (!active) return;
      setSlopeA(analyzeTimeSeries(resA.points).slopePerDecade);
      setSlopeB(analyzeTimeSeries(resB.points).slopePerDecade);

      const n = Math.min(resA.points.length, resB.points.length);
      if (n > 2) {
        const xs = resA.points.slice(0, n).map((p) => p.value);
        const ys = resB.points.slice(0, n).map((p) => p.value);
        const mx = xs.reduce((a, b) => a + b, 0) / n;
        const my = ys.reduce((a, b) => a + b, 0) / n;
        let num = 0, dx2 = 0, dy2 = 0;
        for (let i = 0; i < n; i++) {
          const dx = xs.at(i)! - mx;
          const dy = ys.at(i)! - my;
          num += dx * dy;
          dx2 += dx * dx;
          dy2 += dy * dy;
        }
        const r = dx2 && dy2 ? num / Math.sqrt(dx2 * dy2) : 0;
        setCorr(Number(r.toFixed(2)));
      }
    }
    compute();
    return () => { active = false; };
  }, [regionA, regionB, variable.id, startYear, endYear]);

  const isOpposite = (slopeA > 0 && slopeB < 0) || (slopeA < 0 && slopeB > 0);
  const statusLabel = isOpposite
    ? 'OPPOSITE DIPOLE DETECTED'
    : 'PARALLEL REGIONAL SHIFT';

  function copyReport() {
    const text = `TERRA-PULSE NASA REPORT (${startYear}-${endYear}) | Metric: ${variable.label} (${variable.missionSource}) | Place A (${regionA.name}): ${slopeA > 0 ? '+' : ''}${slopeA} ${variable.unit}/dec | Place B (${regionB.name}): ${slopeB > 0 ? '+' : ''}${slopeB} ${variable.unit}/dec | Cross-Region Correlation r = ${corr} (${statusLabel}).`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full bg-[#05070C] border border-white/15 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono-code text-amber-400 font-bold flex items-center gap-1">
          <ArrowLeftRight className="w-3 h-3" /> {statusLabel}
        </span>
        <button
          type="button"
          onClick={copyReport}
          className="text-[10px] font-mono-code bg-white/10 hover:bg-white hover:text-slate-950 text-white px-2 py-0.5 rounded flex items-center gap-1 transition font-semibold"
        >
          {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
          {copied ? 'COPIED' : 'COPY BRIEF'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center font-mono-code text-[11px]">
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg py-1.5 px-1">
          <div className="text-[9px] text-amber-300">PLACE A</div>
          <div className="font-bold text-white">{slopeA > 0 ? '+' : ''}{slopeA}</div>
        </div>
        <div className="bg-white/5 border border-white/15 rounded-lg py-1.5 px-1">
          <div className="text-[9px] text-slate-400">CORREL (r)</div>
          <div className="font-bold text-white">{corr}</div>
        </div>
        <div className="bg-sky-400/10 border border-sky-400/30 rounded-lg py-1.5 px-1">
          <div className="text-[9px] text-sky-300">PLACE B</div>
          <div className="font-bold text-white">{slopeB > 0 ? '+' : ''}{slopeB}</div>
        </div>
      </div>
    </div>
  );
};
