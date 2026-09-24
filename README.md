# OSCILLO // Precision Acoustic Transducer & Flagship XY Lissajous Studio

A dual-mode creative engineering system combining an **achromatic, poster-scale technical product showcase** with a **broadcast-grade, real-time audio-reactive music visualizer studio**.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and the **Web Audio API**.

---

## 🏛️ Achromatic Technical Presentation System

The landing presentation applies an editorial, high-precision technical-product design contract:
- **Strict Achromatic Palette**: Ground `#EFEFEE`, Dimmer Stage `#E4E4E2`, Ink `#0D0D0F`, Secondary Ink `#43444A`, Muted `#6E6F76`, and exactly one saturated Signal Accent `#2F5BFF` (with `#7C97FF` lift on dark grounds). The signal accent appears only as small type, dots, rules, or traces—never as a background fill.
- **Display & Monospaced Typography**: Display headers set in **Archivo 700-900** with tight negative tracking (`-0.045em` to `-0.055em`) and line heights down to `0.78`. Pinned technical metadata and labels set in **IBM Plex Mono** (10-12px, tracking `+0.14em` to `+0.16em`, uppercase).
- **Type and Subject Occlusion Weave**: The poster-scale wordmark `OSCILLO` is rendered in two absolute layers with the photographic transducer subject sandwiched at `z-index: 2`. The back layer renders `O S C I L [hidden] O` and the front layer renders `[hidden] [hidden] [hidden] [hidden] [hidden] L [hidden]`. Flexbox metrics match with zero subpixel jitter, producing an authentic mechanical weave.
- **7 Full-Width Alternating Sections**:
  1. **Showcase Navigation**: 64px fixed bar, 82% ground with 14px backdrop blur, 1px bottom hairline, display 800 brand mark with accent period, 5 mono links, and action pill button.
  2. **Hero Section**: Left-anchored 38ch lede, display headline with accent phrase, 3-row mono spec matrix, and occlusion-woven transducer subject with scroll parting parallax.
  3. **Inverted Proof Section**: Full-bleed ink ground `#0D0D0F`, enormous tabular numeral display (`clamp(56px, 8.5vw, 120px)`), and live SVG dual-trace comparison showing multi-harmonic wander vs calibrated sub-micron damping.
  4. **Pinned Counter-Travel Stage**: 320vh scroll track with a sticky 100svh stage. A top-down precision rotor disc rotates $360^\circ$ counter-traveling against a 3x marquee track, with live real-time degrees, phase angle, and RPM readouts.
  5. **Technical CAD Diagram**: Definition list with accent mono labels alongside a strictly-to-scale SVG CAD cross-section featuring construction hairlines, leader lines, and fiducial accent dots.
  6. **Runtime Field-Swap Picker**: Dynamic material switcher (Raw Aluminum, Dimmer Stage, Deep Graphite, Inverted Ink) with 0.7s smooth transition and a 3-cell definition panel with `color-mix(in srgb, currentColor 24%, transparent)` borders.
  7. **Spec Table Matrix**: Balanced two-column grid with 12 hairline-ruled rows of laboratory metrology tolerances.
  8. **Close Section**: Display headline, monospaced fine print, pill buttons, 4-item footer strip, and bookend `OSCILLO` wordmark baseline-cropped at the bottom viewport edge.


## ⚡ Flagship Feature: XY Oscilloscope / Lissajous Visualizer

The **XY Oscilloscope** is the flagship generative instrument of the application, transforming audio into a luminous two-dimensional trajectory $X(t) \text{ vs } Y(t)$:

- **True Stereo XY Mode**: Discrete Left and Right channels routed via Web Audio `ChannelSplitterNode` into dedicated Left/Right `AnalyserNode`s for authentic analog oscilloscope vector display.
- **Parametric Lissajous Synthesis**: Mathematical frequency ratios ($1:1$, $1:2$, $2:3$, $3:4$, $3:5$, $4:5$, $5:6$, $5:7$, $7:8$, custom) with continuous audio-reactive morphing and phase modulation.
- **Multiple Signal Sources**:
  - `Stereo XY (L/R)`
  - `Lissajous Synth`
  - `Bass vs Treble`
  - `Mid vs High-Mid`
  - `Bass vs Mid`
  - `Mono Quadrature Phase Shift`
- **Electron Beam Styles**:
  - **Neon Bloom**: Multi-pass additive phosphor glow with ultra-hot white electron core.
  - **Spectral Gradient**: Trajectory rainbow gradient running continuously along the curve.
  - **Multi-Beam**: Parallel harmonic beams.
  - **Solid Vector**: Precision analog oscilloscope line.
