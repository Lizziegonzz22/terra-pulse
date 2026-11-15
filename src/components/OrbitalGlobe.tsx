import React, { useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { DEMO_CASES } from '../services/nasaPowerApi';
import { PresetCase } from '../types/climate';

interface Props {
  onSelectCase?: (demo: PresetCase) => void;
  regionA?: { name: string; lat: number; lon: number };
  regionB?: { name: string; lat: number; lon: number };
  onPickCoordinate?: (target: 'A' | 'B', name: string, lat: number, lon: number) => void;
  compact?: boolean;
}

const LAND = [
  { c: '-168,65 -140,70 -95,72 -62,58 -55,47 -75,35 -81,25 -97,26 -105,20 -118,33 -125,49', p: false },
  { c: '-78,10 -60,8 -35,-6 -39,-18 -53,-33 -68,-54 -75,-48 -71,-18 -81,-4', p: false },
  { c: '-52,60 -22,70 -18,82 -55,81 -60,72', p: true },
  { c: '-9,36 -9,43 -2,48 5,53 10,58 25,68 42,66 48,45 28,41 15,38 5,43', p: false },
  { c: '-17,15 -5,35 10,37 32,31 44,12 50,11 40,-15 20,-34 12,-16 8,4 -8,5', p: false },
  { c: '28,41 48,45 65,70 105,75 140,70 170,65 142,45 122,38 118,22 102,12 80,8 68,24 52,25', p: false },
  { c: '114,-22 132,-12 152,-26 146,-38 116,-34', p: false },
  { c: '-180,-74 -90,-72 0,-72 90,-72 180,-74 180,-88 -180,-88', p: true },
];

const CONTINENTS = LAND.map((item) => {
  const pts = item.c.split(' ').map((s) => s.split(',').map(Number));
  const poly: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts.at(i)!;
    const b = pts.at((i + 1) % pts.length)!;
    for (let s = 0; s < 5; s++) {
      const t = s / 5;
      poly.push([a.at(0)! + (b.at(0)! - a.at(0)!) * t, a.at(1)! + (b.at(1)! - a.at(1)!) * t]);
    }
  }
  return { poly, polar: item.p };
});

const HOTSPOTS = [
  { id: 'u', label: 'Río de la Plata (+Rain)', lat: -34.9, lon: -56.2, color: '#38BDF8', idx: 0 },
  { id: 'c', label: 'Central Chile (-Drought)', lat: -33.4, lon: -70.6, color: '#F59E0B', idx: 0 },
  { id: 'a', label: 'Svalbard (+3.4°C)', lat: 78.2, lon: 15.6, color: '#FBBF24', idx: 1 },
  { id: 'k', label: 'Boreal Canada (Smoke)', lat: 54.5, lon: -105.5, color: '#A78BFA', idx: 2 },
];

