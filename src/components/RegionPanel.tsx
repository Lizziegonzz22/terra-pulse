import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus, Info, Download } from 'lucide-react';
import { DataPoint, NasaVariableOption, TrendAnalysis } from '../types/climate';
import { fetchNasaAnnualTrend } from '../services/nasaPowerApi';
import { analyzeTimeSeries } from '../engine/statistics';
import { TrendChart } from './TrendChart';

interface Props {
  panelTitle: string;
  regionName: string;
  lat: number;
  lon: number;
  variable: NasaVariableOption;
  startYear: number;
  endYear: number;
  onUpdateCoords: (name: string, lat: number, lon: number) => void;
}

const QUICK_LOCATIONS = [
  { name: 'Montevideo / Río de la Plata (Uruguay)', lat: -34.9, lon: -56.2 },
  { name: 'Central Valley (Santiago, Chile)', lat: -33.4, lon: -70.6 },
  { name: 'Svalbard Archipelago (High Arctic)', lat: 78.2, lon: 15.6 },
  { name: 'Galápagos Marine Reserve (Equator)', lat: -0.9, lon: -90.9 },
  { name: 'Central Saskatchewan (Boreal Forest)', lat: 54.5, lon: -105.5 },
  { name: 'Madison, Wisconsin (Downwind Path)', lat: 43.0, lon: -89.4 },
];

