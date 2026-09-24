import React from 'react';

export const TechnicalDiagramSection: React.FC = () => {
  return (
    <section
      id="diagram"
      className="relative w-full bg-[#E4E4E2] text-[#0D0D0F] py-24 px-6 md:px-12 border-b border-[#0D0D0F]/12 overflow-hidden isolate"
    >
      {/* Corner metadata pinned */}
      <div className="absolute top-6 left-6 md:left-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]"></span>
        <span>SECTION // 04</span>
        <span className="text-[#0D0D0F]/20">/</span>
        <span>SCHEMATIC & OPTICAL ASSEMBLY</span>
      </div>

      <div className="absolute top-6 right-6 md:right-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] hidden md:block">
        CAD REF // DWG-8804-REV.3
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-6">
        {/* Left Column: Structured Definition List */}
        <div className="lg:col-span-5 flex flex-col gap-2 reveal-init">
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#2F5BFF] mb-2">
            SUBSYSTEM TOPOLOGY
          </div>

          <h2 
            className="font-display font-black text-[#0D0D0F] uppercase tracking-[-0.04em] mb-4"
            style={{ fontSize: 'clamp(28px, 3.6vw, 48px)', lineHeight: 0.95 }}
          >
            Mechanical isolation across all axes.
          </h2>

          <div className="flex flex-col border-t border-[#0D0D0F]/12">
            {/* Item 01 */}
            <div className="py-5 border-b border-[#0D0D0F]/12 group">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#2F5BFF] mb-1">
                01 // DUAL-COIL BALANCED STATOR
              </div>
              <h3 className="font-display font-bold text-base text-[#0D0D0F] mb-1">
                Opposed Neodymium Flux Actuator
              </h3>
              <p className="text-sm text-[#43444A] leading-relaxed max-w-[42ch]">
                Twin high-purity copper windings positioned symmetrically around the spindle neutralize parasitic axial torques, eliminating wobble down to DC levels.
              </p>
            </div>

            {/* Item 02 */}
            <div className="py-5 border-b border-[#0D0D0F]/12 group">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#2F5BFF] mb-1">
                02 // QUARTZ REFERENCE REFLECTOR
              </div>
              <h3 className="font-display font-bold text-base text-[#0D0D0F] mb-1">
                Laser-Grade Monocrystalline Mirror
              </h3>
              <p className="text-sm text-[#43444A] leading-relaxed max-w-[42ch]">
                Sub-nanometer flatness standard (<span className="font-mono text-xs">λ/20</span> at 632.8nm) reflects dual orthogonal laser tracks directly onto high-speed optical position detectors.
              </p>
            </div>

            {/* Item 03 */}
            <div className="py-5 border-b border-[#0D0D0F]/12 group">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#2F5BFF] mb-1">
                03 // EDDY-CURRENT FLUID DAMPING
              </div>
              <h3 className="font-display font-bold text-base text-[#0D0D0F] mb-1">
                Non-Contact Magnetic Dissipation
              </h3>
              <p className="text-sm text-[#43444A] leading-relaxed max-w-[42ch]">
                Passive conductive rings generate counter-electromotive braking directly proportional to velocity, preventing overshoot without mechanical friction or wear.
              </p>
            </div>

            {/* Item 04 */}
            <div className="py-5 border-b border-[#0D0D0F]/12 group">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#2F5BFF] mb-1">
                04 // 0.08MM VACUUM FLUID GAP
              </div>
              <h3 className="font-display font-bold text-base text-[#0D0D0F] mb-1">
                Micro-Gap Boundary Isolation
              </h3>
              <p className="text-sm text-[#43444A] leading-relaxed max-w-[42ch]">
                Synthetic perfluoropolyether boundary layer isolates external chassis acoustic vibrations from contaminating the rotating transducer core.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: To-Scale SVG Technical Line Diagram */}
        <div className="lg:col-span-7 reveal-init delay-150">
          <div className="w-full bg-[#E4E4E2] border border-[#0D0D0F]/15 p-6 md:p-8 relative">
            {/* Header info strip */}
            <div className="flex justify-between items-center pb-4 border-b border-[#0D0D0F]/10 mb-6">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#0D0D0F] font-semibold">
                CROSS-SECTION // ROTATIONAL AXIS Z=0.00
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-[#6E6F76] uppercase">
                SCALE 1:1.25 // METRIC
              </span>
            </div>

            {/* SVG Engineering CAD Drawing */}
            <div className="w-full aspect-[4/3] relative">
              <svg
                viewBox="0 0 600 450"
                className="w-full h-full overflow-visible"
                fill="none"
              >
                {/* Hairline Construction Grid & Geometry */}
                <rect x="30" y="30" width="540" height="390" stroke="rgba(13,13,15,0.08)" strokeDasharray="6 6" />
                <line x1="300" y1="15" x2="300" y2="435" stroke="rgba(13,13,15,0.20)" strokeDasharray="8 4" />
                <line x1="15" y1="225" x2="585" y2="225" stroke="rgba(13,13,15,0.20)" strokeDasharray="8 4" />

                {/* Outer concentric construction radii */}
                <circle cx="300" cy="225" r="190" stroke="rgba(13,13,15,0.12)" strokeDasharray="4 4" />
                <circle cx="300" cy="225" r="150" stroke="rgba(13,13,15,0.18)" />
                <circle cx="300" cy="225" r="110" stroke="rgba(13,13,15,0.15)" strokeDasharray="3 3" />
                <circle cx="300" cy="225" r="70" stroke="rgba(13,13,15,0.25)" strokeWidth="1.5" />
                <circle cx="300" cy="225" r="28" stroke="rgba(13,13,15,0.35)" strokeWidth="1.5" />

                {/* Core spindle & bearings */}
                <rect x="290" y="80" width="20" height="290" stroke="#0D0D0F" strokeWidth="1.5" fill="none" />
                <circle cx="300" cy="225" r="5" fill="#0D0D0F" />

                {/* Stator electromagnetic coil blocks */}
                <rect x="150" y="195" width="40" height="60" stroke="#0D0D0F" strokeWidth="1.5" fill="none" />
                <line x1="150" y1="205" x2="190" y2="205" stroke="rgba(13,13,15,0.4)" />
                <line x1="150" y1="215" x2="190" y2="215" stroke="rgba(13,13,15,0.4)" />
                <line x1="150" y1="235" x2="190" y2="235" stroke="rgba(13,13,15,0.4)" />
                <line x1="150" y1="245" x2="190" y2="245" stroke="rgba(13,13,15,0.4)" />

                <rect x="410" y="195" width="40" height="60" stroke="#0D0D0F" strokeWidth="1.5" fill="none" />
                <line x1="410" y1="205" x2="450" y2="205" stroke="rgba(13,13,15,0.4)" />
                <line x1="410" y1="215" x2="450" y2="215" stroke="rgba(13,13,15,0.4)" />
                <line x1="410" y1="235" x2="450" y2="235" stroke="rgba(13,13,15,0.4)" />
                <line x1="410" y1="245" x2="450" y2="245" stroke="rgba(13,13,15,0.4)" />

                {/* Optical laser trace paths */}
                <line x1="300" y1="225" x2="475" y2="95" stroke="#2F5BFF" strokeWidth="1.5" />
                <line x1="300" y1="225" x2="125" y2="355" stroke="#2F5BFF" strokeWidth="1.5" strokeDasharray="4 2" />

                {/* Fiducial Accent Dots (#2F5BFF) */}
                <circle cx="300" cy="225" r="3.5" fill="#2F5BFF" />
                <circle cx="475" cy="95" r="3.5" fill="#2F5BFF" />
                <circle cx="150" cy="195" r="3" fill="#2F5BFF" />
                <circle cx="450" cy="255" r="3" fill="#2F5BFF" />
                <circle cx="300" cy="370" r="3" fill="#2F5BFF" />

                {/* Leader Lines and Dimension Callouts */}
                {/* 1. Rotor Outer Callout */}
                <polyline points="450,225 490,225 530,190" stroke="#0D0D0F" strokeWidth="1" />
                <text x="535" y="186" fill="#0D0D0F" fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="0.1em">
                  ROTOR Ø 148.00MM
                </text>

                {/* 2. Air Gap Callout */}
                <polyline points="190,225 210,225 230,170" stroke="#0D0D0F" strokeWidth="1" />
                <text x="180" y="160" fill="#2F5BFF" fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="0.1em">
                  AIR GAP: 0.08MM
                </text>

                {/* 3. Optical Sensor Callout */}
                <polyline points="475,95 510,95" stroke="#2F5BFF" strokeWidth="1" />
                <text x="515" y="98" fill="#2F5BFF" fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="0.1em">
                  LASER PICKUP (632.8NM)
                </text>

                {/* 4. Spindle Bearing Callout */}
                <polyline points="300,370 340,400" stroke="#0D0D0F" strokeWidth="1" />
                <text x="345" y="405" fill="#6E6F76" fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="0.1em">
                  MAGNETIC BEARING REST
                </text>
              </svg>
            </div>

            {/* Bottom diagram notes strip */}
            <div className="flex justify-between items-center font-mono text-[9px] tracking-[0.14em] text-[#6E6F76] uppercase pt-4 border-t border-[#0D0D0F]/10">
              <span>ALL DIMENSIONS IN MILLIMETERS</span>
              <span className="text-[#2F5BFF]">CONFIDENTIAL LAB SCHEMATIC</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
