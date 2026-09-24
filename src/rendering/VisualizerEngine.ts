import { AudioAnalysis, ColorPalette, EffectsConfig, OscilloscopeConfig, AudioReactivityConfig, VisualizerType, XYOscilloscopeConfig } from '../types';
import { IVisualizerRenderer, RenderContext } from './types';
import { OscilloscopeRenderer } from '../visualizers/oscilloscope/OscilloscopeRenderer';
import { XYOscilloscopeRenderer } from '../visualizers/oscilloscope/XYOscilloscopeRenderer';
import { SpectrumBarsRenderer } from '../visualizers/spectrum/SpectrumBarsRenderer';
import { CircularSpectrumRenderer } from '../visualizers/circular/CircularSpectrumRenderer';
import { ParticleFieldRenderer } from '../visualizers/particles/ParticleFieldRenderer';
import { WaveTunnelRenderer } from '../visualizers/tunnel/WaveTunnelRenderer';
import { FrequencyRingsRenderer } from '../visualizers/radial/FrequencyRingsRenderer';
import { ReactiveGridRenderer } from '../visualizers/waveform/ReactiveGridRenderer';

export class VisualizerEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private renderers: Map<VisualizerType, IVisualizerRenderer> = new Map();
  private oscilloscopeRenderer: OscilloscopeRenderer;
  private xyOscilloscopeRenderer: XYOscilloscopeRenderer;

  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;

    // Instantiate renderers
    this.xyOscilloscopeRenderer = new XYOscilloscopeRenderer();
    this.oscilloscopeRenderer = new OscilloscopeRenderer();

    // Register FLAGSHIP XY Oscilloscope
    this.renderers.set('xy-oscilloscope', this.xyOscilloscopeRenderer);

    // Register Classic Oscilloscope modes
    this.renderers.set('oscilloscope', this.oscilloscopeRenderer);
    this.renderers.set('circular-oscilloscope', this.oscilloscopeRenderer);
    this.renderers.set('radial', this.oscilloscopeRenderer);
    this.renderers.set('lissajous', this.oscilloscopeRenderer);
    this.renderers.set('orbital', this.oscilloscopeRenderer);
    this.renderers.set('fluid-wave', this.oscilloscopeRenderer);

    // Register studio visualizers
    this.renderers.set('spectrum-bars', new SpectrumBarsRenderer());
    this.renderers.set('circular-spectrum', new CircularSpectrumRenderer());
    this.renderers.set('particle-field', new ParticleFieldRenderer());
    this.renderers.set('wave-tunnel', new WaveTunnelRenderer());
    this.renderers.set('frequency-rings', new FrequencyRingsRenderer());
    this.renderers.set('reactive-grid', new ReactiveGridRenderer());
  }

  public resize(width: number, height: number, dpr = window.devicePixelRatio || 1) {
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  public render(
    visualizer: VisualizerType,
    analysis: AudioAnalysis,
    colors: ColorPalette,
    effects: EffectsConfig,
    oscilloscopeConfig: OscilloscopeConfig,
    reactivity: AudioReactivityConfig,
    timestamp: number,
    xyConfig?: XYOscilloscopeConfig
  ) {
    const width = parseFloat(this.canvas.style.width) || this.canvas.width;
    const height = parseFloat(this.canvas.style.height) || this.canvas.height;

    const deltaTime = this.lastTime ? Math.min(0.1, (timestamp - this.lastTime) / 1000) : 0.016;
    this.lastTime = timestamp;

    const ctx = this.ctx;

    // 1. Background Clearing with Motion Trails / Persistence
    if (effects.transparentBg) {
      ctx.clearRect(0, 0, width, height);
    } else {
      // Trail effect: 0.0 means clear immediately, 0.95 means long ghosting trail
      const trail = visualizer === 'xy-oscilloscope' && xyConfig 
        ? xyConfig.trailPersistence 
        : effects.trail;
      const trailAlpha = Math.max(0.04, 1.0 - trail * 0.93);
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = colors.background || '#07080d';
      ctx.globalAlpha = trailAlpha;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // 2. Camera Shake / Pulse on heavy beats
    ctx.save();
    if (effects.cameraShake && analysis.beat && analysis.beatStrength > 0.25) {
      const shakeAmp = analysis.beatStrength * 7.0;
      const shakeX = (Math.random() * 2 - 1) * shakeAmp;
      const shakeY = (Math.random() * 2 - 1) * shakeAmp;
      ctx.translate(shakeX, shakeY);
    }

    // 3. Rotation if configured in global effects
    if (Math.abs(effects.rotationSpeed) > 0.001 && visualizer !== 'xy-oscilloscope') {
      const cx = width / 2;
      const cy = height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((timestamp / 1000) * effects.rotationSpeed);
      ctx.translate(-cx, -cy);
    }

    // Prepare RenderContext
    const renderContext: RenderContext = {
      ctx,
      width,
      height,
      analysis,
      colors,
      effects,
      oscilloscopeConfig,
      reactivity,
      time: timestamp / 1000,
      deltaTime
    };
    if (xyConfig) {
      (renderContext as any).xyConfig = xyConfig;
    }

    // Special handling: XY Oscilloscope manages its own advanced symmetry, kaleidoscope, and view transforms
    if (visualizer === 'xy-oscilloscope') {
      this.xyOscilloscopeRenderer.render(renderContext);
      ctx.restore();
      return;
    }

    // 4. Kaleidoscope Symmetry Folding for standard visualizers
    const symmetry = Math.max(1, Math.min(8, effects.symmetry || 1));
    const renderer = this.renderers.get(visualizer) || this.oscilloscopeRenderer;

    if (symmetry > 1) {
      const cx = width / 2;
      const cy = height / 2;
      const angleStep = (Math.PI * 2) / symmetry;

      for (let s = 0; s < symmetry; s++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(s * angleStep);
        ctx.translate(-cx, -cy);
        renderer.render(renderContext);
        ctx.restore();
      }
    } else {
      renderer.render(renderContext);
    }

    ctx.restore();
  }
}
