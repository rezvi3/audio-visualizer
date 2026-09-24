import { describe, it, expect } from 'vitest';
import { OscilloscopeRenderer } from '../src/visualizers/oscilloscope/OscilloscopeRenderer';
import { RenderContext } from '../src/rendering/types';
import { PALETTES } from '../src/presets/palettes';

describe('OscilloscopeRenderer', () => {
  it('instantiates and renders all 10 oscilloscope modes without throwing', () => {
    const renderer = new OscilloscopeRenderer();

    // Mock CanvasRenderingContext2D
    const ctxMock = {
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
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
    } as unknown as CanvasRenderingContext2D;

    const modes = [
      'classic', 'mirror', 'double', 'circular', 'radial', 'spiral', 'tunnel', 'lissajous', 'orbital', 'fluid'
    ] as const;

    const sampleWaveform = new Float32Array(1024);
    for (let i = 0; i < sampleWaveform.length; i++) {
      sampleWaveform[i] = Math.sin(i * 0.1) * 0.5;
    }

    for (const mode of modes) {
      const renderContext: RenderContext = {
        ctx: ctxMock,
        width: 1920,
        height: 1080,
        analysis: {
          waveform: sampleWaveform,
          frequencyData: new Uint8Array(1024),
          frequencyDataNormalized: new Float32Array(1024),
          bass: 0.8,
          lowMid: 0.5,
          mid: 0.4,
          highMid: 0.3,
          treble: 0.6,
          volume: 0.7,
          rms: 0.65,
          beat: true,
          beatStrength: 0.9,
          timestamp: 5.2
        },
        colors: PALETTES.neon,
        effects: {
          glow: 0.8,
          trail: 0.6,
          blur: 0,
          chromaticAberration: 0.3,
          distortion: 0.2,
          noise: 0.05,
          particles: true,
          particleCount: 150,
          symmetry: 1,
          rotationSpeed: 0.1,
          pulseIntensity: 1.2,
          cameraShake: true,
          transparentBg: false
        },
        oscilloscopeConfig: {
          mode,
          waveHeight: 1.8,
          thickness: 3.5,
          density: 2,
          fill: true,
          fillOpacity: 0.2,
          glowStrength: 0.8,
          radialRadius: 180,
          spiralTightness: 1.2,
          layers: [
            {
              id: 'layer_test',
              name: 'Bass Layer',
              enabled: true,
              type: 'bass',
              color: '#ff007f',
              thickness: 2,
              amplitude: 1.2,
              verticalOffset: 0,
              rotation: 0,
              opacity: 0.8
            }
          ]
        },
        reactivity: {
          smoothing: 0.75,
          sensitivity: 1.4,
          bassInfluence: 1.5,
          midInfluence: 1.0,
          trebleInfluence: 1.2,
          beatInfluence: 1.5,
          attack: 0.8,
          decay: 0.3
        },
        time: 5.2,
        deltaTime: 0.016
      };

      expect(() => renderer.render(renderContext)).not.toThrow();
    }
  });
});
