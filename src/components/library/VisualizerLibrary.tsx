import React, { useState } from 'react';
import { 
  Activity, 
  CircleDot, 
  Sun, 
  Orbit, 
  Waves, 
  Compass, 
  Boxes, 
  BarChart2, 
  Disc, 
  Sparkles, 
  Grid, 
  Radio,
  Zap,
  Search,
  Check
} from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { VisualizerType, OscilloscopeMode } from '../../types';

interface ModeItem {
  id: OscilloscopeMode;
  name: string;
  desc: string;
  category: string;
  icon: React.ElementType;
}

interface VisualizerItem {
  id: VisualizerType;
  name: string;
  desc: string;
  category: string;
  icon: React.ElementType;
}

const OSCILLOSCOPE_MODES: ModeItem[] = [
  { id: 'classic', name: 'Classic Line', desc: 'Standard time-domain waveform', category: 'waveform', icon: Activity },
  { id: 'mirror', name: 'Mirror Wave', desc: 'Symmetrical vertical envelope', category: 'waveform', icon: Waves },
  { id: 'double', name: 'Double Wave', desc: 'Dual phase-offset waveforms', category: 'waveform', icon: Activity },
  { id: 'circular', name: 'Circular Ring', desc: '360° polar coordinate ring', category: 'geometric', icon: CircleDot },
  { id: 'radial', name: 'Radial Starburst', desc: 'Audio amplitude starburst', category: 'geometric', icon: Sun },
  { id: 'spiral', name: 'Spiral Vortex', desc: 'Archimedean reactive spiral', category: 'geometric', icon: Compass },
  { id: 'tunnel', name: 'Wave Tunnel', desc: 'Concentric depth geometry', category: '3d', icon: Boxes },
  { id: 'lissajous', name: 'Lissajous XY', desc: 'Dual-phase parametric figures', category: 'vector', icon: Orbit },
  { id: 'orbital', name: 'Orbital System', desc: 'Gravitational orbiting nodes', category: 'particles', icon: Orbit },
  { id: 'fluid', name: 'Fluid Ribbon', desc: 'Harmonic wave mesh field', category: 'mesh', icon: Waves },
];

const OTHER_VISUALIZERS: VisualizerItem[] = [
  { id: 'spectrum-bars', name: 'Master Spectrum', desc: '64-band equalizer with peak decay', category: 'spectral', icon: BarChart2 },
  { id: 'circular-spectrum', name: 'Circular EQ', desc: '360° radial frequency equalizer', category: 'spectral', icon: Disc },
  { id: 'particle-field', name: 'Particle Field', desc: 'Dynamic velocity audio particles', category: 'generative', icon: Sparkles },
  { id: 'wave-tunnel', name: '3D Wave Tunnel', desc: 'Perspective wireframe tunnel', category: '3d', icon: Boxes },
  { id: 'frequency-rings', name: 'Frequency Rings', desc: 'Harmonic octave rings', category: 'spectral', icon: Radio },
  { id: 'reactive-grid', name: 'Synthwave Grid', desc: '3D horizon undulating terrain', category: '3d', icon: Grid },
];

