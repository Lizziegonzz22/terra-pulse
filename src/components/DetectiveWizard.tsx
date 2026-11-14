import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { DEMO_CASES, NASA_VARIABLES } from '../services/nasaPowerApi';
import { PresetCase } from '../types/climate';

interface Props {
  onApplyRecommendation: (demo: PresetCase) => void;
}

export const DetectiveWizard: React.FC<Props> = ({ onApplyRecommendation }) => {
  const [ecosystem, setEcosystem] = useState<'polar' | 'agriculture' | 'forest'>('agriculture');
  const [phenomenon, setPhenomenon] = useState<'drought' | 'warming' | 'smoke'>('drought');
  const [span, setSpan] = useState<'short' | 'long'>('long');

  const getRecommendation = (): PresetCase => {
    if (phenomenon === 'warming' || ecosystem === 'polar') {
      return {
        ...DEMO_CASES, // Arctic Amplification
        startYear: span === 'short' ? 2010 : 1985,
        endYear: 2024,
      };
    }
    if (phenomenon === 'smoke' || ecosystem === 'forest') {
      return {
        ...DEMO_CASES, // Boreal Smoke & Radiation
        startYear: span === 'short' ? 2012 : 1990,
        endYear: 2024,
      };
    }
    return {
      ...DEMO_CASES, // ENSO Dipole Uruguay vs Chile
      startYear: span === 'short' ? 2012 : 1985,
      endYear: 2024,
    };
  };

  const recommended = getRecommendation();
  const recVariable = NASA_VARIABLES.find((v) => v.id === recommended.variableId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-mono-code text-amber-400 mb-2">
          <Sparkles className="w-4 h-4" /> GUIDED DATA DETECTIVE ASSISTANT
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Configure Your Earth System Investigation
        </h2>
        <p className="text-sm text-slate-400 mb-8">
          Answer three quick questions to match your hypothesis with the right NASA satellite
          sensors, regions, and statistical time window.
        </p>

        <div className="flex flex-col gap-6">
          {/* Pregunta 1 */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-cyan-400 mb-3">
              1. Which environment or biome do you want to investigate?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'agriculture', title: 'Agricultural & River Basins', desc: 'Crops, soil moisture & rainfall' },
                { id: 'polar', title: 'Polar & High-Latitude Ice', desc: 'Rapid Arctic warming & albedo' },
                { id: 'forest', title: 'Boreal & Tropical Forests', desc: 'Wildfire smoke & solar dimming' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setEcosystem(item.id as 'polar' | 'agriculture' | 'forest')}
                  className={`p-4 rounded-xl border text-left transition ${
                    ecosystem === item.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-sm">{item.title}</div>
                  <div className="text-xs opacity-80 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pregunta 2 */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-cyan-400 mb-3">
              2. What physical change are you testing for?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'drought', title: 'Hydrological Shifts', desc: 'Opposite wet/dry regional trends' },
                { id: 'warming', title: 'Thermal Acceleration', desc: 'Surface air temperature anomalies' },
                { id: 'smoke', title: 'Aerosols & Solar Radiation', desc: 'Smoke plumes blocking sunlight' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPhenomenon(item.id as 'drought' | 'warming' | 'smoke')}
                  className={`p-4 rounded-xl border text-left transition ${
                    phenomenon === item.id
                      ? 'bg-emerald-500/15 border-emerald-400 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-sm">{item.title}</div>
                  <div className="text-xs opacity-80 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pregunta 3 */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-cyan-400 mb-3">
              3. Select temporal baseline (Test how duration affects p-value!)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setSpan('long')}
                className={`p-4 rounded-xl border text-left transition ${
                  span === 'long'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold text-sm">Full Multi-Decadal Record (~35–40 Years)</div>
                <div className="text-xs opacity-80 mt-1">
                  Recommended to separate long-term climate trends from natural cycles.
                </div>
              </button>
              <button
                onClick={() => setSpan('short')}
                className={`p-4 rounded-xl border text-left transition ${
                  span === 'short'
                    ? 'bg-amber-500/15 border-amber-400 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold text-sm">Recent Decade Window (~12–14 Years)</div>
                <div className="text-xs opacity-80 mt-1">
                  Demonstrates why shorter series often yield p &gt; 0.05 (not yet significant).
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Resultado Recomendado */}
        <div className="mt-8 bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" /> RECOMMENDED NASA MISSION SETUP
            </div>
            <div className="text-lg font-bold text-white">{recommended.title}</div>
            <div className="text-xs text-slate-400 mt-1">
              Sensor: <strong className="text-cyan-300">{recVariable?.missionSource}</strong> ·
              Variable: <strong className="text-white">{recVariable?.label}</strong> (
              {recommended.startYear}–{recommended.endYear})
            </div>
          </div>

          <button
            onClick={() => onApplyRecommendation(recommended)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs font-mono-code flex items-center gap-2 shrink-0 transition"
          >
            <Compass className="w-4 h-4" /> RUN LIVE ANALYSIS <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
