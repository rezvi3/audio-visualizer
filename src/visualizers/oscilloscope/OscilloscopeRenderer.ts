import { IVisualizerRenderer, RenderContext } from '../../rendering/types';
import { WaveformLayer } from '../../types';

export class OscilloscopeRenderer implements IVisualizerRenderer {
  private phase = 0;
  private tunnelRings: { radius: number; speed: number; alpha: number }[] = [];

  constructor() {
    // Initialize tunnel ring layers
    for (let i = 0; i < 8; i++) {
      this.tunnelRings.push({
        radius: (i + 1) * 35,
        speed: 1.2 + i * 0.3,
        alpha: (8 - i) / 8
      });
    }
  }

  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, oscilloscopeConfig, time, deltaTime } = rc;
    this.phase += deltaTime * 2.0;

    const { mode, waveHeight, thickness, layers, fill, fillOpacity, glowStrength, radialRadius, spiralTightness } = oscilloscopeConfig;
    const { waveform, bass, mid, treble, beat, beatStrength } = analysis;

    // Reactivity scale multipliers
    const pulseScale = 1.0 + (beat ? beatStrength * 0.35 * effects.pulseIntensity : 0);
    const bassScale = 1.0 + bass * 0.8;
    const midHarmonic = mid * 0.3;
    const trebleJitter = treble * 0.25;

    ctx.save();

    // Setup glow
    const totalGlow = (effects.glow + glowStrength) * 0.5;
    if (totalGlow > 0.05) {
      ctx.shadowBlur = totalGlow * 25;
      ctx.shadowColor = colors.glow || colors.primary;
    } else {
      ctx.shadowBlur = 0;
    }

    // Render based on selected oscilloscope mode
    switch (mode) {
      case 'classic':
        this.renderClassic(rc, pulseScale * bassScale, midHarmonic, trebleJitter);
        break;
      case 'mirror':
        this.renderMirror(rc, pulseScale * bassScale, midHarmonic, trebleJitter);
        break;
      case 'double':
        this.renderDouble(rc, pulseScale * bassScale, midHarmonic, trebleJitter);
        break;
      case 'circular':
        this.renderCircular(rc, radialRadius * pulseScale, bassScale, trebleJitter);
        break;
      case 'radial':
        this.renderRadial(rc, radialRadius * pulseScale, bassScale);
        break;
      case 'spiral':
        this.renderSpiral(rc, spiralTightness, pulseScale * bassScale);
        break;
      case 'tunnel':
        this.renderTunnel(rc, pulseScale * bassScale);
        break;
      case 'lissajous':
        this.renderLissajous(rc, pulseScale * bassScale);
        break;
      case 'orbital':
        this.renderOrbital(rc, radialRadius * pulseScale, bassScale);
        break;
      case 'fluid':
        this.renderFluid(rc, pulseScale * bassScale);
        break;
    }

    // Render additional user configured waveform layers
    if (layers && layers.length > 0) {
      for (const layer of layers) {
        if (layer.enabled) {
          this.renderCustomLayer(rc, layer, pulseScale);
        }
      }
    }

    ctx.restore();
  }

  // MODE 1: CLASSIC HORIZONTAL OSCILLOSCOPE
  private renderClassic(rc: RenderContext, scaleY: number, harmonic: number, jitter: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform } = analysis;
    const { waveHeight, thickness, fill, fillOpacity } = oscilloscopeConfig;

    const centerY = height / 2;
    const step = Math.max(1, Math.floor(waveform.length / width));
    const amp = (height * 0.28) * waveHeight * scaleY;

    ctx.lineWidth = thickness;
    ctx.strokeStyle = colors.primary;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    let firstX = 0;
    let firstY = centerY;

    for (let x = 0; x < width; x += 2) {
      const sampleIdx = Math.min(waveform.length - 1, Math.floor((x / width) * waveform.length));
      let sample = waveform[sampleIdx];

      // Add harmonic & treble micro-structure
      sample += Math.sin(x * 0.05 + this.phase * 3) * harmonic * 0.2;
      sample += (Math.random() * 2 - 1) * jitter * 0.05;

      const y = centerY + sample * amp;
      if (x === 0) {
        firstX = x;
        firstY = y;
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Optional translucent fill under waveform
    if (fill) {
      ctx.lineTo(width, centerY);
      ctx.lineTo(firstX, centerY);
      ctx.closePath();
      ctx.fillStyle = colors.primary;
      ctx.globalAlpha = fillOpacity;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  // MODE 2: MIRROR OSCILLOSCOPE
  private renderMirror(rc: RenderContext, scaleY: number, harmonic: number, jitter: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform } = analysis;
    const { waveHeight, thickness, fill, fillOpacity } = oscilloscopeConfig;

    const centerY = height / 2;
    const amp = (height * 0.22) * waveHeight * scaleY;

    ctx.lineWidth = thickness;
    ctx.strokeStyle = colors.primary;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Top wave
    ctx.beginPath();
    for (let x = 0; x < width; x += 2) {
      const idx = Math.floor((x / width) * waveform.length);
      const sample = Math.abs(waveform[idx]) + Math.sin(x * 0.04 + this.phase) * harmonic * 0.15;
      const y = centerY - sample * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    // Bottom wave (reversed)
    for (let x = width; x >= 0; x -= 2) {
      const idx = Math.floor((x / width) * waveform.length);
      const sample = Math.abs(waveform[idx]) + Math.sin(x * 0.04 + this.phase) * harmonic * 0.15;
      const y = centerY + sample * amp;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    if (fill) {
      const grad = ctx.createLinearGradient(0, centerY - amp, 0, centerY + amp);
      grad.addColorStop(0, colors.primary);
      grad.addColorStop(0.5, colors.secondary);
      grad.addColorStop(1, colors.primary);
      ctx.fillStyle = grad;
      ctx.globalAlpha = fillOpacity;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  // MODE 3: DOUBLE WAVE
  private renderDouble(rc: RenderContext, scaleY: number, harmonic: number, jitter: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform } = analysis;
    const { waveHeight, thickness } = oscilloscopeConfig;

    const centerY = height / 2;
    const amp = (height * 0.24) * waveHeight * scaleY;

    // Primary wave
    ctx.lineWidth = thickness;
    ctx.strokeStyle = colors.primary;
    ctx.beginPath();
    for (let x = 0; x < width; x += 2) {
      const idx = Math.floor((x / width) * waveform.length);
      const y = centerY + waveform[idx] * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Offset secondary phase inverted wave
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = Math.max(1, thickness * 0.7);
    ctx.beginPath();
    const phaseOffset = Math.floor(waveform.length * 0.08);
    for (let x = 0; x < width; x += 2) {
      const idx = (Math.floor((x / width) * waveform.length) + phaseOffset) % waveform.length;
      const y = centerY - waveform[idx] * amp * 0.85;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // MODE 4: CIRCULAR OSCILLOSCOPE
  private renderCircular(rc: RenderContext, baseRadius: number, bassScale: number, jitter: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform } = analysis;
    const { waveHeight, thickness, fill, fillOpacity } = oscilloscopeConfig;

    const cx = width / 2;
    const cy = height / 2;
    const amp = 90 * waveHeight * bassScale;

    ctx.lineWidth = thickness;
    ctx.strokeStyle = colors.primary;
    ctx.beginPath();

    const pointsCount = Math.min(720, waveform.length);
    for (let i = 0; i <= pointsCount; i++) {
      const idx = (i % pointsCount);
      const angle = (idx / pointsCount) * Math.PI * 2 - Math.PI / 2;
      const sample = waveform[Math.floor((idx / pointsCount) * waveform.length)];
      const r = baseRadius + sample * amp;

      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    if (fill) {
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, baseRadius + amp);
      grad.addColorStop(0, colors.secondary);
      grad.addColorStop(1, colors.primary);
      ctx.fillStyle = grad;
      ctx.globalAlpha = fillOpacity;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  // MODE 5: RADIAL STARBURST
  private renderRadial(rc: RenderContext, baseRadius: number, bassScale: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform, bass } = analysis;
    const { waveHeight, thickness } = oscilloscopeConfig;

    const cx = width / 2;
    const cy = height / 2;
    const numRays = 120;
    const amp = 140 * waveHeight * bassScale;

    ctx.lineWidth = thickness;

    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * Math.PI * 2 + this.phase * 0.1;
      const sampleIdx = Math.floor((i / numRays) * waveform.length);
      const magnitude = Math.abs(waveform[sampleIdx]);

      const innerR = baseRadius * 0.7;
      const outerR = baseRadius + magnitude * amp;

      const x1 = cx + Math.cos(angle) * innerR;
      const y1 = cy + Math.sin(angle) * innerR;
      const x2 = cx + Math.cos(angle) * outerR;
      const y2 = cy + Math.sin(angle) * outerR;

      ctx.strokeStyle = i % 2 === 0 ? colors.primary : colors.secondary;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // MODE 6: SPIRAL OSCILLOSCOPE
  private renderSpiral(rc: RenderContext, tightness: number, scale: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform } = analysis;
    const { waveHeight, thickness } = oscilloscopeConfig;

    const cx = width / 2;
    const cy = height / 2;
    const loops = 4.5;
    const totalPoints = 600;
    const amp = 35 * waveHeight * scale;

    ctx.lineWidth = thickness;
    ctx.strokeStyle = colors.primary;
    ctx.beginPath();

    for (let i = 0; i < totalPoints; i++) {
      const t = i / totalPoints;
      const angle = t * Math.PI * 2 * loops + this.phase * 0.3;
      const baseR = t * Math.min(width, height) * 0.42 * tightness;
      const sample = waveform[Math.floor(t * waveform.length)];
      const r = Math.max(0, baseR + sample * amp);

      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // MODE 7: WAVE TUNNEL
  private renderTunnel(rc: RenderContext, scale: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform } = analysis;
    const { waveHeight, thickness } = oscilloscopeConfig;

    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) * 0.48;

    ctx.lineWidth = thickness;

    for (let ring = 0; ring < this.tunnelRings.length; ring++) {
      const rItem = this.tunnelRings[ring];
      rItem.radius += rItem.speed;
      if (rItem.radius > maxRadius) {
        rItem.radius = 25;
      }
      const ringT = rItem.radius / maxRadius;
      const alpha = Math.sin(ringT * Math.PI);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = ring % 2 === 0 ? colors.primary : colors.secondary;

      ctx.beginPath();
      const segments = 64;
      const amp = 30 * waveHeight * scale * (1 - ringT * 0.5);

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const sIdx = Math.floor((i / segments) * waveform.length);
        const sample = waveform[sIdx];
        const r = rItem.radius + sample * amp;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  // MODE 8: LISSAJOUS XY OSCILLOSCOPE
  private renderLissajous(rc: RenderContext, scale: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform, mid } = analysis;
    const { waveHeight, thickness } = oscilloscopeConfig;

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.38 * waveHeight * scale;
    const phaseLag = Math.floor(waveform.length * 0.25);
    const harmonicRatio = 2.0 + mid * 2.0;

    ctx.lineWidth = thickness;
    ctx.strokeStyle = colors.primary;
    ctx.beginPath();

    const steps = 600;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const idxX = Math.floor(t * waveform.length);
      const idxY = (idxX + phaseLag) % waveform.length;

      const sampleX = waveform[idxX];
      const sampleY = waveform[idxY];

      const angle = t * Math.PI * 2;
      const x = cx + (sampleX * 0.8 + Math.cos(angle)) * radius;
      const y = cy + (sampleY * 0.8 + Math.sin(angle * harmonicRatio + this.phase * 0.4)) * radius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // MODE 9: ORBITAL HARMONICS
  private renderOrbital(rc: RenderContext, baseRadius: number, bassScale: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform, bass, beatStrength } = analysis;
    const { waveHeight, thickness } = oscilloscopeConfig;

    const cx = width / 2;
    const cy = height / 2;

    // Pulsing central nucleus
    const coreR = 25 + bass * 25 + beatStrength * 20;
    const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, coreR);
    coreGrad.addColorStop(0, colors.accent);
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    // 3 Waveform modulated orbits
    const numOrbits = 3;
    ctx.lineWidth = thickness;

    for (let o = 0; o < numOrbits; o++) {
      const orbitR = baseRadius * (0.6 + o * 0.35);
      const orbitSpeed = (o + 1) * 0.4 * (o % 2 === 0 ? 1 : -1);
      const orbitPhase = this.phase * orbitSpeed;

      ctx.strokeStyle = o === 0 ? colors.primary : o === 1 ? colors.secondary : colors.accent;
      ctx.beginPath();

      const segs = 180;
      for (let i = 0; i <= segs; i++) {
        const angle = (i / segs) * Math.PI * 2 + orbitPhase;
        const sIdx = Math.floor((i / segs) * waveform.length);
        const sample = waveform[sIdx];
        const r = orbitR + sample * 40 * waveHeight * bassScale;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * 0.65; // ellipse angle

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Satellite node on orbit
      const satAngle = orbitPhase * 2;
      const satR = orbitR + waveform[Math.floor(waveform.length * 0.5)] * 30;
      const sx = cx + Math.cos(satAngle) * satR;
      const sy = cy + Math.sin(satAngle) * satR * 0.65;

      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(sx, sy, 5 + bass * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // MODE 10: FLUID WAVE
  private renderFluid(rc: RenderContext, scale: number) {
    const { ctx, width, height, analysis, colors, oscilloscopeConfig } = rc;
    const { waveform, mid } = analysis;
    const { waveHeight, thickness, fill, fillOpacity } = oscilloscopeConfig;

    const centerY = height / 2;
    const amp = height * 0.22 * waveHeight * scale;

    ctx.lineWidth = thickness;
    ctx.strokeStyle = colors.primary;

    // Bezier fluid ribbon with 4 offset wave segments
    const ribbons = 3;
    for (let r = 0; r < ribbons; r++) {
      ctx.beginPath();
      const rOffset = (r / ribbons) * Math.PI;
      ctx.strokeStyle = r === 0 ? colors.primary : r === 1 ? colors.secondary : colors.accent;
      ctx.globalAlpha = 0.85 - r * 0.2;

      for (let x = 0; x <= width; x += 15) {
        const t = x / width;
        const sIdx = Math.floor(t * waveform.length);
        const sample = waveform[sIdx];
        const harmonic = Math.sin(t * 12 + this.phase + rOffset) * mid * 30;
        const y = centerY + sample * amp + harmonic;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (fill && r === 0) {
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = colors.primary;
        ctx.globalAlpha = fillOpacity;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }

  // MULTI-LAYER CUSTOM WAVEFORM LAYER RENDERER
  private renderCustomLayer(rc: RenderContext, layer: WaveformLayer, pulseScale: number) {
    const { ctx, width, height, analysis } = rc;
    const { waveform, bass, treble, beatStrength } = analysis;

    ctx.save();
    ctx.lineWidth = layer.thickness;
    ctx.strokeStyle = layer.color;
    ctx.globalAlpha = layer.opacity;

    const centerY = height / 2 + layer.verticalOffset;
    const amp = (height * 0.2) * layer.amplitude * pulseScale;

    ctx.beginPath();
    for (let x = 0; x < width; x += 3) {
      const t = x / width;
      const sIdx = Math.floor(t * waveform.length);
      let sample = waveform[sIdx];

      if (layer.type === 'bass') {
        sample *= (1.0 + bass * 2.0);
      } else if (layer.type === 'treble') {
        sample += (Math.random() * 2 - 1) * treble * 0.3;
      } else if (layer.type === 'beat') {
        sample *= (1.0 + beatStrength * 2.5);
      }

      const y = centerY + sample * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}
