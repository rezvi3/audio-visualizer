import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Camera, Zap, Radio } from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { audioEngine } from '../../audio/AudioEngine';
import { VisualizerEngine } from '../../rendering/VisualizerEngine';

export const VisualizerCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<VisualizerEngine | null>(null);

  const [fps, setFps] = useState(60);
  const [resolution, setResolution] = useState({ width: 0, height: 0 });

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
    let lastTime = performance.now();
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

  return (
    <div 
      ref={containerRef} 
      className="relative flex-1 h-[calc(100vh-3.5rem-5rem)] bg-studio-950 flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair"
      />

      {/* Floating Canvas HUD Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <div className="px-2 py-1 rounded bg-studio-900/80 backdrop-blur-md border border-studio-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{fps} FPS</span>
        </div>
        <div className="px-2 py-1 rounded bg-studio-900/80 backdrop-blur-md border border-studio-800 text-[11px] font-mono text-slate-400">
          {resolution.width} × {resolution.height}
        </div>
      </div>

      {/* Floating Canvas Quick Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <button
          onClick={handleTakeSnapshot}
          className="p-1.5 rounded bg-studio-900/80 hover:bg-studio-800 backdrop-blur-md border border-studio-800 text-slate-300 hover:text-cyan-400 transition-all text-xs"
          title="Take PNG snapshot of current frame"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleToggleFullscreen}
          className="p-1.5 rounded bg-studio-900/80 hover:bg-studio-800 backdrop-blur-md border border-studio-800 text-slate-300 hover:text-cyan-400 transition-all text-xs"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
