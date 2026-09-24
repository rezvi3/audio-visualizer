import { create } from 'zustand';
import { 
  VisualizerType, 
  OscilloscopeMode, 
  ColorPalette, 
  EffectsConfig, 
  AudioReactivityConfig, 
  OscilloscopeConfig,
  XYOscilloscopeConfig,
  XYLayerConfig,
  VisualPreset,
  WaveformLayer
} from '../types';
import { DEFAULT_PRESETS } from '../presets/defaultPresets';
import { PALETTES } from '../presets/palettes';
import { XY_FLAGSHIP_PRESETS } from '../presets/xyPresets';

interface VisualizerState {
  // Visualizer settings
  visualizer: VisualizerType;
  oscilloscopeConfig: OscilloscopeConfig;
  xyConfig: XYOscilloscopeConfig;
  colors: ColorPalette;
  effects: EffectsConfig;
  reactivity: AudioReactivityConfig;

  // Presets
  presets: VisualPreset[];
  activePresetId: string;
  activeXYPresetId: string;

  // UI state
  activeTab: 'xy' | 'mode' | 'reactivity' | 'colors' | 'effects' | 'layers' | 'presets';
  debugPanelOpen: boolean;
  exportModalOpen: boolean;
  libraryCollapsed: boolean;
  inspectorCollapsed: boolean;

  // Actions
  setVisualizer: (v: VisualizerType) => void;
  setOscilloscopeMode: (m: OscilloscopeMode) => void;
  updateOscilloscopeConfig: (c: Partial<OscilloscopeConfig>) => void;
  updateXYConfig: (c: Partial<XYOscilloscopeConfig>) => void;
  setColors: (colors: ColorPalette) => void;
  updateCustomColor: (key: keyof ColorPalette, val: string) => void;
  updateEffects: (e: Partial<EffectsConfig>) => void;
  updateReactivity: (r: Partial<AudioReactivityConfig>) => void;
  
  // Layer actions
  addLayer: () => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, layer: Partial<WaveformLayer>) => void;

  // XY Layer actions
  addXYLayer: () => void;
  removeXYLayer: (id: string) => void;
  updateXYLayer: (id: string, layer: Partial<XYLayerConfig>) => void;

  // Presets & Randomization
  loadPreset: (id: string) => void;
  loadXYPreset: (id: string) => void;
  saveCustomPreset: (name: string, description: string) => void;
  deleteCustomPreset: (id: string) => void;
  randomize: () => void;
  randomizeXY: () => void;
  resetCurrent: () => void;

  // UI toggles
  setActiveTab: (t: 'xy' | 'mode' | 'reactivity' | 'colors' | 'effects' | 'layers' | 'presets') => void;
  toggleDebugPanel: () => void;
  setExportModalOpen: (open: boolean) => void;
  toggleLibrary: () => void;
  toggleInspector: () => void;
}

const STORAGE_KEY_CUSTOM_PRESETS = 'audio_visualizer_custom_presets_v1';

const getInitialPresets = (): VisualPreset[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS);
      if (saved) {
        const custom = JSON.parse(saved);
        return [...DEFAULT_PRESETS, ...custom];
      }
    }
  } catch (e) {
    console.error('Failed to load custom presets from storage', e);
  }
  return DEFAULT_PRESETS;
};

const initialXYConfig: XYOscilloscopeConfig = {
  sourceMode: 'stereo',
  beamStyle: 'neon',
  freqRatioX: 1,
  freqRatioY: 2,
  ratioPreset: '1:2',
  reactiveFrequencyRatio: true,
  phaseX: 0,
  phaseY: 0,
  phaseSpeed: 0.5,
  reactivePhase: true,
  ampX: 1.1,
  ampY: 1.1,
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
  glowIntensity: 1.25,
  glowRadius: 30,
  trailPersistence: 0.8,
  beamDecay: 0.85,
  gradientAlongCurve: true,
  gradientStartColor: '#00f0ff',
  gradientMidColor: '#a855f7',
  gradientEndColor: '#ff007f',
  particleEmission: true,
  particleRate: 60,
  zoom: 1.0,
  panX: 0,
  panY: 0,
  rotation: 0,
  rotationSpeed: 0.08,
  beatRotationImpulse: true,
  layers: [],
  generativeMode: false,
  generativeMorphSpeed: 0.5
};

