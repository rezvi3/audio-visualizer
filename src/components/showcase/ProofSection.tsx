import React, { useMemo } from 'react';

export const ProofSection: React.FC = () => {
  // Generate two synthetic comparative waveforms from summed sine terms
  const { refPath, calibratedPath } = useMemo(() => {
    const width = 800;
    const height = 280;
    const midY = height / 2;
    const pointsCount = 200;

    let pRef = `M 0,${midY}`;
    let pCal = `M 0,${midY}`;

    for (let i = 0; i <= pointsCount; i++) {
      const x = (i / pointsCount) * width;
      // Wandering uncalibrated trace with multi-harmonic flutter & drift
      const t = (i / pointsCount) * Math.PI * 8;
      const wander = 
        Math.sin(t * 0.9) * 38 +
        Math.sin(t * 2.3 + 1.2) * 22 +
        Math.sin(t * 4.7 + 0.5) * 14 +
        Math.cos(t * 9.1) * 8;
      const yRef = midY + wander;

      // Precision calibrated transducer trace: heavily damped, flat, sub-micron stability
      const damping = Math.sin(t * 0.9) * 2.8 + Math.cos(t * 3.1) * 1.2;
      const yCal = midY + damping;

      pRef += ` L ${x.toFixed(1)},${yRef.toFixed(1)}`;
      pCal += ` L ${x.toFixed(1)},${yCal.toFixed(1)}`;
    }

    return { refPath: pRef, calibratedPath: pCal };
  }, []);

  return (
    <section
      id="proof"
      className="relative w-full bg-[#0D0D0F] text-[#EFEFEE] py-24 px-6 md:px-12 border-b border-[#EFEFEE]/12 overflow-hidden isolate"
    >
      {/* Corner metadata pinned */}
      <div className="absolute top-6 left-6 md:left-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7C97FF]"></span>
        <span>SECTION // 02</span>
        <span className="text-[#EFEFEE]/20">/</span>
        <span>EMPIRICAL CALIBRATION PROOF</span>
      </div>

      <div className="absolute top-6 right-6 md:right-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] hidden md:block">
        TOLERANCE // ±0.0004%
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mt-6">
        {/* Left Column: Tabular Numerals & Descriptive Analysis */}
        <div className="lg:col-span-5 flex flex-col gap-6 reveal-init">
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#7C97FF]">
            INTERFEROMETRIC PHASE STABILITY
          </div>

          <div className="flex flex-col">
            <div 
              className="font-mono font-medium tracking-tight text-[#EFEFEE] leading-none"
              style={{ fontSize: 'clamp(56px, 8.5vw, 120px)' }}
            >
              0.0028
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-mono text-[12px] tracking-[0.16em] text-[#7C97FF] uppercase font-semibold">
                % RMS DEVIATION
              </span>
              <span className="text-[#6E6F76] text-xs">·</span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-[#6E6F76] uppercase">
                20Hz – 96kHz
              </span>
            </div>
          </div>

          <p className="text-[#EFEFEE]/70 text-sm leading-relaxed max-w-[42ch]">
            Continuous laser heterodyne measurement comparing traditional mechanical transducers against the MK-VII fluid-damped floating rotor. Residual phase variance is suppressed below detectable acoustic jitter thresholds.
          </p>

          <div className="pt-6 border-t border-[#EFEFEE]/12 grid grid-cols-2 gap-6">
            <div>
              <span className="block font-mono text-[9px] tracking-[0.16em] uppercase text-[#6E6F76]">CONVENTIONAL DRIFT</span>
              <span className="font-mono text-sm text-[#EFEFEE]/50 line-through">±1.4200° PHASE</span>
            </div>
            <div>
              <span className="block font-mono text-[9px] tracking-[0.16em] uppercase text-[#7C97FF]">MK-VII COHERENCE</span>
              <span className="font-mono text-sm text-[#EFEFEE] font-medium">±0.0019° PHASE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Waveform Traces SVG */}
        <div className="lg:col-span-7 flex flex-col gap-4 reveal-init delay-150">
          <div className="w-full bg-[#0D0D0F] border border-[#EFEFEE]/12 p-6 md:p-8 relative">
            {/* Diagram Title Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[#EFEFEE]/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7C97FF]"></span>
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#EFEFEE]">
                  COMPARATIVE TRANSDUCER DRIFT (40S RUN)
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.14em] text-[#6E6F76] uppercase">
                SAMPLE: 192,000 SPS
              </span>
            </div>

            {/* SVG Waveform Visualizer */}
            <div className="w-full aspect-[800/320] relative">
              <svg
                viewBox="0 0 800 320"
                className="w-full h-full overflow-visible"
                fill="none"
              >
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(239, 239, 238, 0.08)" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="800" y2="90" stroke="rgba(239, 239, 238, 0.08)" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(239, 239, 238, 0.16)" />
                <line x1="0" y1="190" x2="800" y2="190" stroke="rgba(239, 239, 238, 0.08)" strokeDasharray="4 4" />
                <line x1="0" y1="240" x2="800" y2="240" stroke="rgba(239, 239, 238, 0.08)" strokeDasharray="4 4" />

                {/* Vertical frequency boundaries */}
                <line x1="160" y1="20" x2="160" y2="260" stroke="rgba(239, 239, 238, 0.06)" />
                <line x1="360" y1="20" x2="360" y2="260" stroke="rgba(239, 239, 238, 0.06)" />
                <line x1="560" y1="20" x2="560" y2="260" stroke="rgba(239, 239, 238, 0.06)" />

                {/* Trace 1: Wandering Reference Curve */}
                <path
                  d={refPath}
                  stroke="rgba(239, 239, 238, 0.28)"
                  strokeWidth="1.25"
                  strokeDasharray="5 3"
                />

                {/* Trace 2: Calibrated MK-VII Signal Curve */}
                <path
                  d={calibratedPath}
                  stroke="#7C97FF"
                  strokeWidth="2.2"
                />

                {/* Reference center target marker */}
                <circle cx="400" cy="140" r="3" fill="#7C97FF" />
                <circle cx="400" cy="140" r="10" stroke="#7C97FF" strokeWidth="1" strokeDasharray="2 2" />

                {/* Delta Callout */}
                <line x1="400" y1="140" x2="400" y2="70" stroke="#7C97FF" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="360" y="48" width="80" height="18" fill="#0D0D0F" stroke="#7C97FF" strokeWidth="1" />
                <text x="400" y="61" fill="#7C97FF" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="middle" letterSpacing="0.1em">
                  Δ = 0.0004%
                </text>
              </svg>

              {/* Axis Labels */}
              <div className="flex justify-between font-mono text-[9px] tracking-[0.14em] text-[#6E6F76] uppercase mt-2 pt-2 border-t border-[#EFEFEE]/10">
                <span>10 HZ</span>
                <span>100 HZ</span>
                <span>1.0 KHZ (NULL REF)</span>
                <span>10 KHZ</span>
                <span>96 KHZ</span>
              </div>
            </div>

            {/* Trace Legend */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-[#EFEFEE]/10 font-mono text-[10px] tracking-[0.14em] uppercase">
              <div className="flex items-center gap-2 text-[#EFEFEE]/40">
                <span className="w-4 h-0.5 border-t border-dashed border-[#EFEFEE]/40"></span>
                <span>REFERENCE UNCALIBRATED (±1.420°)</span>
              </div>
              <div className="flex items-center gap-2 text-[#7C97FF]">
                <span className="w-4 h-0.5 bg-[#7C97FF]"></span>
                <span>MK-VII DAMPED ROTOR (±0.0019°)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
