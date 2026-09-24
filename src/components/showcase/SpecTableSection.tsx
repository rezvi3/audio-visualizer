import React from 'react';

interface SpecRow {
  label: string;
  value: string;
}

const SPECS: SpecRow[] = [
  {
    label: 'Transducer Architecture',
    value: 'Dual-coil opposed stator, fluid-damped floating rotor',
  },
  {
    label: 'Effective Bandwidth',
    value: 'DC to 192,000 Hz (±0.04 dB ref 1kHz)',
  },
  {
    label: 'Dynamic Range (A-wt)',
    value: '138.6 dB (24-bit/32-bit float internal)',
  },
  {
    label: 'Total Harmonic Distortion',
    value: '< 0.00018% THD+N (1.0V RMS, 20Hz–20kHz)',
  },
  {
    label: 'Rotational Slew Rate',
    value: '4,800 rad/s² max transient acceleration',
  },
  {
    label: 'Rotational Jitter (Flutter)',
    value: '< 0.0004% RMS (IEC 386 weighted standard)',
  },
  {
    label: 'Spindle Radial Runout',
    value: '< 0.045 μm TIR (Total Indicator Reading)',
  },
  {
    label: 'Optical Pickup Sensor',
    value: 'Dual orthogonal laser detectors (632.8nm)',
  },
  {
    label: 'Phase Linearity',
    value: '±0.0019° from 20 Hz to 96,000 Hz',
  },
  {
    label: 'Digital Audio Output',
    value: '192 kHz / 32-bit floating point class-compliant',
  },
  {
    label: 'Chassis Billet',
    value: 'Monolithic 6061-T6 CNC machined aluminum',
  },
  {
    label: 'Total Assembly Mass',
    value: '4.82 kg (including fluid-damped decoupled base)',
  },
];

export const SpecTableSection: React.FC = () => {
  return (
    <section
      id="specs"
      className="relative w-full bg-[#EFEFEE] text-[#0D0D0F] py-24 px-6 md:px-12 border-b border-[#0D0D0F]/12 overflow-hidden isolate"
    >
      {/* Corner metadata pinned */}
      <div className="absolute top-6 left-6 md:left-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]"></span>
        <span>SECTION // 06</span>
        <span className="text-[#0D0D0F]/20">/</span>
        <span>TECHNICAL SPECIFICATION MATRIX</span>
      </div>

      <div className="absolute top-6 right-6 md:right-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] hidden md:block">
        CERTIFICATION // ISO-9001 METROLOGY
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-10 mt-6">
        {/* Section Header */}
        <div className="flex flex-col gap-2 reveal-init">
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#2F5BFF]">
            METRIC TOLERANCES
          </div>
          <h2 
            className="font-display font-black uppercase tracking-[-0.04em]"
            style={{ fontSize: 'clamp(28px, 4.2vw, 56px)', lineHeight: 0.92 }}
          >
            Laboratory grade specifications.
          </h2>
        </div>

        {/* Hairline-Ruled Specification Grid: 12 Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 border-t border-[#0D0D0F]/12 reveal-init delay-150">
          {/* Column 1: Rows 0..5 */}
          <div className="flex flex-col">
            {SPECS.slice(0, 6).map((spec, i) => (
              <div
                key={`spec-col1-${i}`}
                className="py-4 border-b border-[#0D0D0F]/12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
              >
                <span className="text-sm text-[#43444A]">{spec.label}</span>
                <span className="font-mono text-xs sm:text-[13px] text-[#0D0D0F] font-medium tracking-[0.06em] text-right sm:text-left">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Column 2: Rows 6..11 */}
          <div className="flex flex-col">
            {SPECS.slice(6, 12).map((spec, i) => (
              <div
                key={`spec-col2-${i}`}
                className="py-4 border-b border-[#0D0D0F]/12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
              >
                <span className="text-sm text-[#43444A]">{spec.label}</span>
                <span className="font-mono text-xs sm:text-[13px] text-[#0D0D0F] font-medium tracking-[0.06em] text-right sm:text-left">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Calibration Verification Line */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[#6E6F76]">
          <span>VERIFIED BY HETERODYNE LASER VIBROMETRY</span>
          <span className="text-[#2F5BFF]">TRACEABLE TO NIST/PTB STANDARDS</span>
        </div>
      </div>
    </section>
  );
};
