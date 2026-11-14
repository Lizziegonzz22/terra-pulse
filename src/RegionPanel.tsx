import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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
  { name: 'Central Amazon Rainforest (Brazil)', lat: -3.4, lon: -62.2 },
  { name: 'Madison, Wisconsin (US Midwest)', lat: 43.0, lon: -89.4 },
  { name: 'Sahel Belt (Niamey, Niger)', lat: 13.5, lon: 2.1 },
];

export const RegionPanel: React.FC<Props> = ({
  panelTitle,
  regionName,
  lat,
  lon,
  variable,
  startYear,
  endYear,
  onUpdateCoords,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const pts = await fetchNasaAnnualTrend(lat, lon, variable.id, startYear, endYear);
        if (!active) return;
        setData(pts);
        setAnalysis(analyzeTimeSeries(pts));
      } catch (err) {
        if (!active) return;
        setError('Unable to reach NASA POWER servers. Check coordinates or retry.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [lat, lon, variable.id, startYear, endYear]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      {/* Header + Veredicto Estadístico */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <span className="text-xs font-mono-code uppercase tracking-widest text-cyan-400">
          {panelTitle}
        </span>

        {analysis && !loading && (
          <span
            className={`text-xs font-mono-code px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
              analysis.isSignificant
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
            }`}
          >
            {analysis.isSignificant ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {analysis.isSignificant
              ? `SIGNIFICANT (p = ${analysis.pValue})`
              : `NOT SIGNIFICANT (p = ${analysis.pValue})`}
          </span>
        )}
      </div>

      {/* Selector de región o coordenadas manuales */}
      <div className="flex flex-col gap-2.5">
        <select
          value={regionName}
          onChange={(e) => {
            const found = QUICK_LOCATIONS.find((l) => l.name === e.target.value);
            if (found) onUpdateCoords(found.name, found.lat, found.lon);
          }}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
        >
          {!QUICK_LOCATIONS.some((l) => l.name === regionName) && (
            <option value={regionName}>{regionName}</option>
          )}
          {QUICK_LOCATIONS.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2 font-mono-code text-xs">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" /> LAT:
            </span>
            <input
              type="number"
              step="0.5"
              value={lat}
              onChange={(e) =>
                onUpdateCoords('Custom Coordinates', parseFloat(e.target.value) || 0, lon)
              }
              className="bg-transparent text-right text-white font-bold w-20 focus:outline-none"
            />
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between">
            <span className="text-slate-400">LON:</span>
            <input
              type="number"
              step="0.5"
              value={lon}
              onChange={(e) =>
                onUpdateCoords('Custom Coordinates', lat, parseFloat(e.target.value) || 0)
              }
              className="bg-transparent text-right text-white font-bold w-20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Área de Gráfico */}
      {loading ? (
        <div className="h-64 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center gap-2 font-mono-code text-xs text-cyan-400 animate-pulse">
          <span>STREAMING NASA {variable.missionSource} DATA...</span>
          <span className="text-[10px] text-slate-500">
            Computing Mann-Kendall & Linear Regression
          </span>
        </div>
      ) : error ? (
        <div className="h-64 rounded-xl bg-red-950/20 border border-red-800/40 flex items-center justify-center text-xs text-red-300 p-4 text-center">
          {error}
        </div>
      ) : (
        analysis && <TrendChart data={data} analysis={analysis} unit={variable.unit} />
      )}

      {/* Tarjetas de Métricas Científicas */}
      {analysis && !loading && (
        <div className="grid grid-cols-3 gap-2.5 font-mono-code">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 block">RATE / DECADE</span>
            <div className="text-sm md:text-base font-bold text-white flex items-center gap-1 mt-0.5">
              {analysis.slopePerDecade > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : analysis.slopePerDecade < 0 ? (
                <TrendingDown className="w-4 h-4 text-cyan-400" />
              ) : (
                <Minus className="w-4 h-4 text-slate-400" />
              )}
              {analysis.slopePerDecade > 0 ? '+' : ''}
              {analysis.slopePerDecade}
            </div>
            <span className="text-[10px] text-slate-500">
              95% CI [{analysis.confidenceLow}, {analysis.confidenceHigh}]
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 block">TOTAL SHIFT</span>
            <div className="text-sm md:text-base font-bold text-white mt-0.5">
              {analysis.totalChange > 0 ? '+' : ''}
              {analysis.totalChange} {variable.unit}
            </div>
            <span className="text-[10px] text-slate-500">
              ({analysis.percentChange > 0 ? '+' : ''}
              {analysis.percentChange}% vs mean)
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 block">MANN-KENDALL Z</span>
            <div className="text-sm md:text-base font-bold text-white mt-0.5">
              Z = {analysis.zScore}
            </div>
            <span
              className={`text-[10px] font-bold ${
                analysis.isSignificant ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {analysis.isSignificant ? 'p < 0.05 CONFIRMED' : 'p ≥ 0.05 NOISE'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
