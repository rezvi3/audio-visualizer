import React from 'react';

interface HeroSectionProps {
  onOpenStudio?: () => void;
  heroParallax?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenStudio, heroParallax = 0 }) => {
  const letters = ['O', 'S', 'C', 'I', 'L', 'L', 'O'];

  return (
    <section
      id="hero"
      className="relative w-full h-[calc(100svh-64px)] min-h-[640px] bg-[#E4E4E2] text-[#0D0D0F] overflow-clip isolate flex flex-col justify-between pt-10 pb-0 px-6 md:px-12"
      style={{
        borderBottom: '1px solid rgba(13, 13, 15, 0.12)',
      }}
    >
      {/* Corner metadata pinned top-left / top-right */}
      <div className="absolute top-4 left-6 md:left-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] z-10 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]"></span>
        <span>SYS.REF // 0049-MKVII</span>
        <span className="hidden sm:inline-block text-[#0D0D0F]/20">/</span>
        <span className="hidden sm:inline-block">CALIBRATION PASS: 0.18MS</span>
      </div>

      <div className="absolute top-4 right-6 md:right-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] z-10 hidden md:block">
        COORD // 35°41'N 139°45'E
      </div>

      {/* Main Left Column Content */}
      <div className="relative z-10 max-w-xl lg:max-w-2xl pt-6 md:pt-10 flex flex-col gap-5">
        {/* Eyebrow */}
        <div className="reveal-init hero-reveal">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#43444A]">
            LABORATORY INSTRUMENT // ACOUSTIC ROTOR
          </p>
        </div>

        {/* Display Headline */}
        <div className="reveal-init hero-reveal delay-75">
          <h1 
            className="font-display font-black text-[#0D0D0F] tracking-[-0.048em] uppercase"
            style={{
              fontSize: 'clamp(34px, 5.1vw, 74px)',
              lineHeight: 0.88,
            }}
          >
            Sub-hertz mechanical trace of <span className="text-[#2F5BFF]">transient phenomena.</span>
          </h1>
        </div>

        {/* 38ch Lede */}
        <div className="reveal-init hero-reveal delay-150">
          <p className="text-[#43444A] text-sm md:text-base leading-relaxed max-w-[38ch]">
            Continuous optical tracking of high-frequency audio vectors. Machined from single-billet aluminum to eliminate resonant distortion and reveal true phase geometry.
          </p>
        </div>

        {/* Actions - Pill Buttons */}
        <div className="reveal-init hero-reveal delay-200 flex items-center gap-3.5 pt-2">
          <button
            onClick={onOpenStudio}
            className="rounded-full px-6 py-2.5 bg-[#0D0D0F] text-[#EFEFEE] font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-[#2F5BFF] transition-colors flex items-center gap-2 cursor-pointer shadow-none"
          >
            <span>LAUNCH STUDIO</span>
            <span className="text-[#7C97FF]">→</span>
          </button>
          <a
            href="#proof"
            className="rounded-full px-5 py-2.5 bg-transparent border border-[#0D0D0F]/20 text-[#0D0D0F] font-mono text-[11px] tracking-[0.14em] uppercase hover:border-[#0D0D0F] transition-colors cursor-pointer"
          >
            VIEW PROOF
          </a>
        </div>

        {/* Hairline-topped 3-line spec block */}
        <div className="reveal-init hero-reveal delay-300 mt-4 pt-4 border-t border-[#0D0D0F]/12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="block font-mono text-[9px] tracking-[0.16em] uppercase text-[#6E6F76]">LATENCY</span>
            <span className="font-mono text-[11px] tracking-[0.10em] text-[#0D0D0F] font-medium">0.18MS DUAL-AXIS</span>
          </div>
          <div>
            <span className="block font-mono text-[9px] tracking-[0.16em] uppercase text-[#6E6F76]">BANDWIDTH</span>
            <span className="font-mono text-[11px] tracking-[0.10em] text-[#0D0D0F] font-medium">DC TO 192.00 KHZ</span>
          </div>
          <div>
            <span className="block font-mono text-[9px] tracking-[0.16em] uppercase text-[#6E6F76]">JITTER</span>
            <span className="font-mono text-[11px] tracking-[0.10em] text-[#0D0D0F] font-medium">&lt; 0.0004% RMS</span>
          </div>
        </div>
      </div>

      {/* Layer 1: Occlusion Weave - Back Layer (Letters 0, 1, 2, 3, 4, 6 visible; Letter 5 hidden) */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none select-none z-[1] flex justify-between items-baseline px-2 md:px-6 overflow-hidden"
        style={{
          transform: `translateY(${heroParallax * 30}px)`,
          transition: 'transform 0.1s ease-out',
        }}
        aria-hidden="true"
      >
        {letters.map((char, idx) => (
          <span
            key={`back-${idx}`}
            className="font-display font-black text-[#0D0D0F] tracking-[-0.055em] uppercase leading-none"
            style={{
              fontSize: 'clamp(88px, 19.4vw, 310px)',
              lineHeight: 0.78,
              visibility: idx === 5 ? 'hidden' : 'visible',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Layer 2: Photographic Product Subject Sandwiched at z-index 2 */}
      <div
        className="absolute bottom-[-10px] md:bottom-[-20px] pointer-events-none select-none z-[2]"
        style={{
          right: '-4vw',
          width: 'min(58vw, 940px)',
          transform: `translateY(${heroParallax * -20}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <img
          src="/hero-transducer.png"
          alt="MK-VII Precision Acoustic Transducer"
          width={796}
          height={559}
          className="w-full h-auto object-contain block"
          style={{
            filter: 'drop-shadow(0 26px 34px rgba(13, 13, 15, 0.20))',
          }}
          loading="eager"
        />
      </div>

      {/* Layer 3: Occlusion Weave - Front Layer (Letter 5 visible; Letters 0, 1, 2, 3, 4, 6 hidden) */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none select-none z-[3] flex justify-between items-baseline px-2 md:px-6 overflow-hidden"
        style={{
          transform: `translateY(${heroParallax * 30}px)`,
          transition: 'transform 0.1s ease-out',
        }}
        aria-hidden="true"
      >
        {letters.map((char, idx) => (
          <span
            key={`front-${idx}`}
            className="font-display font-black text-[#0D0D0F] tracking-[-0.055em] uppercase leading-none"
            style={{
              fontSize: 'clamp(88px, 19.4vw, 310px)',
              lineHeight: 0.78,
              visibility: idx === 5 ? 'visible' : 'hidden',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </section>
  );
};
