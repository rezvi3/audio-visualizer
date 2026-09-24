import { IVisualizerRenderer, RenderContext } from '../../rendering/types';

export class CircularSpectrumRenderer implements IVisualizerRenderer {
  private rotation = 0;

  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, deltaTime } = rc;
    const { frequencyDataNormalized, bass, beatStrength } = analysis;

    this.rotation += deltaTime * (0.15 + bass * 0.2);

    const cx = width / 2;
    const cy = height / 2;
    const baseRadius = Math.min(width, height) * 0.22 * (1 + beatStrength * 0.15);
    const numBars = 120;
    const maxBarLen = Math.min(width, height) * 0.26;

    ctx.save();
    if (effects.glow > 0.05) {
      ctx.shadowBlur = effects.glow * 22;
      ctx.shadowColor = colors.glow || colors.primary;
    }

    // Inner glowing ring
    ctx.lineWidth = 3;
    ctx.strokeStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < numBars; i++) {
      const angle = (i / numBars) * Math.PI * 2 + this.rotation;
      const logT = Math.pow(Math.abs(i - numBars / 2) / (numBars / 2), 1.4);
      const binIdx = Math.min(frequencyDataNormalized.length - 1, Math.floor(logT * frequencyDataNormalized.length * 0.7));
      const val = frequencyDataNormalized[binIdx] || 0;

      const barLen = Math.max(3, val * maxBarLen * (1 + bass * 0.5));
      const x1 = cx + Math.cos(angle) * baseRadius;
      const y1 = cy + Math.sin(angle) * baseRadius;
      const x2 = cx + Math.cos(angle) * (baseRadius + barLen);
      const y2 = cy + Math.sin(angle) * (baseRadius + barLen);

      ctx.lineWidth = 3;
      ctx.strokeStyle = i % 2 === 0 ? colors.primary : colors.secondary;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
