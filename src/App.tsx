import React, { useState } from 'react';
import { Globe2, SlidersHorizontal, Sparkles, BookOpen } from 'lucide-react';
import { DEMO_CASES, NASA_VARIABLES } from './services/nasaPowerApi';
import { PresetCase } from './types/climate';
import { MissionOverview } from './components/MissionOverview';
import { DetectiveWizard } from './components/DetectiveWizard';
import { RegionPanel } from './components/RegionPanel';

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'wizard' | 'lab'>('overview');
  const [selectedVarId, setSelectedVarId] = useState('PRECTOTCORR');
  const [startYear, setStartYear] = useState(1985);
  const [endYear, setEndYear] = useState(2024);

  const [regionA, setRegionA] = useState(DEMO_CASES.regionA);
  const [regionB, setRegionB] = useState(DEMO_CASES.regionB);

  const activeVariable =
    NASA_VARIABLES.find((v) => v.id === selectedVarId) || NASA_VARIABLES;

  function loadCase(demo: PresetCase) {
    setSelectedVarId(demo.variableId);
    setRegionA(demo.regionA);
    setRegionB(demo.regionB);
    setStartYear(demo.startYear);
    setEndYear(demo.endYear);
    setActiveTab('lab');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-[#04070D]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-tight text-white">
                TERRA<span className="text-cyan-400">PULSE</span>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                NASA EARTH SYSTEM TREND DETECTIVE
              </div>
            </div>
          </button>

          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'overview'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'wizard'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Data Wizard
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'lab'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Trend Lab
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {activeTab === 'overview' && (
          <MissionOverview
            onStartLab={() => setActiveTab('lab')}
            onStartWizard={() => setActiveTab('wizard')}
            onLoadDemoCase={loadCase}
          />
        )}

        {activeTab === 'wizard' && <DetectiveWizard onApplyRecommendation={loadCase} />}

        {activeTab === 'lab' && (
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
            <section className="glass-card rounded-2xl p-4 md:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-mono-code uppercase text-cyan-400 block mb-1">
                  NASA EARTH OBSERVATION VARIABLE ({activeVariable.missionSource})
                </label>
                <select
                  value={selectedVarId}
                  onChange={(e) => setSelectedVarId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400"
                >
                  {NASA_VARIABLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} ({v.unit}) — {v.missionSource}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1.5">{activeVariable.simpleDefinition}</p>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 rounded-xl p-3 font-mono-code text-xs shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 block">START YEAR</span>
                  <input
                    type="number"
                    min={1984}
                    max={endYear - 5}
                    value={startYear}
                    onChange={(e) => setStartYear(parseInt(e.target.value, 10) || 1985)}
                    className="bg-transparent text-white font-bold w-16 focus:outline-none"
                  />
                </div>
                <span className="text-slate-600">→</span>
                <div>
                  <span className="text-[10px] text-slate-400 block">END YEAR</span>
                  <input
                    type="number"
                    min={startYear + 5}
                    max={2024}
                    value={endYear}
                    onChange={(e) => setEndYear(parseInt(e.target.value, 10) || 2024)}
                    className="bg-transparent text-white font-bold w-16 focus:outline-none"
                  />
                </div>
                <div className="pl-2 border-l border-slate-800 text-cyan-400">
                  {endYear - startYear + 1} YRS
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionPanel
                panelTitle="REGION ALPHA // PRIMARY TARGET"
                regionName={regionA.name}
                lat={regionA.lat}
                lon={regionA.lon}
                variable={activeVariable}
                startYear={startYear}
                endYear={endYear}
                onUpdateCoords={(name, lat, lon) => setRegionA({ name, lat, lon })}
              />
              <RegionPanel
                panelTitle="REGION BETA // TELECONNECTION PAIR"
                regionName={regionB.name}
                lat={regionB.lat}
                lon={regionB.lon}
                variable={activeVariable}
                startYear={startYear}
                endYear={endYear}
                onUpdateCoords={(name, lat, lon) => setRegionB({ name, lat, lon })}
              />
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500 font-mono-code">
        TERRA-PULSE · NASA Space Apps Challenge 2026 · Data Source: NASA Langley Research Center
        POWER Project
      </footer>
    </div>
  );
}

export default App;
