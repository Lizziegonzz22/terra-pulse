import React, { useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { DEMO_CASES } from '../services/nasaPowerApi';
import { PresetCase } from '../types/climate';

interface Props {
  onSelectCase: (demo: PresetCase) => void;
}

const CONTINENTS: [number, number][][] = [
  [
    [-165, 65], [-140, 70], [-95, 72], [-65, 60], [-55, 48], [-75, 35],
    [-82, 25], [-97, 26], [-105, 20], [-118, 33], [-125, 49], [-145, 60],
  ],
  [
    [-78, 10], [-60, 8], [-35, -6], [-39, -18], [-53, -33], [-68, -54],
    [-75, -48], [-71, -18], [-81, -4],
  ],
  [
    [-52, 60], [-22, 70], [-18, 82], [-55, 81], [-60, 72],
  ],
  [
    [-9, 36],,,,,,,
,,,,,,,
  ],
  [
    [-17, 15], [-5, 35],,, [40, -15], [20, -34],
    [12, -16],, [-8, 5],
  ],
  [
    [114, -22], [132, -12], [152, -26], [146, -38], [116, -34],
  ],
];

const HOTSPOTS = [
  { id: 'uruguay', label: 'Río de la Plata (+Rain)', lat: -34.9, lon: -56.2, color: '#3B82F6', caseIdx: 0 },
  { id: 'chile', label: 'Central Chile (-Drought)', lat: -33.4, lon: -70.6, color: '#FF5A1F', caseIdx: 0 },
  { id: 'arctic', label: 'Svalbard (+3.4°C)', lat: 78.2, lon: 15.6, color: '#FF5A1F', caseIdx: 1 },
  { id: 'canada', label: 'Boreal Canada (Smoke)', lat: 54.5, lon: -105.5, color: '#F59E0B', caseIdx: 2 },
];

export const OrbitalGlobe: React.FC<Props> = ({ onSelectCase }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotLonRef = useRef<number>(62);
  const rotLatRef = useRef<number>(-12);
  const isDraggingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoSpin, setAutoSpin] = useState(true);

  useEffect(() => {
    let animId: number;
    let satAngle = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = 122;

      if (autoSpin && !isDraggingRef.current) {
        rotLonRef.current = (rotLonRef.current + 0.22) % 360;
      }
      satAngle = (satAngle + 0.018) % (Math.PI * 2);

      ctx.clearRect(0, 0, w, h);

      const project = (lonDeg: number, latDeg: number) => {
        const lambda = ((lonDeg + rotLonRef.current) * Math.PI) / 180;
        const phi = (latDeg * Math.PI) / 180;
        const phi0 = (rotLatRef.current * Math.PI) / 180;
        const cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda);
        const x = cx + radius * Math.cos(phi) * Math.sin(lambda);
        const y = cy - radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda));
        return { x, y, visible: cosc >= 0 };
      };

      const sphereGrad = ctx.createRadialGradient(cx - 38, cy - 38, 12, cx, cy, radius);
      sphereGrad.addColorStop(0, '#1E293B');
      sphereGrad.addColorStop(0.65, '#0F172A');
      sphereGrad.addColorStop(1, '#05070B');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 6) {
          const p = project(lon, lat);
          if (p.visible) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true; }
            else ctx.lineTo(p.x, p.y);
          } else started = false;
        }
        ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -85; lat <= 85; lat += 6) {
          const p = project(lon, lat);
          if (p.visible) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true; }
            else ctx.lineTo(p.x, p.y);
          } else started = false;
        }
        ctx.stroke();
      }

      CONTINENTS.forEach((poly) => {
        ctx.beginPath();
        let visibleCount = 0;
        poly.forEach(([lon, lat], idx) => {
          const p = project(lon, lat);
          if (p.visible) visibleCount++;
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        if (visibleCount > 1) {
          ctx.fillStyle = '#27272A';
          ctx.fill();
          ctx.strokeStyle = '#52525B';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      const pUru = project(-56.2, -34.9);
      const pChi = project(-70.6, -33.4);
      if (pUru.visible && pChi.visible) {
        ctx.beginPath();
        ctx.moveTo(pChi.x, pChi.y);
        ctx.quadraticCurveTo((pChi.x + pUru.x) / 2, pChi.y - 22, pUru.x, pUru.y);
        ctx.strokeStyle = '#FF5A1F';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      HOTSPOTS.forEach((spot) => {
        const p = project(spot.lon, spot.lat);
        if (p.visible) {
          ctx.fillStyle = spot.color;
          ctx.globalAlpha = 0.28;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      ctx.restore();

      ctx.strokeStyle = '#3F3F46';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      const satX = cx + Math.cos(satAngle) * 156;
      const satY = cy + Math.sin(satAngle) * 44 - Math.cos(satAngle) * 24;
      if (Math.sin(satAngle) > 0) {
        ctx.fillStyle = '#FF5A1F';
        ctx.beginPath();
        ctx.arc(satX, satY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
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
          width={340}
          height={300}
          onPointerDown={(e) => {
            isDraggingRef.current = true;
            lastPosRef.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerMove={(e) => {
            if (!isDraggingRef.current) return;
            const dx = e.clientX - lastPosRef.current.x;
            const dy = e.clientY - lastPosRef.current.y;
            rotLonRef.current = (rotLonRef.current + dx * 0.45) % 360;
            rotLatRef.current = Math.max(-55, Math.min(55, rotLatRef.current + dy * 0.35));
            lastPosRef.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={() => { isDraggingRef.current = false; }}
          onPointerLeave={() => { isDraggingRef.current = false; }}
          className="w-full max-w-[330px] h-auto cursor-grab active:cursor-grabbing touch-none"
        />
        <button
          type="button"
          onClick={() => setAutoSpin(!autoSpin)}
          className="absolute bottom-2 right-2 text-[10px] font-mono-code bg-[#18181B] border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:border-white transition"
        >
          <RotateCw className="w-3 h-3" />
          {autoSpin ? 'AUTO-ORBIT' : 'MANUAL'}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mt-2">
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            type="button"
            onClick={() => onSelectCase(DEMO_CASES.at(spot.caseIdx)!)}
            className="text-[11px] font-mono-code bg-[#18181B] hover:bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-zinc-200 transition"
          >
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: spot.color }} />
            {spot.label}
          </button>
        ))}
      </div>
    </div>
  );
};