const defaultPreset = DEFAULT_PRESETS[0];

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  // Default to the FLAGSHIP XY Oscilloscope
  visualizer: 'xy-oscilloscope',
  oscilloscopeConfig: { ...defaultPreset.oscilloscopeConfig },
  xyConfig: { ...initialXYConfig },
  colors: PALETTES.neon,
  effects: { ...defaultPreset.effects, glow: 0.9, trail: 0.75 },
  reactivity: { ...defaultPreset.reactivity },

  presets: getInitialPresets(),
  activePresetId: defaultPreset.id,
  activeXYPresetId: XY_FLAGSHIP_PRESETS[0].id,

  activeTab: 'xy',
  debugPanelOpen: false,
  exportModalOpen: false,
  libraryCollapsed: false,
  inspectorCollapsed: false,

  setVisualizer: (visualizer) => {
    set({ visualizer });
    if (visualizer === 'xy-oscilloscope') {
      set({ activeTab: 'xy' });
    }
  },
  
  setOscilloscopeMode: (mode) => set((s) => ({
    oscilloscopeConfig: { ...s.oscilloscopeConfig, mode }
  })),

  updateOscilloscopeConfig: (config) => set((s) => ({
    oscilloscopeConfig: { ...s.oscilloscopeConfig, ...config }
  })),

  updateXYConfig: (config) => set((s) => ({
    xyConfig: { ...s.xyConfig, ...config }
  })),

  setColors: (colors) => set({ colors }),

  updateCustomColor: (key, val) => set((s) => ({
    colors: { ...s.colors, [key]: val }
  })),

  updateEffects: (effects) => set((s) => ({
    effects: { ...s.effects, ...effects }
  })),

  updateReactivity: (reactivity) => set((s) => ({
    reactivity: { ...s.reactivity, ...reactivity }
  })),

  addLayer: () => set((s) => {
    const newLayer: WaveformLayer = {
      id: 'layer_' + Date.now(),
      name: `Wave Layer ${s.oscilloscopeConfig.layers.length + 1}`,
      enabled: true,
      type: 'waveform',
      color: s.colors.accent || '#00f0ff',
      thickness: 2.5,
      amplitude: 1.5,
      verticalOffset: 0,
      rotation: 0,
      opacity: 0.8
    };
    return {
      oscilloscopeConfig: {
        ...s.oscilloscopeConfig,
        layers: [...s.oscilloscopeConfig.layers, newLayer]
      }
    };
  }),

  removeLayer: (id) => set((s) => ({
    oscilloscopeConfig: {
      ...s.oscilloscopeConfig,
      layers: s.oscilloscopeConfig.layers.filter((l) => l.id !== id)
    }
  })),

  updateLayer: (id, layerUpdates) => set((s) => ({
    oscilloscopeConfig: {
      ...s.oscilloscopeConfig,
      layers: s.oscilloscopeConfig.layers.map((l) =>
        l.id === id ? { ...l, ...layerUpdates } : l
      )
    }
  })),

  addXYLayer: () => set((s) => {
    const newLayer: XYLayerConfig = {
      id: 'xy_layer_' + Date.now(),
      name: `XY Orbit ${s.xyConfig.layers.length + 1}`,
      enabled: true,
      xSource: 'synthesized',
      ySource: 'synthesized',
      color: s.colors.secondary || '#ff007f',
      scale: 0.85,
      thickness: 2.5,
      opacity: 0.7,
      rotation: Math.PI / 4,
      phaseOffset: Math.PI / 2,
      freqRatioX: 2,
      freqRatioY: 3
    };
    return {
      xyConfig: {
        ...s.xyConfig,
        layers: [...s.xyConfig.layers, newLayer]
      }
    };
  }),

  removeXYLayer: (id) => set((s) => ({
    xyConfig: {
      ...s.xyConfig,
      layers: s.xyConfig.layers.filter((l) => l.id !== id)
    }
  })),

  updateXYLayer: (id, layerUpdates) => set((s) => ({
    xyConfig: {
      ...s.xyConfig,
      layers: s.xyConfig.layers.map((l) =>
        l.id === id ? { ...l, ...layerUpdates } : l
      )
    }
  })),

  loadPreset: (id) => {
    const preset = get().presets.find((p) => p.id === id);
    if (!preset) return;
    set({
      visualizer: preset.visualizer,
      oscilloscopeConfig: { ...preset.oscilloscopeConfig },
      colors: { ...preset.colors },
      effects: { ...preset.effects },
      reactivity: { ...preset.reactivity },
      activePresetId: preset.id
    });
  },

  loadXYPreset: (id) => {
    const xyPreset = XY_FLAGSHIP_PRESETS.find((p) => p.id === id);
    if (!xyPreset) return;
    const pal = PALETTES[xyPreset.paletteId] || PALETTES.neon;

    set((s) => ({
      visualizer: 'xy-oscilloscope',
      activeXYPresetId: xyPreset.id,
      colors: pal,
      xyConfig: {
        ...s.xyConfig,
        ...xyPreset.config
      },
      effects: {
        ...s.effects,
        glow: xyPreset.glow,
        trail: xyPreset.trail
      }
    }));
  },

  saveCustomPreset: (name, description) => {
    const s = get();
    const newPreset: VisualPreset = {
      id: 'custom_' + Date.now(),
      name: name.trim() || 'Custom Preset',
      description: description.trim() || 'User created preset',
      visualizer: s.visualizer,
      oscilloscopeConfig: { ...s.oscilloscopeConfig },
      colors: { ...s.colors },
      effects: { ...s.effects },
      reactivity: { ...s.reactivity }
    };

    const updatedPresets = [...s.presets, newPreset];
    const customOnly = updatedPresets.filter((p) => p.id.startsWith('custom_'));
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(customOnly));
      }
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    set({ presets: updatedPresets, activePresetId: newPreset.id });
  },

  deleteCustomPreset: (id) => {
    const s = get();
    const updatedPresets = s.presets.filter((p) => p.id !== id);
    const customOnly = updatedPresets.filter((p) => p.id.startsWith('custom_'));
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(customOnly));
      }
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
    set({ presets: updatedPresets, activePresetId: DEFAULT_PRESETS[0].id });
  },

  randomize: () => {
    if (get().visualizer === 'xy-oscilloscope') {
      get().randomizeXY();
      return;
    }

    const palettesArray = Object.values(PALETTES);
    const randPalette = palettesArray[Math.floor(Math.random() * palettesArray.length)];
    const oscModes: OscilloscopeMode[] = [
      'classic', 'mirror', 'double', 'circular', 'radial', 'spiral', 'tunnel', 'lissajous', 'orbital', 'fluid'
    ];
    const randMode = oscModes[Math.floor(Math.random() * oscModes.length)];

    set((s) => ({
      colors: randPalette,
      oscilloscopeConfig: {
        ...s.oscilloscopeConfig,
        mode: randMode,
        waveHeight: Number((0.8 + Math.random() * 2.2).toFixed(2)),
        thickness: Number((1.5 + Math.random() * 4).toFixed(1)),
        glowStrength: Number((0.4 + Math.random() * 0.6).toFixed(2)),
        radialRadius: Math.floor(120 + Math.random() * 100),
        spiralTightness: Number((0.8 + Math.random() * 1.0).toFixed(2))
      },
      effects: {
        ...s.effects,
        glow: Number((0.5 + Math.random() * 0.5).toFixed(2)),
        trail: Number((0.4 + Math.random() * 0.45).toFixed(2)),
        distortion: Number((Math.random() * 0.35).toFixed(2)),
        chromaticAberration: Number((Math.random() * 0.4).toFixed(2)),
        rotationSpeed: Number(((Math.random() - 0.5) * 0.4).toFixed(2)),
        pulseIntensity: Number((0.8 + Math.random() * 0.8).toFixed(2))
      }
    }));
  },

  randomizeXY: () => {
    const palettesArray = Object.values(PALETTES);
    const randPalette = palettesArray[Math.floor(Math.random() * palettesArray.length)];
    const ratios = [
      { rx: 1, ry: 1 },
      { rx: 1, ry: 2 },
      { rx: 2, ry: 3 },
      { rx: 3, ry: 4 },
      { rx: 3, ry: 5 },
      { rx: 4, ry: 5 },
      { rx: 5, ry: 6 },
      { rx: 5, ry: 7 },
      { rx: 7, ry: 8 },
    ];
    const randRatio = ratios[Math.floor(Math.random() * ratios.length)];
    const symmetries = [1, 2, 3, 4, 6, 8, 12, 16] as const;
    const randSym = symmetries[Math.floor(Math.random() * symmetries.length)];
    const beamStyles = ['neon', 'gradient', 'multiline', 'solid'] as const;
    const randBeam = beamStyles[Math.floor(Math.random() * beamStyles.length)];
    const sources = ['stereo', 'bass-treble', 'synthesized', 'mid-high', 'bass-mid'] as const;
    const randSource = sources[Math.floor(Math.random() * sources.length)];
    const distTypes = ['none', 'radial', 'wave', 'frequency'] as const;
    const randDist = distTypes[Math.floor(Math.random() * distTypes.length)];

    set((s) => ({
      visualizer: 'xy-oscilloscope',
      colors: randPalette,
      xyConfig: {
        ...s.xyConfig,
        sourceMode: randSource,
        beamStyle: randBeam,
        freqRatioX: randRatio.rx,
        freqRatioY: randRatio.ry,
        ratioPreset: `${randRatio.rx}:${randRatio.ry}`,
        symmetry: randSym,
        kaleidoscope: randSym > 1 && Math.random() > 0.4,
        distortionType: randDist,
        distortionAmount: Number((0.1 + Math.random() * 0.3).toFixed(2)),
        overallScale: Number((0.85 + Math.random() * 0.35).toFixed(2)),
        thickness: Number((2.5 + Math.random() * 3.0).toFixed(1)),
        glowIntensity: Number((0.9 + Math.random() * 0.6).toFixed(2)),
        trailPersistence: Number((0.65 + Math.random() * 0.25).toFixed(2)),
        rotationSpeed: Number(((Math.random() - 0.5) * 0.3).toFixed(2)),
        gradientAlongCurve: true,
        particleEmission: Math.random() > 0.3
      },
      effects: {
        ...s.effects,
        glow: 0.9,
        trail: 0.75
      }
    }));
  },

  resetCurrent: () => {
    if (get().visualizer === 'xy-oscilloscope') {
      set({ xyConfig: { ...initialXYConfig } });
      return;
    }
    const active = get().presets.find((p) => p.id === get().activePresetId) || DEFAULT_PRESETS[0];
    set({
      visualizer: active.visualizer,
      oscilloscopeConfig: { ...active.oscilloscopeConfig },
      colors: { ...active.colors },
      effects: { ...active.effects },
      reactivity: { ...active.reactivity }
    });
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  toggleDebugPanel: () => set((s) => ({ debugPanelOpen: !s.debugPanelOpen })),
  setExportModalOpen: (exportModalOpen) => set({ exportModalOpen }),
  toggleLibrary: () => set((s) => ({ libraryCollapsed: !s.libraryCollapsed })),
  toggleInspector: () => set((s) => ({ inspectorCollapsed: !s.inspectorCollapsed })),
}));
