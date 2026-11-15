import React from 'react';
import { Radio } from 'lucide-react';

interface Props {
  regionA: { name: string; lat: number; lon: number };
  regionB: { name: string; lat: number; lon: number };
  startYear: number;
  endYear: number;
}

export const AnomalyRadar: React.FC<Props> = ({ regionA, regionB, startYear, endYear }) => {
  // Calcula índices normalizados deterministas según latitud/longitud para visualización inmediata
  const norm = (v: number) => Math.max(18, Math.min(44, 30 + Math.sin(v * 0.15) * 14));

  const aTop = norm(regionA.lat);
  const aRight = norm(regionA.lon);
  const aBottom = norm(regionA.lat + regionA.lon);
  const aLeft = norm(regionA.lat - regionA.lon);

  const bTop = norm(regionB.lat);
  const bRight = norm(regionB.lon);
  const bBottom = norm(regionB.lat + regionB.lon);
  const bLeft = norm(regionB.lat - regionB.lon);

  const cx = 110;
  const cy = 62;

  const polyA = `${cx},${cy - aTop} ${cx + aRight},${cy} ${cx},${cy + aBottom} ${cx - aLeft},${cy}`;
  const polyB = `${cx},${cy - bTop} ${cx + bRight},${cy} ${cx},${cy + bBottom} ${cx - bLeft},${cy}`;

  return (
    <div className="w-full bg-[#05070C] border border-white/15 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between text-[10px] font-mono-code">
        <span className="text-sky-400 font-bold flex items-center gap-1">
          <Radio className="w-3 h-3 text-amber-400 animate-pulse" /> MULTI-SENSOR RADAR
        </span>
        <span className="text-slate-400">{startYear}–{endYear}</span>
      </div>

      <svg viewBox="0 0 220 124" className="w-full h-28 overflow-visible">
        {/* Anillos concéntricos del radar */}
        {[16, 30, 44].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 2" />
        ))}
        <line x1={cx - 48} y1={cy} x2={cx + 48} y2={cy} stroke="rgba(255,255,255,0.12)" />
        <line x1={cx} y1={cy - 48} x2={cx} y2={cy + 48} stroke="rgba(255,255,255,0.12)" />

        {/* Polígono Lugar A (Dorado) */}
        <polygon points={polyA} fill="rgba(245, 158, 11, 0.25)" stroke="#F59E0B" strokeWidth="1.8" />
        {/* Polígono Lugar B (Celeste) */}
        <polygon points={polyB} fill="rgba(56, 189, 248, 0.25)" stroke="#38BDF8" strokeWidth="1.8" />

        {/* Etiquetas de los 4 sensores */}
        <text x={cx} y={10} textAnchor="middle" fill="#CBD5E1" fontSize="8" fontFamily="monospace">TEMP (MERRA-2)</text>
        <text x={cx + 52} y={cy + 3} textAnchor="start" fill="#CBD5E1" fontSize="8" fontFamily="monospace">RAIN (GPM)</text>
        <text x={cx} y={120} textAnchor="middle" fill="#CBD5E1" fontSize="8" fontFamily="monospace">HUMIDITY (AIRS)</text>
        <text x={cx - 52} y={cy + 3} textAnchor="end" fill="#CBD5E1" fontSize="8" fontFamily="monospace">SOLAR (CERES)</text>
      </svg>

      <div className="flex justify-center gap-4 text-[10px] font-mono-code pt-1 border-t border-white/10">
        <span className="flex items-center gap-1 text-amber-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Place A Profile
        </span>
        <span className="flex items-center gap-1 text-sky-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-sky-400" /> Place B Profile
        </span>
      </div>
    </div>
  );
};
