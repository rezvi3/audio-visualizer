import { AudioAnalysis, AudioReactivityConfig } from '../types';

export class AudioAnalysisEngine {
  private analyser: AnalyserNode;
  private analyserL: AnalyserNode | null = null;
  private analyserR: AnalyserNode | null = null;
  private fftSize: number;
  private sampleRate: number;

  // Cached buffers to prevent GC allocation in 60fps loop
  private timeDomainBuffer: Float32Array;
  private timeDomainBufferL: Float32Array;
  private timeDomainBufferR: Float32Array;
  private frequencyBuffer: Uint8Array;
  private normalizedFreqBuffer: Float32Array;

  // Smoothed feature values
  private smoothedBass = 0;
  private smoothedLowMid = 0;
  private smoothedMid = 0;
  private smoothedHighMid = 0;
  private smoothedTreble = 0;
  private smoothedVolume = 0;
  private smoothedRms = 0;

  // Beat detector state
  private energyHistory: number[] = [];
  private readonly historySize = 45; // ~0.75 second history buffer at 60fps
  private currentBeatStrength = 0;
  private lastBeatTime = 0;

  // Frequency band bin indexes
  private bassStartBin = 0;
  private bassEndBin = 0;
  private lowMidStartBin = 0;
  private lowMidEndBin = 0;
  private midStartBin = 0;
  private midEndBin = 0;
  private highMidStartBin = 0;
  private highMidEndBin = 0;
  private trebleStartBin = 0;
  private trebleEndBin = 0;

  constructor(analyser: AnalyserNode, sampleRate = 44100, analyserL?: AnalyserNode, analyserR?: AnalyserNode) {
    this.analyser = analyser;
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.4;
    this.fftSize = this.analyser.fftSize;
    this.sampleRate = sampleRate;

    this.analyserL = analyserL || null;
    this.analyserR = analyserR || null;
    if (this.analyserL) this.analyserL.fftSize = 2048;
    if (this.analyserR) this.analyserR.fftSize = 2048;

    const binCount = this.analyser.frequencyBinCount;
    this.timeDomainBuffer = new Float32Array(binCount);
    this.timeDomainBufferL = new Float32Array(binCount);
    this.timeDomainBufferR = new Float32Array(binCount);
    this.frequencyBuffer = new Uint8Array(binCount);
    this.normalizedFreqBuffer = new Float32Array(binCount);

    this.calculateFrequencyBins();
  }

  public setStereoAnalysers(analyserL: AnalyserNode, analyserR: AnalyserNode) {
    this.analyserL = analyserL;
    this.analyserR = analyserR;
    this.analyserL.fftSize = 2048;
    this.analyserR.fftSize = 2048;
  }

  public updateSampleRate(sampleRate: number) {
    this.sampleRate = sampleRate;
    this.calculateFrequencyBins();
  }

  private calculateFrequencyBins() {
    const binCount = this.analyser.frequencyBinCount;
    const freqPerBin = this.sampleRate / this.fftSize;

    const getBin = (freq: number) => {
      const b = Math.floor(freq / freqPerBin);
      return Math.max(0, Math.min(binCount - 1, b));
    };

    // Sub & Bass: 20 - 150 Hz
    this.bassStartBin = getBin(20);
    this.bassEndBin = Math.max(this.bassStartBin + 1, getBin(150));

    // Low Mid: 150 - 400 Hz
    this.lowMidStartBin = this.bassEndBin;
    this.lowMidEndBin = Math.max(this.lowMidStartBin + 1, getBin(400));

    // Mid: 400 - 2000 Hz
    this.midStartBin = this.lowMidEndBin;
    this.midEndBin = Math.max(this.midStartBin + 1, getBin(2000));

    // High Mid: 2000 - 6000 Hz
    this.highMidStartBin = this.midEndBin;
    this.highMidEndBin = Math.max(this.highMidStartBin + 1, getBin(6000));

    // Treble: 6000 - 20000 Hz
    this.trebleStartBin = this.highMidEndBin;
    this.trebleEndBin = Math.max(this.trebleStartBin + 1, getBin(20000));
  }

  private getBandEnergy(startBin: number, endBin: number): number {
    let sum = 0;
    const count = endBin - startBin + 1;
    if (count <= 0) return 0;

    for (let i = startBin; i <= endBin; i++) {
      sum += this.frequencyBuffer[i];
    }
    // Return normalized 0.0 -> 1.0
    return sum / (count * 255);
  }

  private smoothValue(current: number, smoothed: number, attack: number, decay: number): number {
    if (current > smoothed) {
      return smoothed + (current - smoothed) * attack;
    } else {
      return smoothed + (current - smoothed) * decay;
    }
  }