- **Velocity-Modulated Luminosity**: Dynamically calculates beam travel velocity ($v = \sqrt{\Delta x^2 + \Delta y^2}$), intensifying glow, brightness, and particle emission when the beam accelerates.
- **Generative Distortions & Polar Mode**: Radial swirls, sinusoidal wave ripples, procedural noise, and FFT harmonic deformation; toggle Cartesian to Polar ($r, \theta$) coordinate space.
- **Kaleidoscope Symmetry**: $1\times, 2\times, 3\times, 4\times, 6\times, 8\times, 12\times, 16\times$ radial symmetry with optional mirror reflection.
- **Multi-Layer XY Curves**: Stack multiple independent harmonic XY orbits with distinct source modes, colors, scales, rotations, and phase offsets.
- **15 Flagship XY Presets**:
  1. *Classic Lissajous*
  2. *Neon Heart*
  3. *Infinite Loop*
  4. *Crystal*
  5. *Aurora*
  6. *Cyber Tunnel*
  7. *Kaleidoscope*
  8. *Electric Flower*
  9. *Plasma Orbit*
  10. *Quantum Wave*
  11. *Bass Reactor*
  12. *Stereo Pulse*
  13. *Dream Spiral*
  14. *Digital DNA*
  15. *Hyper Geometry*

---

## ⚡ Core Engine Features

- **Continuous Audio Signal Extraction**: Real-time extraction of time-domain waveforms, 2048-point FFT spectrum, RMS loudness, peak volume, and 5 discrete frequency bands (Bass, Low-Mid, Mid, High-Mid, Treble).
- **Intelligent Beat & Onset Detection**: Dynamic transient tracking with adaptive energy thresholding and exponential decay to trigger explosive scale bursts and camera shake.
- **Classic Oscilloscope Modes**: 10 modes including Classic horizontal, Symmetrical Mirror, Double Wave, Circular Ring, Radial Starburst, Archimedean Spiral, Wave Tunnel, Lissajous XY, Orbital Harmonics, and Fluid Ribbon.
- **Studio Visualizers**: Master Spectrum Bars (64-band equalizer with peak decay), Circular EQ, Particle Field with light webs, 3D Wave Tunnel, Frequency Rings, and Synthwave Horizon Grid.
- **Video Export Studio**: Direct canvas stream capture + Web Audio MediaStream destination recording into high-bitrate WebM video at 1080p, 4K, 9:16 Vertical (TikTok/Reels/Shorts), and 1:1 Square (Album Art).
- **Transparent Background Mode**: Export with alpha transparency for seamless overlays in Premiere Pro, DaVinci Resolve, and After Effects.
- **Built-in Procedural Synth**: Instant 30-second 124 BPM synthwave track with punchy kick, sub-bass, arpeggios, and drums with stereo quadrature phase for immediate zero-setup testing.
- **Live Microphone Input**: Real-time audio line-in for live DJ sets and VJ performances.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd visualizer

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Supported Browsers

- Google Chrome / Chromium (v90+) — **Recommended for WebM VP9 export & high performance**
- Brave / Microsoft Edge (v90+)
- Mozilla Firefox (v90+)
- Apple Safari (v15.2+)

---

## 🏗️ Architecture Overview

Oscillo Studio strictly adheres to a unidirectional audio-to-visual decoupled pipeline:

```text
                  AUDIO SOURCE (File / Demo Synth / Live Mic)
                                     │
                                     ▼
                                AUDIO ENGINE
                 (Web Audio Context & Channel Splitter Node)
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
               LEFT CHANNEL                    RIGHT CHANNEL
              (AnalyserNode)                  (AnalyserNode)
                     │                               │
                     └───────────────┬───────────────┘
                                     ▼
                            AUDIO ANALYSIS ENGINE
                     (FFT, Band Energy, Smoothing, Beat)
                                     │
                                     ▼
                            NORMALIZED FEATURES
                   (Waveform L/R, Bass, Mid, Treble, Beat)
                                     │
                                     ▼
                            VISUALIZER ENGINE
             (XY Flagship / Oscilloscope / Spectrum / Particles)
                                     │
                                     ▼
                          POST-PROCESSING PIPELINE
            (Trails, Bloom Glow, Symmetry, Camera Shake, Alpha)
                                     │
                        ┌────────────┴────────────┐
                        ▼                         ▼
                  PREVIEW CANVAS            VIDEO EXPORT
                   (~60 FPS RAF)          (MediaRecorder)
```

For in-depth architectural details, see [ARCHITECTURE.md](file:///home/rezvi/Documents/visualizer/ARCHITECTURE.md).
For guides on adding new visualizers and features, see [DEVELOPMENT.md](file:///home/rezvi/Documents/visualizer/DEVELOPMENT.md).
