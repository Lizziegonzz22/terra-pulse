import React, { useState } from 'react';
import { Crosshair } from 'lucide-react';

interface Props {
  regionA: { name: string; lat: number; lon: number };
  regionB: { name: string; lat: number; lon: number };
  onSelectLocation: (target: 'A' | 'B', name: string, lat: number, lon: number) => void;
}

const LAND_DATA = [
  '-168,65 -140,70 -95,72 -62,58 -55,47 -75,35 -81,25 -97,26 -105,20 -118,33 -125,49',
  '-78,10 -60,8 -35,-6 -39,-18 -53,-33 -68,-54 -75,-48 -71,-18 -81,-4',
  '-52,60 -22,70 -18,82 -55,81 -60,72',
  '-9,36 -9,43 -2,48 5,53 10,58 25,68 42,66 48,45 28,41 15,38 5,43',
  '-17,15 -5,35 10,37 32,31 44,12 50,11 40,-15 20,-34 12,-16 8,4 -8,5',
  '28,41 48,45 65,70 105,75 140,70 170,65 142,45 122,38 118,22 102,12 80,8 68,24 52,25',
  '114,-22 132,-12 152,-26 146,-38 116,-34',
  '-180,-74 -90,-72 0,-72 90,-72 180,-74 180,-88 -180,-88',
];

const WORLD_LAND = LAND_DATA.map((str) =>
  str.split(' ').map((p) => {
    const pair = p.split(',');
    return [Number(pair.at(0)), Number(pair.at(1))] as [number, number];
  })
);

export const WorldPickerMap: React.FC<Props> = ({ regionA, regionB, onSelectLocation }) => {
  const [activePin, setActivePin] = useState<'A' | 'B'>('A');
  const w = 720;
  const h = 260;

  const lonToX = (lon: number) => ((lon + 180) / 360) * w;
  const latToY = (lat: number) => ((90 - lat) / 180) * h;

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * w;
    const clickY = ((e.clientY - rect.top) / rect.height) * h;
    const newLon = Number(Math.max(-180, Math.min(180, (clickX / w) * 360 - 180)).toFixed(1));
    const newLat = Number(Math.max(-85, Math.min(85, 90 - (clickY / h) * 180)).toFixed(1));
    onSelectLocation(activePin, `Custom Pin (${newLat}°, ${newLon}°)`, newLat, newLon);
  };

  const ax = lonToX(regionA.lon);
  const ay = latToY(regionA.lat);
  const bx = lonToX(regionB.lon);
  const by = latToY(regionB.lat);

  return (
    <div className="editorial-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono-code text-slate-300">
          <Crosshair className="w-4 h-4 text-[#87A8D0]" />
          <span>GLOBAL TELECONNECTION MAP (TAP ANYWHERE TO SAMPLE NASA DATA)</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0D1017] p-1 rounded-xl border border-slate-800 text-xs font-mono-code">
          <button
            type="button"
            onClick={() => setActivePin('A')}
            className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activePin === 'A' ? 'bg-[#5C7FA8] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" /> Move Pin A
          </button>
          <button
            type="button"
            onClick={() => setActivePin('B')}
            className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activePin === 'B' ? 'bg-[#7A75A6] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" /> Move Pin B
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-[#0D1017] border border-slate-800/80">
        <svg viewBox={`0 0 ${w} ${h}`} onClick={handleSvgClick} className="w-full h-48 md:h-60 block cursor-crosshair select-none">
          {[-60, -30, 0, 30, 60].map((lat) => (
            <line key={lat} x1={0} y1={latToY(lat)} x2={w} y2={latToY(lat)} stroke="#182030" strokeDasharray={lat === 0 ? '4 4' : undefined} strokeWidth="1" />
          ))}
          {[-120, -60, 0, 60, 120].map((lon) => (
            <line key={lon} x1={lonToX(lon)} y1={0} x2={lonToX(lon)} y2={h} stroke="#182030" strokeWidth="1" />
          ))}

          {WORLD_LAND.map((poly, idx) => (
            <polygon key={idx} points={poly.map((pt) => `${lonToX(pt.at(0)!)},${latToY(pt.at(1)!)}`).join(' ')} fill="#1B2333" stroke="#3D4E6B" strokeWidth="1.1" />
          ))}

          <path d={`M ${ax},${ay} Q ${(ax + bx) / 2},${Math.min(ay, by) - 38} ${bx},${by}`} fill="none" stroke="#8596B2" strokeWidth="1.4" strokeDasharray="4 4" />

          <g transform={`translate(${ax}, ${ay})`}>
            <circle r="11" fill="#6892C6" opacity="0.25" />
            <circle r="5" fill="#6892C6" stroke="#E2E6EE" strokeWidth="1.4" />
            <text x="9" y="4" fill="#E2E6EE" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">A</text>
          </g>

          <g transform={`translate(${bx}, ${by})`}>
            <circle r="11" fill="#8A84B8" opacity="0.25" />
            <circle r="5" fill="#8A84B8" stroke="#E2E6EE" strokeWidth="1.4" />
            <text x="9" y="4" fill="#E2E6EE" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">B</text>
          </g>
        </svg>
      </div>
    </div>
  );
};
