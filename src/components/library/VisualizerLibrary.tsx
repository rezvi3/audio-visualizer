import React from 'react';
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
  Flame,
  Layers
} from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { VisualizerType, OscilloscopeMode, XYSignalSource } from '../../types';

interface ModeItem {
  id: OscilloscopeMode;
  name: string;
  desc: string;
  icon: React.ElementType;
}

interface VisualizerItem {
  id: VisualizerType;
  name: string;
  desc: string;
  icon: React.ElementType;
}

const OSCILLOSCOPE_MODES: ModeItem[] = [
  { id: 'classic', name: 'Classic Line', desc: 'Standard time-domain waveform', icon: Activity },
  { id: 'mirror', name: 'Mirror Wave', desc: 'Symmetrical vertical envelope', icon: Waves },
  { id: 'double', name: 'Double Wave', desc: 'Dual phase-offset waveforms', icon: Activity },
  { id: 'circular', name: 'Circular Ring', desc: '360° polar coordinate ring', icon: CircleDot },
  { id: 'radial', name: 'Radial Starburst', desc: 'Audio amplitude starburst', icon: Sun },
  { id: 'spiral', name: 'Spiral Vortex', desc: 'Archimedean reactive spiral', icon: Compass },
  { id: 'tunnel', name: 'Wave Tunnel', desc: 'Concentric depth geometry', icon: Boxes },
  { id: 'lissajous', name: 'Lissajous XY', desc: 'Dual-phase parametric figures', icon: Orbit },
  { id: 'orbital', name: 'Orbital System', desc: 'Gravitational orbiting nodes', icon: Orbit },
  { id: 'fluid', name: 'Fluid Ribbon', desc: 'Harmonic wave mesh field', icon: Waves },
];

const OTHER_VISUALIZERS: VisualizerItem[] = [
  { id: 'spectrum-bars', name: 'Master Spectrum', desc: '64-band equalizer with peak decay', icon: BarChart2 },
  { id: 'circular-spectrum', name: 'Circular EQ', desc: '360° radial frequency equalizer', icon: Disc },
  { id: 'particle-field', name: 'Particle Field', desc: 'Dynamic velocity audio particles', icon: Sparkles },
  { id: 'wave-tunnel', name: '3D Wave Tunnel', desc: 'Perspective wireframe tunnel', icon: Boxes },
  { id: 'frequency-rings', name: 'Frequency Rings', desc: 'Harmonic octave rings', icon: Radio },
  { id: 'reactive-grid', name: 'Synthwave Grid', desc: '3D horizon undulating terrain', icon: Grid },
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

  if (libraryCollapsed) {
    return null;
  }

  const isXY = visualizer === 'xy-oscilloscope';

  return (
    <aside className="w-64 border-r border-studio-800 bg-studio-900/90 backdrop-blur-sm flex flex-col h-[calc(100vh-3.5rem-5rem)] select-none">
      <div className="p-3 border-b border-studio-800">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Visualizer Library
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Select geometry mode & rendering engine
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* ================= FLAGSHIP XY LISSAJOUS ================= */}
        <div>
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              Flagship Engine
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20 font-bold">
              FLAGSHIP
            </span>
          </div>

          <div className="mt-1 space-y-1">
            <button
              onClick={() => setVisualizer('xy-oscilloscope')}
              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                isXY
                  ? 'bg-gradient-to-r from-cyan-950 via-purple-950/40 to-studio-850 text-cyan-100 border border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-studio-850 hover:text-slate-100 border border-studio-750'
              }`}
            >
              <div className={`p-1.5 rounded-lg mt-0.5 ${isXY ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/50' : 'bg-studio-800 text-cyan-400'}`}>
                <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate flex items-center justify-between">
                  <span>XY Oscilloscope</span>
                  {isXY && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <div className="text-[10px] text-cyan-300/80 truncate mt-0.5">
                  Lissajous & Generative Trajectory
                </div>
              </div>
            </button>

            {/* Quick sub-modes when in XY */}
            {isXY && (
              <div className="pl-4 pr-1 py-1 space-y-1">
                <button
                  onClick={() => updateXYConfig({ sourceMode: 'stereo' })}
                  className={`w-full text-left px-2 py-1 rounded text-[11px] font-mono transition-all flex items-center justify-between ${
                    xyConfig.sourceMode === 'stereo'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>• Stereo XY (L/R)</span>
                  {xyConfig.sourceMode === 'stereo' && <span className="text-[9px] text-cyan-400">ACTIVE</span>}
                </button>
                <button
                  onClick={() => updateXYConfig({ sourceMode: 'synthesized' })}
                  className={`w-full text-left px-2 py-1 rounded text-[11px] font-mono transition-all flex items-center justify-between ${
                    xyConfig.sourceMode === 'synthesized'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>• Math Lissajous</span>
                  {xyConfig.sourceMode === 'synthesized' && <span className="text-[9px] text-cyan-400">ACTIVE</span>}
                </button>
                <button
                  onClick={() => updateXYConfig({ sourceMode: 'bass-treble' })}
                  className={`w-full text-left px-2 py-1 rounded text-[11px] font-mono transition-all flex items-center justify-between ${
                    xyConfig.sourceMode === 'bass-treble'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>• Bass vs Treble</span>
                  {xyConfig.sourceMode === 'bass-treble' && <span className="text-[9px] text-cyan-400">ACTIVE</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= TIME-DOMAIN OSCILLOSCOPE MODES ================= */}
        <div>
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Time-Domain Waveforms
            </span>
          </div>

          <div className="mt-1 space-y-1">
            {OSCILLOSCOPE_MODES.map((item) => {
              const Icon = item.icon;
              const isSelected = visualizer === 'oscilloscope' && oscilloscopeConfig.mode === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setVisualizer('oscilloscope');
                    setOscilloscopeMode(item.id);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 to-studio-850 text-cyan-200 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:bg-studio-850 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded-md mt-0.5 ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-studio-800 text-slate-400'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate flex items-center justify-between">
                      <span>{item.name}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= STUDIO VISUALIZERS ================= */}
        <div>
          <div className="px-2 py-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Frequency & Spectrum
            </span>
          </div>

          <div className="mt-1 space-y-1">
            {OTHER_VISUALIZERS.map((item) => {
              const Icon = item.icon;
              const isSelected = visualizer === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setVisualizer(item.id)}
                  className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-fuchsia-950/80 to-studio-850 text-fuchsia-200 border border-fuchsia-500/40 shadow-sm shadow-fuchsia-500/10'
                      : 'text-slate-300 hover:bg-studio-850 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded-md mt-0.5 ${isSelected ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-studio-800 text-slate-400'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate flex items-center justify-between">
                      <span>{item.name}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
