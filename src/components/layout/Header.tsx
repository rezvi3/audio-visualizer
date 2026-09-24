import React from 'react';
import { 
  Activity, 
  Sparkles, 
  Download, 
  Orbit, 
  Zap, 
  PanelLeftClose,
  PanelLeft,
  PanelRightClose,
  PanelRight,
  Sliders,
  BarChart2,
  Waves
} from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { useAudioStore } from '../../state/useAudioStore';

interface HeaderProps {
  onBackToShowcase?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackToShowcase }) => {
  const { 
    visualizer,
    setVisualizer,
    randomize, 
    toggleDebugPanel, 
    debugPanelOpen, 
    setExportModalOpen,
    activePresetId,
    presets,
    xyConfig,
    updateXYConfig,
    libraryCollapsed,
    toggleLibrary,
    inspectorCollapsed,
    toggleInspector
  } = useVisualizerStore();

  const { trackInfo, isPlaying, audioSourceType } = useAudioStore();
  const activePreset = presets.find((p) => p.id === activePresetId);
  const isXY = visualizer === 'xy-oscilloscope';

  return (
    <header className="h-14 border-b border-white/[0.08] bg-studio-950/95 backdrop-blur-xl px-3 sm:px-4 flex items-center justify-between select-none z-30 relative shadow-sm">
      {/* 1. Left: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Toggle Library Drawer Button */}
        <button
          onClick={toggleLibrary}
          className={`p-1.5 rounded-lg border text-xs transition-all ${
            !libraryCollapsed 
              ? 'bg-studio-850 border-white/[0.12] text-cyan-400 hover:bg-studio-800' 
              : 'bg-studio-900 border-white/[0.06] text-slate-400 hover:text-white hover:bg-studio-850'
          }`}
          title={libraryCollapsed ? "Open Visualizer Library (Left)" : "Collapse Library"}
        >
          {libraryCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        {onBackToShowcase && (
          <button
            onClick={onBackToShowcase}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-studio-900 border border-white/[0.08] text-slate-300 font-mono text-[11px] tracking-wider uppercase hover:border-[#2F5BFF]/80 hover:text-white hover:shadow-[0_0_12px_rgba(47,91,255,0.25)] transition-all cursor-pointer"
            title="Return to Technical Product Presentation"
          >
            <span className="text-[#2F5BFF] font-bold">←</span>
            <span className="hidden sm:inline">SHOWCASE</span>
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-fuchsia-500 p-[1px] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <div className="w-full h-full bg-studio-950 rounded-[7px] flex items-center justify-center">
              <Orbit className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                Oscillo Studio
              </span>
              <span className="hidden md:inline-flex text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_8px_rgba(0,240,255,0.15)]">
                PRO 2.0
              </span>
            </div>
            <p className="hidden xs:flex text-[10px] text-slate-400 font-mono items-center gap-1.5 leading-none mt-0.5">
              {isXY ? (
                <>
                  <span className="text-cyan-400 font-semibold">XY LISSAJOUS</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400 uppercase">{xyConfig.sourceMode} ({xyConfig.ratioPreset || '1:2'})</span>
                </>
              ) : (
                <>
                  <span className="text-slate-300">{activePreset?.name || 'Custom Preset'}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400 uppercase">{visualizer}</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Center: Quick Mode Deck & Live Track Indicator */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Quick Mode Switcher Pills */}
        <div className="flex items-center bg-studio-900/90 p-0.5 rounded-lg border border-white/[0.08] text-[11px] font-mono">
          <button
            onClick={() => {
              setVisualizer('xy-oscilloscope');
              updateXYConfig({ sourceMode: 'stereo' });
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              isXY && xyConfig.sourceMode === 'stereo'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-studio-850'
            }`}
            title="True Stereo Vector Oscilloscope (L vs R)"
          >
            <Zap className="w-3 h-3" />
            <span>STEREO XY</span>
          </button>

          <button
            onClick={() => setVisualizer('oscilloscope')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              visualizer === 'oscilloscope'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-studio-850'
            }`}
            title="Time-Domain Oscilloscope Waveform"
          >
            <Waves className="w-3 h-3" />
            <span>WAVEFORM</span>
          </button>

          <button
            onClick={() => setVisualizer('spectrum-bars')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              visualizer === 'spectrum-bars'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-studio-850'
            }`}
            title="64-Band Spectrum Equalizer"
          >
            <BarChart2 className="w-3 h-3" />
            <span>SPECTRUM</span>
          </button>
        </div>

        {/* Audio Track Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-studio-900/90 border border-white/[0.08] text-xs">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-slate-300 font-medium max-w-[160px] truncate text-[11px]">
            {trackInfo ? trackInfo.name : 'Demo Synth Loaded'}
          </span>
          <span className="text-[9px] font-mono text-cyan-400/90 uppercase px-1.5 py-0.5 rounded bg-studio-850 border border-cyan-500/20">
            {audioSourceType}
          </span>
        </div>
      </div>

      {/* 3. Right: Actions & Inspector Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Randomize Preset */}
        <button
          onClick={randomize}
          className="studio-btn-secondary flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer active:scale-95"
          title={isXY ? "Randomize XY Lissajous geometry & beam" : "Randomize parameters & palette"}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{isXY ? 'Randomize XY' : 'Randomize'}</span>
        </button>

        {/* Real-time Diagnostics Toggle */}
        <button
          onClick={toggleDebugPanel}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            debugPanelOpen 
              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
              : 'bg-studio-900 border-white/[0.08] text-slate-300 hover:bg-studio-850 hover:text-white'
          }`}
          title="Toggle audio FFT diagnostics panel"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Diagnostics</span>
        </button>

        {/* Export Video Button */}
        <button
          onClick={() => setExportModalOpen(true)}
          className="studio-btn-primary flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-slate-950" />
          <span>Export</span>
        </button>

        {/* Toggle Right Inspector Drawer Button */}
        <button
          onClick={toggleInspector}
          className={`p-1.5 rounded-lg border text-xs transition-all ${
            !inspectorCollapsed 
              ? 'bg-studio-850 border-white/[0.12] text-cyan-400 hover:bg-studio-800' 
              : 'bg-studio-900 border-white/[0.06] text-slate-400 hover:text-white hover:bg-studio-850'
          }`}
          title={inspectorCollapsed ? "Open Controls Inspector (Right)" : "Collapse Inspector"}
        >
          {inspectorCollapsed ? <PanelRight className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
