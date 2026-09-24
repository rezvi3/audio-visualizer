import React, { useState } from 'react';
import { X, Film, CheckCircle, Download, Loader2 } from 'lucide-react';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { useAudioStore } from '../../state/useAudioStore';
import { exportEngine } from '../../export/ExportEngine';
import { ExportSettings } from '../../types';

const RESOLUTIONS = [
  { width: 1920, height: 1080, label: '1080p Full HD', aspect: '16:9' },
  { width: 1080, height: 1920, label: '1080p Vertical', aspect: '9:16 (Shorts/Reels)' },
  { width: 1080, height: 1080, label: 'Square Visual', aspect: '1:1 (Album/Feed)' },
  { width: 1280, height: 720, label: '720p HD', aspect: '16:9' },
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-studio-900 border border-studio-750 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-studio-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Export Video</h3>
              <p className="text-xs text-slate-400">Render audio-reactive video in WebM format</p>
            </div>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            disabled={isRecording}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Resolution Selector */}
          <div>
            <label className="text-slate-300 font-medium block mb-2">Resolution & Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {RESOLUTIONS.map((res) => (
                <button
                  key={res.label}
                  disabled={isRecording}
                  onClick={() => setSelectedRes(res)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedRes.label === res.label
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                      : 'border-studio-800 bg-studio-850 hover:bg-studio-800 text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-xs">{res.label}</div>
                  <div className="text-[10px] text-slate-500">{res.aspect}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Framerate Selector */}
          <div>
            <label className="text-slate-300 font-medium block mb-2">Framerate</label>
            <div className="grid grid-cols-3 gap-2">
              {([24, 30, 60] as const).map((fps) => (
                <button
                  key={fps}
                  disabled={isRecording}
                  onClick={() => setSelectedFps(fps)}
                  className={`py-2 rounded-lg border text-center font-mono font-medium transition-all ${
                    selectedFps === fps
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                      : 'border-studio-800 bg-studio-850 hover:bg-studio-800 text-slate-400'
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-medium">Record Duration</label>
              <span className="font-mono text-cyan-400">{recordSeconds} seconds</span>
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

          {/* Transparent Background */}
          <label className="flex items-center gap-2 cursor-pointer text-slate-200 pt-1">
            <input
              type="checkbox"
              disabled={isRecording}
              checked={effects.transparentBg}
              onChange={(e) => updateEffects({ transparentBg: e.target.checked })}
              className="rounded bg-studio-800 border-studio-700 text-cyan-500 focus:ring-0"
            />
            <span>Transparent Background (Alpha Channel Overlay)</span>
          </label>

          {/* Recording Progress / Ready */}
          {isRecording && (
            <div className="p-3 rounded-lg bg-studio-950 border border-studio-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Recording Video Stream...
                </span>
                <span className="text-slate-300">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-studio-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Video Render Complete!</span>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-studio-800 flex justify-end gap-2 bg-studio-950/40">
          <button
            onClick={() => setExportModalOpen(false)}
            disabled={isRecording}
            className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs"
          >
            Close
          </button>
          {!downloadUrl ? (
            <button
              onClick={handleStartExport}
              disabled={isRecording}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              {isRecording ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Film className="w-3.5 h-3.5" />
                  <span>Start Recording</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Video</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
