# Oscillo Studio — Developer & Contributor Guide

This guide walks you through extending Oscillo Studio with new visualizers, audio features, presets, and post-processing effects.

---

## 1. Adding a New Visualizer

To add a new visualizer (e.g. `MatrixRainVisualizer`):

### Step 1: Create the Renderer Class
Create `src/visualizers/matrix/MatrixRainRenderer.ts`:

```typescript
import { IVisualizerRenderer, RenderContext } from '../../rendering/types';

export class MatrixRainRenderer implements IVisualizerRenderer {
  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, deltaTime } = rc;
    const { bass, treble, beat, beatStrength } = analysis;

    ctx.save();
    // Use analysis.bass, mid, treble, waveform etc. to draw
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    // ... drawing logic ...
    ctx.restore();
  }

  public reset?(): void {
    // Optional state reset on track change
  }
}
```

### Step 2: Register in `src/types/index.ts`
Add the visualizer type to `VisualizerType`:

```typescript
export type VisualizerType =
  | 'oscilloscope'
  | ...
  | 'matrix-rain';
```

### Step 3: Register in `VisualizerEngine.ts`
Instantiate and add to the renderer map:

```typescript
import { MatrixRainRenderer } from '../visualizers/matrix/MatrixRainRenderer';

// In constructor:
this.renderers.set('matrix-rain', new MatrixRainRenderer());
```

### Step 4: Add to `VisualizerLibrary.tsx`
Add an entry in `OTHER_VISUALIZERS` array with an icon and description.

---

## 2. Adding a New Audio Feature

To extract a new audio signal feature (e.g. spectral centroid or high-frequency transients):

### Step 1: Update `AudioAnalysis` in `src/types/index.ts`
```typescript
export interface AudioAnalysis {
  // ... existing properties
  spectralCentroid: number; // 0.0 -> 1.0
}
```

### Step 2: Implement Calculation in `AudioAnalysisEngine.ts`
In `AudioAnalysisEngine.analyze()`:

```typescript
// Example: calculate spectral centroid
let weightedSum = 0;
let totalMagnitude = 0;
for (let i = 0; i < this.frequencyBuffer.length; i++) {
  const mag = this.frequencyBuffer[i];
  weightedSum += i * mag;
  totalMagnitude += mag;
}
const rawCentroid = totalMagnitude > 0 ? (weightedSum / totalMagnitude) / this.frequencyBuffer.length : 0;
const smoothedCentroid = this.smoothValue(rawCentroid, this.lastCentroid, atk, dec);
```

Add `spectralCentroid: smoothedCentroid` to the returned analysis object.

### Step 3: Expose in `AudioDebugPanel.tsx`
Add a meter to visualize the new feature in real time!

---

## 3. Adding a Visual Preset

Presets encapsulate visualizer mode, colors, effects, and audio reactivity.

### Step 1: Define in `src/presets/defaultPresets.ts`
```typescript
{
  id: 'my-cool-preset',
  name: 'Electric Abyss',
  description: 'Deep sub-bass responsive geometry with neon cyan aura',
  visualizer: 'oscilloscope',
  oscilloscopeConfig: {
    mode: 'circular',
    waveHeight: 2.0,
    thickness: 3.5,
    density: 2,
    fill: true,
    fillOpacity: 0.15,
    glowStrength: 0.9,
    radialRadius: 180,
    spiralTightness: 1.0,
    layers: []
  },
  colors: PALETTES.neon,
  effects: {
    glow: 0.9,
    trail: 0.65,
    blur: 0,
    chromaticAberration: 0.3,
    distortion: 0.2,
    noise: 0.05,
    particles: true,
    particleCount: 160,
    symmetry: 1,
    rotationSpeed: 0.1,
    pulseIntensity: 1.4,
    cameraShake: true,
    transparentBg: false
  },
  reactivity: {
    smoothing: 0.75,
    sensitivity: 1.4,
    bassInfluence: 1.8,
    midInfluence: 1.1,
    trebleInfluence: 1.2,
    beatInfluence: 1.6,
    attack: 0.85,
    decay: 0.3
  }
}
```

---

## 4. Adding a Post-Processing Effect

To add a new visual effect (e.g. RGB Split or Scanlines):

1. Add configuration fields to `EffectsConfig` in `src/types/index.ts`.
2. Add control sliders/toggles in `ControlsInspector.tsx` under the `'effects'` tab.
3. Apply the effect in `VisualizerEngine.render()` or within specific visualizer renderers using 2D Canvas compositing or pixel operations.
