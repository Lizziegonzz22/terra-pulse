import React, { useState } from 'react';
import { Crosshair } from 'lucide-react';

interface Props {
  regionA: { name: string; lat: number; lon: number };
  regionB: { name: string; lat: number; lon: number };
  onSelectLocation: (target: 'A' | 'B', name: string, lat: number, lon: number) => void;
}

const CONTINENT_STRINGS: string[] = [
  '-168,65 -140,70 -95,72 -62,58 -55,47 -75,35 -81,25 -97,26 -105,20 -118,33 -125,49 -148,60',
  '-78,10 -60,8 -35,-6 -39,-18 -53,-33 -68,-54 -75,-48 -71,-18 -81,-4',
  '-52,60 -22,70 -18,82 -55,81 -60,72',
  '-9,36 -9,43 -2,48 5,53 10,58 25,68 42,66 48,45 28,41 15,38 5,43 -5,36',
  '-17,15 -5,35 10,37 32,31 44,12 50,11 40,-15 20,-34 12,-16 8,4 -8,5',
  '28,41 48,45 65,70 105,75 140,70 170,65 142,45 122,38 118,22 102,12 96,18 80,8 68,24 52,25 36,34',
  '114,-22 132,-12 152,-26 146,-38 116,-34',
  '-180,-74 -90,-72 0,-72 90,-72 180,-74 180,-88 -180,-88',
];

const WORLD_LAND: [number, number][][] = CONTINENT_STRINGS.map((str) =>
  str.split(' ').map((pair) => {
    const parts = pair.split(',');
    return [Number(parts.at(0)), Number(parts.at(1))];
  })
);

export const WorldPickerMap: React.FC<Props> = ({ regionA, regionB, onSelectLocation }) => {
  const [activePin, setActivePin] = useState<'A' | 'B'>('A');

  const w = 720;
  const h = 260;

  const lonToX = (lon: number) => ((lon + 180) / 360) * w;
  const latToY = (lat: number) => ((90 - lat) / 180) * h;

  const xToLon = (x: number) => Number(((x / w) * 360 - 180).toFixed(1));
  const yToLat = (y: number) => Number((90 - (y / h) * 180).toFixed(1));

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * w;
    const clickY = ((e.clientY - rect.top) / rect.height) * h;
    const newLon = Math.max(-180, Math.min(180, xToLon(clickX)));
    const newLat = Math.max(-85, Math.min(85, yToLat(clickY)));
    onSelectLocation(activePin, `Custom Pin (${newLat}°, ${newLon}°)`, newLat, newLon);
  };

  const ax = lonToX(regionA.lon);
  const ay = latToY(regionA.lat);
  const bx = lonToX(regionB.lon);
  const by = latToY(regionB.lat);

  return (
    <div className="editorial-card rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-300">
          <Crosshair className="w-4 h-4 text-[#FF5A1F]" />
          <span>INTERACTIVE GLOBAL TELECONNECTION MAP (TAP ANYWHERE TO SAMPLE NASA DATA)</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#09090B] p-1 rounded-xl border border-zinc-800 text-xs font-mono-code">
          <button
            type="button"
            onClick={() => setActivePin('A')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activePin === 'A' ? 'bg-[#FF5A1F] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" /> Move Pin A
          </button>
          <button
            type="button"
            onClick={() => setActivePin('B')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activePin === 'B' ? 'bg-[#3B82F6] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" /> Move Pin B
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-[#09090B] border border-zinc-800">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          onClick={handleSvgClick}
          className="w-full h-48 md:h-60 block cursor-crosshair select-none"
        >
          {[-60, -30, 0, 30, 60].map((lat) => (
            <line
              key={lat}
              x1={0}
              y1={latToY(lat)}
              x2={w}
              y2={latToY(lat)}
              stroke={lat === 0 ? 'rgba(255, 90, 31, 0.25)' : '#1F1F23'}
              strokeDasharray={lat === 0 ? '4 4' : undefined}
              strokeWidth="1"
            />
          ))}
          {[-120, -60, 0, 60, 120].map((lon) => (
            <line
              key={lon}
              x1={lonToX(lon)}
              y1={0}
              x2={lonToX(lon)}
              y2={h}
              stroke="#1F1F23"
              strokeWidth="1"
            />
          ))}

          {WORLD_LAND.map((poly, idx) => (
            <polygon
              key={idx}
              points={poly.map(([lon, lat]) => `${lonToX(lon)},${latToY(lat)}`).join(' ')}
              fill="#27272A"
              stroke="#52525B"
              strokeWidth="1.2"
            />
          ))}

          <path
            d={`M ${ax},${ay} Q ${(ax + bx) / 2},${Math.min(ay, by) - 38} ${bx},${by}`}
            fill="none"
            stroke="#E4E4E7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.75"
          />

          <g transform={`translate(${ax}, ${ay})`}>
            <circle r="12" fill="#FF5A1F" opacity="0.28" />
            <circle r="5.5" fill="#FF5A1F" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="9" y="4" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
              A
            </text>
          </g>

          <g transform={`translate(${bx}, ${by})`}>
            <circle r="12" fill="#3B82F6" opacity="0.28" />
            <circle r="5.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="9" y="4" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
              B
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
