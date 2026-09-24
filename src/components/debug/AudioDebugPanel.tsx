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
    <div className="absolute top-4 left-4 sm:left-76 w-72 sm:w-80 bg-studio-900/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 z-40 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
              FFT Telemetry
            </span>
            <span className="text-[9px] text-cyan-400/80 font-mono block">1024-Pt Frequency Spectrum</span>
          </div>
        </div>
        <button
          onClick={toggleDebugPanel}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-studio-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 space-y-3 text-xs font-mono">
        {/* Beat Transient Detector */}
        <div className="p-3 rounded-xl bg-studio-950/90 border border-white/[0.08] flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${analysis?.beat ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
            <span className="text-slate-300 font-semibold text-[11px]">Onset Transient:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
              analysis?.beat 
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
                : 'bg-studio-900 text-slate-500 border border-white/[0.06]'
            }`}>
              {analysis?.beat ? 'TRIGGERED' : 'IDLE'}
            </span>
            <div 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-75 ${
                analysis?.beat ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,1)] scale-125' : 'bg-studio-800'
              }`} 
            />
          </div>
        </div>

        {/* Real-time Frequency Band Meters */}
        <div className="space-y-2">
          {[
            { label: 'Sub-Bass (20-80Hz)', val: analysis?.bass || 0, color: 'from-rose-500 to-red-400' },
            { label: 'Low-Mid (150-400Hz)', val: analysis?.lowMid || 0, color: 'from-amber-500 to-yellow-400' },
            { label: 'Midrange (400-2kHz)', val: analysis?.mid || 0, color: 'from-emerald-500 to-green-400' },
            { label: 'High-Mid (2-6kHz)', val: analysis?.highMid || 0, color: 'from-sky-500 to-cyan-400' },
            { label: 'Treble Air (6-20kHz)', val: analysis?.treble || 0, color: 'from-indigo-500 to-purple-400' },
            { label: 'RMS Loudness', val: analysis?.rms || 0, color: 'from-fuchsia-500 to-pink-400' },
            { label: 'Peak Volume', val: analysis?.volume || 0, color: 'from-cyan-400 to-blue-400' },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-cyan-300 font-bold">{Math.round(item.val * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-studio-950 rounded-full overflow-hidden border border-white/[0.06]">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} transition-all duration-75`}
                  style={{ width: `${Math.min(100, item.val * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
