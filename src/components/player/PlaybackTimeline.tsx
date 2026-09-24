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
  FileAudio
} from 'lucide-react';
import { useAudioStore } from '../../state/useAudioStore';
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

  // Subscribe to real-time audio time updates
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

    return () => {
      unsubTime();
      unsubEnded();
    };
  }, []);

  // Update waveform peaks on track load
  const updateWaveformPreview = () => {
    const peaks = audioEngine.extractWaveformPeaks(240);
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
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
      const barH = Math.max(2, peak * h * 0.85);
      const x = i * barW;
      const y = (h - barH) / 2;

      ctx.fillStyle = x <= progressX ? '#00f0ff' : '#22273d';
      ctx.fillRect(x, y, Math.max(1, barW - 0.5), barH);
    }
  }, [waveformPeaks, currentTime, duration]);

  return (
    <footer className="h-20 border-t border-studio-800 bg-studio-950 px-4 flex flex-col justify-center gap-1.5 select-none z-20">
      {/* Waveform Scrubber Timeline Bar */}
      <div 
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineMouseMove}
        onMouseLeave={() => setHoverTime(null)}
        className="relative h-6 bg-studio-900 rounded-md border border-studio-800/80 cursor-pointer overflow-hidden group"
      >
        <canvas
          ref={timelineCanvasRef}
          width={800}
          height={32}
          className="w-full h-full block pointer-events-none opacity-80"
        />

        {/* Playhead Marker */}
        {duration > 0 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 pointer-events-none transition-all"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="w-2.5 h-2.5 -ml-1 rounded-full bg-cyan-400 shadow-md shadow-cyan-500/80" />
          </div>
        )}

        {/* Hover Time Tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute -top-7 px-1.5 py-0.5 rounded bg-studio-800 text-[10px] font-mono text-cyan-300 border border-studio-700 pointer-events-none -translate-x-1/2"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* Playback Controls & File Ingestion */}
      <div className="flex items-center justify-between">
        {/* Left: Input Sources */}
        <div className="flex items-center gap-2">
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
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-studio-850 hover:bg-studio-800 text-slate-200 border border-studio-750 text-xs font-medium transition-all"
            title="Upload MP3, WAV, FLAC, OGG"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Upload Audio</span>
          </button>

          {/* Procedural Demo Synth Track */}
          <button
            onClick={handleLoadDemoTrack}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium transition-all ${
              audioSourceType === 'demo'
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                : 'bg-studio-850 border-studio-750 text-slate-300 hover:bg-studio-800'
            }`}
            title="Load built-in 30s Synthwave demo track"
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo Synth</span>
          </button>

          {/* Live Microphone Input */}
          <button
            onClick={handleToggleMic}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium transition-all ${
              audioSourceType === 'mic'
                ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300 animate-pulse'
                : 'bg-studio-850 border-studio-750 text-slate-300 hover:bg-studio-800'
            }`}
            title="Live Microphone Input for VJ / Performance"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Mic</span>
          </button>
        </div>

        {/* Center: Play, Stop, Loop & Timer */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStop}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-studio-800 transition-all active:scale-95"
            title="Stop & Reset"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={handleToggleLoop}
            className={`p-1.5 rounded-full transition-all active:scale-95 ${
              isLooping ? 'text-cyan-400 bg-studio-800' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Loop"
          >
            <Repeat className="w-4 h-4" />
          </button>

          <div className="font-mono text-xs text-slate-400 ml-1">
            <span className="text-slate-200">{formatTime(currentTime)}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Master Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="text-slate-400 hover:text-slate-200 transition-all"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </div>
    </footer>
  );
};
