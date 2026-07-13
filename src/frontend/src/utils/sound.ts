let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  startTime: number,
  duration: number,
  gainPeak = 0.3,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

export function playCorrect(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 523, "sine", now, 0.15);
  playTone(ctx, 784, "sine", now + 0.12, 0.22);
}

export function playWrong(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 220, "square", now, 0.08, 0.2);
  playTone(ctx, 180, "square", now + 0.1, 0.18, 0.15);
}

export function playCelebration(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(ctx, 523, "sine", now, 0.12);
  playTone(ctx, 659, "sine", now + 0.12, 0.12);
  playTone(ctx, 784, "sine", now + 0.24, 0.28, 0.35);
}
