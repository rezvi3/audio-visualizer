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
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/70 via-purple-950/40 to-studio-900 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Orbit className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px] font-mono">
              XY Lissajous Vector
            </span>
          </div>
          <p className="text-[10px] text-cyan-300/80 mt-0.5 font-mono">
            Direct Web Audio Channel Splitter
          </p>
        </div>
        <button
          onClick={randomizeXY}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-[11px] font-medium transition-all active:scale-95 shadow-[0_0_8px_rgba(0,240,255,0.2)] cursor-pointer"
          title="Randomize XY Geometry & Beam"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Random XY</span>
        </button>
      </div>

      {/* ================= 1. SIGNAL SOURCE ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
            1. Signal Routing
          </span>
          <span className="text-[10px] font-mono text-slate-400">X(t) vs Y(t)</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'stereo', name: 'Stereo XY (L/R)', desc: 'X = Left, Y = Right' },
            { id: 'synthesized', name: 'Lissajous Synth', desc: 'Audio-driven math ratios' },
            { id: 'bass-treble', name: 'Bass vs Treble', desc: 'X = Bass, Y = Treble' },
            { id: 'mid-high', name: 'Mid vs High-Mid', desc: 'X = Mid, Y = High-Mid' },
            { id: 'bass-mid', name: 'Bass vs Mid', desc: 'X = Bass, Y = Mid' },
            { id: 'mono', name: 'Mono Quadrature', desc: '90° Hilbert delay' },
          ].map((src) => (
            <button
              key={src.id}
              onClick={() => updateXYConfig({ sourceMode: src.id as XYSignalSource })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                xyConfig.sourceMode === src.id
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 hover:border-white/[0.14] text-slate-300'
              }`}
            >
              <div className="font-semibold text-[11px] truncate">{src.name}</div>
              <div className="text-[9px] text-slate-400 truncate mt-0.5 font-mono">{src.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= 2. GEOMETRY & FREQUENCY RATIOS ================= */}
      <div className="space-y-3 pt-3 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
            2. Harmonic Ratios & Phase
          </span>
          <span className="text-[10px] font-mono text-slate-400">fx : fy</span>
        </div>

        {/* Ratio Quick Presets */}
        <div>
          <label className="text-slate-300 text-[11px] block mb-1.5 font-medium">Harmonic Frequency Ratio Preset</label>
          <div className="grid grid-cols-5 gap-1.5">
            {RATIO_PRESETS.map((rp) => (
              <button
                key={rp.label}
                onClick={() => updateXYConfig({
                  freqRatioX: rp.rx,
                  freqRatioY: rp.ry,
                  ratioPreset: rp.label
                })}
                className={`py-1 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                  xyConfig.freqRatioX === rp.rx && xyConfig.freqRatioY === rp.ry
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                    : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 text-slate-400 hover:text-white'
                }`}
              >
                {rp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Ratios Sliders */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl bg-studio-900/60 border border-white/[0.06]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-300 text-[11px] font-medium">Ratio X</span>
              <span className="font-mono text-cyan-300 text-[10px] px-1.5 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{xyConfig.freqRatioX.toFixed(1)}</span>
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

          <div className="p-2.5 rounded-xl bg-studio-900/60 border border-white/[0.06]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-300 text-[11px] font-medium">Ratio Y</span>
              <span className="font-mono text-cyan-300 text-[10px] px-1.5 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{xyConfig.freqRatioY.toFixed(1)}</span>
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

        {/* Phase Speed */}
        <div className="p-2.5 rounded-xl bg-studio-900/60 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-300 font-medium">Phase Rotation Velocity</span>
            <span className="font-mono text-cyan-300 text-[10px] px-1.5 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{xyConfig.phaseSpeed.toFixed(2)}</span>
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
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-white/[0.06] text-slate-300 text-[11px] hover:border-cyan-500/30">
            <input
              type="checkbox"
              checked={xyConfig.reactiveFrequencyRatio}
              onChange={(e) => updateXYConfig({ reactiveFrequencyRatio: e.target.checked })}
              className="rounded bg-studio-800 border-white/[0.1] text-cyan-500 focus:ring-0"
            />
            <span>Audio Morphs Ratio</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-white/[0.06] text-slate-300 text-[11px] hover:border-cyan-500/30">
            <input
              type="checkbox"
              checked={xyConfig.reactivePhase}
              onChange={(e) => updateXYConfig({ reactivePhase: e.target.checked })}
              className="rounded bg-studio-800 border-white/[0.1] text-cyan-500 focus:ring-0"
            />
            <span>Bass Advances Phase</span>
          </label>
        </div>
      </div>

      {/* ================= 3. BEAM STYLE & LUMINESCENCE ================= */}
      <div className="space-y-3 pt-3 border-t border-white/[0.08]">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
          3. Beam Style & Phosphor Bloom
        </span>

        <div>
          <label className="text-slate-300 text-[11px] block mb-1.5 font-medium">Beam Shader Profile</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'neon', label: 'Neon Bloom' },
              { id: 'gradient', label: 'Spectral Gradient' },
              { id: 'multiline', label: 'Multi-Phase Beam' },
              { id: 'solid', label: 'Solid Vector Trace' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => updateXYConfig({ beamStyle: b.id as XYBeamStyle })}
                className={`py-2 px-2.5 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                  xyConfig.beamStyle === b.id
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 text-slate-300 hover:text-white'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-studio-900/60 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-300 font-medium">Vector Beam Thickness</span>
            <span className="font-mono text-cyan-300 text-[10px] px-1.5 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{xyConfig.thickness.toFixed(1)} px</span>
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

        <div className="p-2.5 rounded-xl bg-studio-900/60 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-300 font-medium">Luminescent Glow Intensity</span>
            <span className="font-mono text-cyan-300 text-[10px] px-1.5 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{xyConfig.glowIntensity.toFixed(1)}×</span>
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

        <div className="p-2.5 rounded-xl bg-studio-900/60 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-300 font-medium">Phosphor Persistence (Trails)</span>
            <span className="font-mono text-cyan-300 text-[10px] px-1.5 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{Math.round(xyConfig.trailPersistence * 100)}%</span>
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
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-white/[0.06] text-slate-300 text-[11px] hover:border-cyan-500/30">
            <input
              type="checkbox"
              checked={xyConfig.reactiveLineWidth}
              onChange={(e) => updateXYConfig({ reactiveLineWidth: e.target.checked })}
              className="rounded bg-studio-800 border-white/[0.1] text-cyan-500 focus:ring-0"
            />
            <span>Bass Modulates Width</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-white/[0.06] text-slate-300 text-[11px] hover:border-cyan-500/30">
            <input
              type="checkbox"
              checked={xyConfig.velocityModulation}
              onChange={(e) => updateXYConfig({ velocityModulation: e.target.checked })}
              className="rounded bg-studio-800 border-white/[0.1] text-cyan-500 focus:ring-0"
            />
            <span>Velocity Luminance</span>
          </label>
        </div>
      </div>

      {/* ================= 4. DISTORTION & KALEIDOSCOPE SYMMETRY ================= */}
      <div className="space-y-3 pt-3 border-t border-white/[0.08]">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
          4. Radial Symmetry & Non-Linear Warp
        </span>

        <div>
          <label className="text-slate-300 text-[11px] block mb-1.5 font-medium">Kaleidoscope Radial Symmetry</label>
          <div className="grid grid-cols-8 gap-1">
            {SYMMETRIES.map((sym) => (
              <button
                key={sym}
                onClick={() => updateXYConfig({ symmetry: sym })}
                className={`py-1.5 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                  xyConfig.symmetry === sym
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                    : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 text-slate-400 hover:text-white'
                }`}
              >
                {sym}×
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-300 text-[11px] block mb-1.5 font-medium">Warp Distortion</label>
            <select
              value={xyConfig.distortionType}
              onChange={(e) => updateXYConfig({ distortionType: e.target.value as XYDistortionType })}
              className="w-full bg-studio-950 border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/60"
            >
              <option value="none">None (Clean)</option>
              <option value="radial">Radial Swirl</option>
              <option value="wave">Waveform Ripple</option>
              <option value="noise">Procedural Noise</option>
              <option value="frequency">FFT Harmonics</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 text-[11px] block mb-1.5 font-medium">Strength</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={xyConfig.distortionAmount}
              onChange={(e) => updateXYConfig({ distortionAmount: parseFloat(e.target.value) })}
              className="w-full mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-white/[0.06] text-slate-300 text-[11px] hover:border-cyan-500/30">
            <input
              type="checkbox"
              checked={xyConfig.polarMode}
              onChange={(e) => updateXYConfig({ polarMode: e.target.checked })}
              className="rounded bg-studio-800 border-white/[0.1] text-cyan-500 focus:ring-0"
            />
            <span>Polar Mapping (R/θ)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-studio-900/60 border border-white/[0.06] text-slate-300 text-[11px] hover:border-cyan-500/30">
            <input
              type="checkbox"
              checked={xyConfig.kaleidoscope}
              onChange={(e) => updateXYConfig({ kaleidoscope: e.target.checked })}
              className="rounded bg-studio-800 border-white/[0.1] text-cyan-500 focus:ring-0"
            />
            <span>Mirror Reflection</span>
          </label>
        </div>
      </div>

      {/* ================= 5. CURATED XY PRESETS ================= */}
      <div className="space-y-3 pt-3 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
            5. Flagship XY Presets
          </span>
          <span className="text-[10px] font-mono text-slate-400">{XY_FLAGSHIP_PRESETS.length}</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {XY_FLAGSHIP_PRESETS.map((p) => {
            const isCurrent = activeXYPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadXYPreset(p.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 hover:border-white/[0.14] text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">{p.name}</span>
                  {isCurrent && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 font-mono">
                  {p.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
