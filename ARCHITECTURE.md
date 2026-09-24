# Oscillo Studio — System Architecture

This document describes the internal engineering architecture of Oscillo Studio, detailing the separation of concerns across audio processing, signal analysis, visual rendering, and video export.

---

## 1. Architectural Philosophy

1. **Strict Decoupling**: Visualizers do not communicate directly with audio sources. They consume standardized, normalized feature objects provided by the analysis pipeline.
2. **Dual-Mode Coexistence**: The platform provides both an editorial, poster-scale **Achromatic Technical Metrology Showcase** and a high-performance **Audio-Reactive Visualizer Studio**, switchable instantaneously without state corruption.
3. **Flagship Priority**: The **XY Oscilloscope / Lissajous Visualizer** serves as the primary generative instrument, capable of authentic stereo XY hardware emulation and parametric mathematical art.
4. **Physical Occlusion Weave**: Display typography and cut-out product photography are woven in 3 explicit coordinate layers (`z-index: 1`, `z-index: 2`, `z-index: 3`) with matching font metrics and letter visibility masks, eliminating subpixel reflow jitter.
5. **Zero-Allocation Render Loops**: Hot animation loops running at 60 FPS reuse pre-allocated typed arrays (`Float32Array`, `Uint8Array`) to eliminate garbage collection pauses.
6. **No React State in Animation Loops**: High-frequency animation calculations bypass React component state entirely, reading from mutable references or singleton store snapshots on demand.
7. **Deterministic Feature Ranges**: All normalized metrics (Bass, Mid, Treble, Volume, RMS, Beat Strength) are constrained within `0.0` to `1.0`.

---

## 2. Technical Presentation System (`src/components/showcase/`)

The presentation layer executes the strict Achromatic Technical Product design specification:
- **`ShowcaseNav`**: Fixed 64px header, 82% ground with 14px backdrop blur, 1px bottom hairline, display 800 brand mark with accent dot, 5 mono anchor links, and studio launch pill button.
- **`HeroSection`**: Type and photographic subject occlusion weave. Sandwiches the high-resolution aluminum transducer cut-out (`public/hero-transducer.png`, 796x559) between two identical flexbox layers of the wordmark `OSCILLO`. The back layer renders `O S C I L [hidden] O`, the front layer renders `[hidden] [hidden] [hidden] [hidden] [hidden] L [hidden]`. Hero scroll progress drives subtle parting parallax.
- **`ProofSection`**: Full-bleed inverted ink ground `#0D0D0F`, oversized tabular numeral readout (`0.0028% RMS DEVIATION`), and dual-trace SVG comparing multi-harmonic uncalibrated signal jitter against the calibrated, fluid-damped MK-VII signal path.
- **`CounterTravelStage`**: 320vh scroll track with a sticky 100svh stage. A top-down precision rotor disc (`public/rotor-disc.png`, 934x934) rotates $360^\circ$ clockwise while an oversized 3x marquee counter-travels horizontally, accompanied by real-time angular degrees, instantaneous velocity (RPM), and phase telemetry.
- **`TechnicalDiagramSection`**: Subsystem definition list paired with an orthogonal CAD vector drawing complete with hairline construction geometry, leader dimensions, and fiducial accent dots (`#2F5BFF`).
- **`FieldSwapPickerSection`**: Dynamic 4-finish material switcher (Raw Aluminum, Dimmer Stage, Deep Graphite, Inverted Ink) with 0.7s smooth transition and a 3-cell definition panel with `color-mix(in srgb, currentColor 24%, transparent)` borders.
- **`SpecTableSection`**: Balanced two-column grid with 12 hairline-ruled rows of laboratory metrology tolerances.
- **`CloseSection`**: Final metrology gate with Archivo headline, monospaced fine print, action pills, 4-item footer strip, and bookend `OSCILLO` wordmark baseline-cropped along the lower viewport edge.
- **`useShowcaseScroll`**: Passive rAF-throttled scroll listener, IntersectionObserver with `rootMargin: '0px 0px -12% 0px'`, and immediate rAF reveal trigger for hero elements.


---

## 2. Audio Engine (`src/audio/AudioEngine.ts`)

The `AudioEngine` class wraps the Web Audio API (`AudioContext`) and manages stereo signal routing:

```text
[AudioBufferSourceNode / MediaElement / MediaStream (Mic)]
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
     [AnalyserNode]    [ChannelSplitterNode (2 Channels)]
     (Master FFT)                │
           │              ┌──────┴──────┐
           ▼              ▼             ▼
       [GainNode]    [Analyser L]  [Analyser R]
           │          (Left FFT)   (Right FFT)
    ┌──────┴──────┐
    ▼             ▼
[Speakers]  [MediaStreamDestination]
```

### Key Capabilities:
- **True Stereo Routing**: Routes audio to a `ChannelSplitterNode` into distinct `analyserL` and `analyserR` nodes for real-time instantaneous $X(t) \text{ vs } Y(t)$ stereo trajectory plotting.
- **Audio Decoding**: Decodes binary files (`File` / `Blob`) into `AudioBuffer` for sample-accurate scrubbing and offline inspection.
- **Waveform Overview Extraction**: Pre-computes peak buckets (`extractWaveformPeaks(240)`) for fast rendering of the bottom timeline scrub bar.
- **Time Synchronization**: Coordinates precise playback offsets with pause/resume support and loop bounds.
- **Microphone Live Input**: Connects browser `getUserMedia` streams directly to the `AnalyserNode` without routing to `AudioContext.destination`, completely preventing audio feedback loops.
- **Built-in Procedural Synth**: Generates a 30-second electronic/synthwave loop directly into memory with stereo quadrature phase (`generateDemoAudioBuffer()`).

