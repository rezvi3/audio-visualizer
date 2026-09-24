import React, { useEffect, useRef, useState } from 'react';
import { 
  Maximize2, 
  Camera, 
  Grid3X3, 
  Crop, 
  PanelLeft, 
  PanelRight,
  Sparkles,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { audioEngine } from '../../audio/AudioEngine';
import { VisualizerEngine } from '../../rendering/VisualizerEngine';

type GraticuleMode = 'off' | 'cyan' | 'green' | 'amber';
type AspectGuide = 'off' | '16:9' | '9:16' | '1:1';

export const VisualizerCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<VisualizerEngine | null>(null);

  const [fps, setFps] = useState(60);
  const [resolution, setResolution] = useState({ width: 0, height: 0 });
  const [graticule, setGraticule] = useState<GraticuleMode>('off');
  const [aspectGuide, setAspectGuide] = useState<AspectGuide>('off');

  const { 
    visualizer, 
    setVisualizer, 
    updateXYConfig, 
    xyConfig,
    presets, 
    loadPreset, 
    activePresetId,
    libraryCollapsed, 
    toggleLibrary, 
    inspectorCollapsed, 
    toggleInspector 
  } = useVisualizerStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Initialize visualizer engine
    const engine = new VisualizerEngine(canvas);
    engineRef.current = engine;

    // Handle high-DPI responsive resize
    const handleResize = () => {
      if (!container || !canvas || !engine) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      engine.resize(rect.width, rect.height, dpr);
      setResolution({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // 60 FPS RequestAnimationFrame Loop
    let animId: number;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const loop = (timestamp: number) => {
      // Calculate live FPS
      frameCount++;
      if (timestamp - lastFpsUpdate >= 500) {
        setFps(Math.round((frameCount * 1000) / (timestamp - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = timestamp;
      }

      // Fetch state directly from store without causing React re-renders
      const state = useVisualizerStore.getState();
      const analysis = audioEngine.getAnalysis(state.reactivity);

      if (analysis && engineRef.current) {
        engineRef.current.render(
          state.visualizer,
          analysis,
          state.colors,
          state.effects,
          state.oscilloscopeConfig,
          state.reactivity,
          timestamp,
          state.xyConfig
        );
      } else if (engineRef.current) {
        // Fallback idle render with synthetic quiet analysis
        const quietAnalysis = {
          waveform: new Float32Array(1024),
          frequencyData: new Uint8Array(1024),
          frequencyDataNormalized: new Float32Array(1024),
          bass: 0.05,
          lowMid: 0.05,
          mid: 0.05,
          highMid: 0.05,
          treble: 0.05,
          volume: 0.05,
          rms: 0.05,
          beat: false,
          beatStrength: 0,
          timestamp: 0
        };
        // Add subtle idle sine wave so oscilloscope is alive
        for (let i = 0; i < quietAnalysis.waveform.length; i++) {
          quietAnalysis.waveform[i] = Math.sin((i / 50) + timestamp * 0.002) * 0.12;
        }

        engineRef.current.render(
          state.visualizer,
          quietAnalysis,
          state.colors,
          state.effects,
          state.oscilloscopeConfig,
          state.reactivity,
          timestamp,
          state.xyConfig
        );
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  const handleTakeSnapshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `oscillo_frame_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const cycleGraticule = () => {
    const sequence: GraticuleMode[] = ['off', 'cyan', 'green', 'amber'];
    const nextIdx = (sequence.indexOf(graticule) + 1) % sequence.length;
    setGraticule(sequence[nextIdx]);
  };

  const cycleAspectGuide = () => {
    const sequence: AspectGuide[] = ['off', '16:9', '9:16', '1:1'];
    const nextIdx = (sequence.indexOf(aspectGuide) + 1) % sequence.length;
    setAspectGuide(sequence[nextIdx]);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative flex-1 h-[calc(100vh-3.5rem-5rem)] bg-studio-950 flex items-center justify-center overflow-hidden"
    >
      {/* 1. Underlying Main Visualization Canvas */}
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair relative z-0"
      />

      {/* 2. Optional Authentic Oscilloscope Graticule Reticle Overlay */}
      {graticule !== 'off' && (
        <div 
          className={`absolute inset-0 pointer-events-none z-10 ${
            graticule === 'cyan' 
              ? 'studio-graticule' 
              : graticule === 'green' 
                ? 'studio-graticule-green' 
                : 'studio-graticule-amber'
          }`}
        >
          {/* Centered Crosshair Guides */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-full h-[1px] ${
              graticule === 'cyan' ? 'bg-cyan-400/20' : graticule === 'green' ? 'bg-emerald-400/25' : 'bg-amber-400/25'
            }`} />
            <div className={`absolute h-full w-[1px] ${
              graticule === 'cyan' ? 'bg-cyan-400/20' : graticule === 'green' ? 'bg-emerald-400/25' : 'bg-amber-400/25'
            }`} />
          </div>
        </div>
      )}

      {/* 3. Framing Aspect Ratio Guide Mask (16:9, 9:16, 1:1) */}
      {aspectGuide !== 'off' && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div 
            className="border-2 border-dashed border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.2)] bg-cyan-950/5 relative"
            style={{
              width: aspectGuide === '16:9' ? 'min(90%, 90vh * 16 / 9)' : aspectGuide === '9:16' ? 'min(50%, 85vh * 9 / 16)' : 'min(75vh, 75vw)',
              aspectRatio: aspectGuide === '16:9' ? '16/9' : aspectGuide === '9:16' ? '9/16' : '1/1',
              maxHeight: '90%'
            }}
          >
            <span className="absolute top-2 left-2 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-studio-950/80 text-cyan-300 border border-cyan-500/30">
              FRAME GUIDE: {aspectGuide}
            </span>
          </div>
        </div>
      )}

      {/* 4. Left Edge Expand Handle (Visible only when Library is collapsed) */}
      {libraryCollapsed && (
        <button
          onClick={toggleLibrary}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 px-1 py-3 bg-studio-900/90 hover:bg-studio-850 border-r border-y border-white/[0.1] rounded-r-md text-slate-400 hover:text-cyan-400 transition-all shadow-md cursor-pointer"
          title="Open Visualizer Library"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      )}

      {/* 5. Right Edge Expand Handle (Visible only when Inspector is collapsed) */}
      {inspectorCollapsed && (
        <button
          onClick={toggleInspector}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 px-1 py-3 bg-studio-900/90 hover:bg-studio-850 border-l border-y border-white/[0.1] rounded-l-md text-slate-400 hover:text-cyan-400 transition-all shadow-md cursor-pointer"
          title="Open Controls Inspector"
        >
          <PanelRight className="w-4 h-4" />
        </button>
      )}

      {/* 6. Top Left: Real-time Telemetry HUD */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 sm:gap-2 pointer-events-none z-20">
        <div className="px-2.5 py-1 rounded-lg bg-studio-900/85 backdrop-blur-md border border-white/[0.08] text-[10px] sm:text-[11px] font-mono text-slate-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span>{fps} FPS</span>
        </div>
        <div className="hidden xs:flex px-2.5 py-1 rounded-lg bg-studio-900/85 backdrop-blur-md border border-white/[0.08] text-[10px] sm:text-[11px] font-mono text-slate-400 shadow-sm">
          {resolution.width} × {resolution.height}
        </div>
      </div>

      {/* 7. Top Center: Quick Style Presets Bar */}
      <div className="hidden md:flex absolute top-3 left-1/2 -translate-x-1/2 items-center gap-1 px-1.5 py-1 rounded-full bg-studio-900/85 backdrop-blur-md border border-white/[0.08] shadow-lg z-20">
        {presets.slice(0, 5).map((p) => {
          const isActive = activePresetId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => loadPreset(p.id)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-studio-800'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* 8. Top Right: Canvas Quick Actions Dock */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
        {/* CRT Reticle Grid Toggle */}
        <button
          onClick={cycleGraticule}
          className={`p-1.5 sm:px-2 sm:py-1 rounded-lg backdrop-blur-md border text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
            graticule !== 'off'
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'bg-studio-900/80 border-white/[0.08] text-slate-300 hover:bg-studio-850 hover:text-white'
          }`}
          title={`Cycle CRT Oscilloscope Reticle Grid (${graticule.toUpperCase()})`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[10px] uppercase">{graticule === 'off' ? 'GRID' : graticule}</span>
        </button>

        {/* Aspect Ratio Framing Guides */}
        <button
          onClick={cycleAspectGuide}
          className={`p-1.5 sm:px-2 sm:py-1 rounded-lg backdrop-blur-md border text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
            aspectGuide !== 'off'
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'bg-studio-900/80 border-white/[0.08] text-slate-300 hover:bg-studio-850 hover:text-white'
          }`}
          title={`Cycle Composition Frame Guide (${aspectGuide})`}
        >
          <Crop className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[10px] uppercase">{aspectGuide === 'off' ? 'FRAME' : aspectGuide}</span>
        </button>

        {/* Snapshot PNG */}
        <button
          onClick={handleTakeSnapshot}
          className="p-1.5 rounded-lg bg-studio-900/80 hover:bg-studio-850 backdrop-blur-md border border-white/[0.08] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-xs cursor-pointer"
          title="Save High-Res PNG Snapshot"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Mode */}
        <button
          onClick={handleToggleFullscreen}
          className="p-1.5 rounded-lg bg-studio-900/80 hover:bg-studio-850 backdrop-blur-md border border-white/[0.08] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-xs cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
