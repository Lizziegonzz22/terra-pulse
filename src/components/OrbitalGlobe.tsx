import React, { useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { DEMO_CASES } from '../services/nasaPowerApi';
import { PresetCase } from '../types/climate';

interface Props {
  onSelectCase: (demo: PresetCase) => void;
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

const CONTINENTS: [number, number][][] = LAND_DATA.map((str) => {
  const pts = str.split(' ').map((p) => {
    const pair = p.split(',');
    return [Number(pair.at(0)), Number(pair.at(1))] as [number, number];
  });
  const smooth: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts.at(i)!;
    const b = pts.at((i + 1) % pts.length)!;
    const ax = a.at(0)!;
    const ay = a.at(1)!;
    const bx = b.at(0)!;
    const by = b.at(1)!;
    for (let s = 0; s < 5; s++) {
      const t = s / 5;
      smooth.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
    }
  }
  return smooth;
});

const HOTSPOTS = [
  { id: 'uru', label: 'Río de la Plata (+Rain)', lat: -34.9, lon: -56.2, color: '#38BDF8', idx: 0 },
  { id: 'chi', label: 'Central Chile (-Drought)', lat: -33.4, lon: -70.6, color: '#818CF8', idx: 0 },
  { id: 'arc', label: 'Svalbard (+3.4°C)', lat: 78.2, lon: 15.6, color: '#60A5FA', idx: 1 },
  { id: 'can', label: 'Boreal Canada (Smoke)', lat: 54.5, lon: -105.5, color: '#93C5FD', idx: 2 },
];

export const OrbitalGlobe: React.FC<Props> = ({ onSelectCase }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rot = useRef({ lon: 55, lat: -12, drag: false, x: 0, y: 0 });
  const [autoSpin, setAutoSpin] = useState(true);

  useEffect(() => {
    let animId: number;
    let sat = 0;
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 118;

      if (autoSpin && !rot.current.drag) rot.current.lon = (rot.current.lon + 0.25) % 360;
      sat = (sat + 0.016) % (Math.PI * 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const proj = (lonDeg: number, latDeg: number) => {
        const lam = ((lonDeg + rot.current.lon) * Math.PI) / 180;
        const phi = (latDeg * Math.PI) / 180;
        const p0 = (rot.current.lat * Math.PI) / 180;
        const cosc = Math.sin(p0) * Math.sin(phi) + Math.cos(p0) * Math.cos(phi) * Math.cos(lam);
        let dx = Math.cos(phi) * Math.sin(lam);
        let dy = -(Math.cos(p0) * Math.sin(phi) - Math.sin(p0) * Math.cos(phi) * Math.cos(lam));
        if (cosc < 0) {
          const len = Math.hypot(dx, dy) || 1;
          dx /= len;
          dy /= len;
        }
        return { x: cx + r * dx, y: cy + r * dy, vis: cosc >= 0 };
      };

      const bg = ctx.createRadialGradient(cx - 35, cy - 35, 12, cx, cy, r);
      bg.addColorStop(0, '#1E293B');
      bg.addColorStop(1, '#0B1120');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let st = false;
        for (let lon = -180; lon <= 180; lon += 10) {
          const p = proj(lon, lat);
          if (p.vis) { st ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); st = true; }
          else st = false;
        }
        ctx.stroke();
      }

      CONTINENTS.forEach((poly) => {
        if (!poly.some((pt) => proj(pt.at(0)!, pt.at(1)!).vis)) return;
        ctx.beginPath();
        poly.forEach((pt, i) => {
          const p = proj(pt.at(0)!, pt.at(1)!);
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = '#25334D';
        ctx.fill();
        ctx.strokeStyle = '#60A5FA';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      HOTSPOTS.forEach((s) => {
        const p = proj(s.lon, s.lat);
        if (p.vis) {
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      ctx.restore();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      if (Math.sin(sat) > 0) {
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(sat) * 148, cy + Math.sin(sat) * 38 - Math.cos(sat) * 20, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [autoSpin]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={320}
          height={280}
          onPointerDown={(e) => { rot.current.drag = true; rot.current.x = e.clientX; rot.current.y = e.clientY; }}
          onPointerMove={(e) => {
            if (!rot.current.drag) return;
            rot.current.lon = (rot.current.lon + (e.clientX - rot.current.x) * 0.45) % 360;
            rot.current.lat = Math.max(-55, Math.min(55, rot.current.lat + (e.clientY - rot.current.y) * 0.35));
            rot.current.x = e.clientX;
            rot.current.y = e.clientY;
          }}
          onPointerUp={() => { rot.current.drag = false; }}
          onPointerLeave={() => { rot.current.drag = false; }}
          className="w-full max-w-[310px] h-auto cursor-grab active:cursor-grabbing touch-none"
        />
        <button
          type="button"
          onClick={() => setAutoSpin(!autoSpin)}
          className="absolute bottom-2 right-2 text-[10px] font-mono-code bg-[#161D2C] border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1"
        >
          <RotateCw className="w-3 h-3 text-sky-400" /> {autoSpin ? 'AUTO' : 'MANUAL'}
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 mt-2">
        {HOTSPOTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectCase(DEMO_CASES.at(s.idx)!)}
            className="text-[11px] font-mono-code bg-[#161D2C] hover:bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-slate-200"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /> {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