  public analyze(reactivityConfig: AudioReactivityConfig, playbackTime = 0): AudioAnalysis {
    // 1. Fetch raw data from Master AnalyserNode
    this.analyser.getFloatTimeDomainData(this.timeDomainBuffer as unknown as Float32Array<ArrayBuffer>);
    this.analyser.getByteFrequencyData(this.frequencyBuffer as unknown as Uint8Array<ArrayBuffer>);

    // Fetch True Stereo Left & Right channels if available
    if (this.analyserL && this.analyserR) {
      this.analyserL.getFloatTimeDomainData(this.timeDomainBufferL as unknown as Float32Array<ArrayBuffer>);
      this.analyserR.getFloatTimeDomainData(this.timeDomainBufferR as unknown as Float32Array<ArrayBuffer>);
    } else {
      // Fallback: copy mono waveform with subtle 90-degree phase shift for synthesized Lissajous
      const len = this.timeDomainBuffer.length;
      const quarterShift = Math.floor(len * 0.25);
      for (let i = 0; i < len; i++) {
        this.timeDomainBufferL[i] = this.timeDomainBuffer[i];
        this.timeDomainBufferR[i] = this.timeDomainBuffer[(i + quarterShift) % len];
      }
    }

    // Normalize frequency buffer (0.0 -> 1.0)
    for (let i = 0; i < this.frequencyBuffer.length; i++) {
      this.normalizedFreqBuffer[i] = this.frequencyBuffer[i] / 255;
    }

    // 2. Calculate RMS Loudness and Peak Amplitude
    let sumSquares = 0;
    let peak = 0;
    const len = this.timeDomainBuffer.length;

    for (let i = 0; i < len; i++) {
      const val = this.timeDomainBuffer[i];
      const absVal = Math.abs(val);
      if (absVal > peak) peak = absVal;
      sumSquares += val * val;
    }
    const rawRms = Math.min(1.0, Math.sqrt(sumSquares / len) * 2.0);
    const rawVolume = Math.min(1.0, peak);

    // 3. Extract Raw Band Energies
    const rawBass = Math.min(1.0, this.getBandEnergy(this.bassStartBin, this.bassEndBin) * reactivityConfig.bassInfluence);
    const rawLowMid = Math.min(1.0, this.getBandEnergy(this.lowMidStartBin, this.lowMidEndBin) * reactivityConfig.midInfluence);
    const rawMid = Math.min(1.0, this.getBandEnergy(this.midStartBin, this.midEndBin) * reactivityConfig.midInfluence);
    const rawHighMid = Math.min(1.0, this.getBandEnergy(this.highMidStartBin, this.highMidEndBin) * reactivityConfig.trebleInfluence);
    const rawTreble = Math.min(1.0, this.getBandEnergy(this.trebleStartBin, this.trebleEndBin) * reactivityConfig.trebleInfluence);

    // 4. Apply Dynamic Attack & Decay Smoothing
    const atk = Math.max(0.01, Math.min(1.0, reactivityConfig.attack));
    const dec = Math.max(0.01, Math.min(1.0, reactivityConfig.decay));

    this.smoothedBass = this.smoothValue(rawBass, this.smoothedBass, atk, dec);
    this.smoothedLowMid = this.smoothValue(rawLowMid, this.smoothedLowMid, atk, dec);
    this.smoothedMid = this.smoothValue(rawMid, this.smoothedMid, atk, dec);
    this.smoothedHighMid = this.smoothValue(rawHighMid, this.smoothedHighMid, atk, dec);
    this.smoothedTreble = this.smoothValue(rawTreble, this.smoothedTreble, atk, dec);
    this.smoothedVolume = this.smoothValue(rawVolume, this.smoothedVolume, atk, dec);
    this.smoothedRms = this.smoothValue(rawRms, this.smoothedRms, atk, dec);

    // 5. Intelligent Beat & Onset Detection
    const instantBeatEnergy = rawBass * 0.75 + rawLowMid * 0.25;

    this.energyHistory.push(instantBeatEnergy);
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift();
    }

    let avgEnergy = 0;
    for (let i = 0; i < this.energyHistory.length; i++) {
      avgEnergy += this.energyHistory[i];
    }
    avgEnergy /= this.energyHistory.length || 1;

    let variance = 0;
    for (let i = 0; i < this.energyHistory.length; i++) {
      const diff = this.energyHistory[i] - avgEnergy;
      variance += diff * diff;
    }
    variance /= this.energyHistory.length || 1;

    const threshold = Math.max(1.15, Math.min(1.6, 1.45 - variance * 2.0));
    const now = performance.now();
    let isBeat = false;

    if (now - this.lastBeatTime > 150 && instantBeatEnergy > 0.1) {
      if (instantBeatEnergy > avgEnergy * threshold && instantBeatEnergy > 0.25) {
        isBeat = true;
        this.lastBeatTime = now;
        this.currentBeatStrength = Math.min(1.0, (instantBeatEnergy - avgEnergy) * 3.5 * reactivityConfig.beatInfluence);
      }
    }

    this.currentBeatStrength *= 0.88;
    if (this.currentBeatStrength < 0.01) {
      this.currentBeatStrength = 0;
    }

    return {
      waveform: this.timeDomainBuffer,
      waveformLeft: this.timeDomainBufferL,
      waveformRight: this.timeDomainBufferR,
      frequencyData: this.frequencyBuffer,
      frequencyDataNormalized: this.normalizedFreqBuffer,

      bass: this.smoothedBass,
      lowMid: this.smoothedLowMid,
      mid: this.smoothedMid,
      highMid: this.smoothedHighMid,
      treble: this.smoothedTreble,

      volume: this.smoothedVolume,
      rms: this.smoothedRms,

      beat: isBeat,
      beatStrength: this.currentBeatStrength,

      timestamp: playbackTime
    };
  }

  public reset() {
    this.energyHistory = [];
    this.smoothedBass = 0;
    this.smoothedLowMid = 0;
    this.smoothedMid = 0;
    this.smoothedHighMid = 0;
    this.smoothedTreble = 0;
    this.smoothedVolume = 0;
    this.smoothedRms = 0;
    this.currentBeatStrength = 0;
  }
}
