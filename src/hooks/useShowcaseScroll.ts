import { useEffect, useState, useRef } from 'react';

export interface ShowcaseScrollState {
  scrollY: number;
  heroParallax: number; // 0 to 1
  stageProgress: number; // 0 to 1 for the 320vh counter-travel section
  stageAngle: number; // in degrees
  stageRpm: number; // calculated instantaneous angular velocity
}

export function useShowcaseScroll(stageRef?: React.RefObject<HTMLDivElement | null>) {
  const [scrollState, setScrollState] = useState<ShowcaseScrollState>({
    scrollY: 0,
    heroParallax: 0,
    stageProgress: 0,
    stageAngle: 0,
    stageRpm: 0,
  });

  const lastScrollTime = useRef<number>(Date.now());
  const lastScrollY = useRef<number>(0);
  const velocityEma = useRef<number>(0);

  useEffect(() => {
    // 1. Motion preference check & class injection
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mediaQuery.matches;

    if (!isReduced) {
      document.documentElement.classList.add('js');
    }

    // 2. IntersectionObserver for reveal sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.05,
      }
    );

    const revealElements = document.querySelectorAll('.reveal-init:not(.hero-reveal)');
    revealElements.forEach((el) => observer.observe(el));

    // 3. Hero elements reveal immediately on next rAF per specification
    const rafId = requestAnimationFrame(() => {
      const heroElements = document.querySelectorAll('.hero-reveal');
      heroElements.forEach((el) => el.classList.add('in'));
    });

    // 4. Passive rAF-throttled scroll listener
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const viewportH = window.innerHeight;
          const now = Date.now();
          const dt = Math.max(16, now - lastScrollTime.current);
          const dy = Math.abs(currentY - lastScrollY.current);

          // Calculate instantaneous scroll velocity smoothed with EMA
          const instantRpm = (dy / dt) * 60; // rough mechanical translation
          velocityEma.current = velocityEma.current * 0.8 + instantRpm * 0.2;

          lastScrollTime.current = now;
          lastScrollY.current = currentY;

          // Hero parallax progress (0 to 1 over first 80% of viewport)
          const heroP = Math.min(1, Math.max(0, currentY / (viewportH * 0.8)));

          // Stage progress (counter-travel section)
          let stageP = 0;
          if (stageRef?.current) {
            const rect = stageRef.current.getBoundingClientRect();
            const totalTravel = stageRef.current.offsetHeight - viewportH;
            if (totalTravel > 0) {
              const scrolledInside = -rect.top;
              stageP = Math.min(1, Math.max(0, scrolledInside / totalTravel));
            }
          }

          // Mechanical disc angle: full 360 rotation over progress
          const angle = (stageP * 360) % 360;
          // Virtual steady rotation baseline + scroll velocity
          const calculatedRpm = stageP > 0 && stageP < 1 
            ? Math.min(99.99, Math.max(33.33, 33.33 + velocityEma.current * 0.12))
            : (stageP >= 1 ? 0 : 33.33);

          setScrollState({
            scrollY: currentY,
            heroParallax: heroP,
            stageProgress: stageP,
            stageAngle: angle,
            stageRpm: Number(calculatedRpm.toFixed(2)),
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial run
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [stageRef]);

  return scrollState;
}
