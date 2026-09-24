export interface AudioAnalysis {
  waveform: Float32Array;
  waveformLeft?: Float32Array;
  waveformRight?: Float32Array;
  frequencyData: Uint8Array;
  frequencyDataNormalized: Float32Array;

  bass: number;        // 20Hz - 150Hz (0.0 -> 1.0)
  lowMid: number;      // 150Hz - 400Hz (0.0 -> 1.0)
  mid: number;         // 400Hz - 2000Hz (0.0 -> 1.0)
  highMid: number;     // 2000Hz - 6000Hz (0.0 -> 1.0)
  treble: number;      // 6000Hz - 20000Hz (0.0 -> 1.0)

  volume: number;      // Instantaneous peak/volume (0.0 -> 1.0)
  rms: number;         // Root Mean Square loudness (0.0 -> 1.0)

  beat: boolean;       // Instantaneous beat onset flag
  beatStrength: number;// Normalized beat transient intensity (0.0 -> 1.0)

  timestamp: number;   // Performance timing / audio playback time
}

export type VisualizerType =
  | 'xy-oscilloscope'  // FLAGSHIP: Dedicated XY Oscilloscope / Lissajous Visualizer
  | 'oscilloscope'
  | 'circular-oscilloscope'
  | 'radial'
  | 'spectrum-bars'
  | 'circular-spectrum'
  | 'particle-field'
  | 'lissajous'
  | 'wave-tunnel'
  | 'frequency-rings'
  | 'reactive-grid'
  | 'fluid-wave'
  | 'orbital';

export type OscilloscopeMode =
  | 'classic'
  | 'mirror'
  | 'double'
  | 'circular'
  | 'radial'
  | 'spiral'
  | 'tunnel'
  | 'lissajous'
  | 'orbital'
  | 'fluid';

// ======================== FLAGSHIP XY OSCILLOSCOPE TYPES ========================

export type XYSignalSource =
  | 'stereo'         // True Stereo: Left -> X, Right -> Y
  | 'left'
  | 'right'
  | 'mono'
  | 'bass-treble'    // Bass -> X, Treble -> Y
  | 'mid-high'       // Mid -> X, High-Mid -> Y
  | 'bass-mid'       // Bass -> X, Mid -> Y
  | 'synthesized'    // Audio-driven mathematical Lissajous synthesis
  | 'custom';

export type XYBeamStyle =
  | 'neon'           // High-intensity multi-pass phosphor bloom
  | 'solid'          // Razor sharp precision analog beam
  | 'soft'           // Soft diffused electron beam
  | 'gradient'       // Trajectory rainbow / spectral gradient
  | 'multiline'      // Parallel beam harmonics
  | 'particle';      // Particle stream along trajectory

export type XYDistortionType =
  | 'none'
  | 'radial'         // Distance-based displacement
  | 'wave'           // Sinusoidal perturbation
  | 'noise'          // Procedural continuous noise
  | 'frequency';     // Audio frequency harmonics

export type XYSymmetryMode = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;

export interface XYLayerConfig {
  id: string;
  name: string;
  enabled: boolean;
  xSource: XYSignalSource;
  ySource: XYSignalSource;
  color: string;
  scale: number;
  thickness: number;
  opacity: number;
  rotation: number;
  phaseOffset: number;
  freqRatioX: number;
  freqRatioY: number;
}

export interface XYOscilloscopeConfig {
  sourceMode: XYSignalSource;
  beamStyle: XYBeamStyle;
  
  // Mathematical Lissajous Parameters
  freqRatioX: number;             // e.g. 1.0, 2.0, 3.0...
  freqRatioY: number;             // e.g. 1.0, 2.0, 3.0, 4.0, 5.0...
  ratioPreset: string;            // '1:1', '1:2', '2:3', '3:4', '3:5', '4:5', '5:6', '5:7', '7:8', 'custom'
  reactiveFrequencyRatio: boolean;// whether audio smoothly shifts the ratio
  
  // Phase & Amplitude
  phaseX: number;                 // 0 -> 2*PI
  phaseY: number;                 // 0 -> 2*PI
  phaseSpeed: number;             // auto-animation speed (-2.0 -> 2.0)
  reactivePhase: boolean;         // audio (bass/mid) advances phase
  
  ampX: number;                   // 0.1 -> 3.0
  ampY: number;                   // 0.1 -> 3.0
  overallScale: number;           // 0.2 -> 3.0
  
