import React from "react";

type MascotMood = "happy" | "thinking";

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
  const animClass = "animate-float";

  // Eye pupil offsets per mood
  const leftPupil = {
    happy: { cx: 30, cy: 31, r: 4 },
    thinking: { cx: 27, cy: 31, r: 4 },
  }[mood];

  const rightPupil = {
    happy: { cx: 52, cy: 31, r: 4 },
    thinking: { cx: 49, cy: 31, r: 4 },
  }[mood];

  // Eye shine positions — offset slightly from pupil center (upper-right of pupil)
  const leftShine = { cx: leftPupil.cx + 1.5, cy: leftPupil.cy - 2 };
  const rightShine = { cx: rightPupil.cx + 1.5, cy: rightPupil.cy - 2 };

  // Mouth shape per mood
  const getMouth = () => {
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
    // happy
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
        <rect x="16" y="16" width="48" height="38" rx="12" fill="#5B4FCF" />
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
        <circle cx="22" cy="36" r="5" fill="#FF6B35" opacity={0.4} />
        <circle cx="58" cy="36" r="5" fill="#FF6B35" opacity={0.4} />
        {/* Body */}
        <rect x="22" y="54" width="36" height="22" rx="10" fill="#7B6FDF" />
        {/* Chest light */}
        <circle cx="40" cy="64" r="5" fill="#00C9A7" opacity="0.8" />
        {/* Arms */}
        <rect x="6" y="58" width="14" height="8" rx="4" fill="#5B4FCF" />
        <rect x="60" y="58" width="14" height="8" rx="4" fill="#5B4FCF" />
      </svg>
    </div>
  );
});
