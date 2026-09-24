import { describe, it, expect } from 'vitest';
import { AudioAnalysisEngine } from '../src/audio-analysis/AudioAnalysisEngine';
import { AudioReactivityConfig } from '../src/types';

describe('AudioAnalysisEngine', () => {
  it('initializes frequency bins and performs analysis without crashing', () => {
    // Mock Web Audio AnalyserNode
    const binCount = 1024;
    const mockAnalyser = {
      fftSize: 2048,
      frequencyBinCount: binCount,
      smoothingTimeConstant: 0.4,
      getFloatTimeDomainData: (arr: Float32Array) => {
        // Fill with synthetic 100Hz sine wave (bass energy)
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.sin((i / 44100) * 100 * Math.PI * 2) * 0.8;
        }
      },
      getByteFrequencyData: (arr: Uint8Array) => {
        // Fill bass bins with high energy
        for (let i = 0; i < 15; i++) {
          arr[i] = 220;
        }
        for (let i = 15; i < arr.length; i++) {
          arr[i] = 20;
        }
      }
    } as unknown as AnalyserNode;

    const engine = new AudioAnalysisEngine(mockAnalyser, 44100);

    const reactivityConfig: AudioReactivityConfig = {
      smoothing: 0.7,
      sensitivity: 1.0,
      bassInfluence: 1.0,
      midInfluence: 1.0,
      trebleInfluence: 1.0,
      beatInfluence: 1.0,
      attack: 0.8,
      decay: 0.3
    };

    const analysis = engine.analyze(reactivityConfig, 1.25);

    expect(analysis).toBeDefined();
    expect(analysis.waveform.length).toBe(1024);
    expect(analysis.frequencyData.length).toBe(1024);
    expect(analysis.frequencyDataNormalized.length).toBe(1024);

    // Bass energy should be significantly higher than treble
    expect(analysis.bass).toBeGreaterThan(0.3);
    expect(analysis.treble).toBeLessThan(0.3);

    // RMS loudness should be positive
    expect(analysis.rms).toBeGreaterThan(0);
    expect(analysis.volume).toBeGreaterThan(0);

    // Timestamp preserved
    expect(analysis.timestamp).toBe(1.25);
  });

  it('correctly adapts to sample rate changes', () => {
    const mockAnalyser = {
      fftSize: 2048,
      frequencyBinCount: 1024,
      smoothingTimeConstant: 0.4,
      getFloatTimeDomainData: () => {},
      getByteFrequencyData: () => {}
    } as unknown as AnalyserNode;

    const engine = new AudioAnalysisEngine(mockAnalyser, 48000);
    expect(() => engine.updateSampleRate(44100)).not.toThrow();
  });
});
