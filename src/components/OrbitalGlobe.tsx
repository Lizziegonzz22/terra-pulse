import React from 'react';
import { DEMO_CASES } from '../services/nasaPowerApi';
import { PresetCase } from '../types/climate';

interface Props {
  onSelectCase: (demo: PresetCase) => void;
}

const HOTSPOTS = [
  {
    id: 'arctic',
    label: 'Svalbard (Arctic +3.4°C)',
    x: 235,
    y: 62,
    color: '#E07A5F',
    caseIdx: 1,
  },
  {
    id: 'canada',
    label: 'Boreal Canada (Wildfire Smoke)',
    x: 118,
    y: 102,
    color: '#F4A261',
    caseIdx: 2,
  },
  {
    id: 'uruguay',
    label: 'Río de la Plata (+Rainfall)',
    x: 162,
    y: 238,
    color: '#4EA8DE',
    caseIdx: 0,
  },
  {
    id: 'chile',
    label: 'Central Chile (-Megadrought)',
    x: 142,
    y: 235,
    color: '#E07A5F',
    caseIdx: 0,
  },
];

export const OrbitalGlobe: React.FC<Props> = ({ onSelectCase }) => {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      {/* Resplandor atmosférico */}
      <div className="absolute inset-6 rounded-full bg-[#3D85C6]/20 blur-2xl pointer-events-none" />

      <svg viewBox="0 0 360 320" className="w-full h-auto drop-shadow-2xl">
        <defs>
          <radialGradient id="earthOcean" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="55%" stopColor="#0F233C" />
            <stop offset="100%" stopColor="#07101E" />
          </radialGradient>
          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(78, 168, 222, 0)" />
            <stop offset="50%" stopColor="rgba(78, 168, 222, 0.85)" />
            <stop offset="100%" stopColor="rgba(224, 122, 95, 0.9)" />
          </linearGradient>
        </defs>

        {/* Estrellas de fondo */}
        {[, [320, 35], [45, 270], [315, 265], [180, 18], [340, 145], [20, 155],
        ].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r="1.4" fill="#CBD5E1" opacity="0.65" />
        ))}

        {/* Órbita trasera del satélite */}
        <ellipse
          cx="180"
          cy="160"
          rx="162"
          ry="52"
          transform="rotate(-22 180 160)"
          fill="none"
          stroke="rgba(148, 163, 184, 0.18)"
          strokeDasharray="4 4"
          strokeWidth="1.2"
        />

        {/* Esfera terrestre */}
        <circle
          cx="180"
          cy="160"
          r="112"
          fill="url(#earthOcean)"
          stroke="rgba(125, 211, 252, 0.35)"
          strokeWidth="1.5"
        />

        {/* Retícula de paralelos y meridianos */}
        <ellipse cx="180" cy="160" rx="112" ry="38" fill="none" stroke="rgba(148,163,184,0.12)" />
        <ellipse cx="180" cy="160" rx="112" ry="78" fill="none" stroke="rgba(148,163,184,0.12)" />
        <ellipse cx="180" cy="160" rx="52" ry="112" fill="none" stroke="rgba(148,163,184,0.12)" />

        {/* Siluetas estilizadas de continentes (América + Atlántico + Ártico) */}
        {/* América del Norte */}
        <path
          d="M95,88 Q118,75 142,86 L148,112 Q132,126 118,136 L106,120 Z"
          fill="#1E3F3B"
          stroke="#52B788"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        {/* América del Sur */}
        <path
          d="M140,175 Q164,178 175,204 Q168,236 150,256 Q140,235 136,205 Z"
          fill="#1E3F3B"
          stroke="#52B788"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        {/* Groenlandia / Ártico */}
        <path
          d="M192,58 Q222,52 246,66 Q230,82 204,78 Z"
          fill="#2B4C59"
          stroke="#93C5FD"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        {/* África / Europa borde */}
        <path
          d="M238,108 Q268,112 278,145 Q272,188 250,205 Q236,172 234,136 Z"
          fill="#1E3F3B"
          stroke="#52B788"
          strokeOpacity="0.35"
          strokeWidth="1"
        />

        {/* Arco de teleconexión entre Chile y Uruguay */}
        <path
          d="M142,235 Q152,216 162,238"
          fill="none"
          stroke="#E07A5F"
          strokeWidth="2"
          strokeDasharray="3 2"
        />

        {/* Órbita delantera del satélite NASA */}
        <path
          d="M 32,218 A 162,52 -22 0,0 328,102"
          fill="none"
          stroke="url(#orbitGrad)"
          strokeWidth="2"
        />

        {/* Ícono del Satélite NASA */}
        <g transform="translate(292, 114) rotate(-22)">
          <rect x="-14" y="-3" width="10" height="6" fill="#3D85C6" stroke="#BAE6FD" strokeWidth="0.8" />
          <rect x="4" y="-3" width="10" height="6" fill="#3D85C6" stroke="#BAE6FD" strokeWidth="0.8" />
          <rect x="-4" y="-5" width="8" height="10" rx="1.5" fill="#F8FAFC" />
          <circle cx="0" cy="6" r="2" fill="#E07A5F" />
        </g>

        {/* Puntos interactivos sobre la Tierra */}
        {HOTSPOTS.map((spot) => (
          <g
            key={spot.id}
            onClick={() => onSelectCase(DEMO_CASES.at(spot.caseIdx)!)}
            className="cursor-pointer group"
          >
            <circle cx={spot.x} cy={spot.y} r="11" fill={spot.color} opacity="0.22" />
            <circle
              cx={spot.x}
              cy={spot.y}
              r="4.5"
              fill={spot.color}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </g>
        ))}
      </svg>

      {/* Leyenda interactiva debajo del globo */}
      <div className="flex flex-wrap justify-center gap-2 mt-1">
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            type="button"
            onClick={() => onSelectCase(DEMO_CASES.at(spot.caseIdx)!)}
            className="text-[11px] font-mono-code bg-[#151C2C] hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-slate-200 transition"
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: spot.color }}
            />
            {spot.label}
          </button>
        ))}
      </div>
    </div>
  );
};
