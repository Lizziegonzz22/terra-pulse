import React, { useState } from 'react';
import { Crosshair } from 'lucide-react';

interface Props {
  regionA: { name: string; lat: number; lon: number };
  regionB: { name: string; lat: number; lon: number };
  onSelectLocation: (target: 'A' | 'B', name: string, lat: number, lon: number) => void;
}

// Polígonos simplificados de continentes en coordenadas (lon, lat)
const WORLD_LAND: [number, number][][] = [
  // Norteamérica
  [[-168,66],[-140,70],[-95,72],[-62,58],[-55,47],[-75,35],[-81,25],[-97,26],[-105,20],[-118,33],[-125,49],[-148,60]],
  // Sudamérica
  [[-78,10],[-60,8],[-35,-6],[-39,-18],[-53,-33],[-68,-54],[-75,-48],[-71,-18],[-81,-4]],
  // Groenlandia
  [[-52,60],[-22,70],[-18,82],[-55,81],[-60,72]],
  // Europa
  [[-9,36],[-9,43],[-2,48],[6,53],[10,58],[25,65],[40,66],[45,45],[28,41],[15,38],[3,42]],
  // África
  [[-17,15],[-5,35],[11,37],[32,31],[43,12],[51,11],[40,-15],[20,-34],[12,-16],[9,4],[-8,5]],
  // Asia
  [[45,45],[40,66],[85,73],[140,70],[170,65],[155,50],[135,35],[120,23],[105,10],[98,16],[88,22],[78,8],[68,24],[52,26]],
  // Australia
  [[114,-22],[132,-12],[152,-26],[146,-38],[116,-34]],
  // Antártida
  [[-180,-72],[-90,-70],[0,-70],[90,-70],[180,-72],[180,-88],[-180,-88]],
];

export const WorldPickerMap: React.FC<Props> = ({ regionA, regionB, onSelectLocation }) => {
  const [activePin, setActivePin] = useState<'A' | 'B'>('A');

  const w = 720;
  const h = 260;

  // Proyección equirectangular: lon [-180, 180] -> [0, w], lat [90, -90] -> [0, h]
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
    onSelectLocation(
      activePin,
      `Custom Pin (${newLat}°, ${newLon}°)`,
      newLat,
      newLon
    );
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

        {/* Selector de qué pin mover al tocar el mapa */}
        <div className="flex items-center gap-1.5 bg-[#09090B] p-1 rounded-xl border border-zinc-800 text-xs font-mono-code">
          <button
            type="button"
            onClick={() => setActivePin('A')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activePin === 'A'
                ? 'bg-[#FF5A1F] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" /> Move Pin A
          </button>
          <button
            type="button"
            onClick={() => setActivePin('B')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activePin === 'B'
                ? 'bg-[#3B82F6] text-white'
                : 'text-zinc-400 hover:text-white'
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
          {/* Grilla de latitud/longitud */}
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

          {/* Continentes */}
          {WORLD_LAND.map((poly, idx) => (
            <polygon
              key={idx}
              points={poly.map(([lon, lat]) => `${lonToX(lon)},${latToY(lat)}`).join(' ')}
              fill="#1E1E24"
              stroke="#3F3F46"
              strokeWidth="1.2"
            />
          ))}

          {/* Arco de conexión entre Región A y Región B */}
          <path
            d={`M ${ax},${ay} Q ${(ax + bx) / 2},${Math.min(ay, by) - 38} ${bx},${by}`}
            fill="none"
            stroke="#E4E4E7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.7"
          />

          {/* Pin A (Naranja Aeroespacial) */}
          <g transform={`translate(${ax}, ${ay})`}>
            <circle r="12" fill="#FF5A1F" opacity="0.25" />
            <circle r="5.5" fill="#FF5A1F" stroke="#FFFFFF" strokeWidth="1.5" />
            <text
              x="9"
              y="4"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              A
            </text>
          </g>

          {/* Pin B (Azul Satelital) */}
          <g transform={`translate(${bx}, ${by})`}>
            <circle r="12" fill="#3B82F6" opacity="0.25" />
            <circle r="5.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
            <text
              x="9"
              y="4"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="bold"
              fontFamily="JetBrains Mono, monospace"
            >
              B
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
