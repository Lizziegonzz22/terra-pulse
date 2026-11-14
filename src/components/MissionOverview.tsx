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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102030] border border-[#5F8575]/60 text-[#98B092] text-xs font-mono-code mb-5">
              <Satellite className="w-3.5 h-3.5 text-[#98B092]" />
              NASA EARTH OBSERVATION // EARTH SYSTEM ARCHIVE
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F1F5F2] leading-[1.12] mb-5">
              See How One Climate Shift Drives{' '}
              <span className="text-[#98B092]">Opposite Worlds</span>
            </h1>

            <p className="text-[#D4E0DA] text-sm md:text-base leading-relaxed mb-7 max-w-xl">
              Explore 40 years of NASA satellite measurements. Rotate the 3D Earth globe, compare
              two regions side-by-side, and run statistical significance tests (
              <span className="font-mono-code text-[#98B092] font-semibold">Mann-Kendall p &lt; 0.05</span>) to
              separate real climate trends from natural weather swings.
            </p>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onStartLab}
                className="bg-[#2F6352] hover:bg-[#3a7864] border border-[#98B092]/50 text-[#F1F5F2] font-semibold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                Open Interactive Trend Lab <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onStartWizard}
                className="bg-[#102030] hover:bg-[#193046] border border-[#889BAE]/50 text-[#F1F5F2] font-medium px-5 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-[#889BAE]" /> 3-Step Guided Wizard
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#5F8575]/30 w-full max-w-lg font-mono-code">
              <div>
                <div className="text-xl font-bold text-[#F1F5F2]">40 YRS</div>
                <div className="text-[11px] text-[#889BAE]">NASA Satellite Span</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#98B092]">p &lt; 0.05</div>
                <div className="text-[11px] text-[#889BAE]">Significance Engine</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#889BAE]">4 SENSORS</div>
                <div className="text-[11px] text-[#889BAE]">MERRA-2 · GPM · CERES</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <OrbitalGlobe onSelectCase={onLoadDemoCase} />
            <span className="text-[11px] font-mono-code text-[#889BAE] mt-3 text-center">
              Drag the 3D globe to rotate · Tap any marker to inspect live data
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-mono-code text-[#98B092] uppercase tracking-widest font-semibold">
              FEATURED TELECONNECTIONS
            </span>
            <h2 className="text-2xl font-bold text-[#F1F5F2] mt-1">
              Real-World Climate Detective Cases
            </h2>
          </div>
          <span className="text-xs text-[#889BAE]">Select a scenario to inspect opposite regional trends</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEMO_CASES.map((demo, idx) => (
            <div key={demo.id} className="editorial-card rounded-2xl p-5 flex flex-col justify-between hover:border-[#98B092]/70 transition group">
              <div>
                <div className="h-24 rounded-xl bg-[#102030] border border-[#5F8575]/40 mb-4 p-3 flex items-center justify-between overflow-hidden">
                  {idx === 0 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <path d="M10,45 Q60,38 100,15" fill="none" stroke="#98B092" strokeWidth="2.4" />
                      <path d="M120,18 Q165,35 210,48" fill="none" stroke="#889BAE" strokeWidth="2.4" />
                      <text x="10" y="14" fill="#98B092" fontSize="9" fontFamily="monospace">URUGUAY (+RAIN)</text>
                      <text x="122" y="14" fill="#889BAE" fontSize="9" fontFamily="monospace">CHILE (-DROUGHT)</text>
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <path d="M10,50 L80,35 L140,22 L210,8" fill="none" stroke="#98B092" strokeWidth="2.4" />
                      <path d="M10,48 L210,42" fill="none" stroke="#889BAE" strokeWidth="1.8" strokeDasharray="4 3" />
                      <text x="10" y="14" fill="#98B092" fontSize="9" fontFamily="monospace">ARCTIC 4× WARMING</text>
                      <text x="120" y="55" fill="#889BAE" fontSize="9" fontFamily="monospace">EQUATOR BASELINE</text>
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg viewBox="0 0 220 60" className="w-full h-full">
                      <circle cx="38" cy="30" r="14" fill="#5F8575" opacity="0.3" />
                      <circle cx="38" cy="30" r="5.5" fill="#98B092" />
                      <path d="M55,30 Q115,15 195,32" fill="none" stroke="#889BAE" strokeWidth="2.4" strokeDasharray="5 3" />
                      <text x="72" y="14" fill="#D4E0DA" fontSize="9" fontFamily="monospace">SMOKE PLUME DIMMING</text>
                    </svg>
                  )}
                </div>

                <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded bg-[#102030] text-[#98B092] border border-[#5F8575]/50">
                  {demo.badge}
                </span>
                <h3 className="text-base font-bold text-[#F1F5F2] mt-2.5 mb-2">{demo.title}</h3>
                <p className="text-xs text-[#D4E0DA] leading-relaxed mb-4">{demo.scientificStory}</p>
              </div>

              <button
                type="button"
                onClick={() => onLoadDemoCase(demo)}
                className="w-full py-2.5 rounded-xl bg-[#102030] group-hover:bg-[#2F6352] border border-[#5F8575]/60 group-hover:border-[#98B092] text-[#F1F5F2] text-xs font-semibold font-mono-code flex items-center justify-center gap-2 transition"
              >
                <TrendingUp className="w-3.5 h-3.5" /> ANALYZE THIS PAIR
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="editorial-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#98B092] mb-1 font-semibold">
            <Layers className="w-4 h-4" /> NASA EARTHDATA SENSORS
          </div>
          <h2 className="text-lg font-bold text-[#F1F5F2] mb-4">What Each Satellite Instrument Measures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NASA_VARIABLES.map((v) => (
              <div key={v.id} className="bg-[#102030] border border-[#5F8575]/40 rounded-xl p-4">
                <div className="text-[11px] font-mono-code text-[#98B092] font-semibold mb-1">{v.missionSource}</div>
                <div className="font-bold text-sm text-[#F1F5F2] mb-1.5">{v.label}</div>
                <p className="text-xs text-[#D4E0DA] leading-relaxed">{v.simpleDefinition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
