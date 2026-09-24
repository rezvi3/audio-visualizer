import React from 'react';
import { 
  Orbit, 
  Radio, 
  Sliders, 
  Sparkles, 
  Layers, 
  Bookmark, 
  Wand2, 
  Zap, 
  Compass, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check 
} from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { XY_FLAGSHIP_PRESETS } from '../../presets/xyPresets';
import { XYSignalSource, XYBeamStyle, XYDistortionType, XYSymmetryMode } from '../../types';

export const XYControlsPanel: React.FC = () => {
  const {
    xyConfig,
    updateXYConfig,
    activeXYPresetId,
    loadXYPreset,
    randomizeXY,
    addXYLayer,
    removeXYLayer,
    updateXYLayer,
    colors
  } = useVisualizerStore();

  const RATIO_PRESETS = [
    { label: '1:1', rx: 1, ry: 1 },
    { label: '1:2', rx: 1, ry: 2 },
    { label: '2:3', rx: 2, ry: 3 },
    { label: '3:4', rx: 3, ry: 4 },
    { label: '3:5', rx: 3, ry: 5 },
    { label: '4:5', rx: 4, ry: 5 },
    { label: '5:6', rx: 5, ry: 6 },
    { label: '5:7', rx: 5, ry: 7 },
    { label: '7:8', rx: 7, ry: 8 },
  ];

  const SYMMETRIES: XYSymmetryMode[] = [1, 2, 3, 4, 6, 8, 12, 16];

  return (
    <div className="space-y-5 text-xs">
      {/* Top Flagship Banner & Quick Randomize */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 via-purple-950/40 to-studio-900 border border-cyan-500/30 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Orbit className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              XY Lissajous Engine
            </span>
          </div>
          <p className="text-[10px] text-cyan-300/70 mt-0.5">
            Analog XY Trajectory & Generative Art
          </p>
        </div>
        <button
          onClick={randomizeXY}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-medium transition-all active:scale-95 shadow-sm"
          title="Randomize XY Geometry & Beam"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Random XY</span>
        </button>
      </div>

      {/* ================= 1. SIGNAL SOURCE ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            1. Signal Source Mode
          </span>
          <span className="text-[10px] font-mono text-slate-500">X(t) vs Y(t)</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'stereo', name: 'Stereo XY (L/R)', desc: 'X = Left, Y = Right' },
            { id: 'synthesized', name: 'Lissajous Synth', desc: 'Audio-driven math ratios' },
            { id: 'bass-treble', name: 'Bass vs Treble', desc: 'X = Bass, Y = Treble' },
            { id: 'mid-high', name: 'Mid vs High-Mid', desc: 'X = Mid, Y = High-Mid' },
            { id: 'bass-mid', name: 'Bass vs Mid', desc: 'X = Bass, Y = Mid' },
            { id: 'mono', name: 'Mono Phase Shift', desc: '90° Quadrature delay' },
          ].map((src) => (
            <button
              key={src.id}
              onClick={() => updateXYConfig({ sourceMode: src.id as XYSignalSource })}
              className={`p-2 rounded-lg border text-left transition-all ${
                xyConfig.sourceMode === src.id
                  ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-sm shadow-cyan-500/10'
                  : 'border-studio-800 bg-studio-850 hover:bg-studio-800 text-slate-300'
              }`}
            >
              <div className="font-semibold text-[11px] truncate">{src.name}</div>
              <div className="text-[9px] text-slate-500 truncate mt-0.5">{src.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= 2. GEOMETRY & FREQUENCY RATIOS ================= */}
      <div className="space-y-3 pt-2 border-t border-studio-800">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider block">
          2. Lissajous Ratios & Phase
        </span>

        {/* Ratio Quick Presets */}
        <div>
          <label className="text-slate-400 text-[11px] block mb-1">Harmonic Frequency Ratio (fx : fy)</label>
          <div className="grid grid-cols-5 gap-1">
            {RATIO_PRESETS.map((rp) => (
              <button
                key={rp.label}
                onClick={() => updateXYConfig({
                  freqRatioX: rp.rx,
                  freqRatioY: rp.ry,
                  ratioPreset: rp.label
                })}
                className={`py-1 rounded border text-xs font-mono font-medium transition-all ${
                  xyConfig.freqRatioX === rp.rx && xyConfig.freqRatioY === rp.ry
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 font-bold'
                    : 'border-studio-800 bg-studio-850 hover:bg-studio-800 text-slate-400'
                }`}
              >
                {rp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Ratios Sliders */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 text-[11px]">Ratio X</span>
              <span className="font-mono text-cyan-400">{xyConfig.freqRatioX.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={xyConfig.freqRatioX}
              onChange={(e) => updateXYConfig({ freqRatioX: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 text-[11px]">Ratio Y</span>
              <span className="font-mono text-cyan-400">{xyConfig.freqRatioY.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={xyConfig.freqRatioY}
              onChange={(e) => updateXYConfig({ freqRatioY: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        {/* Phase Speed & Reactive Phase */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 font-medium">Phase Rotation Speed</span>
            <span className="font-mono text-cyan-400">{xyConfig.phaseSpeed.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-1.5"
            max="1.5"
            step="0.05"
            value={xyConfig.phaseSpeed}
            onChange={(e) => updateXYConfig({ phaseSpeed: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Reactive Switches */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
            <input
              type="checkbox"
              checked={xyConfig.reactiveFrequencyRatio}
              onChange={(e) => updateXYConfig({ reactiveFrequencyRatio: e.target.checked })}
              className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
            />
            <span>Audio Morphs Ratio</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
            <input
              type="checkbox"
              checked={xyConfig.reactivePhase}
              onChange={(e) => updateXYConfig({ reactivePhase: e.target.checked })}
              className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
            />
            <span>Bass Advances Phase</span>
          </label>
        </div>
      </div>

      {/* ================= 3. BEAM STYLE & LUMINESCENCE ================= */}
      <div className="space-y-3 pt-2 border-t border-studio-800">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider block">
          3. Electron Beam & Luminous Glow
        </span>

        <div>
          <label className="text-slate-400 text-[11px] block mb-1.5">Beam Rendering Style</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'neon', label: 'Neon Bloom' },
              { id: 'gradient', label: 'Spectral Gradient' },
              { id: 'multiline', label: 'Multi-Beam' },
              { id: 'solid', label: 'Solid Vector' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => updateXYConfig({ beamStyle: b.id as XYBeamStyle })}
                className={`py-1.5 rounded-lg border text-center font-medium transition-all ${
                  xyConfig.beamStyle === b.id
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 font-bold'
                    : 'border-studio-800 bg-studio-850 hover:bg-studio-800 text-slate-400'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 font-medium">Beam Thickness</span>
            <span className="font-mono text-cyan-400">{xyConfig.thickness.toFixed(1)} px</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="12.0"
            step="0.5"
            value={xyConfig.thickness}
            onChange={(e) => updateXYConfig({ thickness: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 font-medium">Glow Intensity</span>
            <span className="font-mono text-cyan-400">{xyConfig.glowIntensity.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={xyConfig.glowIntensity}
            onChange={(e) => updateXYConfig({ glowIntensity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300 font-medium">Phosphor Trail Persistence</span>
            <span className="font-mono text-cyan-400">{Math.round(xyConfig.trailPersistence * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.96"
            step="0.02"
            value={xyConfig.trailPersistence}
            onChange={(e) => updateXYConfig({ trailPersistence: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
            <input
              type="checkbox"
              checked={xyConfig.reactiveLineWidth}
              onChange={(e) => updateXYConfig({ reactiveLineWidth: e.target.checked })}
              className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
            />
            <span>Bass Thickens Beam</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
            <input
              type="checkbox"
              checked={xyConfig.velocityModulation}
              onChange={(e) => updateXYConfig({ velocityModulation: e.target.checked })}
              className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
            />
            <span>Velocity Luminosity</span>
          </label>
        </div>
      </div>

      {/* ================= 4. DISTORTION & KALEIDOSCOPE SYMMETRY ================= */}
      <div className="space-y-3 pt-2 border-t border-studio-800">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider block">
          4. Symmetry & Generative Distortion
        </span>

        <div>
          <label className="text-slate-400 text-[11px] block mb-1">Kaleidoscope Radial Symmetry</label>
          <div className="grid grid-cols-8 gap-1">
            {SYMMETRIES.map((sym) => (
              <button
                key={sym}
                onClick={() => updateXYConfig({ symmetry: sym })}
                className={`py-1 rounded border text-xs font-mono font-medium transition-all ${
                  xyConfig.symmetry === sym
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 font-bold'
                    : 'border-studio-800 bg-studio-850 hover:bg-studio-800 text-slate-400'
                }`}
              >
                {sym}×
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Distortion Type</label>
            <select
              value={xyConfig.distortionType}
              onChange={(e) => updateXYConfig({ distortionType: e.target.value as XYDistortionType })}
              className="w-full bg-studio-800 border border-studio-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="none">None</option>
              <option value="radial">Radial Swirl</option>
              <option value="wave">Waveform Ripple</option>
              <option value="noise">Procedural Noise</option>
              <option value="frequency">FFT Harmonics</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Strength</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={xyConfig.distortionAmount}
              onChange={(e) => updateXYConfig({ distortionAmount: parseFloat(e.target.value) })}
              className="w-full mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
            <input
              type="checkbox"
              checked={xyConfig.polarMode}
              onChange={(e) => updateXYConfig({ polarMode: e.target.checked })}
              className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
            />
            <span>Polar Mapping (R/θ)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
            <input
              type="checkbox"
              checked={xyConfig.kaleidoscope}
              onChange={(e) => updateXYConfig({ kaleidoscope: e.target.checked })}
              className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
            />
            <span>Mirror Reflection</span>
          </label>
        </div>
      </div>

      {/* ================= 5. MULTI-LAYER XY CURVES ================= */}
      <div className="space-y-3 pt-2 border-t border-studio-800">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            5. Multi-Layer XY Curves
          </span>
          <button
            onClick={addXYLayer}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-medium transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>Add Layer</span>
          </button>
        </div>

        {xyConfig.layers.length === 0 ? (
          <p className="text-[10px] text-slate-500 italic">
            Single primary trajectory. Click "Add Layer" to render multiple harmonic curves simultaneously.
          </p>
        ) : (
          <div className="space-y-2">
            {xyConfig.layers.map((layer) => (
              <div key={layer.id} className="p-2.5 rounded-lg bg-studio-850 border border-studio-750 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateXYLayer(layer.id, { enabled: !layer.enabled })}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      {layer.enabled ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                    </button>
                    <span className="font-semibold text-slate-200 text-xs">{layer.name}</span>
                  </div>
                  <button
                    onClick={() => removeXYLayer(layer.id)}
                    className="p-1 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Color</label>
                    <input
                      type="color"
                      value={layer.color}
                      onChange={(e) => updateXYLayer(layer.id, { color: e.target.value })}
                      className="w-full h-6 rounded border border-studio-700 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-slate-400">Scale</span>
                      <span className="font-mono text-cyan-400">{layer.scale.toFixed(2)}×</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1.5"
                      step="0.05"
                      value={layer.scale}
                      onChange={(e) => updateXYLayer(layer.id, { scale: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= 6. 15 FLAGSHIP PRESETS ================= */}
      <div className="space-y-3 pt-2 border-t border-studio-800">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider block">
          6. Flagship Lissajous Presets (15 Presets)
        </span>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {XY_FLAGSHIP_PRESETS.map((p) => {
            const isSelected = activeXYPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadXYPreset(p.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-sm shadow-cyan-500/10'
                    : 'border-studio-800 bg-studio-850 hover:bg-studio-800 text-slate-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                    <span className={isSelected ? 'text-cyan-300' : 'text-slate-200'}>{p.name}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {p.description}
                  </p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-cyan-400 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