  // Dynamics & Velocity
  thickness: number;              // 1.0 -> 15.0 px
  reactiveLineWidth: boolean;     // bass/treble modulates line thickness
  velocityModulation: boolean;    // velocity modulates brightness/glow/width
  
  // Distortion & Geometry
  distortionType: XYDistortionType;
  distortionAmount: number;       // 0.0 -> 1.0
  polarMode: boolean;             // Cartesian -> Polar mapping
  polarRings: number;             // 1 -> 8
  
  // Symmetry & Kaleidoscope
  symmetry: XYSymmetryMode;
  kaleidoscope: boolean;
  
  // Visual Effects & Beam
  glowIntensity: number;          // 0.0 -> 2.0
  glowRadius: number;             // 5 -> 60 px
  trailPersistence: number;       // 0.0 -> 0.98
  beamDecay: number;              // electron phosphor fade
  
  // Color & Gradient
  gradientAlongCurve: boolean;
  gradientStartColor: string;
  gradientMidColor: string;
  gradientEndColor: string;
  
  // Particle Emission
  particleEmission: boolean;
  particleRate: number;           // 10 -> 200
  
  // Camera / View Transform
  zoom: number;                   // 0.5 -> 3.0
  panX: number;                   // -300 -> 300
  panY: number;                   // -300 -> 300
  rotation: number;               // 0 -> 360 deg
  rotationSpeed: number;          // -2.0 -> 2.0
  beatRotationImpulse: boolean;
  
  // Multi-layer
  layers: XYLayerConfig[];
  
  // Generative Morphing
  generativeMode: boolean;
  generativeMorphSpeed: number;   // 0.1 -> 2.0
}

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  glow: string;
  accent: string;
}

export interface EffectsConfig {
  glow: number;                // 0.0 -> 1.0
  trail: number;               // 0.0 -> 1.0 (persistence / ghosting)
  blur: number;                // 0 -> 20 px
  chromaticAberration: number; // 0.0 -> 1.0
  distortion: number;          // 0.0 -> 1.0
  noise: number;               // 0.0 -> 1.0
  particles: boolean;          // overlay particles
  particleCount: number;       // 50 -> 500
  symmetry: number;            // 1, 2, 4, 6, 8
  rotationSpeed: number;       // -2.0 -> 2.0
  pulseIntensity: number;      // 0.0 -> 2.0
  cameraShake: boolean;        // beat-triggered micro shake
  transparentBg: boolean;      // for video overlays / post-production
}

export interface AudioReactivityConfig {
  smoothing: number;        // 0.0 -> 0.95
  sensitivity: number;      // 0.1 -> 3.0
  bassInfluence: number;    // 0.0 -> 3.0
  midInfluence: number;     // 0.0 -> 3.0
  trebleInfluence: number;  // 0.0 -> 3.0
  beatInfluence: number;    // 0.0 -> 3.0
  attack: number;           // 0.01 -> 1.0
  decay: number;            // 0.01 -> 1.0
}

export interface WaveformLayer {
  id: string;
  name: string;
  enabled: boolean;
  type: 'waveform' | 'bass' | 'treble' | 'beat';
  color: string;
  thickness: number;
  amplitude: number;
  verticalOffset: number;
  rotation: number;
  opacity: number;
}

export interface OscilloscopeConfig {
  mode: OscilloscopeMode;
  waveHeight: number;        // amplitude multiplier (0.1 -> 5.0)
  thickness: number;         // line width in pixels (1 -> 15)
  density: number;           // sample resolution step
  layers: WaveformLayer[];
  fill: boolean;             // whether to fill below curve
  fillOpacity: number;
  glowStrength: number;
  radialRadius: number;
  spiralTightness: number;
}

export interface VisualPreset {
  id: string;
  name: string;
  description: string;
  visualizer: VisualizerType;
  oscilloscopeConfig: OscilloscopeConfig;
  xyConfig?: Partial<XYOscilloscopeConfig>;
  colors: ColorPalette;
  effects: EffectsConfig;
  reactivity: AudioReactivityConfig;
}

export interface AudioTrackInfo {
  name: string;
  duration: number;
  sampleRate: number;
  channels: number;
  sourceType: 'file' | 'synth' | 'mic';
}

export interface ExportSettings {
  resolution: { width: number; height: number; label: string; aspect: string };
  fps: 24 | 30 | 60;
  format: 'webm' | 'png-sequence';
  duration: number;
  transparent: boolean;
}
