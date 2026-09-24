import React, { useRef } from 'react';
import { ShowcaseNav } from './ShowcaseNav';
import { HeroSection } from './HeroSection';
import { ProofSection } from './ProofSection';
import { CounterTravelStage } from './CounterTravelStage';
import { TechnicalDiagramSection } from './TechnicalDiagramSection';
import { FieldSwapPickerSection } from './FieldSwapPickerSection';
import { SpecTableSection } from './SpecTableSection';
import { CloseSection } from './CloseSection';
import { useShowcaseScroll } from '../../hooks/useShowcaseScroll';

interface ShowcasePageProps {
  onOpenStudio: () => void;
}

export const ShowcasePage: React.FC<ShowcasePageProps> = ({ onOpenStudio }) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { heroParallax, stageProgress, stageAngle, stageRpm } = useShowcaseScroll(stageRef);

  return (
    <div className="relative w-full min-h-screen bg-[#EFEFEE] text-[#0D0D0F] font-sans overflow-x-hidden selection:bg-[#2F5BFF] selection:text-white">
      {/* 1. Fixed 64px Navigation Bar */}
      <ShowcaseNav onOpenStudio={onOpenStudio} />

      {/* Main Content with 64px Top Offset */}
      <main className="pt-16">
        {/* Section 1: Hero with Type and Subject Occlusion Weave */}
        <HeroSection onOpenStudio={onOpenStudio} heroParallax={heroParallax} />

        {/* Section 2: Inverted Proof Section on Ink Ground */}
        <ProofSection />

        {/* Section 3: Pinned Counter-Travel Stage (320vh) */}
        <CounterTravelStage
          stageRef={stageRef}
          stageProgress={stageProgress}
          stageAngle={stageAngle}
          stageRpm={stageRpm}
        />

        {/* Section 4: Technical Diagram and Optical Assembly */}
        <TechnicalDiagramSection />

        {/* Section 5: Runtime Field-Swap Chassis Picker */}
        <FieldSwapPickerSection />

        {/* Section 6: Spec Table Matrix */}
        <SpecTableSection />

        {/* Section 7: Metrology Close and Bookend Wordmark */}
        <CloseSection onOpenStudio={onOpenStudio} />
      </main>
    </div>
  );
};
