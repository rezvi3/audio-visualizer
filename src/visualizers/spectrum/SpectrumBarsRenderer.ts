import { IVisualizerRenderer, RenderContext } from '../../rendering/types';

export class SpectrumBarsRenderer implements IVisualizerRenderer {
  private peaks: number[] = [];
  private peakHoldTimes: number[] = [];

  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, deltaTime } = rc;
    const { frequencyDataNormalized, bass, beat, beatStrength } = analysis;

    const numBars = 64;
    const barSpacing = 3;
    const totalSpacing = (numBars - 1) * barSpacing;
    const barWidth = Math.max(2, (width * 0.85 - totalSpacing) / numBars);
    const startX = (width - (numBars * barWidth + totalSpacing)) / 2;
    const baseY = height * 0.85;
    const maxHeight = height * 0.65 * (1 + bass * 0.4);

    // Initialize peaks if needed
    if (this.peaks.length !== numBars) {
      this.peaks = new Array(numBars).fill(0);
      this.peakHoldTimes = new Array(numBars).fill(0);
    }

    ctx.save();
    if (effects.glow > 0.05) {
      ctx.shadowBlur = effects.glow * 20;
      ctx.shadowColor = colors.glow || colors.primary;
    }

    // Step across logarithmic frequency bins
    for (let i = 0; i < numBars; i++) {
      // Logarithmic index distribution so bass has detail
      const logT = Math.pow(i / numBars, 1.6);
      const binIdx = Math.min(
        frequencyDataNormalized.length - 1,
        Math.floor(logT * (frequencyDataNormalized.length * 0.75))
      );
      let value = frequencyDataNormalized[binIdx] || 0;

      // Scale height
      const barH = Math.max(4, value * maxHeight * (1 + (beat ? beatStrength * 0.25 : 0)));
      const x = startX + i * (barWidth + barSpacing);
      const y = baseY - barH;

      // Peak tracking
      if (barH > this.peaks[i]) {
        this.peaks[i] = barH;
        this.peakHoldTimes[i] = 0;
      } else {
        this.peakHoldTimes[i] += deltaTime;
        if (this.peakHoldTimes[i] > 0.12) {
          this.peaks[i] = Math.max(0, this.peaks[i] - deltaTime * maxHeight * 0.8);
        }
      }

      // Bar gradient
      const grad = ctx.createLinearGradient(x, baseY, x, y);
      grad.addColorStop(0, colors.secondary);
      grad.addColorStop(1, colors.primary);

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barH);

      // Peak cap indicator
      const peakY = baseY - this.peaks[i] - 2;
      ctx.fillStyle = colors.accent || '#ffffff';
      ctx.fillRect(x, peakY, barWidth, 3);
    }

    ctx.restore();
  }
}