export const OrbitalGlobe: React.FC<Props> = ({ onSelectCase, regionA, regionB, onPickCoordinate, compact }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rot = useRef({ lon: 55, lat: -10, drag: false, moved: false, x: 0, y: 0 });
  const [autoSpin, setAutoSpin] = useState(true);
  const [activePin, setActivePin] = useState<'A' | 'B'>('A');
  useEffect(() => {
    let id: number;
    let sat = 0;
    const draw = () => {
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (!c || !ctx) return;
      const cx = c.width / 2;
      const cy = c.height / 2;
      const r = compact ? 110 : 118;

      if (autoSpin && !rot.current.drag) rot.current.lon = (rot.current.lon + 0.25) % 360;
      sat = (sat + 0.016) % (Math.PI * 2);
      ctx.clearRect(0, 0, c.width, c.height);

      const halo = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.28);
      halo.addColorStop(0, 'rgba(56,189,248,0.34)');
      halo.addColorStop(1, 'rgba(5,7,12,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.28, 0, Math.PI * 2); ctx.fill();

      const sun = ctx.createRadialGradient(cx - 64, cy - 84, 2, cx - 64, cy - 84, 60);
      sun.addColorStop(0, 'rgba(255,251,235,0.95)');
      sun.addColorStop(0.3, 'rgba(245,158,11,0.5)');
      sun.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = sun;
      ctx.beginPath(); ctx.arc(cx - 64, cy - 84, 60, 0, Math.PI * 2); ctx.fill();

      const proj = (lo: number, la: number) => {
        const lam = ((lo + rot.current.lon) * Math.PI) / 180;
        const phi = (la * Math.PI) / 180;
        const p0 = (rot.current.lat * Math.PI) / 180;
        const cosc = Math.sin(p0) * Math.sin(phi) + Math.cos(p0) * Math.cos(phi) * Math.cos(lam);
        let dx = Math.cos(phi) * Math.sin(lam);
        let dy = -(Math.cos(p0) * Math.sin(phi) - Math.sin(p0) * Math.cos(phi) * Math.cos(lam));
        if (cosc < 0) { const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len; }
        return { x: cx + r * dx, y: cy + r * dy, vis: cosc >= 0 };
      };

      const bg = ctx.createRadialGradient(cx - 42, cy - 52, 10, cx, cy, r);
      bg.addColorStop(0, '#1D4ED8'); bg.addColorStop(0.58, '#0D2342'); bg.addColorStop(1, '#040812');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();

      CONTINENTS.forEach(({ poly, polar }) => {
        if (!poly.some((pt) => proj(pt.at(0)!, pt.at(1)!).vis)) return;
        ctx.beginPath();
        poly.forEach((pt, i) => { const p = proj(pt.at(0)!, pt.at(1)!); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
        ctx.closePath();
        ctx.fillStyle = polar ? '#E2E8F0' : '#26633D'; ctx.fill();
        ctx.strokeStyle = polar ? '#FFF' : '#6EE7B7'; ctx.lineWidth = 1; ctx.stroke();
      });

      if (regionA && regionB) {
        const pA = proj(regionA.lon, regionA.lat);
        const pB = proj(regionB.lon, regionB.lat);
        if (pA.vis || pB.vis) {
          ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.quadraticCurveTo(cx, Math.min(pA.y, pB.y) - 45, pB.x, pB.y);
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2.2; ctx.stroke();
        }
        [pA, pB].forEach((p, idx) => {
          if (!p.vis) return;
          ctx.fillStyle = idx === 0 ? '#F59E0B' : '#38BDF8';
          ctx.beginPath(); ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#FFF'; ctx.lineWidth = 1.5; ctx.stroke();
        });
      } else {
        HOTSPOTS.forEach((s) => {
          const p = proj(s.lon, s.lat);
          if (!p.vis) return;
          ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(p.x, p.y, 4.8, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#FFF'; ctx.lineWidth = 1.5; ctx.stroke();
        });
      }

      ctx.restore();
      ctx.strokeStyle = 'rgba(125,211,252,0.7)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

      if (Math.sin(sat) > 0) {
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath(); ctx.arc(cx + Math.cos(sat) * (r + 26), cy + Math.sin(sat) * 32 - Math.cos(sat) * 16, 4, 0, Math.PI * 2); ctx.fill();
      }
      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(id);
  }, [autoSpin, regionA, regionB, compact]);
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (rot.current.moved || !onPickCoordinate || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const r = compact ? 110 : 118;
    const x = (((e.clientX - rect.left) * canvasRef.current.width) / rect.width - canvasRef.current.width / 2) / r;
    const y = (canvasRef.current.height / 2 - ((e.clientY - rect.top) * canvasRef.current.height) / rect.height) / r;
    const rho = Math.hypot(x, y);
    if (rho > 1) return;
    const c = Math.asin(rho);
    const p0 = (rot.current.lat * Math.PI) / 180;
    const lat = (Math.asin(Math.cos(c) * Math.sin(p0) + (y * Math.sin(c) * Math.cos(p0)) / (rho || 1)) * 180) / Math.PI;
    let lon = ((Math.atan2(x * Math.sin(c), rho * Math.cos(p0) * Math.cos(c) - y * Math.sin(p0) * Math.sin(c)) * 180) / Math.PI - rot.current.lon) % 360;
    if (lon > 180) lon -= 360;
    if (lon < -180) lon += 360;
    onPickCoordinate(activePin, `Orbital Pin (${lat.toFixed(1)}°, ${lon.toFixed(1)}°)`, Number(lat.toFixed(1)), Number(lon.toFixed(1)));
  };

  return (
    <div className="flex flex-col items-center w-full">
      {onPickCoordinate && (
        <div className="flex gap-1.5 bg-[#05070C] p-1 rounded-xl border border-white/15 text-[11px] font-mono-code mb-2">
          <button type="button" onClick={() => setActivePin('A')} className={`px-3 py-1 rounded-lg font-bold ${activePin === 'A' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'}`}>Pin A</button>
          <button type="button" onClick={() => setActivePin('B')} className={`px-3 py-1 rounded-lg font-bold ${activePin === 'B' ? 'bg-sky-400 text-slate-950' : 'text-slate-300'}`}>Pin B</button>
        </div>
      )}
      <div className="relative">
        <canvas
          ref={canvasRef} width={290} height={260} onClick={handleClick}
          onPointerDown={(e) => { rot.current.drag = true; rot.current.moved = false; rot.current.x = e.clientX; rot.current.y = e.clientY; }}
          onPointerMove={(e) => {
            if (!rot.current.drag) return;
            const dx = e.clientX - rot.current.x; const dy = e.clientY - rot.current.y;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) rot.current.moved = true;
            rot.current.lon = (rot.current.lon + dx * 0.45) % 360;
            rot.current.lat = Math.max(-55, Math.min(55, rot.current.lat + dy * 0.35));
            rot.current.x = e.clientX; rot.current.y = e.clientY;
          }}
          onPointerUp={() => { rot.current.drag = false; }} onPointerLeave={() => { rot.current.drag = false; }}
          className="w-full max-w-[285px] h-auto cursor-grab active:cursor-grabbing touch-none"
        />
        <button type="button" onClick={() => setAutoSpin(!autoSpin)} className="absolute bottom-2 right-2 text-[10px] font-mono-code bg-[#0D121E] border border-white/20 text-white px-2 py-1 rounded-lg flex items-center gap-1">
          <RotateCw className="w-3 h-3 text-amber-400" /> {autoSpin ? 'AUTO' : 'MANUAL'}
        </button>
      </div>
      {onSelectCase && !compact && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
          {HOTSPOTS.map((s) => (
            <button key={s.id} type="button" onClick={() => onSelectCase(DEMO_CASES.at(s.idx)!)} className="text-[11px] font-mono-code bg-[#0D121E] border border-white/15 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

