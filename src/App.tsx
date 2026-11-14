import React, { useState } from 'react';
import { Globe2, SlidersHorizontal, Sparkles, BookOpen } from 'lucide-react';
import { DEMO_CASES, NASA_VARIABLES } from './services/nasaPowerApi';
import { PresetCase } from './types/climate';
import { MissionOverview } from './components/MissionOverview';
import { DetectiveWizard } from './components/DetectiveWizard';
import { RegionPanel } from './components/RegionPanel';

export function App() {
  const defaultCase = DEMO_CASES.at(0)!;
  const [activeTab, setActiveTab] = useState<'overview' | 'wizard' | 'lab'>('overview');
  const [selectedVarId, setSelectedVarId] = useState(defaultCase.variableId);
  const [startYear, setStartYear] = useState(defaultCase.startYear);
  const [endYear, setEndYear] = useState(defaultCase.endYear);

  const [regionA, setRegionA] = useState(defaultCase.regionA);
  const [regionB, setRegionB] = useState(defaultCase.regionB);

  const activeVariable =
    NASA_VARIABLES.find((v) => v.id === selectedVarId) || NASA_VARIABLES.at(0)!;

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
      <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-[#0E131F]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#3D85C6] flex items-center justify-center text-white font-bold shadow-md">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-tight text-white">
                TERRA<span className="text-[#E07A5F]">PULSE</span>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                EARTH SYSTEM TREND DETECTIVE
              </div>
            </div>
          </button>

          <nav className="flex items-center gap-1.5 bg-[#151C2C] p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'overview'
                  ? 'bg-[#3D85C6] text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wizard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'wizard'
                  ? 'bg-[#3D85C6] text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Wizard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'lab'
                  ? 'bg-[#E07A5F] text-white font-semibold'
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
            <section className="editorial-card rounded-2xl p-4 md:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-mono-code uppercase text-slate-400 block mb-1">
                  1. SELECT WHAT TO MEASURE ({activeVariable.missionSource})
                </label>
                <select
                  value={selectedVarId}
                  onChange={(e) => setSelectedVarId(e.target.value)}
                  className="w-full bg-[#0E131F] border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-[#3D85C6]"
                >
                  {NASA_VARIABLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} ({v.unit}) — {v.missionSource}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {activeVariable.simpleDefinition}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#0E131F] border border-slate-800 rounded-xl p-3 font-mono-code text-xs shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 block">FROM YEAR</span>
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
                  <span className="text-[10px] text-slate-400 block">TO YEAR</span>
                  <input
                    type="number"
                    min={startYear + 5}
                    max={2023}
                    value={endYear}
                    onChange={(e) => setEndYear(parseInt(e.target.value, 10) || 2023)}
                    className="bg-transparent text-white font-bold w-16 focus:outline-none"
                  />
                </div>
                <div className="pl-2 border-l border-slate-800 text-[#E07A5F] font-bold">
                  {endYear - startYear + 1} YRS
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionPanel
                panelTitle="REGION A // PRIMARY LOCATION"
                regionName={regionA.name}
                lat={regionA.lat}
                lon={regionA.lon}
                variable={activeVariable}
                startYear={startYear}
                endYear={endYear}
                onUpdateCoords={(name, lat, lon) => setRegionA({ name, lat, lon })}
              />
              <RegionPanel
                panelTitle="REGION B // COMPARISON LOCATION"
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

      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-400 font-mono-code">
        TERRA-PULSE · NASA Space Apps Challenge 2026 · Data Source: NASA Langley POWER Earth
        Observations
      </footer>
    </div>
  );
}

export default App;
