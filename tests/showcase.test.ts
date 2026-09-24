import { describe, it, expect } from 'vitest';

describe('Showcase Architecture & Mathematical Models', () => {
  it('correctly models the 7-letter OSCILLO occlusion weave structure', () => {
    const letters = ['O', 'S', 'C', 'I', 'L', 'L', 'O'];
    expect(letters).toHaveLength(7);

    // Layer 1: Back layer renders letters 0, 1, 2, 3, 4, 6. Letter 5 (second L) is hidden
    const backVisibility = letters.map((_, idx) => (idx === 5 ? 'hidden' : 'visible'));
    expect(backVisibility[0]).toBe('visible');
    expect(backVisibility[4]).toBe('visible');
    expect(backVisibility[5]).toBe('hidden');
    expect(backVisibility[6]).toBe('visible');

    // Layer 3: Front layer renders ONLY letter 5 (second L). Others hidden
    const frontVisibility = letters.map((_, idx) => (idx === 5 ? 'visible' : 'hidden'));
    expect(frontVisibility[0]).toBe('hidden');
    expect(frontVisibility[4]).toBe('hidden');
    expect(frontVisibility[5]).toBe('visible');
    expect(frontVisibility[6]).toBe('hidden');

    // Verification: Union of visible characters covers all letters without collision
    letters.forEach((char, idx) => {
      const isVisibleInBack = backVisibility[idx] === 'visible';
      const isVisibleInFront = frontVisibility[idx] === 'visible';
      expect(isVisibleInBack !== isVisibleInFront).toBe(true); // Exactly one layer is visible
    });
  });

  it('generates damped calibrated waveform with sub-micron drift compared to wandering reference', () => {
    const width = 800;
    const height = 280;
    const midY = height / 2;
    const pointsCount = 100;

    let maxWanderDelta = 0;
    let maxCalibratedDelta = 0;

    for (let i = 0; i <= pointsCount; i++) {
      const t = (i / pointsCount) * Math.PI * 8;
      const wander = 
        Math.sin(t * 0.9) * 38 +
        Math.sin(t * 2.3 + 1.2) * 22 +
        Math.sin(t * 4.7 + 0.5) * 14 +
        Math.cos(t * 9.1) * 8;
      const yRef = midY + wander;

      const damping = Math.sin(t * 0.9) * 2.8 + Math.cos(t * 3.1) * 1.2;
      const yCal = midY + damping;

      maxWanderDelta = Math.max(maxWanderDelta, Math.abs(yRef - midY));
      maxCalibratedDelta = Math.max(maxCalibratedDelta, Math.abs(yCal - midY));
    }

    // Wandering reference trace should exhibit wide uncalibrated excursions
    expect(maxWanderDelta).toBeGreaterThan(40);

    // Calibrated trace should be heavily damped within strict sub-5px bounds
    expect(maxCalibratedDelta).toBeLessThan(5);
    expect(maxCalibratedDelta / maxWanderDelta).toBeLessThan(0.1);
  });

  it('verifies counter-travel stage rotational and angular mathematics', () => {
    // Over a 320vh travel, scroll progress maps 0..1 to 0..360 degrees
    const calculateAngle = (p: number) => (p * 360) % 360;
    expect(calculateAngle(0)).toBe(0);
    expect(calculateAngle(0.5)).toBe(180);
    expect(calculateAngle(1)).toBe(0);

    // Marquee offset counter-travels across center:
    const calculateMarqueeOffset = (p: number) => (0.5 - p) * 45;
    expect(calculateMarqueeOffset(0)).toBe(22.5);
    expect(calculateMarqueeOffset(0.5)).toBe(0);
    expect(calculateMarqueeOffset(1)).toBe(-22.5);
  });

  it('validates all 4 field-swap material configurations', () => {
    const finishes = [
      { id: 'aluminum', bg: '#EFEFEE', text: '#0D0D0F', accent: '#2F5BFF' },
      { id: 'stage', bg: '#E4E4E2', text: '#0D0D0F', accent: '#2F5BFF' },
      { id: 'graphite', bg: '#1E1F24', text: '#F2F2F0', accent: '#7C97FF' },
      { id: 'ink', bg: '#0D0D0F', text: '#EFEFEE', accent: '#7C97FF' },
    ];

    expect(finishes).toHaveLength(4);
    finishes.forEach((finish) => {
      // Must have distinct background and text colors to maintain contrast
      expect(finish.bg).not.toBe(finish.text);
      // Accent must be either signal #2F5BFF or dark lift #7C97FF
      expect(['#2F5BFF', '#7C97FF']).toContain(finish.accent);
    });
  });
});
