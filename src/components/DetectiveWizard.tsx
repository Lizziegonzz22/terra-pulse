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
    const caseDipole = DEMO_CASES.at(0)!;
    const caseArctic = DEMO_CASES.at(1)!;
    const caseSmoke = DEMO_CASES.at(2)!;

    if (phenomenon === 'warming' || ecosystem === 'polar') {
      return { ...caseArctic, startYear: span === 'short' ? 2010 : 1985, endYear: 2023 };
    }
    if (phenomenon === 'smoke' || ecosystem === 'forest') {
      return { ...caseSmoke, startYear: span === 'short' ? 2010 : 1990, endYear: 2023 };
    }
    return { ...caseDipole, startYear: span === 'short' ? 2010 : 1985, endYear: 2023 };
  };

  const recommended = getRecommendation();
  const recVariable = NASA_VARIABLES.find((v) => v.id === recommended.variableId) || NASA_VARIABLES.at(0)!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="editorial-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-mono-code text-[#98B092] font-semibold mb-2">
          <Sparkles className="w-4 h-4" /> GUIDED INVESTIGATION ASSISTANT
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#F1F5F2] mb-2">Build Your Investigation in 3 Steps</h2>
        <p className="text-sm text-[#D4E0DA] mb-8 leading-relaxed">
          Choose an environment, a physical change, and a time window. We will configure the matching NASA satellite sensors and two real regions to compare.
        </p>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#889BAE] mb-3">Step 1 · Choose an environment to explore</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'agriculture', title: 'Farms & River Basins', desc: 'How rainfall patterns shift across regions' },
                { id: 'polar', title: 'Polar Ice & Oceans', desc: 'Why the Arctic warms faster than the equator' },
                { id: 'forest', title: 'Forests & Air Quality', desc: 'How wildfire smoke dims surface sunlight' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEcosystem(item.id as 'polar' | 'agriculture' | 'forest')}
                  className={`p-4 rounded-xl border text-left transition ${
                    ecosystem === item.id ? 'bg-[#2F6352] border-[#98B092] text-white' : 'bg-[#102030] border-[#5F8575]/40 text-[#889BAE] hover:border-[#98B092]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#F1F5F2]">{item.title}</div>
                  <div className="text-xs text-[#D4E0DA] mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#889BAE] mb-3">Step 2 · What environmental change do you want to measure?</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'drought', title: 'Wet vs. Dry Shifts', desc: 'Compare regions with opposite rain trends' },
                { id: 'warming', title: 'Temperature Rise', desc: 'Measure warming speed per decade' },
                { id: 'smoke', title: 'Sunlight & Smoke', desc: 'Track drops in solar radiation' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPhenomenon(item.id as 'drought' | 'warming' | 'smoke')}
                  className={`p-4 rounded-xl border text-left transition ${
                    phenomenon === item.id ? 'bg-[#2F6352] border-[#98B092] text-white' : 'bg-[#102030] border-[#5F8575]/40 text-[#889BAE] hover:border-[#98B092]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#F1F5F2]">{item.title}</div>
                  <div className="text-xs text-[#D4E0DA] mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#889BAE] mb-3">Step 3 · Choose how many years of satellite data to analyze</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSpan('long')}
                className={`p-4 rounded-xl border text-left transition ${
                  span === 'long' ? 'bg-[#2F6352] border-[#98B092] text-white' : 'bg-[#102030] border-[#5F8575]/40 text-[#889BAE] hover:border-[#98B092]'
                }`}
              >
                <div className="font-bold text-sm text-[#F1F5F2]">Long-Term Record (35+ Years)</div>
                <div className="text-xs text-[#D4E0DA] mt-1">Best for proving whether a climate trend is statistically real (p &lt; 0.05).</div>
              </button>
              <button
                type="button"
                onClick={() => setSpan('short')}
                className={`p-4 rounded-xl border text-left transition ${
                  span === 'short' ? 'bg-[#2F6352] border-[#98B092] text-white' : 'bg-[#102030] border-[#5F8575]/40 text-[#889BAE] hover:border-[#98B092]'
                }`}
              >
                <div className="font-bold text-sm text-[#F1F5F2]">Short Window (~13 Years)</div>
                <div className="text-xs text-[#D4E0DA] mt-1">Shows why shorter periods look noisy and often fail significance tests.</div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#102030] border border-[#5F8575]/60 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#98B092] font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" /> RECOMMENDED NASA SETUP
            </div>
            <div className="text-lg font-bold text-[#F1F5F2]">{recommended.title}</div>
            <div className="text-xs text-[#D4E0DA] mt-1">
              Satellite Source: <strong className="text-white">{recVariable.missionSource}</strong> · Metric: <strong className="text-white">{recVariable.label}</strong> ({recommended.startYear}–{recommended.endYear})
            </div>
          </div>

          <button
            type="button"
            onClick={() => onApplyRecommendation(recommended)}
            className="bg-[#5F8575] hover:bg-[#2F6352] border border-[#98B092]/50 text-white font-semibold px-5 py-3 rounded-xl text-xs font-mono-code flex items-center gap-2 shrink-0 transition"
          >
            <Compass className="w-4 h-4" /> OPEN IN TREND LAB <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
