import React, { useState } from 'react';
import { 
  Sliders, 
  Palette, 
  Sparkles, 
  Layers, 
  Bookmark, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check,
  Radio,
  Eye,
  EyeOff,
  Orbit
} from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { PALETTES } from '../../presets/palettes';
import { ColorPalette, WaveformLayer } from '../../types';
import { XYControlsPanel } from './XYControlsPanel';

export const ControlsInspector: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    oscilloscopeConfig,
    updateOscilloscopeConfig,
    reactivity,
    updateReactivity,
    colors,
    setColors,
    updateCustomColor,
    effects,
    updateEffects,
    addLayer,
    removeLayer,
    updateLayer,
    presets,
    activePresetId,
    loadPreset,
    saveCustomPreset,
    deleteCustomPreset,
    resetCurrent,
    inspectorCollapsed
  } = useVisualizerStore();

  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  if (inspectorCollapsed) return null;

  return (
    <aside className="w-80 sm:w-84 border-l border-white/[0.08] bg-studio-900/95 backdrop-blur-xl flex flex-col h-[calc(100vh-3.5rem-5rem)] select-none z-20 shadow-xl">
      {/* 1. Tab Navigation Header */}
      <div className="grid grid-cols-6 border-b border-white/[0.08] bg-studio-950/80 p-1.5 gap-1 text-[11px] font-mono">
        <button
          onClick={() => setActiveTab('xy')}
          className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'xy'
              ? 'bg-gradient-to-b from-cyan-950 to-studio-850 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-studio-850/60 border-transparent'
          }`}
          title="Flagship XY Oscilloscope & Lissajous Generator"
        >
          <Orbit className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate font-bold text-[9px]">XY PRO</span>
        </button>

        <button
          onClick={() => setActiveTab('mode')}
          className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'mode'
              ? 'bg-gradient-to-b from-cyan-950 to-studio-850 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-studio-850/60 border-transparent'
          }`}
          title="Waveform Geometry & Settings"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="truncate text-[9px]">WAVE</span>
        </button>

        <button
          onClick={() => setActiveTab('reactivity')}
          className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'reactivity'
              ? 'bg-gradient-to-b from-cyan-950 to-studio-850 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-studio-850/60 border-transparent'
          }`}
          title="Audio Reactivity & Sensitivity"
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="truncate text-[9px]">AUDIO</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'colors'
              ? 'bg-gradient-to-b from-cyan-950 to-studio-850 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-studio-850/60 border-transparent'
          }`}
          title="Color Palettes & Lighting"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="truncate text-[9px]">COLOR</span>
        </button>

        <button
          onClick={() => setActiveTab('effects')}
          className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'effects'
              ? 'bg-gradient-to-b from-cyan-950 to-studio-850 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-studio-850/60 border-transparent'
          }`}
          title="Visual Effects & Glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="truncate text-[9px]">FX</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'presets'
              ? 'bg-gradient-to-b from-cyan-950 to-studio-850 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-studio-850/60 border-transparent'
          }`}
          title="Preset Vault"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span className="truncate text-[9px]">PRESET</span>
        </button>
      </div>

      {/* 2. Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ================= FLAGSHIP TAB: XY OSCILLOSCOPE ================= */}
        {activeTab === 'xy' && <XYControlsPanel />}

        {/* ================= TAB 1: GEOMETRY ================= */}
        {activeTab === 'mode' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Wave Height / Amplitude</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{oscilloscopeConfig.waveHeight.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="4.0"
                step="0.1"
                value={oscilloscopeConfig.waveHeight}
                onChange={(e) => updateOscilloscopeConfig({ waveHeight: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Line Thickness</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{oscilloscopeConfig.thickness.toFixed(1)} px</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={oscilloscopeConfig.thickness}
                onChange={(e) => updateOscilloscopeConfig({ thickness: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Radial Radius (Circular/Radial)</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{oscilloscopeConfig.radialRadius} px</span>
              </div>
              <input
                type="range"
                min="60"
                max="320"
                step="10"
                value={oscilloscopeConfig.radialRadius}
                onChange={(e) => updateOscilloscopeConfig({ radialRadius: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Spiral Tightness</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{oscilloscopeConfig.spiralTightness.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
                value={oscilloscopeConfig.spiralTightness}
                onChange={(e) => updateOscilloscopeConfig({ spiralTightness: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Wave Glow Strength</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{oscilloscopeConfig.glowStrength.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={oscilloscopeConfig.glowStrength}
                onChange={(e) => updateOscilloscopeConfig({ glowStrength: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Waveform Layers Sub-deck */}
            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-300 flex items-center gap-1.5 font-mono text-[11px] uppercase">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Waveform Layers
                </span>
                <button
                  onClick={addLayer}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Layer</span>
                </button>
              </div>

              {oscilloscopeConfig.layers.map((layer) => (
                <div key={layer.id} className="p-3 rounded-xl bg-studio-900/80 border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateLayer(layer.id, { enabled: !layer.enabled })}
                        className="text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {layer.enabled ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                      </button>
                      <span className="font-medium text-slate-200 text-xs">{layer.name}</span>
                    </div>
                    <button
                      onClick={() => removeLayer(layer.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      title="Delete layer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="text-slate-400 block mb-1">Color</label>
                      <input
                        type="color"
                        value={layer.color}
                        onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
                        className="w-full h-7 rounded border border-white/[0.1] bg-transparent cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Amplitude</label>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.1"
                        value={layer.amplitude}
                        onChange={(e) => updateLayer(layer.id, { amplitude: parseFloat(e.target.value) })}
                        className="w-full mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: AUDIO REACTIVITY ================= */}
        {activeTab === 'reactivity' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Reactivity Sensitivity</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{reactivity.sensitivity.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={reactivity.sensitivity}
                onChange={(e) => updateReactivity({ sensitivity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Smoothing Time Constant</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{Math.round(reactivity.smoothing * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={reactivity.smoothing}
                onChange={(e) => updateReactivity({ smoothing: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Bass Band Influence</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{reactivity.bassInfluence.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={reactivity.bassInfluence}
                onChange={(e) => updateReactivity({ bassInfluence: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Midrange Band Influence</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{reactivity.midInfluence.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={reactivity.midInfluence}
                onChange={(e) => updateReactivity({ midInfluence: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Treble Band Influence</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{reactivity.trebleInfluence.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={reactivity.trebleInfluence}
                onChange={(e) => updateReactivity({ trebleInfluence: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 3: COLORS ================= */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2 font-bold">
                Curated Color Palettes
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PALETTES).map((pal) => (
                  <button
                    key={pal.name}
                    onClick={() => setColors(pal)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      colors.name === pal.name
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-xs mb-1.5">{pal.name}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-white/[0.2]" style={{ backgroundColor: pal.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-white/[0.2]" style={{ backgroundColor: pal.secondary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-white/[0.2]" style={{ backgroundColor: pal.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block font-bold">
                Custom Color Adjustments
              </span>

              <div className="flex items-center justify-between p-2 rounded-lg bg-studio-900/60 border border-white/[0.06]">
                <span className="text-slate-300">Primary Wave Color</span>
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => updateCustomColor('primary', e.target.value)}
                  className="w-7 h-7 rounded border border-white/[0.1] bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-studio-900/60 border border-white/[0.06]">
                <span className="text-slate-300">Secondary Accent</span>
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => updateCustomColor('secondary', e.target.value)}
                  className="w-7 h-7 rounded border border-white/[0.1] bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-studio-900/60 border border-white/[0.06]">
                <span className="text-slate-300">Glow Aura</span>
                <input
                  type="color"
                  value={colors.glow}
                  onChange={(e) => updateCustomColor('glow', e.target.value)}
                  className="w-7 h-7 rounded border border-white/[0.1] bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-studio-900/60 border border-white/[0.06]">
                <span className="text-slate-300">Background</span>
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) => updateCustomColor('background', e.target.value)}
                  className="w-7 h-7 rounded border border-white/[0.1] bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: EFFECTS ================= */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Glow / Bloom</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{Math.round(effects.glow * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={effects.glow}
                onChange={(e) => updateEffects({ glow: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Motion Trails (Persistence)</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{Math.round(effects.trail * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.95"
                step="0.05"
                value={effects.trail}
                onChange={(e) => updateEffects({ trail: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Beat Pulse Intensity</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{effects.pulseIntensity.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.1"
                value={effects.pulseIntensity}
                onChange={(e) => updateEffects({ pulseIntensity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium">Continuous Rotation</label>
                <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{effects.rotationSpeed.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.05"
                value={effects.rotationSpeed}
                onChange={(e) => updateEffects({ rotationSpeed: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-white/[0.06] text-slate-300 text-[11px] hover:border-cyan-500/30">
                <input
                  type="checkbox"
                  checked={effects.cameraShake}
                  onChange={(e) => updateEffects({ cameraShake: e.target.checked })}
                  className="rounded bg-studio-800 border-white/[0.1] text-cyan-500 focus:ring-0"
                />
                <span>Camera Shake on Heavy Kick</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-white/[0.06] text-slate-300 text-[11px] hover:border-cyan-500/30">
                <input
                  type="checkbox"
                  checked={effects.particles}
                  onChange={(e) => updateEffects({ particles: e.target.checked })}
                  className="rounded bg-studio-800 border-white/[0.1] text-cyan-500 focus:ring-0"
                />
                <span>Atmospheric Particles</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-emerald-500/30 text-emerald-400 text-[11px] hover:border-emerald-500/60 font-medium">
                <input
                  type="checkbox"
                  checked={effects.transparentBg}
                  onChange={(e) => updateEffects({ transparentBg: e.target.checked })}
                  className="rounded bg-studio-800 border-white/[0.1] text-emerald-500 focus:ring-0"
                />
                <span>Transparent Background (Video Alpha Overlay)</span>
              </label>
            </div>
          </div>
        )}

        {/* ================= TAB 5: PRESETS ================= */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300 font-mono text-[11px] uppercase">Preset Vault</span>
              <button
                onClick={() => setShowSavePreset(!showSavePreset)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save New</span>
              </button>
            </div>

            {showSavePreset && (
              <div className="p-3.5 rounded-xl bg-studio-900/90 border border-cyan-500/50 space-y-2 shadow-lg">
                <input
                  type="text"
                  placeholder="Preset Name (e.g. Electric Abyss)"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="w-full bg-studio-950 border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/60"
                />
                <input
                  type="text"
                  placeholder="Short description..."
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  className="w-full bg-studio-950 border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/60"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowSavePreset(false)}
                    className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newPresetName.trim()) {
                        saveCustomPreset(newPresetName, newPresetDesc);
                        setNewPresetName('');
                        setNewPresetDesc('');
                        setShowSavePreset(false);
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              {presets.map((preset) => {
                const isActive = preset.id === activePresetId;
                const isCustom = preset.id.startsWith('custom_');

                return (
                  <div
                    key={preset.id}
                    onClick={() => loadPreset(preset.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {preset.name}
                        </span>
                        {isCustom && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            USER
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 font-mono">
                        {preset.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomPreset(preset.id);
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                          title="Delete custom preset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isActive && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.08]">
              <button
                onClick={resetCurrent}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-studio-900 hover:bg-studio-850 text-slate-300 hover:text-white border border-white/[0.08] transition-all text-xs font-mono cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Preset Default</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
