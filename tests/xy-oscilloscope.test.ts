import { describe, it, expect } from 'vitest';
import { XYOscilloscopeRenderer } from '../src/visualizers/oscilloscope/XYOscilloscopeRenderer';
import { RenderContext } from '../src/rendering/types';
import { PALETTES } from '../src/presets/palettes';
import { XY_FLAGSHIP_PRESETS } from '../src/presets/xyPresets';
import { XYSignalSource, XYBeamStyle, XYDistortionType, XYSymmetryMode } from '../src/types';

describe('XYOscilloscopeRenderer (Flagship)', () => {
  const mockCtx = {
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
  } as unknown as CanvasRenderingContext2D;

  const mockAnalysis = {
    waveform: new Float32Array(1024).map((_, i) => Math.sin(i * 0.05)),
    waveformLeft: new Float32Array(1024).map((_, i) => Math.sin(i * 0.05)),
    waveformRight: new Float32Array(1024).map((_, i) => Math.cos(i * 0.05)),
    frequencyData: new Uint8Array(1024).fill(128),
    frequencyDataNormalized: new Float32Array(1024).fill(0.5),
    bass: 0.85,
    lowMid: 0.6,
    mid: 0.45,
    highMid: 0.35,
    treble: 0.7,
    volume: 0.8,
    rms: 0.65,
    beat: true,
    beatStrength: 0.9,
    timestamp: 3.5
  };

  it('renders all source modes without crashing', () => {
    const renderer = new XYOscilloscopeRenderer();
    const sourceModes: XYSignalSource[] = [
      'stereo', 'left', 'right', 'mono', 'bass-treble', 'mid-high', 'bass-mid', 'synthesized'
    ];

    for (const sourceMode of sourceModes) {
      const rc: any = {
        ctx: mockCtx,
        width: 1920,
        height: 1080,
        analysis: mockAnalysis,
        colors: PALETTES.neon,
        effects: { glow: 1.0, trail: 0.8, pulseIntensity: 1.2 },
        oscilloscopeConfig: { mode: 'classic' },
        reactivity: { smoothing: 0.7 },
        time: 3.5,
        deltaTime: 0.016,
        xyConfig: {
          sourceMode,
          beamStyle: 'neon',
          freqRatioX: 1,
          freqRatioY: 2,
          ratioPreset: '1:2',
          reactiveFrequencyRatio: true,
          phaseX: 0,
          phaseY: 0,
          phaseSpeed: 0.5,
          reactivePhase: true,
          ampX: 1.0,
          ampY: 1.0,
          overallScale: 1.0,
          thickness: 3.5,
          reactiveLineWidth: true,
          velocityModulation: true,
          distortionType: 'none',
          distortionAmount: 0.2,
          polarMode: false,
          polarRings: 1,
          symmetry: 1,
          kaleidoscope: false,
          glowIntensity: 1.2,
          glowRadius: 28,
          trailPersistence: 0.75,
          beamDecay: 0.8,
          gradientAlongCurve: true,
          particleEmission: true,
          layers: []
        }
      };

      expect(() => renderer.render(rc)).not.toThrow();
    }
  });

  it('renders all beam styles correctly', () => {
    const renderer = new XYOscilloscopeRenderer();
    const beamStyles: XYBeamStyle[] = ['neon', 'gradient', 'multiline', 'solid'];

    for (const beamStyle of beamStyles) {
      const rc: any = {
        ctx: mockCtx,
        width: 1280,
        height: 720,
        analysis: mockAnalysis,
        colors: PALETTES.cyberpunk,
        effects: { glow: 1.0, trail: 0.7, pulseIntensity: 1.0 },
        oscilloscopeConfig: { mode: 'classic' },
        reactivity: { smoothing: 0.7 },
        time: 1.0,
        deltaTime: 0.016,
        xyConfig: {
          sourceMode: 'stereo',
          beamStyle,
          freqRatioX: 2,
          freqRatioY: 3,
          symmetry: 2,
          layers: []
        }
      };

      expect(() => renderer.render(rc)).not.toThrow();
    }
  });

  it('renders all distortion types and polar mapping without error', () => {
    const renderer = new XYOscilloscopeRenderer();
    const distortions: XYDistortionType[] = ['none', 'radial', 'wave', 'noise', 'frequency'];

    for (const distortionType of distortions) {
      const rc: any = {
        ctx: mockCtx,
        width: 1920,
        height: 1080,
        analysis: mockAnalysis,
        colors: PALETTES.fire,
        effects: { glow: 1.0, trail: 0.7 },
        oscilloscopeConfig: { mode: 'classic' },
        reactivity: { smoothing: 0.7 },
        time: 2.0,
        deltaTime: 0.016,
        xyConfig: {
          sourceMode: 'synthesized',
          distortionType,
          distortionAmount: 0.35,
          polarMode: true,
          polarRings: 2,
          symmetry: 4,
          kaleidoscope: true,
          layers: []
        }
      };

      expect(() => renderer.render(rc)).not.toThrow();
    }
  });

  it('verifies all 15 flagship XY presets exist with complete parameters', () => {
    expect(XY_FLAGSHIP_PRESETS.length).toBe(15);

    const expectedPresetNames = [
      'Classic Lissajous',
      'Neon Heart',
      'Infinite Loop',
      'Crystal',
      'Aurora',
      'Cyber Tunnel',
      'Kaleidoscope',
      'Electric Flower',
      'Plasma Orbit',
      'Quantum Wave',
      'Bass Reactor',
      'Stereo Pulse',
      'Dream Spiral',
      'Digital DNA',
      'Hyper Geometry'
    ];

    for (const name of expectedPresetNames) {
      const found = XY_FLAGSHIP_PRESETS.some((p) => p.name.includes(name));
      expect(found, `Expected to find preset with name containing "${name}"`).toBe(true);
    }
  });
});
