import React from 'react';
import { ArrowRight, Compass, Radio, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { DEMO_CASES, NASA_VARIABLES } from '../services/nasaPowerApi';
import { PresetCase } from '../types/climate';

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
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="pt-8 md:pt-14 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code mb-6">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          LIVE NASA EARTH OBSERVATION TELEMETRY // 1985–2024
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
          Decode Hidden Signals in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
            Earth&apos;s Climate System
          </span>
        </h1>
        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          A single planetary process can drive warming or wetting in one region while triggering
          the exact opposite trend thousands of kilometers away. Investigate satellite time series,
          test statistical significance (<span className="font-mono-code text-cyan-300">p &lt; 0.05</span>),
          and uncover regional teleconnections.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartLab}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
          >
            Launch Trend Detective Lab <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onStartWizard}
            className="glass-card hover:border-cyan-400/50 text-white font-semibold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Guided Investigation Wizard
          </button>
        </div>
      </section>

      {/* Los 5 Pasos Científicos del Desafío */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
              SCIENTIFIC WORKFLOW
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              How Earth System Trend Detection Works
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono-code font-bold mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Select Satellite Variables</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Query homogenized multi-decade records from NASA missions including{' '}
              <strong className="text-slate-200">MERRA-2, GPM, CERES, SMAP, and AIRS</strong> with
              clear physical definitions.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono-code font-bold mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Compare Opposite Dipoles</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Analyze any coordinate pair side-by-side and adjust the observation window (e.g., 10
              vs. 40 years) to see when subtle shifts emerge above natural climate noise.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono-code font-bold mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verify Statistical Significance</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated Ordinary Least Squares (OLS) slope, 95% confidence intervals, and
              non-parametric <strong className="text-slate-200">Mann-Kendall p-value</strong> testing.
            </p>
          </div>
        </div>
      </section>

      {/* Casos de Estudio Listos con 1 Clic */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="mb-6">
          <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest">
            CURATED INVESTIGATIONS
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Interactive Demo Cases (Click to Load Live NASA Data)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEMO_CASES.map((demo) => (
            <div
              key={demo.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-400/50 transition"
            >
              <div>
                <span className="text-[10px] font-mono-code px-2.5 py-1 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {demo.badge}
                </span>
                <h3 className="text-lg font-bold text-white mt-3 mb-2">{demo.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {demo.scientificStory}
                </p>
                <div className="text-[11px] font-mono-code text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 mb-5">
                  <div>A: {demo.regionA.name}</div>
                  <div className="text-cyan-400 mt-1">B: {demo.regionB.name}</div>
                </div>
              </div>

              <button
                onClick={() => onLoadDemoCase(demo)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white text-xs font-bold font-mono-code flex items-center justify-center gap-2 transition"
              >
                <TrendingUp className="w-3.5 h-3.5" /> INVESTIGATE CASE
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo de Variables Satelitales */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 mb-2">
            <ShieldCheck className="w-4 h-4" /> NASA EARTHDATA INSTRUMENT CATALOG
          </div>
          <h2 className="text-xl font-bold text-white mb-6">
            Supported Satellite Variables & Physical Definitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NASA_VARIABLES.map((v) => (
              <div key={v.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-mono-code text-cyan-400 mb-1">
                  <span>{v.id}</span>
                  <span className="text-slate-500">{v.missionSource}</span>
                </div>
                <div className="font-bold text-sm text-white mb-1">{v.label}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{v.simpleDefinition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
