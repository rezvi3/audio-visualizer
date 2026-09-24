import React from 'react';

interface CloseSectionProps {
  onOpenStudio?: () => void;
}

export const CloseSection: React.FC<CloseSectionProps> = ({ onOpenStudio }) => {
  const letters = ['O', 'S', 'C', 'I', 'L', 'L', 'O'];

  return (
    <section
      id="close"
      className="relative w-full bg-[#E4E4E2] text-[#0D0D0F] pt-24 pb-0 px-6 md:px-12 overflow-hidden isolate flex flex-col justify-between"
    >
      {/* Corner metadata pinned */}
      <div className="absolute top-6 left-6 md:left-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]"></span>
        <span>SECTION // 07</span>
        <span className="text-[#0D0D0F]/20">/</span>
        <span>FINAL METROLOGY GATE</span>
      </div>

      <div className="absolute top-6 right-6 md:right-12 font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] hidden md:block">
        BUILD // 1.0.4-RELEASE
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-10 mt-6 z-10">
        {/* Main Display Headline */}
        <div className="flex flex-col gap-4 reveal-init">
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#2F5BFF]">
            DIGITAL TWIN READY
          </div>
          <h2
            className="font-display font-black uppercase text-[#0D0D0F] tracking-[-0.05em] max-w-4xl"
            style={{
              fontSize: 'clamp(38px, 6.2vw, 86px)',
              lineHeight: 0.88,
            }}
          >
            Direct sensor coupling to the <span className="text-[#2F5BFF]">audio engine.</span>
          </h2>
        </div>

        {/* Monospaced Fine Print */}
        <div className="reveal-init delay-75 max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#43444A] leading-relaxed">
            CALIBRATION PROTOCOL VERIFIED. 192KHZ 32-BIT FLOATING AUDIO STREAMS SYNCHRONIZED DIRECTLY TO 15 HIGH-DIMENSIONAL LISSAJOUS PHASE VISUALIZERS AND 10 TIME-DOMAIN OSCILLOSCOPE MODES WITH LOW-LATENCY GPU ACCELERATION.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="reveal-init delay-150 flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onOpenStudio}
            className="rounded-full px-7 py-3 bg-[#0D0D0F] text-[#EFEFEE] font-mono text-xs tracking-[0.16em] uppercase hover:bg-[#2F5BFF] transition-colors flex items-center gap-2.5 cursor-pointer shadow-none"
          >
            <span>LAUNCH AUDIO-REACTIVE STUDIO</span>
            <span className="text-[#7C97FF]">→</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-full px-6 py-3 bg-transparent border border-[#0D0D0F]/20 text-[#0D0D0F] font-mono text-xs tracking-[0.16em] uppercase hover:border-[#0D0D0F] transition-colors cursor-pointer"
          >
            RETURN TO TOP ↑
          </button>
        </div>

        {/* 4-Item Footer Strip */}
        <div className="mt-16 pt-6 border-t border-[#0D0D0F]/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-[10px] tracking-[0.14em] uppercase text-[#6E6F76]">
          <div>© 2026 OSCILLO METROLOGY CORP.</div>
          <div>PATENT NO. US-2026-019948-A1</div>
          <div>LABS: TOKYO / ZÜRICH / SF</div>
          <div className="lg:text-right text-[#0D0D0F] font-medium">SPECIFICATION ARCHIVE V1.0.4</div>
        </div>
      </div>

      {/* Bookend Baseline-Cropped OSCILLO Wordmark */}
      <div 
        className="w-full flex justify-between items-baseline px-2 md:px-6 pointer-events-none select-none overflow-hidden mt-8"
        style={{
          transform: 'translateY(0.19em)',
        }}
        aria-hidden="true"
      >
        {letters.map((char, idx) => (
          <span
            key={`footer-word-${idx}`}
            className="font-display font-black text-[#0D0D0F] tracking-[-0.055em] uppercase leading-none opacity-90"
            style={{
              fontSize: 'clamp(84px, 19.5vw, 300px)',
              lineHeight: 0.76,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </section>
  );
};