---

## 3. Audio Analysis Engine (`src/audio-analysis/AudioAnalysisEngine.ts`)

The `AudioAnalysisEngine` transforms raw time-domain and frequency data into musical control signals:

### Frequency Band Bin Mapping
The Nyquist frequency is divided into 1024 bins (`fftSize / 2`). Given a sampling rate $f_s$, the width of each bin is $\Delta f = f_s / 2048$. Frequency boundaries are dynamically mapped to discrete bins:
- **Bass**: $20\text{ Hz} - 150\text{ Hz}$
- **Low-Mid**: $150\text{ Hz} - 400\text{ Hz}$
- **Mid**: $400\text{ Hz} - 2000\text{ Hz}$
- **High-Mid**: $2000\text{ Hz} - 6000\text{ Hz}$
- **Treble**: $6000\text{ Hz} - 20000\text{ Hz}$

### Dynamic Smoothing & Envelope Tracking
To prevent visually jarring stutter, raw values undergo asymmetric attack and decay filtering:

$$\text{smoothed}_{t} = \begin{cases} 
\text{smoothed}_{t-1} + (\text{raw}_t - \text{smoothed}_{t-1}) \times \text{attack} & \text{if } \text{raw}_t > \text{smoothed}_{t-1} \\
\text{smoothed}_{t-1} + (\text{raw}_t - \text{smoothed}_{t-1}) \times \text{decay} & \text{if } \text{raw}_t \le \text{smoothed}_{t-1}
\end{cases}$$

### Intelligent Beat Detection
The engine maintains a sliding 45-frame rolling window of energy in the bass + low-mid frequencies ($E_{\text{beat}} = 0.75 \cdot E_{\text{bass}} + 0.25 \cdot E_{\text{lowMid}}$).
- A beat is registered when the instantaneous energy exceeds the rolling average multiplied by an adaptive variance-based threshold ($E_{\text{instant}} > \mu_E \times T$).
- A 150 ms refractory cooldown prevents false retriggers.
- The resulting `beatStrength` decays exponentially each frame ($0.88^{\Delta t}$).

---

## 4. Flagship XY Oscilloscope Architecture (`src/visualizers/oscilloscope/XYOscilloscopeRenderer.ts`)

The XY Oscilloscope treats the screen as a cathode-ray phosphor tube displaying a continuous two-dimensional trajectory:

```text
Audio Input (Stereo L/R / Frequency Bands / Waveform)
                          │
                          ▼
            Parametric Coordinate Generator
                 x(t) = A · sin(2πfx·t + φx) + disp
                 y(t) = B · sin(2πfy·t + φy) + disp
                          │
                          ▼
            Distortion & Polar Mapping Pipeline
         (Radial Swirl / Wave / Noise / FFT Harmonics)
                          │
                          ▼
            Velocity & Luminosity Modulation
              v = sqrt((x_i - x_{i-1})² + (y_i - y_{i-1})²)
                          │
                          ▼
                 Beam Style Rendering
     (Neon Bloom / Spectral Gradient / Multi-Beam / Solid)
                          │
                          ▼
             Kaleidoscope Radial Symmetry
           (1x, 2x, 3x, 4x, 6x, 8x, 12x, 16x)
                          │
                          ▼
                 Particle Trail Emitter
                          │
                          ▼
              Multi-Layer Waveform Compositor
```

### Key Technical Innovations:
- **Velocity Luminosity Calculation**: Points moving at high speeds receive broader bloom halo passes, whereas slow-dwelling nodes generate intense phosphor concentration.
- **Continuous Ratio Morphing**: When `reactiveFrequencyRatio` is active, the harmonic ratio $f_y / f_x$ continuously interpolates across musical octaves, morphing circles into knots and floral geometries.
- **Polar Transformation**: Re-projects planar Cartesian coordinates into polar harmonic rings:
  $$x_{\text{polar}} = (R_0 + Y \cdot \text{amp}) \cos(X \cdot \pi \cdot \text{rings}), \quad y_{\text{polar}} = (R_0 + Y \cdot \text{amp}) \sin(X \cdot \pi \cdot \text{rings})$$

---

## 5. Visualizer & Rendering Architecture (`src/rendering/` & `src/visualizers/`)

Every visualizer implements the common `IVisualizerRenderer` interface:

```typescript
export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  analysis: AudioAnalysis;
  colors: ColorPalette;
  effects: EffectsConfig;
  oscilloscopeConfig: OscilloscopeConfig;
  reactivity: AudioReactivityConfig;
  time: number;
  deltaTime: number;
}

export interface IVisualizerRenderer {
  render(context: RenderContext): void;
  reset?(): void;
}
```

---

## 6. Video Export Architecture (`src/export/ExportEngine.ts`)

Video export captures canvas frames and audio tracks without screen capture dialogs:

```text
[HTMLCanvasElement.captureStream(fps)] ──────────┐
                                                 ▼
[AudioEngine.getMediaStream() (Audio)] ───► [MediaStream] ───► [MediaRecorder] ───► [.webm Blob]
```

- **Video Encoding**: VP9 / VP8 codec at 12 Mbps for broadcast clarity.
- **Audio Encoding**: Stereo Opus at 48 kHz.
- **Format**: WebM container natively decodable in Chrome, Firefox, VLC, and video editing suites (Premiere Pro, DaVinci Resolve, Final Cut).
