import React from 'react';

interface CounterTravelStageProps {
  stageRef: React.RefObject<HTMLDivElement | null>;
  stageProgress: number; // 0 to 1
  stageAngle: number; // 0 to 360
  stageRpm: number; // RPM
}

export const CounterTravelStage: React.FC<CounterTravelStageProps> = ({
  stageRef,
  stageProgress,
  stageAngle,
  stageRpm,
}) => {
  // Counter travel calculation:
  // Marquee moves horizontally in counter-direction as user scrolls
  const marqueeOffset = (0.5 - stageProgress) * 45; // in vw percent
  const rad = (stageAngle * Math.PI) / 180;

  return (
    <section
      id="stage"
      ref={stageRef}
      className="relative w-full h-[320vh] bg-[#EFEFEE] text-[#0D0D0F] border-b border-[#0D0D0F]/12"
    >
      {/* Sticky 100svh Stage Viewport */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between p-6 md:p-12 select-none isolate">
        {/* Top pinned metadata bar */}
        <div className="relative z-20 flex justify-between items-start font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]"></span>
            <span>SECTION // 03</span>
            <span className="text-[#0D0D0F]/20">/</span>
            <span>PINNED COUNTER-TRAVEL STAGE</span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-[#0D0D0F] font-medium">
              ROTATION // {stageAngle.toFixed(1).padStart(5, '0')}°
            </div>
            <div className="text-[#2F5BFF]">
              VELOCITY // {stageRpm.toFixed(2)} RPM
            </div>
          </div>
        </div>

        {/* Center Reticle and Counter-Travel System */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          {/* Hairline Center Reticle & Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-full h-[1px] bg-[#0D0D0F]/15"></div>
            <div className="absolute h-full w-[1px] bg-[#0D0D0F]/15"></div>
            <div className="absolute w-[min(65vw,700px)] h-[min(65vw,700px)] rounded-full border border-dashed border-[#0D0D0F]/20"></div>
            <div className="absolute w-[min(75vw,820px)] h-[min(75vw,820px)] rounded-full border border-[#0D0D0F]/10"></div>
          </div>

          {/* Background Marquee Counter-Traveling Horizontally */}
          <div
            className="absolute whitespace-nowrap pointer-events-none select-none z-[1] opacity-25"
            style={{
              transform: `translateX(${marqueeOffset}vw)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <span 
              className="font-display font-black text-[#0D0D0F] uppercase tracking-[-0.04em]"
              style={{ fontSize: 'clamp(90px, 15vw, 240px)', lineHeight: 0.8 }}
            >
              SYNCHRONOUS GYRO // DUAL COIL ROTOR // HARMONIC STABILITY // 
            </span>
            <span 
              className="font-display font-black text-[#0D0D0F] uppercase tracking-[-0.04em]"
              style={{ fontSize: 'clamp(90px, 15vw, 240px)', lineHeight: 0.8 }}
            >
              SYNCHRONOUS GYRO // DUAL COIL ROTOR // HARMONIC STABILITY // 
            </span>
          </div>

          {/* Central Rotating Rotor Disc */}
          <div
            className="relative z-10 flex items-center justify-center pointer-events-none"
            style={{
              width: 'min(56vw, 600px)',
              maxWidth: '600px',
              transform: `rotate(${stageAngle}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <img
              src="/rotor-disc.png"
              alt="Precision Machined Rotor Disc"
              width={934}
              height={934}
              className="w-full h-auto object-contain block drop-shadow-2xl"
              loading="lazy"
            />
          </div>

          {/* Live Orbiting Phase Indicator Accent Dot */}
          <div
            className="absolute w-[min(58vw,620px)] h-[min(58vw,620px)] pointer-events-none z-20 flex items-center justify-center"
            style={{
              transform: `rotate(${stageAngle}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#2F5BFF] shadow-[0_0_8px_rgba(47,91,255,0.6)]"></div>
          </div>
        </div>

        {/* Bottom Pinned Telemetry Row */}
        <div className="relative z-20 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#0D0D0F]/12 font-mono text-[10px] tracking-[0.14em] uppercase text-[#6E6F76]">
          <div>
            <span className="block text-[#0D0D0F]/50">STAGE PROGRESS</span>
            <span className="text-[#0D0D0F] font-medium font-mono text-[11px]">
              {(stageProgress * 100).toFixed(1)}% SCROLLED
            </span>
          </div>
          <div>
            <span className="block text-[#0D0D0F]/50">PHASE ANGLE (φ)</span>
            <span className="text-[#0D0D0F] font-medium font-mono text-[11px]">
              {rad.toFixed(4)} RAD
            </span>
          </div>
          <div>
            <span className="block text-[#0D0D0F]/50">BEARING COEFFICIENT</span>
            <span className="text-[#0D0D0F] font-medium font-mono text-[11px]">
              0.00012 DYN·S/CM
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[#0D0D0F]/50">SYSTEM MODE</span>
            <span className="text-[#2F5BFF] font-medium font-mono text-[11px]">
              ACTIVE DAMPED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