export const VisualizerLibrary: React.FC = () => {
  const { 
    visualizer, 
    setVisualizer, 
    oscilloscopeConfig, 
    setOscilloscopeMode, 
    xyConfig,
    updateXYConfig,
    libraryCollapsed 
  } = useVisualizerStore();

  const [searchQuery, setSearchQuery] = useState('');

  if (libraryCollapsed) {
    return null;
  }

  const isXY = visualizer === 'xy-oscilloscope';

  const filteredOscilloscope = OSCILLOSCOPE_MODES.filter(
    (m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOther = OTHER_VISUALIZERS.filter(
    (v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-72 border-r border-white/[0.08] bg-studio-900/95 backdrop-blur-xl flex flex-col h-[calc(100vh-3.5rem-5rem)] select-none z-20 shadow-xl">
      {/* Header and Live Search */}
      <div className="p-3.5 border-b border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
            <span>Library</span>
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-850 border border-white/[0.06] text-slate-400">
            {OSCILLOSCOPE_MODES.length + OTHER_VISUALIZERS.length + 1} ENGINES
          </span>
        </div>

        {/* Search Input Field */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search engines & modes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-studio-950/80 border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
          />
        </div>
      </div>

      {/* Visualizers Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* ================= FLAGSHIP XY LISSAJOUS ================= */}
        {('xy oscilloscope lissajous vector'.includes(searchQuery.toLowerCase()) || !searchQuery) && (
          <div>
            <div className="px-1 py-0.5 flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                Flagship Instrument
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(0,240,255,0.3)] font-bold">
                FLAGSHIP
              </span>
            </div>

            <div className={`p-3 rounded-xl border transition-all ${
              isXY
                ? 'bg-gradient-to-b from-cyan-950/50 via-studio-850 to-studio-900 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.18)]'
                : 'bg-studio-850/60 hover:bg-studio-850 border-white/[0.08] hover:border-cyan-500/40'
            }`}>
              <button
                onClick={() => setVisualizer('xy-oscilloscope')}
                className="w-full text-left flex items-start gap-2.5 cursor-pointer"
              >
                <div className={`p-2 rounded-lg mt-0.5 transition-all ${
                  isXY 
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]' 
                    : 'bg-studio-800 text-cyan-400 border border-white/[0.06]'
                }`}>
                  <Orbit className={`w-4 h-4 ${isXY ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate flex items-center justify-between">
                    <span className={isXY ? 'text-white' : 'text-slate-200'}>XY Oscilloscope</span>
                    {isXY ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" />
                    ) : null}
                  </div>
                  <div className="text-[10px] text-cyan-300/80 truncate mt-0.5 font-mono">
                    Lissajous Vector Beam
                  </div>
                </div>
              </button>

              {/* Quick source pills if active */}
              {isXY && (
                <div className="mt-3 pt-2.5 border-t border-cyan-500/20 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Signal Channel
                  </div>
                  <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                    <button
                      onClick={() => updateXYConfig({ sourceMode: 'stereo' })}
                      className={`px-2 py-1 rounded text-left transition-all ${
                        xyConfig.sourceMode === 'stereo'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-studio-900/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      Stereo (L/R)
                    </button>
                    <button
                      onClick={() => updateXYConfig({ sourceMode: 'synthesized' })}
                      className={`px-2 py-1 rounded text-left transition-all ${
                        xyConfig.sourceMode === 'synthesized'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-studio-900/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      Math Synth
                    </button>
                    <button
                      onClick={() => updateXYConfig({ sourceMode: 'bass-treble' })}
                      className={`px-2 py-1 rounded text-left transition-all ${
                        xyConfig.sourceMode === 'bass-treble'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-studio-900/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      Bass vs Treble
                    </button>
                    <button
                      onClick={() => updateXYConfig({ sourceMode: 'mono' })}
                      className={`px-2 py-1 rounded text-left transition-all ${
                        xyConfig.sourceMode === 'mono'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-studio-900/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      Mono 90°
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TIME-DOMAIN OSCILLOSCOPE MODES ================= */}
        {filteredOscilloscope.length > 0 && (
          <div>
            <div className="px-1 py-0.5 flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Time-Domain Waveforms
              </span>
              <span className="text-[9px] font-mono text-slate-500">{filteredOscilloscope.length}</span>
            </div>

            <div className="space-y-1">
              {filteredOscilloscope.map((item) => {
                const Icon = item.icon;
                const isSelected = visualizer === 'oscilloscope' && oscilloscopeConfig.mode === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setVisualizer('oscilloscope');
                      setOscilloscopeMode(item.id);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/60 to-studio-850 text-cyan-200 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                        : 'bg-studio-900/40 hover:bg-studio-850/80 text-slate-300 hover:text-white border-transparent hover:border-white/[0.06]'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md mt-0.5 ${
                      isSelected ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-studio-800 text-slate-400'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate flex items-center justify-between">
                        <span>{item.name}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STUDIO GENERATORS ================= */}
        {filteredOther.length > 0 && (
          <div>
            <div className="px-1 py-0.5 flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Frequency & 3D Studios
              </span>
              <span className="text-[9px] font-mono text-slate-500">{filteredOther.length}</span>
            </div>

            <div className="space-y-1">
              {filteredOther.map((item) => {
                const Icon = item.icon;
                const isSelected = visualizer === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setVisualizer(item.id)}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-fuchsia-950/60 to-studio-850 text-fuchsia-200 border-fuchsia-500/50 shadow-sm shadow-fuchsia-500/10'
                        : 'bg-studio-900/40 hover:bg-studio-850/80 text-slate-300 hover:text-white border-transparent hover:border-white/[0.06]'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md mt-0.5 ${
                      isSelected ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : 'bg-studio-800 text-slate-400'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate flex items-center justify-between">
                        <span>{item.name}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-fuchsia-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
