import React, { useState } from 'react';

interface FinishPreset {
  id: string;
  name: string;
  code: string;
  bg: string;
  text: string;
  accent: string;
  desc: string;
  alloy: string;
  treatment: string;
  reflectance: string;
}

const FINISHES: FinishPreset[] = [
  {
    id: 'aluminum',
    name: 'RAW ALUMINUM',
    code: 'FIN-6061-T6',
    bg: '#EFEFEE',
    text: '#0D0D0F',
    accent: '#2F5BFF',
    desc: 'Billet 6061 aerospace alloy micro-bead blasted with natural passivation.',
    alloy: 'Al-Mg-Si Structural Alloy',
    treatment: 'Bead-Blasted Satin Passivation',
    reflectance: '18% Diffuse Lambertian',
  },
  {
    id: 'stage',
    name: 'DIMMER STAGE',
    code: 'FIN-7075-STG',
    bg: '#E4E4E2',
    text: '#0D0D0F',
    accent: '#2F5BFF',
    desc: 'Heavy-damped stage ground for calibrated photometric studio environments.',
    alloy: 'Al-Zn-Mg-Cu High Tensile',
    treatment: 'Micro-Vapour Etch Finish',
    reflectance: '12% Low-Scatter Matte',
  },
  {
    id: 'graphite',
    name: 'DEEP GRAPHITE',
    code: 'FIN-GRAPH-ISO',
    bg: '#1E1F24',
    text: '#F2F2F0',
    accent: '#7C97FF',
    desc: 'Isostatic high-density synthetic graphite for extreme RF shielding.',
    alloy: 'Ultra-Fine Grain Carbon Matrix',
    treatment: 'Sub-Micron Diamond Lapping',
    reflectance: '4% Specular Carbon',
  },
  {
    id: 'ink',
    name: 'INVERTED INK',
    code: 'FIN-DLC-BLACK',
    bg: '#0D0D0F',
    text: '#EFEFEE',
    accent: '#7C97FF',
    desc: 'Diamond-like carbon (DLC) coating with complete optical null absorption.',
    alloy: 'Titanium-Infiltrated DLC',
    treatment: 'Plasma-Enhanced CVD Deposition',
    reflectance: '< 0.5% Total Absorbance',
  },
];

