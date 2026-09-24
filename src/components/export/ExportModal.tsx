import React, { useState } from 'react';
import { X, Film, CheckCircle, Download, Loader2, Sparkles } from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { useAudioStore } from '../../state/useAudioStore';
import { exportEngine } from '../../export/ExportEngine';
import { ExportSettings } from '../../types';

const RESOLUTIONS = [
  { width: 1920, height: 1080, label: '1080p Full HD', aspect: '16:9 Cinema / YT' },
  { width: 1080, height: 1920, label: '1080p Vertical', aspect: '9:16 Shorts / Reels' },
  { width: 1080, height: 1080, label: 'Square Visual', aspect: '1:1 Album / Feed' },
  { width: 1280, height: 720, label: '720p HD', aspect: '16:9 Lightweight' },
];

export const ExportModal: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, effects, updateEffects } = useVisualizerStore();
  const { duration } = useAudioStore();

  const [selectedRes, setSelectedRes] = useState(RESOLUTIONS[0]);
  const [selectedFps, setSelectedFps] = useState<24 | 30 | 60>(60);
  const [recordSeconds, setRecordSeconds] = useState(Math.min(30, Math.max(10, Math.floor(duration || 30))));
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  if (!exportModalOpen) return null;

  const handleStartExport = async () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    setIsRecording(true);
    setProgress(0);
    setDownloadUrl(null);

    const settings: ExportSettings = {
      resolution: selectedRes,
      fps: selectedFps,
      format: 'webm',
      duration: recordSeconds,
      transparent: effects.transparentBg
    };

    try {
      await exportEngine.startRecording(canvas, settings);

      const startTime = performance.now();
      const interval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        const pct = Math.min(100, Math.round((elapsed / recordSeconds) * 100));
        setProgress(pct);

        if (elapsed >= recordSeconds) {
          clearInterval(interval);
          finishExport();
        }
      }, 200);

    } catch (e) {
      console.error('Failed to export video', e);
      setIsRecording(false);
    }
  };

  const finishExport = async () => {
    try {
      const blob = await exportEngine.stopRecording();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsRecording(false);
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `oscillo_visualizer_${selectedRes.width}x${selectedRes.height}_${Date.now()}.webm`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-studio-900/95 border border-white/[0.1] rounded-2xl w-full max-w-md shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              <Film className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">Video Export Studio</h3>
              <p className="text-[11px] text-slate-400">Direct Web Audio & High-Bitrate Canvas Stream</p>
            </div>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            disabled={isRecording}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-studio-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Resolution Selector */}
          <div>
            <label className="text-slate-300 font-medium block mb-2 font-mono text-[11px] uppercase tracking-wider">
              Output Resolution & Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RESOLUTIONS.map((res) => (
                <button
                  key={res.label}
                  disabled={isRecording}
                  onClick={() => setSelectedRes(res)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRes.label === res.label
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 hover:border-white/[0.14] text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{res.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{res.aspect}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Framerate Selector */}
          <div>
            <label className="text-slate-300 font-medium block mb-2 font-mono text-[11px] uppercase tracking-wider">
              Framerate (FPS)
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono">
              {([24, 30, 60] as const).map((fps) => (
                <button
                  key={fps}
                  disabled={isRecording}
                  onClick={() => setSelectedFps(fps)}
                  className={`py-2 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                    selectedFps === fps
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                      : 'border-white/[0.08] bg-studio-900/80 hover:bg-studio-850 text-slate-400 hover:text-white'
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
          </div>

          {/* Duration Slider */}
          <div className="p-3 rounded-xl bg-studio-900/60 border border-white/[0.06] space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-medium text-[11px]">Capture Duration</label>
              <span className="font-mono text-cyan-300 text-[10px] px-2 py-0.5 rounded bg-studio-950 border border-white/[0.08]">{recordSeconds} seconds</span>
            </div>
            <input
              type="range"
              min="5"
              max={Math.max(60, Math.floor(duration || 60))}
              step="5"
              disabled={isRecording}
              value={recordSeconds}
              onChange={(e) => setRecordSeconds(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Transparent Background Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-studio-900/60 border border-emerald-500/30 text-emerald-400 font-medium hover:border-emerald-500/60 transition-all">
            <input
              type="checkbox"
              disabled={isRecording}
              checked={effects.transparentBg}
              onChange={(e) => updateEffects({ transparentBg: e.target.checked })}
              className="rounded bg-studio-800 border-white/[0.1] text-emerald-500 focus:ring-0"
            />
            <span>Transparent Background (Alpha Channel Overlay)</span>
          </label>

          {/* Recording Progress Indicator */}
          {isRecording && (
            <div className="p-3.5 rounded-xl bg-studio-950/90 border border-cyan-500/40 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Recording Stream ({selectedFps} FPS)...
                </span>
                <span className="text-cyan-300 font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-studio-900 rounded-full overflow-hidden border border-white/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-200 shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Completion Ready Alert */}
          {downloadUrl && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Video Render Finished!</span>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save WebM</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] flex justify-end gap-2.5 bg-studio-950/60">
          <button
            onClick={() => setExportModalOpen(false)}
            disabled={isRecording}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            Cancel
          </button>
          {!downloadUrl ? (
            <button
              onClick={handleStartExport}
              disabled={isRecording}
              className="studio-btn-primary flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {isRecording ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Film className="w-3.5 h-3.5 text-slate-950" />
                  <span>Start Recording</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Download File</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
