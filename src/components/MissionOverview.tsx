import React from 'react';
import { ArrowRight, Satellite, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { DEMO_CASES, NASA_VARIABLES } from '../services/nasaPowerApi';
import { PresetCase } from '../types/climate';
import { OrbitalGlobe } from './OrbitalGlobe';

interface Props {
  onStartLab: () => void;
  onStartWizard: () => void;
  onLoadDemoCase: (demo: PresetCase) => void;
}

export const MissionOverview: React.FC<Props> = ({ onStartLab, onStartWizard, onLoadDemoCase }) => {
  return (
    <div className="flex flex-col gap-12 pb-14">
      <section className="max-w-7xl mx-auto px-4 pt-6 md:pt-10 w-full">
        <div className="editorial-card rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06080D] border border-white/15 text-amber-300 text-xs font-mono-code mb-5">
              <Satellite className="w-3.5 h-3.5 text-amber-400" />
              2026 NASA SPACE APPS // ORBITAL EARTH ANALYTICS
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-5">
              One Planetary Process.{' '}
              <span className="text-amber-400">Opposite Regional</span> Outcomes.
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-7 max-w-xl">
              Explore 40 years of NASA satellite observations. Rotate the 3D Earth globe, compare
              two regions side-by-side, and run statistical significance tests (
              <span className="font-mono-code text-sky-300 font-semibold">Mann-Kendall p &lt; 0.05</span>) to
              separate real climate signals from natural weather noise.
            </p>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onStartLab}
                className="bg-white hover:bg-slate-200 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg"
              >
                Open Interactive Trend Lab <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onStartWizard}
                className="bg-[#06080D] hover:bg-white/10 border border-white/20 text-white font-semibold px-5 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-400" /> 3-Step Guided Wizard
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 w-full max-w-lg font-mono-code">
              <div>
                <div className="text-xl font-bold text-white">40 YRS</div>
                <div className="text-[11px] text-slate-400">NASA Satellite Span</div>
              </div>
              <div>
                <div className="text-xl font-bold text-amber-400">p &lt; 0.05</div>
                <div className="text-[11px] text-slate-400">Significance Engine</div>
              </div>
              <div>
                <div className="text-xl font-bold text-sky-400">4 SENSORS</div>
                <div className="text-[11px] text-slate-400">MERRA-2 · GPM · CERES</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <OrbitalGlobe onSelectCase={onLoadDemoCase} />
            <span className="text-[11px] font-mono-code text-slate-400 mt-3 text-center">
              Drag the 3D globe to rotate · Tap any marker to inspect live data
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-mono-code text-amber-400 uppercase tracking-widest font-semibold">
              FEATURED TELECONNECTIONS
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Real-World Climate Detective Cases
            </h2>
          </div>
          <span className="text-xs text-slate-400">Select a scenario to inspect opposite regional trends</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEMO_CASES.map((demo, idx) => (
            <div key={demo.id} className="editorial-card rounded-2xl p-5 flex flex-col justify-between hover:border-amber-400/50 transition group">
              <div>
                <div className="h-24 rounded-xl bg-[#06080D] border border-white/10 mb-4 p-3 flex items-center justify-between overflow-hidden">
                  {idx === 0 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <path d="M10,45 Q60,38 100,15" fill="none" stroke="#38BDF8" strokeWidth="2.4" />
                      <path d="M120,18 Q165,35 210,48" fill="none" stroke="#F59E0B" strokeWidth="2.4" />
                      <text x="10" y="14" fill="#7DD3FC" fontSize="9" fontFamily="monospace">URUGUAY (+RAIN)</text>
                      <text x="122" y="14" fill="#FBBF24" fontSize="9" fontFamily="monospace">CHILE (-DROUGHT)</text>
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <path d="M10,50 L80,35 L140,22 L210,8" fill="none" stroke="#F59E0B" strokeWidth="2.4" />
                      <path d="M10,48 L210,42" fill="none" stroke="#64748B" strokeWidth="1.8" strokeDasharray="4 3" />
                      <text x="10" y="14" fill="#FBBF24" fontSize="9" fontFamily="monospace">ARCTIC 4× WARMING</text>
                      <text x="120" y="55" fill="#94A3B8" fontSize="9" fontFamily="monospace">EQUATOR BASELINE</text>
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <circle cx="38" cy="30" r="14" fill="#F59E0B" opacity="0.28" />
                      <circle cx="38" cy="30" r="5.5" fill="#FBBF24" />
                      <path d="M55,30 Q115,15 195,32" fill="none" stroke="#CBD5E1" strokeWidth="2.4" strokeDasharray="5 3" />
                      <text x="72" y="14" fill="#E2E8F0" fontSize="9" fontFamily="monospace">SMOKE PLUME DIMMING</text>
                    </svg>
                  )}
                </div>

                <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded bg-[#06080D] text-amber-300 border border-white/15">
                  {demo.badge}
                </span>
                <h3 className="text-base font-bold text-white mt-2.5 mb-2">{demo.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{demo.scientificStory}</p>
              </div>

              <button
                type="button"
                onClick={() => onLoadDemoCase(demo)}
                className="w-full py-2.5 rounded-xl bg-[#06080D] group-hover:bg-white border border-white/15 group-hover:border-white text-white group-hover:text-slate-950 text-xs font-bold font-mono-code flex items-center justify-center gap-2 transition"
              >
                <TrendingUp className="w-3.5 h-3.5" /> ANALYZE THIS PAIR
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="editorial-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-mono-code text-sky-400 mb-1 font-semibold">
            <Layers className="w-4 h-4" /> NASA EARTHDATA SENSORS
          </div>
          <h2 className="text-lg font-bold text-white mb-4">What Each Satellite Instrument Measures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NASA_VARIABLES.map((v) => (
              <div key={v.id} className="bg-[#06080D] border border-white/10 rounded-xl p-4">
                <div className="text-[11px] font-mono-code text-amber-400 font-semibold mb-1">{v.missionSource}</div>
                <div className="font-bold text-sm text-white mb-1.5">{v.label}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{v.simpleDefinition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
