import React from 'react';

interface ShowcaseNavProps {
  onOpenStudio?: () => void;
}

export const ShowcaseNav: React.FC<ShowcaseNavProps> = ({ onOpenStudio }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-6 md:px-10 border-b border-[#0D0D0F]/12"
      style={{
        backgroundColor: 'rgba(239, 239, 238, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      {/* Brand mark */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <span className="font-display font-extrabold text-[16px] tracking-[-0.035em] text-[#0D0D0F]">
          OSCILLO<span className="text-[#2F5BFF]">.</span>
        </span>
        <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.16em] uppercase text-[#6E6F76] border-l border-[#0D0D0F]/12 pl-2.5 ml-1">
          PRECISION TRANSDUCER
        </span>
      </div>

      {/* Navigation Links and Action Pill */}
      <nav className="flex items-center gap-6 md:gap-8">
        <div className="hidden lg:flex items-center gap-7">
          <button
            onClick={() => scrollTo('hero')}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0D0D0F] border-b border-transparent hover:border-[#2F5BFF] transition-colors py-1 cursor-pointer"
          >
            TRANSDUCER
          </button>
          <button
            onClick={() => scrollTo('proof')}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0D0D0F] border-b border-transparent hover:border-[#2F5BFF] transition-colors py-1 cursor-pointer"
          >
            PROOF
          </button>
          <button
            onClick={() => scrollTo('stage')}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0D0D0F] border-b border-transparent hover:border-[#2F5BFF] transition-colors py-1 cursor-pointer"
          >
            STAGE
          </button>
          <button
            onClick={() => scrollTo('diagram')}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0D0D0F] border-b border-transparent hover:border-[#2F5BFF] transition-colors py-1 cursor-pointer"
          >
            DIAGRAM
          </button>
          <button
            onClick={() => scrollTo('specs')}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0D0D0F] border-b border-transparent hover:border-[#2F5BFF] transition-colors py-1 cursor-pointer"
          >
            SPECIFICATION
          </button>
        </div>

        {/* Action Pill Button */}
        <button
          onClick={onOpenStudio}
          className="rounded-full px-5 py-2 bg-[#0D0D0F] text-[#EFEFEE] font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-[#2F5BFF] transition-colors flex items-center gap-2 cursor-pointer shadow-none"
        >
          <span>LAUNCH STUDIO</span>
          <span className="text-[#7C97FF]">→</span>
        </button>
      </nav>
    </header>
  );
};
