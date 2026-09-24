/**
 * Procedural Audio Synthesizer for Demo & Testing
 * Synthesizes a high-energy electronic / synthwave loop buffer
 * with punchy 808-style kicks, sub-bass riffs, shimmering synth arpeggios, and hi-hats.
 */
export function generateDemoAudioBuffer(ctx: AudioContext, durationSeconds = 30): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  const bpm = 124;
  const beatsPerSecond = bpm / 60;
  const secondsPerBeat = 1 / beatsPerSecond;
  const sixteenthNote = secondsPerBeat / 4;

  // Scale frequencies (Minor pentatonic / Synthwave in F Minor: F, Ab, Bb, C, Eb)
  const notes = [
    87.31, 103.83, 116.54, 130.81, 155.56, // Bass octave (F2, Ab2, Bb2, C3, Eb3)
    174.61, 207.65, 233.08, 261.63, 311.13, // Mid octave (F3, Ab3, Bb3, C4, Eb4)
    349.23, 415.30, 466.16, 523.25, 622.25  // High arp octave (F4, Ab4, Bb4, C5, Eb5)
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const beatPos = t % secondsPerBeat;
    const sixteenthPos = t % sixteenthNote;
    const currentSixteenth = Math.floor(t / sixteenthNote);

    let signalL = 0;
    let signalR = 0;

    // 1. Kick Drum (on every beat 0.0s, with pitch sweep from 140Hz down to 45Hz)
    const kickTime = beatPos;
    if (kickTime < 0.28) {
      const kickFreq = 45 + 110 * Math.exp(-kickTime * 35);
      const kickEnv = Math.exp(-kickTime * 14);
      const kickWave = Math.sin(2 * Math.PI * kickFreq * kickTime) * kickEnv;
      // Slight distortion for punch
      const kickDist = Math.tanh(kickWave * 1.8);
      signalL += kickDist * 0.75;
      signalR += kickDist * 0.75;
    }

    // 2. Off-beat Snare / Clap (on beats 1 and 3 in 4/4)
    const measurePos = (t % (secondsPerBeat * 4)) / secondsPerBeat;
    if ((measurePos >= 1 && measurePos < 1.3) || (measurePos >= 3 && measurePos < 3.3)) {
      const snareTime = measurePos % 1;
      const noise = (Math.random() * 2 - 1) * Math.exp(-snareTime * 18);
      const tone = Math.sin(2 * Math.PI * 180 * snareTime) * Math.exp(-snareTime * 22);
      const snare = (noise * 0.7 + tone * 0.3) * 0.45;
      signalL += snare;
      signalR += snare;
    }

    // 3. Hi-Hat (every 16th note, accented on upbeats)
    const hatTime = sixteenthPos;
    if (hatTime < 0.06) {
      const isUpbeat = currentSixteenth % 2 === 1;
      const hatVol = isUpbeat ? 0.3 : 0.15;
      const hatNoise = (Math.random() * 2 - 1) * Math.exp(-hatTime * 65) * hatVol;
      signalL += hatNoise * 0.8;
      signalR += hatNoise * 1.2; // slight stereo offset
    }

    // 4. Rolling Bassline with Stereo Quadrature component for true XY Lissajous loops
    const bassNoteIdx = [0, 0, 1, 0, 2, 0, 3, 2][currentSixteenth % 8];
    const bassFreq = notes[bassNoteIdx];
    const bassEnv = Math.exp(-(sixteenthPos % sixteenthNote) * 8);
    // Sawtooth + Sub Sine
    const sawPhase = (t * bassFreq) % 1;
    const sawWave = (2 * sawPhase - 1) * 0.3;
    const subSineL = Math.sin(2 * Math.PI * (bassFreq * 0.5) * t) * 0.5;
    const subSineR = Math.sin(2 * Math.PI * (bassFreq * 0.5) * t + Math.PI / 2) * 0.5; // 90° quadrature phase for XY loops
    const bassL = (sawWave + subSineL) * bassEnv * 0.5;
    const bassR = (sawWave + subSineR) * bassEnv * 0.5;
    signalL += bassL * 0.95;
    signalR += bassR * 0.95;

    // 5. Shimmering Synth Arpeggio (melodic high resonance with ping-pong panning)
    const arpIdx = 10 + [0, 2, 4, 3, 1, 3, 2, 4, 1, 4, 3, 2, 0, 3, 4, 2][currentSixteenth % 16];
    const arpFreq = notes[arpIdx];
    const arpEnv = Math.exp(-sixteenthPos * 12);
    const arpSine = Math.sin(2 * Math.PI * arpFreq * t);
    const arpSquare = (arpSine > 0 ? 0.5 : -0.5) * 0.3;
    const arp = (arpSine * 0.7 + arpSquare * 0.3) * arpEnv * 0.28;
    // Stereo ping-pong panning
    const panL = 0.5 + 0.45 * Math.sin(t * 1.5);
    const panR = 1.0 - panL;
    signalL += arp * panL;
    signalR += arp * panR;

    // 6. Warm Pad Chord in background with stereo detuning
    const chordBase = notes[5 + (Math.floor(t / (secondsPerBeat * 8)) % 3) * 2];
    const pad1L = Math.sin(2 * Math.PI * chordBase * t) * 0.1;
    const pad1R = Math.sin(2 * Math.PI * (chordBase * 1.003) * t) * 0.1; // stereo detune
    const pad2 = Math.sin(2 * Math.PI * (chordBase * 1.2) * t) * 0.08;
    const pad3 = Math.sin(2 * Math.PI * (chordBase * 1.5) * t) * 0.06;
    const padL = (pad1L + pad2 + pad3) * (0.8 + 0.2 * Math.sin(t * 0.5));
    const padR = (pad1R + pad2 + pad3) * (0.8 + 0.2 * Math.sin(t * 0.5 + 0.3));
    signalL += padL * 0.6;
    signalR += padR * 0.6;

    // Master Soft Limiter
    left[i] = Math.tanh(signalL * 0.9);
    right[i] = Math.tanh(signalR * 0.9);
  }

  return buffer;
}