export const RegionPanel: React.FC<Props> = ({
  panelTitle, regionName, lat, lon, variable, startYear, endYear, onUpdateCoords,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [sourceMode, setSourceMode] = useState<'LIVE_NASA' | 'CALIBRATED_ARCHIVE'>('LIVE_NASA');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const result = await fetchNasaAnnualTrend(lat, lon, variable.id, startYear, endYear);
      if (!active) return;
      setData(result.points);
      setSourceMode(result.sourceMode);
      setAnalysis(analyzeTimeSeries(result.points));
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [lat, lon, variable.id, startYear, endYear]);

  function getPlainEnglishSummary(a: TrendAnalysis) {
    const dirWord = a.slopePerDecade > 0 ? 'increasing' : 'decreasing';
    if (a.isSignificant) {
      return `Confirmed scientific trend: ${variable.shortName} is ${dirWord} by ${Math.abs(a.slopePerDecade)} ${variable.unit} per decade. Because p = ${a.pValue} (< 0.05), there is >95% statistical confidence this is a real shift, not random weather.`;
    }
    return `Not statistically significant yet (p = ${a.pValue} ≥ 0.05). Year-to-year natural swings are currently larger than the long-term slope. Try expanding the year range to see if a clearer signal emerges.`;
  }

  function downloadCsv() {
    if (data.length === 0) return;
    const header = `Year,${variable.id}_${variable.unit},Latitude,Longitude\n`;
    const rows = data.map((d) => `${d.year},${d.value},${lat},${lon}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NASA_${variable.id}_${lat}_${lon}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="editorial-card rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code uppercase tracking-wider text-[#F1F4F9] font-bold">{panelTitle}</span>
            {data.length > 0 && !loading && (
              <button type="button" onClick={downloadCsv} className="text-[10px] font-mono-code bg-[#0D1017] hover:bg-slate-800 border border-slate-700/80 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1 transition">
                <Download className="w-2.5 h-2.5 text-[#87A8D0]" /> CSV
              </button>
            )}
          </div>
          <span className="text-[10px] font-mono-code text-slate-400 block mt-0.5">
            {sourceMode === 'LIVE_NASA' ? '● LIVE NASA POWER TELEMETRY' : '● NASA POWER CALIBRATED RECORD'}
          </span>
        </div>

        {analysis && !loading && (
          <span className={`text-xs font-mono-code px-3 py-1 rounded-full flex items-center gap-1.5 border font-semibold ${analysis.isSignificant ? 'bg-[#5C7FA8]/20 text-[#B4CAE4] border-[#5C7FA8]/40' : 'bg-[#0D1017] text-slate-300 border-slate-700/80'}`}>
            {analysis.isSignificant ? <CheckCircle2 className="w-3.5 h-3.5 text-[#87A8D0]" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
            {analysis.isSignificant ? `SIGNIFICANT (p = ${analysis.pValue})` : `NATURAL SWINGS (p = ${analysis.pValue})`}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <select
          value={regionName}
          onChange={(e) => {
            const found = QUICK_LOCATIONS.find((l) => l.name === e.target.value);
            if (found) onUpdateCoords(found.name, found.lat, found.lon);
          }}
          className="bg-[#0D1017] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm font-medium text-[#F1F4F9] focus:outline-none focus:border-[#6889B3]"
        >
          {!QUICK_LOCATIONS.some((l) => l.name === regionName) && <option value={regionName}>{regionName}</option>}
          {QUICK_LOCATIONS.map((loc) => <option key={loc.name} value={loc.name}>{loc.name}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-2 font-mono-code text-xs">
          <div className="bg-[#0D1017] border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-[#87A8D0]" /> LAT:</span>
            <input type="number" step="0.5" value={lat} onChange={(e) => onUpdateCoords('Custom Coordinates', parseFloat(e.target.value) || 0, lon)} className="bg-transparent text-right text-[#F1F4F9] font-bold w-20 focus:outline-none" />
          </div>
          <div className="bg-[#0D1017] border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center justify-between">
            <span className="text-slate-400">LON:</span>
            <input type="number" step="0.5" value={lon} onChange={(e) => onUpdateCoords('Custom Coordinates', lat, parseFloat(e.target.value) || 0)} className="bg-transparent text-right text-[#F1F4F9] font-bold w-20 focus:outline-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-56 rounded-xl bg-[#0D1017] border border-slate-800/80 flex flex-col items-center justify-center gap-2 font-mono-code text-xs text-slate-300 animate-pulse">
          <span>LOADING NASA {variable.missionSource} SERIES...</span>
        </div>
      ) : (
        analysis && <TrendChart data={data} analysis={analysis} unit={variable.unit} />
      )}

      {analysis && !loading && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2.5 font-mono-code">
            <div className="bg-[#0D1017] border border-slate-800/80 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block">CHANGE / DECADE</span>
              <div className="text-sm md:text-base font-bold text-[#F1F4F9] flex items-center gap-1 mt-0.5">
                {analysis.slopePerDecade > 0 ? <TrendingUp className="w-4 h-4 text-[#87A8D0]" /> : analysis.slopePerDecade < 0 ? <TrendingDown className="w-4 h-4 text-[#9A95C4]" /> : <Minus className="w-4 h-4 text-slate-400" />}
                {analysis.slopePerDecade > 0 ? '+' : ''}{analysis.slopePerDecade}
              </div>
              <span className="text-[10px] text-slate-500">95% CI [{analysis.confidenceLow}, {analysis.confidenceHigh}]</span>
            </div>

            <div className="bg-[#0D1017] border border-slate-800/80 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block">TOTAL SHIFT</span>
              <div className="text-sm md:text-base font-bold text-[#F1F4F9] mt-0.5">
                {analysis.totalChange > 0 ? '+' : ''}{analysis.totalChange} {variable.unit}
              </div>
              <span className="text-[10px] text-slate-500">({analysis.percentChange > 0 ? '+' : ''}{analysis.percentChange}% vs avg)</span>
            </div>

            <div className="bg-[#0D1017] border border-slate-800/80 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block">MANN-KENDALL</span>
              <div className="text-sm md:text-base font-bold text-[#F1F4F9] mt-0.5">Z = {analysis.zScore}</div>
              <span className={`text-[10px] font-semibold ${analysis.isSignificant ? 'text-[#87A8D0]' : 'text-slate-400'}`}>
                {analysis.isSignificant ? 'p < 0.05 PROVEN' : 'p ≥ 0.05 UNPROVEN'}
              </span>
            </div>
          </div>

          <div className="bg-[#0D1017] border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#87A8D0] shrink-0 mt-0.5" />
            <p>{getPlainEnglishSummary(analysis)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
