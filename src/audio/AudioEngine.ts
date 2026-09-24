import { AudioAnalysis, AudioReactivityConfig, AudioTrackInfo } from '../types';
import { AudioAnalysisEngine } from '../audio-analysis/AudioAnalysisEngine';
import { generateDemoAudioBuffer } from './demoSynth';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private analyserL: AnalyserNode | null = null;
  private analyserR: AnalyserNode | null = null;
  private splitter: ChannelSplitterNode | null = null;
  private gainNode: GainNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private analysisEngine: AudioAnalysisEngine | null = null;

  // Source nodes
  private bufferSource: AudioBufferSourceNode | null = null;
  private currentBuffer: AudioBuffer | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;

  // Playback tracking
  private isPlaying = false;
  private isLooping = true;
  private startTime = 0;
  private pauseOffset = 0;
  private volume = 0.85;
  private isMuted = false;

  // Listeners
  private onTimeUpdateCallbacks: Set<(time: number, duration: number) => void> = new Set();
  private onEndedCallbacks: Set<() => void> = new Set();

  private timeUpdateInterval: number | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.35;

      this.analyserL = this.ctx.createAnalyser();
      this.analyserL.fftSize = 2048;
      this.analyserL.smoothingTimeConstant = 0.35;

      this.analyserR = this.ctx.createAnalyser();
      this.analyserR.fftSize = 2048;
      this.analyserR.smoothingTimeConstant = 0.35;

      this.splitter = this.ctx.createChannelSplitter(2);
      this.splitter.connect(this.analyserL, 0);
      this.splitter.connect(this.analyserR, 1);

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.mediaStreamDest = this.ctx.createMediaStreamDestination();

      // Routing: Source -> Analyser -> Gain -> [Destination & MediaStreamDestination]
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.connect(this.mediaStreamDest);

      this.analysisEngine = new AudioAnalysisEngine(this.analyser, this.ctx.sampleRate, this.analyserL, this.analyserR);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  public getMediaStream(): MediaStream | null {
    return this.mediaStreamDest ? this.mediaStreamDest.stream : null;
  }

  public async loadDemoTrack(): Promise<AudioTrackInfo> {
    this.init();
    if (!this.ctx) throw new Error('AudioContext failed to initialize');

    this.stop();
    const demoBuffer = generateDemoAudioBuffer(this.ctx, 30);
    this.currentBuffer = demoBuffer;
    this.pauseOffset = 0;

    return {
      name: 'Cyber Horizon (Demo Synthwave)',
      duration: demoBuffer.duration,
      sampleRate: demoBuffer.sampleRate,
      channels: demoBuffer.numberOfChannels,
      sourceType: 'synth'
    };
  }

  public async loadAudioFile(file: File): Promise<AudioTrackInfo> {
    this.init();
    if (!this.ctx) throw new Error('AudioContext failed to initialize');

    this.stop();
    const arrayBuffer = await file.arrayBuffer();
    const decodedBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.currentBuffer = decodedBuffer;
    this.pauseOffset = 0;

    return {
      name: file.name.replace(/\.[^/.]+$/, ''),
      duration: decodedBuffer.duration,
      sampleRate: decodedBuffer.sampleRate,
      channels: decodedBuffer.numberOfChannels,
      sourceType: 'file'
    };
  }

  public async enableMicrophone(): Promise<AudioTrackInfo> {
    this.init();
    if (!this.ctx || !this.analyser) throw new Error('AudioContext not ready');

    this.stop();
    this.currentBuffer = null;

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.micStream = stream;
    this.micSource = this.ctx.createMediaStreamSource(stream);
    // For mic: connect directly to analyser, but do NOT connect gain to speakers to prevent feedback loop!
    this.micSource.connect(this.analyser);
    if (this.splitter) {
      this.micSource.connect(this.splitter);
    }
    this.isPlaying = true;

    return {
      name: 'Live Microphone Input',
      duration: 0,
      sampleRate: this.ctx.sampleRate,
      channels: 1,
      sourceType: 'mic'
    };
  }

  public disableMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.isPlaying = false;
  }

  public play() {
    this.init();
    if (!this.ctx || !this.analyser || !this.currentBuffer) return;
    if (this.isPlaying) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Create fresh buffer source node
    const source = this.ctx.createBufferSource();
    source.buffer = this.currentBuffer;
    source.loop = this.isLooping;
    source.connect(this.analyser);
    if (this.splitter) {
      source.connect(this.splitter);
    }

    // Calculate start offset
    const offset = this.pauseOffset % (this.currentBuffer.duration || 1);
    this.startTime = this.ctx.currentTime - offset;
    source.start(0, offset);

    source.onended = () => {
      if (!this.isLooping && this.isPlaying) {
        this.isPlaying = false;
        this.pauseOffset = 0;
        this.onEndedCallbacks.forEach((cb) => cb());
      }
    };

    this.bufferSource = source;
    this.isPlaying = true;
    this.startTimeTracking();
  }

  public pause() {
    if (!this.isPlaying) return;
    this.pauseOffset = this.getCurrentTime();
    if (this.bufferSource) {
      try {
        this.bufferSource.stop();
        this.bufferSource.disconnect();
      } catch (e) {
        console.warn('BufferSource stop error', e);
      }
      this.bufferSource = null;
    }
    this.isPlaying = false;
    this.stopTimeTracking();
  }

  public stop() {
    this.pause();
    this.pauseOffset = 0;
    this.analysisEngine?.reset();
    this.notifyTimeUpdate(0, this.getDuration());
  }

  public seek(targetSeconds: number) {
    const duration = this.getDuration();
    if (duration <= 0) return;

    const clampedTime = Math.max(0, Math.min(duration, targetSeconds));
    const wasPlaying = this.isPlaying;

    if (wasPlaying) {
      this.pause();
      this.pauseOffset = clampedTime;
      this.play();
    } else {
      this.pauseOffset = clampedTime;
      this.notifyTimeUpdate(clampedTime, duration);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      this.gainNode.gain.setValueAtTime(target, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.setVolume(this.volume);
  }

  public setLooping(looping: boolean) {
    this.isLooping = looping;
    if (this.bufferSource) {
      this.bufferSource.loop = looping;
    }
  }

  public getCurrentTime(): number {
    if (this.micSource) return 0;
    if (!this.ctx || !this.currentBuffer) return 0;

    if (this.isPlaying) {
      const elapsed = this.ctx.currentTime - this.startTime;
      if (this.isLooping) {
        return elapsed % this.currentBuffer.duration;
      }
      return Math.min(elapsed, this.currentBuffer.duration);
    }
    return this.pauseOffset;
  }

  public getDuration(): number {
    return this.currentBuffer ? this.currentBuffer.duration : 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getAnalysis(config: AudioReactivityConfig): AudioAnalysis | null {
    if (!this.analysisEngine) return null;
    return this.analysisEngine.analyze(config, this.getCurrentTime());
  }

  public extractWaveformPeaks(numBuckets = 300): number[] {
    if (!this.currentBuffer) return [];
    const channelData = this.currentBuffer.getChannelData(0);
    const step = Math.floor(channelData.length / numBuckets);
    const peaks: number[] = [];

    for (let i = 0; i < numBuckets; i++) {
      let max = 0;
      const start = i * step;
      const end = Math.min(start + step, channelData.length);
      for (let j = start; j < end; j += 4) {
        const val = Math.abs(channelData[j]);
        if (val > max) max = val;
      }
      peaks.push(max);
    }
    return peaks;
  }

  public onTimeUpdate(cb: (time: number, duration: number) => void): () => void {
    this.onTimeUpdateCallbacks.add(cb);
    return () => this.onTimeUpdateCallbacks.delete(cb);
  }

  public onEnded(cb: () => void): () => void {
    this.onEndedCallbacks.add(cb);
    return () => this.onEndedCallbacks.delete(cb);
  }

  private startTimeTracking() {
    this.stopTimeTracking();
    this.timeUpdateInterval = window.setInterval(() => {
      this.notifyTimeUpdate(this.getCurrentTime(), this.getDuration());
    }, 100);
  }

  private stopTimeTracking() {
    if (this.timeUpdateInterval !== null) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  private notifyTimeUpdate(time: number, duration: number) {
    this.onTimeUpdateCallbacks.forEach((cb) => cb(time, duration));
  }
}

// Global singleton instance for app-wide audio routing
export const audioEngine = new AudioEngine();