export const FieldSwapPickerSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('aluminum');

  const currentFinish = FINISHES.find((f) => f.id === selectedId) || FINISHES[0];

  return (
    <section
      id="finishes"
      className="relative w-full py-24 px-6 md:px-12 border-b overflow-hidden isolate"
      style={{
        backgroundColor: currentFinish.bg,
        color: currentFinish.text,
        borderColor: 'color-mix(in srgb, currentColor 14%, transparent)',
        transition: 'background-color 0.7s cubic-bezier(0.16, 1, 0.3, 1), color 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Corner metadata pinned */}
      <div 
        className="absolute top-6 left-6 md:left-12 font-mono text-[10px] tracking-[0.16em] uppercase flex items-center gap-3 opacity-60"
      >
        <span 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: currentFinish.accent }}
        ></span>
        <span>SECTION // 05</span>
        <span>/</span>
        <span>CHASSIS FIELD-SWAP PICKER</span>
      </div>

      <div className="absolute top-6 right-6 md:right-12 font-mono text-[10px] tracking-[0.16em] uppercase opacity-60 hidden md:block">
        ACTIVE RUNTIME STATE: {currentFinish.code}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-12 mt-6">
        {/* Top Header & Finish Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 reveal-init">
          <div className="flex flex-col gap-2 max-w-xl">
            <div 
              className="font-mono text-[11px] tracking-[0.16em] uppercase"
              style={{ color: currentFinish.accent }}
            >
              CHASSIS ALLOY SPECIFICATION
            </div>
            <h2 
              className="font-display font-black uppercase tracking-[-0.04em]"
              style={{ fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 0.92 }}
            >
              Four calibrated material environments.
            </h2>
            <p className="text-sm opacity-70 leading-relaxed max-w-[45ch] mt-1">
              Select an enclosure field to dynamically re-index refractive properties and thermal dissipation profiles in real time.
            </p>
          </div>

          {/* Pill Switcher Buttons */}
          <div 
            className="flex flex-wrap gap-2 p-1.5 rounded-full"
            style={{
              backgroundColor: 'color-mix(in srgb, currentColor 8%, transparent)',
              border: '1px solid color-mix(in srgb, currentColor 16%, transparent)',
            }}
          >
            {FINISHES.map((finish) => {
              const isActive = finish.id === currentFinish.id;
              return (
                <button
                  key={finish.id}
                  onClick={() => setSelectedId(finish.id)}
                  className="rounded-full px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? 'currentColor' : 'transparent',
                    color: isActive ? currentFinish.bg : 'currentColor',
                    opacity: isActive ? 1 : 0.75,
                  }}
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    {isActive && (
                      <span 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: currentFinish.accent }}
                      />
                    )}
                    {finish.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Cell Definition Panel with color-mix(in srgb, currentColor 24%, transparent) borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 reveal-init delay-150">
          {/* Cell 1: Structural Alloy */}
          <div 
            className="p-8 flex flex-col justify-between min-h-[220px]"
            style={{
              border: '1px solid color-mix(in srgb, currentColor 24%, transparent)',
            }}
          >
            <div className="flex flex-col gap-2">
              <span 
                className="font-mono text-[10px] tracking-[0.16em] uppercase"
                style={{ color: currentFinish.accent }}
              >
                PARAMETER // 01
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase opacity-50">
                METALLURGICAL BASE
              </span>
            </div>
            <div>
              <div className="font-display font-bold text-xl uppercase tracking-tight mb-2">
                {currentFinish.alloy}
              </div>
              <p className="text-xs opacity-70 leading-relaxed">
                Machined from homogenous billet without voids or internal shear crystallization planes.
              </p>
            </div>
          </div>

          {/* Cell 2: Surface Treatment */}
          <div 
            className="p-8 flex flex-col justify-between min-h-[220px] md:border-l-0"
            style={{
              border: '1px solid color-mix(in srgb, currentColor 24%, transparent)',
            }}
          >
            <div className="flex flex-col gap-2">
              <span 
                className="font-mono text-[10px] tracking-[0.16em] uppercase"
                style={{ color: currentFinish.accent }}
              >
                PARAMETER // 02
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase opacity-50">
                SURFACE PASSIVATION
              </span>
            </div>
            <div>
              <div className="font-display font-bold text-xl uppercase tracking-tight mb-2">
                {currentFinish.treatment}
              </div>
              <p className="text-xs opacity-70 leading-relaxed">
                Chemical vapour passivated with zero-dielectric boundary to inhibit static charge accumulation.
              </p>
            </div>
          </div>

          {/* Cell 3: Optical Scattering */}
          <div 
            className="p-8 flex flex-col justify-between min-h-[220px] md:border-l-0"
            style={{
              border: '1px solid color-mix(in srgb, currentColor 24%, transparent)',
            }}
          >
            <div className="flex flex-col gap-2">
              <span 
                className="font-mono text-[10px] tracking-[0.16em] uppercase"
                style={{ color: currentFinish.accent }}
              >
                PARAMETER // 03
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase opacity-50">
                OPTICAL RESPONSE
              </span>
            </div>
            <div>
              <div className="font-display font-bold text-xl uppercase tracking-tight mb-2">
                {currentFinish.reflectance}
              </div>
              <p className="text-xs opacity-70 leading-relaxed">
                Engineered for maximum laser pickup contrast without stray optical reflections or phase flares.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Spec Footer */}
        <div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 font-mono text-[10px] tracking-[0.14em] uppercase opacity-60"
          style={{
            borderTop: '1px solid color-mix(in srgb, currentColor 14%, transparent)',
          }}
        >
          <span>SURFACE DISSIPATION // 48.2 W/M²·K</span>
          <span>RESONANCE SUPPRESSION // -42.8 DB Q-FACTOR</span>
          <span style={{ color: currentFinish.accent }}>PASSIVE AIR COOLED</span>
        </div>
      </div>
    </section>
  );
};
