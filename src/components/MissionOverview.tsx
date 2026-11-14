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

export const MissionOverview: React.FC<Props> = ({
  onStartLab,
  onStartWizard,
  onLoadDemoCase,
}) => {
  return (
    <div className="flex flex-col gap-12 pb-14">
      <section className="max-w-7xl mx-auto px-4 pt-6 md:pt-10 w-full">
        <div className="editorial-card rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono-code mb-5">
              <Satellite className="w-3.5 h-3.5 text-[#FF5A1F]" />
              NASA EARTH OBSERVATION // MISSION CONTROL
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-5">
              See How One Climate Shift Drives{' '}
              <span className="text-[#FF5A1F]">Opposite Worlds</span>
            </h1>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-7 max-w-xl">
              Explore 40 years of NASA satellite measurements. Rotate the 3D Earth globe, compare
              two regions side-by-side, and run statistical significance tests (
              <span className="font-mono-code text-white font-semibold">Mann-Kendall p &lt; 0.05</span>) to
              separate real climate trends from natural weather swings.
            </p>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onStartLab}
                className="bg-[#FF5A1F] hover:bg-[#e04810] text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-lg"
              >
                Open Interactive Trend Lab <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onStartWizard}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold px-5 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-[#FF5A1F]" /> 3-Step Guided Wizard
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-800 w-full max-w-lg font-mono-code">
              <div>
                <div className="text-xl font-bold text-white">40 YRS</div>
                <div className="text-[11px] text-zinc-400">NASA Satellite Span</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#FF5A1F]">p &lt; 0.05</div>
                <div className="text-[11px] text-zinc-400">Significance Engine</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">4 SENSORS</div>
                <div className="text-[11px] text-zinc-400">MERRA-2 · GPM · CERES</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <OrbitalGlobe onSelectCase={onLoadDemoCase} />
            <span className="text-[11px] font-mono-code text-zinc-400 mt-3 text-center">
              Drag the 3D globe to rotate · Tap any marker to inspect live data
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-mono-code text-[#FF5A1F] uppercase tracking-widest font-bold">
              FEATURED TELECONNECTIONS
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Real-World Climate Detective Cases
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Select a scenario to inspect opposite regional trends
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEMO_CASES.map((demo, idx) => (
            <div
              key={demo.id}
              className="editorial-card rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-500 transition group"
            >
              <div>
                <div className="h-24 rounded-xl bg-[#09090B] border border-zinc-800 mb-4 p-3 flex items-center justify-between overflow-hidden">
                  {idx === 0 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <path d="M10,45 Q60,38 100,15" fill="none" stroke="#3B82F6" strokeWidth="3" />
                      <path d="M120,18 Q165,35 210,48" fill="none" stroke="#FF5A1F" strokeWidth="3" />
                      <text x="10" y="14" fill="#60A5FA" fontSize="9" fontFamily="monospace">
                        URUGUAY (+RAIN)
                      </text>
                      <text x="122" y="14" fill="#FF5A1F" fontSize="9" fontFamily="monospace">
                        CHILE (-DROUGHT)
                      </text>
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <path d="M10,50 L80,35 L140,22 L210,8" fill="none" stroke="#FF5A1F" strokeWidth="3" />
                      <path d="M10,48 L210,42" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeDasharray="4 3" />
                      <text x="10" y="14" fill="#FF5A1F" fontSize="9" fontFamily="monospace">
                        ARCTIC 4× WARMING
                      </text>
                      <text x="120" y="55" fill="#A1A1AA" fontSize="9" fontFamily="monospace">
                        EQUATOR BASELINE
                      </text>
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <circle cx="38" cy="30" r="14" fill="#FF5A1F" opacity="0.3" />
                      <circle cx="38" cy="30" r="6" fill="#FF5A1F" />
                      <path d="M55,30 Q115,15 195,32" fill="none" stroke="#E4E4E7" strokeWidth="3" strokeDasharray="5 3" />
                      <text x="72" y="14" fill="#E4E4E7" fontSize="9" fontFamily="monospace">
                        SMOKE PLUME DIMMING
                      </text>
                    </svg>
                  )}
                </div>

                <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                  {demo.badge}
                </span>
                <h3 className="text-base font-bold text-white mt-2.5 mb-2">{demo.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  {demo.scientificStory}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onLoadDemoCase(demo)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 group-hover:bg-[#FF5A1F] border border-zinc-700 group-hover:border-[#FF5A1F] text-white text-xs font-bold font-mono-code flex items-center justify-center gap-2 transition"
              >
                <TrendingUp className="w-3.5 h-3.5" /> ANALYZE THIS PAIR
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="editorial-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#FF5A1F] mb-1 font-bold">
            <Layers className="w-4 h-4" /> NASA EARTHDATA SENSORS
          </div>
          <h2 className="text-lg font-bold text-white mb-4">
            What Each Satellite Instrument Measures
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NASA_VARIABLES.map((v) => (
              <div key={v.id} className="bg-[#09090B] border border-zinc-800 rounded-xl p-4">
                <div className="text-[11px] font-mono-code text-[#FF5A1F] font-bold mb-1">
                  {v.missionSource}
                </div>
                <div className="font-bold text-sm text-white mb-1.5">{v.label}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{v.simpleDefinition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
