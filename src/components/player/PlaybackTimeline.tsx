import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Upload, 
  Music, 
  Mic, 
  Repeat, 
  Radio,
  Sliders
} from 'lucide-react';
import { useAudioStore } from '../../state/useAudioStore';
import { useVisualizerStore } from '../../state/useVisualizerStore';
import { audioEngine } from '../../audio/AudioEngine';

export const PlaybackTimeline: React.FC = () => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    audioSourceType,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    toggleMute,
    setIsLooping,
    setTrackInfo,
    setAudioSourceType,
    setError
  } = useAudioStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformPeaks, setWaveformPeaks] = useState<number[]>([]);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [vuLevels, setVuLevels] = useState<{ left: number; right: number }>({ left: 0, right: 0 });

  // Subscribe to real-time audio time updates & VU meter simulation
  useEffect(() => {
    const unsubTime = audioEngine.onTimeUpdate((time, dur) => {
      setCurrentTime(time);
      setDuration(dur);
    });

    const unsubEnded = audioEngine.onEnded(() => {
      setIsPlaying(false);
    });

    // Auto-load demo synthwave track on mount so the studio starts ready to play!
    handleLoadDemoTrack();

    // VU meter RAF loop
    let animId: number;
    const vuLoop = () => {
      if (isPlaying) {
        const reactivity = useVisualizerStore.getState().reactivity;
        const analysis = audioEngine.getAnalysis(reactivity);
        if (analysis) {
          const baseVol = analysis.volume || 0;
          const bassBoost = (analysis.bass || 0) * 0.4;
          const left = Math.min(1, Math.max(0.02, baseVol * 0.95 + (Math.sin(performance.now() * 0.01) * 0.05)));
          const right = Math.min(1, Math.max(0.02, baseVol * 1.05 + (Math.cos(performance.now() * 0.01) * 0.05)));
          setVuLevels({ left, right });
        }
      } else {
        setVuLevels({ left: 0, right: 0 });
      }
      animId = requestAnimationFrame(vuLoop);
    };
    animId = requestAnimationFrame(vuLoop);

    return () => {
      unsubTime();
      unsubEnded();
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  // Update waveform peaks on track load
  const updateWaveformPreview = () => {
    const peaks = audioEngine.extractWaveformPeaks(260);
    setWaveformPeaks(peaks);
  };

  const handleLoadDemoTrack = async () => {
    try {
      audioEngine.disableMicrophone();
      const track = await audioEngine.loadDemoTrack();
      setTrackInfo(track);
      setAudioSourceType('demo');
      setDuration(track.duration);
      setCurrentTime(0);
      updateWaveformPreview();
    } catch (e: any) {
      console.error(e);
      setError('Failed to generate demo synth audio');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      audioEngine.disableMicrophone();
      const track = await audioEngine.loadAudioFile(file);
      setTrackInfo(track);
      setAudioSourceType('file');
      setDuration(track.duration);
      setCurrentTime(0);
      setIsPlaying(false);
      updateWaveformPreview();
      audioEngine.play();
      setIsPlaying(true);
    } catch (e: any) {
      console.error(e);
      setError('Could not decode audio file: ' + (e.message || 'unsupported format'));
    }
  };

  const handleToggleMic = async () => {
    if (audioSourceType === 'mic' && isPlaying) {
      audioEngine.disableMicrophone();
      handleLoadDemoTrack();
    } else {
      try {
        const track = await audioEngine.enableMicrophone();
        setTrackInfo(track);
        setAudioSourceType('mic');
        setIsPlaying(true);
      } catch (e: any) {
        console.error(e);
        setError('Microphone access denied or unavailable');
      }
    }
  };

  const handleTogglePlay = () => {
    if (audioSourceType === 'mic') return;

    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (audioSourceType === 'mic') return;
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0 || audioSourceType === 'mic') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSeconds = percent * duration;
    audioEngine.seek(targetSeconds);
    setCurrentTime(targetSeconds);
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(percent * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
  };

  const handleToggleMute = () => {
    toggleMute();
    audioEngine.setMuted(!isMuted);
  };

  const handleToggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    audioEngine.setLooping(next);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Render mini waveform in timeline
  useEffect(() => {
    const canvas = timelineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (waveformPeaks.length === 0) return;

    const barW = w / waveformPeaks.length;
    const progressPercent = duration > 0 ? currentTime / duration : 0;
    const progressX = progressPercent * w;

    for (let i = 0; i < waveformPeaks.length; i++) {
      const peak = waveformPeaks[i];
      const barH = Math.max(2, peak * h * 0.88);
      const x = i * barW;
      const y = (h - barH) / 2;

      if (x <= progressX) {
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
        ctx.shadowBlur = 4;
      } else {
        ctx.fillStyle = '#22283a';
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(x, y, Math.max(1, barW - 0.5), barH);
    }
  }, [waveformPeaks, currentTime, duration]);

  const effectiveVol = isMuted ? 0 : volume;

  return (
    <footer className="h-20 border-t border-white/[0.08] bg-studio-950/95 backdrop-blur-2xl px-3 sm:px-5 flex flex-col justify-center gap-1.5 select-none z-30 shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
      {/* 1. Waveform Scrubber Timeline Bar */}
      <div 
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineMouseMove}
        onMouseLeave={() => setHoverTime(null)}
        className="relative h-6 bg-studio-900/90 rounded-lg border border-white/[0.08] hover:border-cyan-500/50 cursor-pointer overflow-hidden group transition-all shadow-inner"
      >
        <canvas
          ref={timelineCanvasRef}
          width={900}
          height={32}
          className="w-full h-full block pointer-events-none opacity-85"
        />

        {/* Playhead Progress Overlay */}
        {duration > 0 && (
          <div
            className="absolute top-0 bottom-0 left-0 bg-cyan-500/10 pointer-events-none"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        )}

        {/* Playhead Vertical Cursor */}
        {duration > 0 && (
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 pointer-events-none transition-all shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="w-2.5 h-2.5 -ml-1 -mt-0.5 rounded-full bg-cyan-300 border border-slate-950 shadow-[0_0_8px_rgba(0,240,255,1)]" />
          </div>
        )}

        {/* Hover Time Tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute -top-7 px-2 py-0.5 rounded-md bg-studio-900/95 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 shadow-lg pointer-events-none -translate-x-1/2"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* 2. Playback Transport & Audio Deck Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Input Source Selectors */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* File Upload Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-studio-900 hover:bg-studio-850 text-slate-200 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-medium transition-all cursor-pointer active:scale-95"
            title="Upload audio file (MP3, WAV, FLAC, AAC)"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Procedural Demo Synth Track */}
          <button
            onClick={handleLoadDemoTrack}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              audioSourceType === 'demo'
                ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-studio-900 border-white/[0.08] text-slate-300 hover:bg-studio-850 hover:text-white'
            }`}
            title="Generate built-in 30s 124 BPM Synthwave demo track"
          >
            <Music className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Demo Synth</span>
          </button>

          {/* Live Microphone Input */}
          <button
            onClick={handleToggleMic}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              audioSourceType === 'mic'
                ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300 shadow-[0_0_12px_rgba(255,0,127,0.3)] animate-pulse'
                : 'bg-studio-900 border-white/[0.08] text-slate-300 hover:bg-studio-850 hover:text-white'
            }`}
            title="Live Microphone input for real-time club / DJ performance"
          >
            <Mic className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="hidden sm:inline">Mic</span>
          </button>
        </div>

        {/* Center: Play, Stop, Loop & High-Precision Digital Timecode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Stop / Reset */}
          <button
            onClick={handleStop}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-studio-850 transition-all active:scale-95 cursor-pointer"
            title="Stop and seek to beginning"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Primary Play / Pause Button with Glowing Ring */}
          <button
            onClick={handleTogglePlay}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 flex items-center justify-center transition-all shadow-[0_0_16px_rgba(0,240,255,0.45)] hover:shadow-[0_0_24px_rgba(0,240,255,0.7)] active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Loop Mode */}
          <button
            onClick={handleToggleLoop}
            className={`p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer ${
              isLooping 
                ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-studio-850'
            }`}
            title="Toggle Continuous Loop"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Digital Timecode Display */}
          <div className="font-mono text-[11px] sm:text-xs text-slate-400 px-2.5 py-0.5 rounded-md bg-studio-900/90 border border-white/[0.08] shadow-inner flex items-center gap-1">
            <span className="text-cyan-300 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Master Volume & Stereo VU Level Meters */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Stereo Channel VU Meters (L / R) */}
          <div className="hidden md:flex flex-col gap-0.5 w-16" title="Stereo Channel Peak Levels (L / R)">
            {/* Left Channel */}
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-mono text-slate-500">L</span>
              <div className="h-1.5 flex-1 bg-studio-900 rounded-full overflow-hidden border border-white/[0.06]">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-rose-500 transition-all duration-75"
                  style={{ width: `${vuLevels.left * 100}%` }}
                />
              </div>
            </div>
            {/* Right Channel */}
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-mono text-slate-500">R</span>
              <div className="h-1.5 flex-1 bg-studio-900 rounded-full overflow-hidden border border-white/[0.06]">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-rose-500 transition-all duration-75"
                  style={{ width: `${vuLevels.right * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Master Volume Mute & Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={effectiveVol}
              onChange={handleVolumeChange}
              className="w-16 sm:w-20"
              title={`Master Volume: ${Math.round(effectiveVol * 100)}%`}
            />
            <span className="hidden xl:inline text-[10px] font-mono text-slate-400 w-8 text-right">
              {Math.round(effectiveVol * 100)}%
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
