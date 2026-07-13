import React from "react";

type MascotMood =
  | "happy"
  | "thinking"
  | "celebrating"
  | "excited"
  | "curious"
  | "greeting"
  | "worried";

interface RobotMascotProps {
  size?: number;
  mood?: MascotMood;
  className?: string;
}

export const RobotMascot = React.memo(function RobotMascot({
  size = 80,
  mood = "happy",
  className = "",
}: RobotMascotProps) {
  const animClass = {
    happy: "animate-float",
    thinking: "animate-float",
    celebrating: "animate-mascot-celebrate",
    excited: "animate-mascot-excited",
    curious: "animate-mascot-curious",
    greeting: "animate-mascot-wave",
    worried: "animate-mascot-worried",
  }[mood];

  // Eye pupil offsets per mood
  const leftPupil = {
    happy: { cx: 30, cy: 31, r: 4 },
    thinking: { cx: 27, cy: 31, r: 4 },
    celebrating: { cx: 30, cy: 29, r: 4 },
    excited: { cx: 30, cy: 30, r: 5 },
    curious: { cx: 31, cy: 29, r: 3.5 },
    greeting: { cx: 30, cy: 31, r: 4 },
    worried: { cx: 28, cy: 32, r: 3.5 },
  }[mood];

  const rightPupil = {
    happy: { cx: 52, cy: 31, r: 4 },
    thinking: { cx: 49, cy: 31, r: 4 },
    celebrating: { cx: 52, cy: 29, r: 4 },
    excited: { cx: 52, cy: 30, r: 5 },
    curious: { cx: 53, cy: 29, r: 3.5 },
    greeting: { cx: 52, cy: 31, r: 4 },
    worried: { cx: 50, cy: 32, r: 3.5 },
  }[mood];

  // Eye shine positions — offset slightly from pupil center (upper-right of pupil)
  const leftShine = {
    happy: { cx: leftPupil.cx + 1.5, cy: leftPupil.cy - 2 },
    thinking: { cx: leftPupil.cx + 1.5, cy: leftPupil.cy - 2 },
    celebrating: { cx: leftPupil.cx + 1.5, cy: leftPupil.cy - 2 },
    excited: { cx: leftPupil.cx + 2, cy: leftPupil.cy - 2 },
    curious: { cx: leftPupil.cx + 1.5, cy: leftPupil.cy - 1.5 },
    greeting: { cx: leftPupil.cx + 1.5, cy: leftPupil.cy - 2 },
    worried: { cx: leftPupil.cx + 1.5, cy: leftPupil.cy - 1.5 },
  }[mood];

  const rightShine = {
    happy: { cx: rightPupil.cx + 1.5, cy: rightPupil.cy - 2 },
    thinking: { cx: rightPupil.cx + 1.5, cy: rightPupil.cy - 2 },
    celebrating: { cx: rightPupil.cx + 1.5, cy: rightPupil.cy - 2 },
    excited: { cx: rightPupil.cx + 2, cy: rightPupil.cy - 2 },
    curious: { cx: rightPupil.cx + 1.5, cy: rightPupil.cy - 1.5 },
    greeting: { cx: rightPupil.cx + 1.5, cy: rightPupil.cy - 2 },
    worried: { cx: rightPupil.cx + 1.5, cy: rightPupil.cy - 1.5 },
  }[mood];

  // Mouth shape per mood
  const getMouth = () => {
    if (mood === "celebrating" || mood === "excited") {
      return (
        <path
          d="M26 43 Q40 56 54 43"
          stroke="#FFD166"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    if (mood === "thinking") {
      return (
        <path
          d="M30 47 Q40 45 50 47"
          stroke="#FFD166"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    if (mood === "curious") {
      return (
        <path
          d="M29 44 Q40 50 51 47"
          stroke="#FFD166"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    if (mood === "worried") {
      return (
        <path
          d="M30 48 Q40 43 50 48"
          stroke="#FFD166"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    // happy, greeting
    return (
      <path
        d="M28 43 Q40 50 52 43"
        stroke="#FFD166"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  // Extra sparkles for excited/celebrating
  const getExtras = () => {
    if (mood === "excited") {
      return (
        <>
          <text x="10" y="18" fontSize="10" textAnchor="middle">
            ✨
          </text>
          <text x="70" y="18" fontSize="10" textAnchor="middle">
            ✨
          </text>
        </>
      );
    }
    if (mood === "celebrating") {
      return (
        <>
          <text x="8" y="20" fontSize="9" textAnchor="middle">
            🎉
          </text>
          <text x="72" y="20" fontSize="9" textAnchor="middle">
            ⭐
          </text>
        </>
      );
    }
    if (mood === "curious") {
      return (
        <text x="62" y="14" fontSize="10" textAnchor="middle">
          ❓
        </text>
      );
    }
    if (mood === "greeting") {
      return (
        <text x="68" y="56" fontSize="12" textAnchor="middle">
          👋
        </text>
      );
    }
    if (mood === "worried") {
      return (
        <text x="18" y="22" fontSize="9" textAnchor="middle">
          💧
        </text>
      );
    }
    return null;
  };

  return (
    <div
      className={`${animClass} inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* aria-hidden: mascot is purely decorative, no meaningful content for screen readers */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Antenna */}
        <line
          x1="40"
          y1="8"
          x2="40"
          y2="16"
          stroke="#5B4FCF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="40" cy="6" r="4" fill="#FF6B35" />
        {/* Head */}
        <rect
          x="16"
          y="16"
          width="48"
          height="38"
          rx="12"
          fill="#5B4FCF"
          transform={mood === "curious" ? "rotate(-3 40 35)" : undefined}
        />
        {/* Eye whites */}
        <circle cx="29" cy="30" r="8" fill="white" />
        <circle cx="51" cy="30" r="8" fill="white" />
        {/* Pupils */}
        <circle
          cx={leftPupil.cx}
          cy={leftPupil.cy}
          r={leftPupil.r}
          fill="#1A1A2E"
        />
        <circle
          cx={rightPupil.cx}
          cy={rightPupil.cy}
          r={rightPupil.r}
          fill="#1A1A2E"
        />
        {/* Eye shine — tracks pupil position */}
        <circle cx={leftShine.cx} cy={leftShine.cy} r="1.5" fill="white" />
        <circle cx={rightShine.cx} cy={rightShine.cy} r="1.5" fill="white" />
        {/* Mouth */}
        {getMouth()}
        {/* Cheeks */}
        <circle
          cx="22"
          cy="36"
          r="5"
          fill={mood === "worried" ? "#6B6B8A" : "#FF6B35"}
          opacity={mood === "worried" ? 0.3 : 0.4}
        />
        <circle
          cx="58"
          cy="36"
          r="5"
          fill={mood === "worried" ? "#6B6B8A" : "#FF6B35"}
          opacity={mood === "worried" ? 0.3 : 0.4}
        />
        {/* Body */}
        <rect x="22" y="54" width="36" height="22" rx="10" fill="#7B6FDF" />
        {/* Chest light */}
        <circle cx="40" cy="64" r="5" fill="#00C9A7" opacity="0.8" />
        {/* Arms */}
        <rect x="6" y="58" width="14" height="8" rx="4" fill="#5B4FCF" />
        <rect
          x="60"
          y={mood === "greeting" ? "50" : "58"}
          width="14"
          height="8"
          rx="4"
          fill="#5B4FCF"
          transform={mood === "greeting" ? "rotate(-45 67 54)" : undefined}
        />
        {/* Extras */}
        {getExtras()}
      </svg>
    </div>
  );
});
