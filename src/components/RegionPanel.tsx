import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Download, Activity } from 'lucide-react';
import { DataPoint, NasaVariableOption, TrendAnalysis } from '../types/climate';
import { fetchNasaAnnualTrend } from '../services/nasaPowerApi';
import { analyzeTimeSeries } from '../engine/statistics';
import { TrendChart } from './TrendChart';
import { TrajectoryBar } from './TrajectoryBar';

interface Props {
  panelTitle: string;
  accentColor: 'amber' | 'sky';
  regionName: string;
  lat: number;
  lon: number;
  variable: NasaVariableOption;
  startYear: number;
  endYear: number;
  onUpdateCoords: (name: string, lat: number, lon: number) => void;
}

const LOCATIONS = [
  { name: 'Montevideo / Río de la Plata (Uruguay)', lat: -34.9, lon: -56.2 },
  { name: 'Central Valley (Santiago, Chile)', lat: -33.4, lon: -70.6 },
  { name: 'Svalbard Archipelago (High Arctic)', lat: 78.2, lon: 15.6 },
  { name: 'Galápagos Marine Reserve (Equator)', lat: -0.9, lon: -90.9 },
  { name: 'Central Saskatchewan (Boreal Forest)', lat: 54.5, lon: -105.5 },
  { name: 'Madison, Wisconsin (Downwind Path)', lat: 43.0, lon: -89.4 },
];

export const RegionPanel: React.FC<Props> = ({
  panelTitle, accentColor, regionName, lat, lon, variable, startYear, endYear, onUpdateCoords,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [tempSpark, setTempSpark] = useState<DataPoint[]>([]);
  const [solarSpark, setSolarSpark] = useState<DataPoint[]>([]);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [tempA, setTempA] = useState<TrendAnalysis | null>(null);
  const [solarA, setSolarA] = useState<TrendAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const [m, t, s] = await Promise.all([
        fetchNasaAnnualTrend(lat, lon, variable.id, startYear, endYear),
        fetchNasaAnnualTrend(lat, lon, 'T2M', startYear, endYear),
        fetchNasaAnnualTrend(lat, lon, 'ALLSKY_SFC_SW_DWN', startYear, endYear),
      ]);
      if (!active) return;
      setData(m.points); setAnalysis(analyzeTimeSeries(m.points));
      setTempSpark(t.points); setTempA(analyzeTimeSeries(t.points));
      setSolarSpark(s.points); setSolarA(analyzeTimeSeries(s.points));
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [lat, lon, variable.id, startYear, endYear]);

  function downloadCsv() {
    if (data.length === 0) return;
    const csv = `Year,${variable.id}_${variable.unit},Temp_C,Solar_kWh,Lat,Lon\n` +
      data.map((d, i) => `${d.year},${d.value},${tempSpark.at(i)?.value ?? ''},${solarSpark.at(i)?.value ?? ''},${lat},${lon}`).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = `NASA_${lat}_${lon}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function spark(pts: DataPoint[], color: string) {
    if (pts.length < 2) return null;
    const vals = pts.map((p) => p.value);
    const min = Math.min(...vals); const span = (Math.max(...vals) - min) || 1;
    const points = pts.map((p, i) => `${(i / (pts.length - 1)) * 130},${24 - ((p.value - min) / span) * 20}`).join(' ');
    return <svg viewBox="0 0 130 26" className="w-24 h-6 shrink-0"><polyline fill="none" stroke={color} strokeWidth="2" points={points} /></svg>;
  }

  return (
    <div className="editorial-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${accentColor === 'amber' ? 'bg-amber-400' : 'bg-sky-400'}`} />
          <span className="text-xs font-mono-code font-bold text-white">{panelTitle}</span>
        </div>
        {data.length > 0 && !loading && (
          <button type="button" onClick={downloadCsv} className="text-[10px] font-mono-code bg-white/10 hover:bg-white hover:text-slate-950 border border-white/20 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold">
            <Download className="w-3 h-3" /> CSV
          </button>
        )}
      </div>

      <select
        value={regionName}
        onChange={(e) => { const f = LOCATIONS.find((l) => l.name === e.target.value); if (f) onUpdateCoords(f.name, f.lat, f.lon); }}
        className="bg-[#05070C] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white"
      >
        {!LOCATIONS.some((l) => l.name === regionName) && <option value={regionName}>{regionName}</option>}
        {LOCATIONS.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-2 font-mono-code text-[11px]">
        <div className="bg-[#05070C] border border-white/15 rounded-lg px-2.5 py-1 flex justify-between">
          <span className="text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> LAT</span>
          <input type="number" step="0.5" value={lat} onChange={(e) => onUpdateCoords('Custom Pin', parseFloat(e.target.value) || 0, lon)} className="bg-transparent text-right text-white font-bold w-14" />
        </div>
        <div className="bg-[#05070C] border border-white/15 rounded-lg px-2.5 py-1 flex justify-between">
          <span className="text-slate-400">LON</span>
          <input type="number" step="0.5" value={lon} onChange={(e) => onUpdateCoords('Custom Pin', lat, parseFloat(e.target.value) || 0)} className="bg-transparent text-right text-white font-bold w-14" />
        </div>
      </div>

      {analysis && !loading && (
        <div className={`rounded-xl px-3.5 py-2.5 flex items-center justify-between ${analysis.isSignificant ? (accentColor === 'amber' ? 'bg-amber-400 text-slate-950' : 'bg-sky-400 text-slate-950') : 'bg-white/10 text-white border border-white/20'}`}>
          <div>
            <div className="text-xs font-bold">{variable.shortName}: {analysis.percentChange > 0 ? '+' : ''}{analysis.percentChange}% since {startYear}</div>
            <div className="text-[10px] font-mono-code flex items-center gap-1 mt-0.5">
              {analysis.isSignificant ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {analysis.isSignificant ? `Long-term trend (p = ${analysis.pValue})` : `Natural swings (p = ${analysis.pValue})`}
            </div>
          </div>
          <div className="text-right font-mono-code text-xs font-bold">{analysis.slopePerDecade > 0 ? '+' : ''}{analysis.slopePerDecade} {variable.unit}/dec</div>
        </div>
      )}

      {loading ? (
        <div className="h-52 rounded-xl bg-[#05070C] border border-white/15 flex items-center justify-center font-mono-code text-xs text-amber-400 animate-pulse">LOADING NASA DATA...</div>
      ) : (
        analysis && <TrendChart data={data} analysis={analysis} unit={variable.unit} />
      <TrajectoryBar analysis={analysis} unit={variable.unit} accent={accentColor} />
      )}

      {!loading && tempA && solarA && (
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono-code text-slate-400 flex items-center gap-1"><Activity className="w-3 h-3 text-sky-400" /> CO-LOCATED SENSORS</div>
          <div className="bg-[#05070C] border border-white/15 rounded-xl px-3 py-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Surface Temp (MERRA-2)</div>
              <div className="text-[10px] font-mono-code text-amber-300">{tempA.slopePerDecade > 0 ? '+' : ''}{tempA.slopePerDecade} °C/dec · p={tempA.pValue}</div>
            </div>
            {spark(tempSpark, '#F59E0B')}
          </div>
          <div className="bg-[#05070C] border border-white/15 rounded-xl px-3 py-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Solar Radiation (CERES)</div>
              <div className="text-[10px] font-mono-code text-purple-300">{solarA.slopePerDecade > 0 ? '+' : ''}{solarA.slopePerDecade} kWh/dec · p={solarA.pValue}</div>
            </div>
            {spark(solarSpark, '#A78BFA')}
          </div>
        </div>
      )}
    </div>
  );
};
