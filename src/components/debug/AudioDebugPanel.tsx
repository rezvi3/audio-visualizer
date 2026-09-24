import React, { useEffect, useState } from 'react';
import { Activity, X, Zap } from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { audioEngine } from '../../audio/AudioEngine';
import { AudioAnalysis } from '../../types';

export const AudioDebugPanel: React.FC = () => {
  const { debugPanelOpen, toggleDebugPanel, reactivity } = useVisualizerStore();
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);

  useEffect(() => {
    if (!debugPanelOpen) return;

    let animId: number;
    const update = () => {
      const data = audioEngine.getAnalysis(reactivity);
      if (data) {
        setAnalysis({ ...data });
      }
      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [debugPanelOpen, reactivity]);

  if (!debugPanelOpen) return null;

  return (
    <div className="absolute top-16 left-68 w-72 bg-studio-900/95 backdrop-blur-md border border-studio-700 rounded-xl shadow-2xl p-3.5 z-40 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-studio-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Audio Diagnostics (FFT)
          </span>
        </div>
        <button
          onClick={toggleDebugPanel}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 space-y-2.5 text-xs font-mono">
        {/* Beat Indicator */}
        <div className="p-2 rounded-lg bg-studio-950 border border-studio-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${analysis?.beat ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
            <span className="text-slate-300">Beat Transient:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              analysis?.beat ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'text-slate-600'
            }`}>
              {analysis?.beat ? 'TRIGGERED' : 'IDLE'}
            </span>
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-75 ${
                analysis?.beat ? 'bg-amber-400 shadow-md shadow-amber-400/80 scale-125' : 'bg-studio-800'
              }`} 
            />
          </div>
        </div>

        {/* Meters */}
        {[
          { label: 'Bass (20-150Hz)', val: analysis?.bass || 0, color: 'bg-rose-500' },
          { label: 'Low-Mid (150-400Hz)', val: analysis?.lowMid || 0, color: 'bg-amber-500' },
          { label: 'Mid (400-2kHz)', val: analysis?.mid || 0, color: 'bg-emerald-500' },
          { label: 'High-Mid (2-6kHz)', val: analysis?.highMid || 0, color: 'bg-sky-500' },
          { label: 'Treble (6-20kHz)', val: analysis?.treble || 0, color: 'bg-indigo-500' },
          { label: 'RMS Loudness', val: analysis?.rms || 0, color: 'bg-fuchsia-500' },
          { label: 'Peak Volume', val: analysis?.volume || 0, color: 'bg-cyan-500' },
        ].map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-slate-200">{(item.val).toFixed(2)}</span>
            </div>
            <div className="h-1.5 w-full bg-studio-950 rounded-full overflow-hidden border border-studio-800">
              <div
                className={`h-full ${item.color} transition-all duration-75`}
                style={{ width: `${Math.min(100, item.val * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
