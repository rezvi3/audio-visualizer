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
    <aside className="w-80 border-l border-studio-800 bg-studio-900/90 backdrop-blur-sm flex flex-col h-[calc(100vh-3.5rem-5rem)] select-none">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-studio-800 bg-studio-950/60 p-1 gap-1 text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('xy')}
          className={`flex-1 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'xy'
              ? 'bg-gradient-to-r from-cyan-950 to-studio-800 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Flagship XY Oscilloscope & Lissajous Generator"
        >
          <Orbit className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate font-bold">XY PRO</span>
        </button>

        <button
          onClick={() => setActiveTab('mode')}
          className={`flex-1 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'mode'
              ? 'bg-studio-800 text-cyan-400 border border-studio-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Waveform Geometry & Settings"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="truncate">Wave</span>
        </button>

        <button
          onClick={() => setActiveTab('reactivity')}
          className={`flex-1 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'reactivity'
              ? 'bg-studio-800 text-cyan-400 border border-studio-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Audio Reactivity & Sensitivity"
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="truncate">Audio</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'colors'
              ? 'bg-studio-800 text-cyan-400 border border-studio-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Color Palettes & Lighting"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="truncate">Color</span>
        </button>

        <button
          onClick={() => setActiveTab('effects')}
          className={`flex-1 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'effects'
              ? 'bg-studio-800 text-cyan-400 border border-studio-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Visual Effects & Glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="truncate">FX</span>
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'layers'
              ? 'bg-studio-800 text-cyan-400 border border-studio-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Waveform Layers"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="truncate">Layers</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'presets'
              ? 'bg-studio-800 text-cyan-400 border border-studio-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Presets"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span className="truncate">Presets</span>
        </button>
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ================= FLAGSHIP TAB: XY OSCILLOSCOPE ================= */}
        {activeTab === 'xy' && <XYControlsPanel />}

        {/* ================= TAB 1: GEOMETRY ================= */}
        {activeTab === 'mode' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Wave Height / Amplitude</label>
                <span className="font-mono text-cyan-400">{oscilloscopeConfig.waveHeight.toFixed(1)}×</span>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Line Thickness</label>
                <span className="font-mono text-cyan-400">{oscilloscopeConfig.thickness.toFixed(1)} px</span>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Radial Radius (Circular/Radial)</label>
                <span className="font-mono text-cyan-400">{oscilloscopeConfig.radialRadius} px</span>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Spiral Tightness</label>
                <span className="font-mono text-cyan-400">{oscilloscopeConfig.spiralTightness.toFixed(1)}</span>
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

            <div className="pt-2 border-t border-studio-800 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={oscilloscopeConfig.fill}
                  onChange={(e) => updateOscilloscopeConfig({ fill: e.target.checked })}
                  className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
                />
                <span>Fill Translucent Body</span>
              </label>

              {oscilloscopeConfig.fill && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-slate-400">Fill Opacity</label>
                    <span className="font-mono text-cyan-400">{Math.round(oscilloscopeConfig.fillOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={oscilloscopeConfig.fillOpacity}
                    onChange={(e) => updateOscilloscopeConfig({ fillOpacity: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: REACTIVITY ================= */}
        {activeTab === 'reactivity' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Smoothing (Inertia)</label>
                <span className="font-mono text-cyan-400">{Math.round(reactivity.smoothing * 100)}%</span>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Global Sensitivity</label>
                <span className="font-mono text-cyan-400">{reactivity.sensitivity.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="3.0"
                step="0.1"
                value={reactivity.sensitivity}
                onChange={(e) => updateReactivity({ sensitivity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="pt-2 border-t border-studio-800 space-y-3">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Frequency Band Weights
              </span>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300">Bass Influence (Sub / Kicks)</label>
                  <span className="font-mono text-cyan-400">{reactivity.bassInfluence.toFixed(1)}×</span>
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

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300">Mid Influence (Harmonics / Vocals)</label>
                  <span className="font-mono text-cyan-400">{reactivity.midInfluence.toFixed(1)}×</span>
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

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300">Treble Influence (Shimmer / Highs)</label>
                  <span className="font-mono text-cyan-400">{reactivity.trebleInfluence.toFixed(1)}×</span>
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

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300">Beat Transient Strength</label>
                  <span className="font-mono text-cyan-400">{reactivity.beatInfluence.toFixed(1)}×</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={reactivity.beatInfluence}
                  onChange={(e) => updateReactivity({ beatInfluence: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: COLORS ================= */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 font-medium mb-2 block">Curated Palettes</label>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.values(PALETTES).map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => setColors(pal)}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-1.5 transition-all ${
                      colors.id === pal.id
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                        : 'border-studio-800 bg-studio-850 hover:bg-studio-800 text-slate-300'
                    }`}
                  >
                    <span className="text-[11px] font-medium truncate">{pal.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.primary }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.secondary }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-studio-800 space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Custom Color Adjustments
              </span>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Primary Wave Color</span>
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => updateCustomColor('primary', e.target.value)}
                  className="w-7 h-7 rounded border border-studio-700 bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Secondary Accent</span>
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => updateCustomColor('secondary', e.target.value)}
                  className="w-7 h-7 rounded border border-studio-700 bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Glow Aura</span>
                <input
                  type="color"
                  value={colors.glow}
                  onChange={(e) => updateCustomColor('glow', e.target.value)}
                  className="w-7 h-7 rounded border border-studio-700 bg-transparent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Background</span>
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) => updateCustomColor('background', e.target.value)}
                  className="w-7 h-7 rounded border border-studio-700 bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: EFFECTS ================= */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Glow / Bloom</label>
                <span className="font-mono text-cyan-400">{Math.round(effects.glow * 100)}%</span>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Motion Trails (Persistence)</label>
                <span className="font-mono text-cyan-400">{Math.round(effects.trail * 100)}%</span>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Beat Pulse Intensity</label>
                <span className="font-mono text-cyan-400">{effects.pulseIntensity.toFixed(1)}×</span>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Kaleidoscope Symmetry</label>
                <span className="font-mono text-cyan-400">{effects.symmetry} Fold</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 4, 6, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => updateEffects({ symmetry: n })}
                    className={`py-1 rounded border text-xs font-mono ${
                      effects.symmetry === n
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'border-studio-700 bg-studio-800 text-slate-400'
                    }`}
                  >
                    {n}×
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Continuous Rotation</label>
                <span className="font-mono text-cyan-400">{effects.rotationSpeed.toFixed(2)}</span>
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

            <div className="pt-2 border-t border-studio-800 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={effects.cameraShake}
                  onChange={(e) => updateEffects({ cameraShake: e.target.checked })}
                  className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
                />
                <span>Camera Shake on Heavy Kick</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={effects.particles}
                  onChange={(e) => updateEffects({ particles: e.target.checked })}
                  className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
                />
                <span>Atmospheric Particles</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-emerald-400 font-medium">
                <input
                  type="checkbox"
                  checked={effects.transparentBg}
                  onChange={(e) => updateEffects({ transparentBg: e.target.checked })}
                  className="rounded bg-studio-800 border-studio-700 text-emerald-500 focus:ring-0"
                />
                <span>Transparent Background (Video Overlay)</span>
              </label>
            </div>
          </div>
        )}

        {/* ================= TAB 5: LAYERS ================= */}
        {activeTab === 'layers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300">Waveform Layers</span>
              <button
                onClick={addLayer}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 text-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Layer</span>
              </button>
            </div>

            {oscilloscopeConfig.layers.length === 0 ? (
              <div className="p-4 rounded-lg bg-studio-850 border border-dashed border-studio-700 text-center text-slate-500">
                No extra waveform layers active. Click "Add Layer" to layer multiple reacting waveforms!
              </div>
            ) : (
              <div className="space-y-3">
                {oscilloscopeConfig.layers.map((layer) => (
                  <div key={layer.id} className="p-3 rounded-lg bg-studio-850 border border-studio-750 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateLayer(layer.id, { enabled: !layer.enabled })}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          {layer.enabled ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                        </button>
                        <span className="font-medium text-slate-200">{layer.name}</span>
                      </div>
                      <button
                        onClick={() => removeLayer(layer.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-slate-400 block mb-1">Type</label>
                        <select
                          value={layer.type}
                          onChange={(e) => updateLayer(layer.id, { type: e.target.value as WaveformLayer['type'] })}
                          className="w-full bg-studio-800 border border-studio-700 rounded px-1.5 py-1 text-slate-200 text-xs"
                        >
                          <option value="waveform">Waveform</option>
                          <option value="bass">Bass Core</option>
                          <option value="treble">Treble Shimmer</option>
                          <option value="beat">Beat Burst</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Color</label>
                        <input
                          type="color"
                          value={layer.color}
                          onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
                          className="w-full h-7 rounded border border-studio-700 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-[11px]">Amplitude</span>
                        <span className="font-mono text-cyan-400 text-[11px]">{layer.amplitude.toFixed(1)}×</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.1"
                        value={layer.amplitude}
                        onChange={(e) => updateLayer(layer.id, { amplitude: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: PRESETS ================= */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300">Preset Vault</span>
              <button
                onClick={() => setShowSavePreset(!showSavePreset)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-studio-800 hover:bg-studio-750 text-cyan-400 border border-studio-700 text-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save New</span>
              </button>
            </div>

            {showSavePreset && (
              <div className="p-3 rounded-lg bg-studio-850 border border-cyan-500/40 space-y-2">
                <input
                  type="text"
                  placeholder="Preset Name (e.g. Electric Abyss)"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="w-full bg-studio-800 border border-studio-700 rounded px-2.5 py-1 text-slate-200 text-xs"
                />
                <input
                  type="text"
                  placeholder="Short description..."
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  className="w-full bg-studio-800 border border-studio-700 rounded px-2.5 py-1 text-slate-200 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowSavePreset(false)}
                    className="px-2 py-1 rounded text-slate-400 hover:text-slate-200"
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
                    className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-medium"
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
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-950/30 shadow-sm shadow-cyan-500/10'
                        : 'border-studio-800 bg-studio-850 hover:bg-studio-800'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {preset.name}
                        </span>
                        {isCustom && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800">
                            USER
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
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
                          className="p-1 text-slate-500 hover:text-red-400"
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

            <div className="pt-2 border-t border-studio-800">
              <button
                onClick={resetCurrent}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-studio-850 hover:bg-studio-800 text-slate-400 hover:text-slate-200 border border-studio-750 transition-all text-xs"
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
