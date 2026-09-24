import React from 'react';
import { 
  Activity, 
  Sparkles, 
  Download, 
  Orbit, 
  Zap, 
  Radio
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
    activeXYPresetId,
    presets,
    xyConfig,
    updateXYConfig
  } = useVisualizerStore();

  const { trackInfo, isPlaying, audioSourceType } = useAudioStore();
  const activePreset = presets.find((p) => p.id === activePresetId);
  const isXY = visualizer === 'xy-oscilloscope';

  return (
    <header className="h-14 border-b border-studio-800 bg-studio-950 px-4 flex items-center justify-between select-none z-30">
      {/* Brand & Logo + Return to Showcase */}
      <div className="flex items-center gap-3">
        {onBackToShowcase && (
          <button
            onClick={onBackToShowcase}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-900 border border-studio-750 text-slate-300 font-mono text-[11px] tracking-wider uppercase hover:border-cyan-500/60 hover:text-white transition-all cursor-pointer"
            title="Return to Achromatic Technical Product Presentation"
          >
            <span className="text-[#2F5BFF] font-bold">←</span>
            <span>SHOWCASE</span>
          </button>
        )}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Orbit className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-sky-200 to-fuchsia-400 bg-clip-text text-transparent">
              Oscillo Studio
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold shadow-sm shadow-cyan-500/10">
              XY LISSAJOUS FLAGSHIP
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            {isXY ? `XY Mode: ${xyConfig.sourceMode.toUpperCase()} (${xyConfig.ratioPreset || '1:2'})` : (activePreset?.name || 'Custom Preset')}
          </p>
        </div>
      </div>

      {/* Central Track Status & Flagship Quick Switch */}
      <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded-full bg-studio-900 border border-studio-800 text-xs">
        <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
        <span className="text-slate-300 font-medium max-w-xs truncate">
          {trackInfo ? trackInfo.name : 'No Audio Loaded'}
        </span>
        <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-studio-850">
          {audioSourceType}
        </span>

        {/* Quick Stereo XY Button */}
        <button
          onClick={() => {
            setVisualizer('xy-oscilloscope');
            updateXYConfig({ sourceMode: 'stereo' });
          }}
          className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
            isXY && xyConfig.sourceMode === 'stereo'
              ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
              : 'bg-studio-800 text-cyan-400 hover:bg-studio-750'
          }`}
          title="Switch to authentic Left vs Right channel Stereo XY oscilloscope"
        >
          STEREO XY
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Randomize Preset */}
        <button
          onClick={randomize}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-200 border border-studio-750 text-xs font-medium transition-all hover:border-cyan-500/50 hover:text-cyan-400 active:scale-95"
          title={isXY ? "Randomize XY Lissajous geometry & beam" : "Randomize style, colors, and reactive geometry"}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isXY ? 'Randomize XY' : 'Randomize'}</span>
        </button>

        {/* Audio Diagnostics Debug Panel Toggle */}
        <button
          onClick={toggleDebugPanel}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            debugPanelOpen 
              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' 
              : 'bg-studio-850 border-studio-750 text-slate-300 hover:bg-studio-800'
          }`}
          title="Toggle real-time audio FFT diagnostics"
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Diagnostics</span>
        </button>

        {/* Export Video */}
        <button
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Video</span>
        </button>
      </div>
    </header>
  );
};
