import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getOrCreateClassCode } from "../utils/classCode";
import { RobotMascot } from "./RobotMascot";
import { Button } from "./ui/button";

interface OnboardingWalkthroughProps {
  onComplete: () => void;
  onNavigateToUnits: () => void;
  onNavigateToProgress?: () => void;
  onCreateProfile?: (name: string) => Promise<void>;
}

type Role = "child" | "parent" | "both" | "teacher" | null;

const STEP_KEYS = ["role", "profile", "directional", "accessibility", "ready"];

export function OnboardingWalkthrough({
  onComplete,
  onNavigateToUnits,
  onNavigateToProgress,
  onCreateProfile,
}: OnboardingWalkthroughProps) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>(null);
  const [profileName, setProfileName] = useState("");
  const [profileCreating, setProfileCreating] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);

  const handleRoleSelect = (selected: Role) => {
    setRole(selected);
    if (selected) {
      localStorage.setItem("mathspark_role", selected);
      if (selected === "teacher") {
        getOrCreateClassCode();
      }
    }
    setStep(1);
  };

  const handleCreateProfile = async () => {
    if (!onCreateProfile || !profileName.trim()) return;
    setProfileCreating(true);
    try {
      await onCreateProfile(profileName.trim());
      setProfileCreated(true);
    } catch {
      // ignore
    } finally {
      setProfileCreating(false);
    }
  };

  const handleFinish = () => {
    onComplete();
    if (role === "teacher") {
      onNavigateToProgress?.();
    } else if (role !== "parent") {
      onNavigateToUnits();
    }
  };

  const handleSkip = () => {
    onComplete();
    if (role === "teacher") {
      onNavigateToProgress?.();
    } else {
      onNavigateToUnits();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepRole onSelect={handleRoleSelect} />;
      case 1:
        return (
          <StepProfile
            profileName={profileName}
            setProfileName={setProfileName}
            profileCreating={profileCreating}
            profileCreated={profileCreated}
            onCreateProfile={onCreateProfile ? handleCreateProfile : undefined}
            onNext={() => setStep(2)}
            role={role}
          />
        );
      case 2:
        return (
          <StepDirectional
            role={role}
            onNext={() => setStep(3)}
            onSkip={handleSkip}
          />
        );
      case 3:
        return (
          <StepAccessibility onNext={() => setStep(4)} onSkip={handleSkip} />
        );
      case 4:
        return <StepReady role={role} onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 bg-[#5B4FCF]/10 pb-20"
      data-ocid="onboarding.section"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={STEP_KEYS[step]}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl mx-4 md:mx-0 p-6 md:p-8 max-w-sm md:max-w-md w-full shadow-2xl"
        >
          {renderStep()}

          {/* Progress dots — hidden on step 0 (role selection) */}
          {step > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              {STEP_KEYS.slice(1).map((key, i) => (
                <div
                  key={key}
                  className={`rounded-full transition-all duration-300 ${
                    i + 1 === step
                      ? "w-6 h-3 bg-[#5B4FCF]"
                      : i + 1 < step
                        ? "w-3 h-3 bg-[#5B4FCF]/50"
                        : "w-3 h-3 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Step 0 — Role Selection
function StepRole({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <div>
      <div className="flex justify-center mb-4">
        <RobotMascot size={90} mood="happy" />
      </div>
      <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-1">
        Welcome to MathSpark! ⚡
      </h2>
      <p className="text-[#6B6B8A] text-center font-semibold mb-6">
        Who&apos;s setting this up today?
      </p>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onSelect("child")}
          className="w-full text-left px-5 py-4 rounded-2xl border-2 border-[#5B4FCF]/20 hover:border-[#5B4FCF] hover:bg-[#5B4FCF]/5 transition-all font-black text-[#1A1A2E] text-lg"
          data-ocid="onboarding.role_child.button"
        >
          I&apos;m a Child 👦👧
        </button>
        <button
          type="button"
          onClick={() => onSelect("parent")}
          className="w-full text-left px-5 py-4 rounded-2xl border-2 border-[#5B4FCF]/20 hover:border-[#5B4FCF] hover:bg-[#5B4FCF]/5 transition-all font-black text-[#1A1A2E] text-lg"
          data-ocid="onboarding.role_parent.button"
        >
          I&apos;m a Parent 👩👨
        </button>
        <button
          type="button"
          onClick={() => onSelect("both")}
          className="w-full text-left px-5 py-4 rounded-2xl border-2 border-[#5B4FCF]/20 hover:border-[#5B4FCF] hover:bg-[#5B4FCF]/5 transition-all font-black text-[#1A1A2E] text-lg"
          data-ocid="onboarding.role_both.button"
        >
          Parent &amp; Child Together 🤝
        </button>
        <button
          type="button"
          onClick={() => onSelect("teacher")}
          className="w-full text-left px-5 py-4 rounded-2xl border-2 border-[#00C9A7]/30 hover:border-[#00C9A7] hover:bg-[#00C9A7]/5 transition-all font-black text-[#1A1A2E] text-lg"
          data-ocid="onboarding.role_teacher.button"
        >
          I&apos;m a Teacher 👩‍🏫
        </button>
      </div>
    </div>
  );
}

// Step 1 — Profile Creation
function StepProfile({
  profileName,
  setProfileName,
  profileCreating,
  profileCreated,
  onCreateProfile,
  onNext,
  role,
}: {
  profileName: string;
  setProfileName: (v: string) => void;
  profileCreating: boolean;
  profileCreated: boolean;
  onCreateProfile?: () => void;
  onNext: () => void;
  role: Role;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isTeacher = role === "teacher";

  return (
    <div>
      <div className="flex justify-center mb-4">
        <RobotMascot size={90} mood="excited" />
      </div>
      <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-1">
        {isTeacher ? "Your name?" : "What's your name?"}
      </h2>
      <p className="text-[#6B6B8A] text-center font-semibold mb-5">
        {isTeacher
          ? "Create a profile to track your class!"
          : "Let's create your profile so we can track your stars!"}
      </p>

      {!profileCreated ? (
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            placeholder={isTeacher ? "Your name..." : "Your name..."}
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && profileName.trim() && onCreateProfile?.()
            }
            disabled={profileCreating}
            className="w-full text-center text-xl font-bold py-3 px-4 rounded-2xl border-2 border-[#5B4FCF]/30 focus:border-[#5B4FCF] outline-none bg-gray-50 disabled:opacity-60"
            data-ocid="onboarding.profile_name.input"
          />
          {onCreateProfile && (
            <Button
              onClick={onCreateProfile}
              disabled={!profileName.trim() || profileCreating}
              className={`w-full text-white font-black text-lg py-4 rounded-2xl shadow-lg ${
                isTeacher
                  ? "bg-[#00C9A7] hover:bg-[#00b096]"
                  : "bg-[#FF6B35] hover:bg-[#e55c28]"
              }`}
              data-ocid="onboarding.create_profile.primary_button"
            >
              {profileCreating
                ? "Creating..."
                : isTeacher
                  ? "Set Up My Classroom 🏫"
                  : "Create My Profile 🚀"}
            </Button>
          )}
          {/* UX-01: Only show Skip when there is no way to create a profile */}
          {!onCreateProfile && (
            <button
              type="button"
              onClick={onNext}
              className="w-full text-center text-sm text-[#6B6B8A] py-2 hover:text-[#5B4FCF] transition-colors"
              data-ocid="onboarding.skip_profile.button"
            >
              Skip for now
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            className="text-center py-4 mb-4 rounded-2xl bg-[#00C9A7]/10 border-2 border-[#00C9A7]/30"
            data-ocid="onboarding.profile_created.success_state"
          >
            <span className="text-[#00C9A7] font-black text-lg">
              ✓ Profile created!
            </span>
          </div>
          <Button
            onClick={onNext}
            className={`w-full text-white font-black text-lg py-4 rounded-2xl shadow-lg ${
              isTeacher
                ? "bg-[#00C9A7] hover:bg-[#00b096]"
                : "bg-[#5B4FCF] hover:bg-[#4a3fbe]"
            }`}
            data-ocid="onboarding.next_step.primary_button"
          >
            Continue &rarr;
          </Button>
        </>
      )}
    </div>
  );
}

// Step 2 — Directional
function StepDirectional({
  role,
  onNext,
  onSkip,
}: {
  role: Role;
  onNext: () => void;
  onSkip: () => void;
}) {
  const classCode = localStorage.getItem("mathspark_class_code") || "";

  if (role === "teacher") {
    return (
      <div>
        <div className="flex justify-center mb-4">
          <RobotMascot size={90} mood="excited" />
        </div>
        <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-2">
          Set Up Your Classroom 🏫
        </h2>
        <div className="space-y-3 mb-6">
          <div className="bg-[#E8FAF7] rounded-2xl p-4">
            <p className="font-black text-[#1A1A2E] text-sm mb-1">
              Your class code
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-widest text-[#00C9A7] bg-white rounded-xl px-4 py-2">
                {classCode}
              </span>
              <span className="text-xs text-[#6B6B8A]">
                Share this with your students
              </span>
            </div>
          </div>
          <p className="text-sm text-[#6B6B8A] font-semibold">
            📱 Add student profiles in{" "}
            <span className="text-[#5B4FCF] font-black">Settings</span>
          </p>
          <p className="text-sm text-[#6B6B8A] font-semibold">
            📊 Your Teacher Dashboard is in the{" "}
            <span className="text-[#5B4FCF] font-black">Progress</span> tab
          </p>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-[#00C9A7] hover:bg-[#00b096] text-white font-black text-lg py-4 rounded-2xl shadow-lg"
          data-ocid="onboarding.teacher_directional.primary_button"
        >
          Got it, let&apos;s go! 🚀
        </Button>
      </div>
    );
  }

  if (role === "parent") {
    return (
      <div>
        <div className="flex justify-center mb-4">
          <RobotMascot size={90} mood="happy" />
        </div>
        <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-2">
          For Parents 👨‍👩‍👧
        </h2>
        <div className="space-y-3 mb-6">
          <p className="text-sm text-[#6B6B8A] font-semibold">
            🔒 Set a PIN in{" "}
            <span className="text-[#5B4FCF] font-black">
              Settings → Parent PIN
            </span>{" "}
            to protect the parent reports
          </p>
          <p className="text-sm text-[#6B6B8A] font-semibold">
            📊 Your Parent Dashboard is in the{" "}
            <span className="text-[#5B4FCF] font-black">Progress</span> tab
          </p>
          <p className="text-sm text-[#6B6B8A] font-semibold">
            👤 Add multiple child profiles in{" "}
            <span className="text-[#5B4FCF] font-black">
              Settings → Profiles
            </span>
          </p>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-[#5B4FCF] hover:bg-[#4a3fbe] text-white font-black text-lg py-4 rounded-2xl shadow-lg"
          data-ocid="onboarding.parent_directional.primary_button"
        >
          Got it! →
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full text-center text-sm text-[#6B6B8A] py-2 mt-2 hover:text-[#5B4FCF] transition-colors"
          data-ocid="onboarding.skip_directional.button"
        >
          Skip for now
        </button>
      </div>
    );
  }

  // Child / both
  return (
    <div>
      <div className="flex justify-center mb-4">
        <RobotMascot size={90} mood="happy" />
      </div>
      <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-2">
        Here&apos;s how it works! 🗺️
      </h2>
      <div className="space-y-3 mb-6">
        <p className="text-sm text-[#6B6B8A] font-semibold">
          📚 Tap <span className="text-[#5B4FCF] font-black">Units</span> to
          explore 9 fun math topics
        </p>
        <p className="text-sm text-[#6B6B8A] font-semibold">
          ⭐ Track your stars in the{" "}
          <span className="text-[#5B4FCF] font-black">Progress</span> tab
        </p>
        <p className="text-sm text-[#6B6B8A] font-semibold">
          🎮 Unlock arcade games by completing lessons!
        </p>
        <p className="text-sm text-[#6B6B8A] font-semibold">
          ⚡ Come back every day for a bonus Daily Challenge
        </p>
      </div>
      <Button
        onClick={onNext}
        className="w-full bg-[#5B4FCF] hover:bg-[#4a3fbe] text-white font-black text-lg py-4 rounded-2xl shadow-lg"
        data-ocid="onboarding.child_directional.primary_button"
      >
        Awesome, let&apos;s go! 🚀
      </Button>
      <button
        type="button"
        onClick={onSkip}
        className="w-full text-center text-sm text-[#6B6B8A] py-2 mt-2 hover:text-[#5B4FCF] transition-colors"
        data-ocid="onboarding.skip_directional.button"
      >
        Skip for now
      </button>
    </div>
  );
}

// Step 3 — Accessibility
function StepAccessibility({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <div className="flex justify-center mb-4">
        <RobotMascot size={90} mood="happy" />
      </div>
      <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-2">
        Make it yours ♿
      </h2>
      <div className="space-y-3 mb-6">
        <p className="text-sm text-[#6B6B8A] font-semibold">
          🔊 Turn on{" "}
          <span className="text-[#5B4FCF] font-black">Text-to-Speech</span> if
          you want questions read aloud
        </p>
        <p className="text-sm text-[#6B6B8A] font-semibold">
          🔡 Use the{" "}
          <span className="text-[#5B4FCF] font-black">Dyslexia Font</span> for
          easier reading
        </p>
        <p className="text-sm text-[#6B6B8A] font-semibold">
          🎨 Adjust colors for{" "}
          <span className="text-[#5B4FCF] font-black">
            color vision differences
          </span>
        </p>
        <p className="text-xs text-[#6B6B8A]">
          All these options are in Settings anytime.
        </p>
      </div>
      <Button
        onClick={onNext}
        className="w-full bg-[#5B4FCF] hover:bg-[#4a3fbe] text-white font-black text-lg py-4 rounded-2xl shadow-lg"
        data-ocid="onboarding.accessibility.primary_button"
      >
        Got it! →
      </Button>
      <button
        type="button"
        onClick={onSkip}
        className="w-full text-center text-sm text-[#6B6B8A] py-2 mt-2 hover:text-[#5B4FCF] transition-colors"
        data-ocid="onboarding.skip_accessibility.button"
      >
        Skip for now
      </button>
    </div>
  );
}

// Step 4 — Ready
function StepReady({
  role,
  onFinish,
}: {
  role: Role;
  onFinish: () => void;
}) {
  const isTeacher = role === "teacher";
  const isParent = role === "parent";

  return (
    <div>
      <div className="flex justify-center mb-4">
        <RobotMascot size={110} mood="excited" />
      </div>
      <h2 className="text-2xl font-black text-[#1A1A2E] text-center mb-2">
        {isTeacher
          ? "Your classroom is ready! 🏫"
          : isParent
            ? "All set! 🎉"
            : "You're ready to spark! ⚡"}
      </h2>
      <p className="text-[#6B6B8A] text-center font-semibold mb-6">
        {isTeacher
          ? "Add student profiles in Settings to get started."
          : isParent
            ? "Set a PIN in Settings to protect the parent dashboard."
            : "Your first lesson is waiting. Let's go earn some stars!"}
      </p>
      <Button
        onClick={onFinish}
        className={`w-full text-white font-black text-xl py-5 rounded-2xl shadow-xl ${
          isTeacher
            ? "bg-[#00C9A7] hover:bg-[#00b096]"
            : "bg-[#FF6B35] hover:bg-[#e55c28]"
        }`}
        data-ocid="onboarding.finish.primary_button"
      >
        {isTeacher
          ? "Open My Dashboard 📊"
          : isParent
            ? "Take me to the app!"
            : "Start Learning! 🚀"}
      </Button>
    </div>
  );
}
