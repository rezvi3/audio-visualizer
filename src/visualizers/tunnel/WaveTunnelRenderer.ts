import { IVisualizerRenderer, RenderContext } from '../../rendering/types';

export class WaveTunnelRenderer implements IVisualizerRenderer {
  private offsetZ = 0;

  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, deltaTime } = rc;
    const { waveform, bass, beatStrength } = analysis;

    this.offsetZ += deltaTime * (25 + bass * 80 + beatStrength * 60);

    const cx = width / 2;
    const cy = height / 2;
    const numRings = 14;
    const ringSpacing = 45;

    ctx.save();
    if (effects.glow > 0.05) {
      ctx.shadowBlur = effects.glow * 20;
      ctx.shadowColor = colors.glow || colors.primary;
    }

    ctx.lineWidth = 2.5;

    for (let r = numRings; r >= 1; r--) {
      const z = ((r * ringSpacing + this.offsetZ) % (numRings * ringSpacing));
      const depthFactor = z / (numRings * ringSpacing);
      const ringRadius = Math.max(10, depthFactor * Math.min(width, height) * 0.48);
      const alpha = Math.sin(depthFactor * Math.PI);

      ctx.strokeStyle = r % 2 === 0 ? colors.primary : colors.secondary;
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      const segments = 48;
      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        const sIdx = Math.floor((s / segments) * waveform.length);
        const sample = waveform[sIdx];
        const rad = ringRadius + sample * 35 * depthFactor * (1 + bass * 0.8);

        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;

        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }
}
