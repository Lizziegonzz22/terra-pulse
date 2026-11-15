import React, { useState } from 'react';
import { Globe2, SlidersHorizontal, Sparkles, BookOpen } from 'lucide-react';
import { DEMO_CASES, NASA_VARIABLES } from './services/nasaPowerApi';
import { PresetCase } from './types/climate';
import { MissionOverview } from './components/MissionOverview';
import { DetectiveWizard } from './components/DetectiveWizard';
import { RegionPanel } from './components/RegionPanel';
import { OrbitalGlobe } from './components/OrbitalGlobe';
import { TeleconnectionMeter } from './components/TeleconnectionMeter';
import { AnomalyRadar } from './components/AnomalyRadar';

export function App() {
  const def = DEMO_CASES.at(0)!;
  const [tab, setTab] = useState<'overview' | 'wizard' | 'lab'>('overview');
  const [varId, setVarId] = useState(def.variableId);
  const [startYear, setStartYear] = useState(def.startYear);
  const [endYear, setEndYear] = useState(def.endYear);
  const [regA, setRegA] = useState(def.regionA);
  const [regB, setRegB] = useState(def.regionB);

  const activeVar = NASA_VARIABLES.find((v) => v.id === varId) || NASA_VARIABLES.at(0)!;

  function loadCase(demo: PresetCase) {
    setVarId(demo.variableId); setRegA(demo.regionA); setRegB(demo.regionB);
    setStartYear(demo.startYear); setEndYear(demo.endYear); setTab('lab');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-white/15 bg-[#05070C]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setTab('overview')} className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-950 font-bold"><Globe2 className="w-5 h-5" /></div>
            <div>
              <div className="font-display font-bold text-base text-white">TERRA<span className="text-amber-400">PULSE</span></div>
              <div className="text-[10px] font-mono-code text-slate-400">NASA EARTH SYSTEM COMMAND</div>
            </div>
          </button>

          <nav className="flex items-center gap-1 bg-[#0D121E] p-1 rounded-xl border border-white/15">
            <button type="button" onClick={() => setTab('overview')} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${tab === 'overview' ? 'bg-white text-slate-950 font-bold' : 'text-slate-300'}`}><BookOpen className="w-3.5 h-3.5" /> Overview</button>
            <button type="button" onClick={() => setTab('wizard')} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${tab === 'wizard' ? 'bg-white text-slate-950 font-bold' : 'text-slate-300'}`}><Sparkles className="w-3.5 h-3.5" /> Wizard</button>
            <button type="button" onClick={() => setTab('lab')} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${tab === 'lab' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300'}`}><SlidersHorizontal className="w-3.5 h-3.5" /> Trend Lab</button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {tab === 'overview' && <MissionOverview onStartLab={() => setTab('lab')} onStartWizard={() => setTab('wizard')} onLoadDemoCase={loadCase} />}
        {tab === 'wizard' && <DetectiveWizard onApplyRecommendation={loadCase} />}

        {tab === 'lab' && (
          <div className="max-w-[1440px] mx-auto px-4 py-5 flex flex-col gap-5">
            <section className="editorial-card rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-mono-code text-amber-400 font-bold">PRESETS:</span>
                  {DEMO_CASES.map((c) => (
                    <button key={c.id} type="button" onClick={() => loadCase(c)} className="text-[10px] font-mono-code bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white px-2.5 py-0.5 rounded-full font-semibold">
                      {c.badge}
                    </button>
                  ))}
                </div>
                <select value={varId} onChange={(e) => setVarId(e.target.value)} className="w-full bg-[#05070C] border border-white/20 rounded-xl px-3 py-2 text-sm font-bold text-white">
                  {NASA_VARIABLES.map((v) => <option key={v.id} value={v.id}>{v.label} ({v.unit}) — {v.missionSource}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3 bg-[#05070C] border border-white/15 rounded-xl p-3 font-mono-code text-xs shrink-0">
                <div><span className="text-[10px] text-slate-400 block">FROM</span><input type="number" min={1984} max={endYear - 5} value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value, 10) || 1985)} className="bg-transparent text-white font-bold w-14" /></div>
                <span className="text-slate-500">→</span>
                <div><span className="text-[10px] text-slate-400 block">TO</span><input type="number" min={startYear + 5} max={2023} value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value, 10) || 2023)} className="bg-transparent text-white font-bold w-14" /></div>
                <div className="pl-2 border-l border-white/15 text-amber-400 font-bold">{endYear - startYear + 1} YRS</div>
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              <div className="xl:col-span-4">
                <RegionPanel panelTitle="PLACE A // PRIMARY" accentColor="amber" regionName={regA.name} lat={regA.lat} lon={regA.lon} variable={activeVar} startYear={startYear} endYear={endYear} onUpdateCoords={(name, lat, lon) => setRegA({ name, lat, lon })} />
              </div>

              <div className="xl:col-span-4 editorial-card rounded-2xl p-4 flex flex-col items-center gap-3">
                <div className="text-center">
                  <span className="text-[10px] font-mono-code text-sky-400 font-bold">ORBITAL TELECONNECTION VIEWER</span>
                  <h3 className="text-sm font-bold text-white">Drag to Rotate · Tap Globe to Sample</h3>
                </div>
                <OrbitalGlobe compact regionA={regA} regionB={regB} onPickCoordinate={(t, name, lat, lon) => t === 'A' ? setRegA({ name, lat, lon }) : setRegB({ name, lat, lon })} />
                <TeleconnectionMeter regionA={regA} regionB={regB} variable={activeVar} startYear={startYear} endYear={endYear} />
                <AnomalyRadar regionA={regA} regionB={regB} startYear={startYear} endYear={endYear} />
                <div className="w-full bg-[#05070C] border border-white/15 rounded-xl p-2.5 text-center text-xs">
                  <div className="font-bold text-amber-400 truncate">A: {regA.name}</div>
                  <div className="font-bold text-sky-400 truncate mt-0.5">B: {regB.name}</div>
                </div>
              </div>

              <div className="xl:col-span-4">
                <RegionPanel panelTitle="PLACE B // OPPOSITE" accentColor="sky" regionName={regB.name} lat={regB.lat} lon={regB.lon} variable={activeVar} startYear={startYear} endYear={endYear} onUpdateCoords={(name, lat, lon) => setRegB({ name, lat, lon })} />
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-4 text-center text-xs text-slate-400 font-mono-code">
        TERRA-PULSE · NASA Space Apps Challenge 2026 · Data: NASA Langley POWER
      </footer>
    </div>
  );
}

export default App;
