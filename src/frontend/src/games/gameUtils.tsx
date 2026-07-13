import React from "react";

const CONFETTI_CSS = `
@keyframes confettiBurst {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
@keyframes scoreFloat {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-60px); opacity: 0; }
}
@keyframes comboPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}
`;

const PALETTE = ["#5B4FCF", "#FF6B35", "#00C9A7", "#FFD166", "#EF476F"];

interface ConfettiBurstProps {
  active: boolean;
}

export function ConfettiBurst({ active }: ConfettiBurstProps) {
  if (!active) return null;
  // Generate particles with stable keys based on index (static, not from list)
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360;
    const dist = 60 + ((i * 37) % 60);
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist - 30;
    const color = PALETTE[i % PALETTE.length];
    const size = 6 + (i % 6);
    const delay = (i % 5) * 0.04;
    return { tx, ty, color, size, delay, id: `p${i}` };
  });

  return (
    <>
      <style>{CONFETTI_CSS}</style>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 100 }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              // @ts-ignore
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              animation: `confettiBurst 1s ease-out ${p.delay}s forwards`,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
            }}
          />
        ))}
      </div>
    </>
  );
}

interface ScorePopupProps {
  value: number;
}

export function ScorePopup({ value }: ScorePopupProps) {
  return (
    <>
      <style>{CONFETTI_CSS}</style>
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 200,
          animation: "scoreFloat 0.8s ease-out forwards",
          fontWeight: 900,
          fontSize: 28,
          color: "#FFD166",
          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        +{value}
      </div>
    </>
  );
}

interface ComboIndicatorProps {
  combo: number;
}

export function ComboIndicator({ combo }: ComboIndicatorProps) {
  if (combo < 2) return null;
  const icon = combo >= 3 ? "⚡" : "🔥";
  const label = `${icon} x${combo} Combo!`;
  const color = combo >= 3 ? "#FF6B35" : "#FFD166";

  return (
    <>
      <style>{CONFETTI_CSS}</style>
      <div
        style={{
          display: "inline-block",
          backgroundColor: color,
          color: "#1A1A2E",
          fontWeight: 900,
          fontSize: 16,
          padding: "4px 14px",
          borderRadius: 999,
          animation: "comboPulse 0.6s ease-in-out infinite",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {label}
      </div>
    </>
  );
}

export { CONFETTI_CSS };
