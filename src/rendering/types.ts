import { AudioAnalysis, ColorPalette, EffectsConfig, OscilloscopeConfig, AudioReactivityConfig } from '../types';

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
