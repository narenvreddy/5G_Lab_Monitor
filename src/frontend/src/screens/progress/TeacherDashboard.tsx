import { BookOpen, Copy, GraduationCap, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useApp } from "../../contexts/AppContext";
import { useActor } from "../../hooks/useActor";
import { getOrCreateClassCode } from "../../utils/classCode";
import { hashPin } from "../../utils/pinHash";

function getTotalStarsForProfile(profile: {
  progress: Array<{ lessons?: Array<{ stars: number | bigint }> }>;
}): number {
  return profile.progress.reduce((sum, unit) => {
    const lessons = unit.lessons ?? [];
    return sum + lessons.reduce((s, l) => s + Number(l.stars ?? 0), 0);
  }, 0);
}

function getLessonsCompleted(profile: {
  progress: Array<{ lessons?: Array<{ stars: number | bigint }> }>;
}): number {
  return profile.progress.reduce((count, unit) => {
    const lessons = unit.lessons ?? [];
    return count + lessons.filter((l) => Number(l.stars ?? 0) > 0).length;
  }, 0);
}

function getHighestUnit(profile: {
  progress: Array<{
    unitIndex: number | bigint;
    lessons?: Array<{ stars: number | bigint }>;
  }>;
}): number {
  const unitsWithProgress = profile.progress.filter((u) =>
    (u.lessons ?? []).some((l) => Number(l.stars ?? 0) > 0),
  );
  if (!unitsWithProgress.length) return 0;
  return Math.max(...unitsWithProgress.map((p) => Number(p.unitIndex ?? 0)));
}

interface TeacherDashboardProps {
  onNavigateToSettings?: () => void;
}

export function TeacherDashboard({
  onNavigateToSettings,
}: TeacherDashboardProps) {
  const { profiles } = useApp();
  const { actor } = useActor();

  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("parentUnlocked") === "1",
  );

  const classCode = getOrCreateClassCode();
  const className = localStorage.getItem("mathspark_class_name") || "My Class";

  const handleVerifyPin = async () => {
    if (!actor) return;
    const hash = hashPin(pinInput);
    const ok = await actor.verifyParentPin(hash);
    if (ok) {
      setUnlocked(true);
      sessionStorage.setItem("parentUnlocked", "1");
      setPinError(false);
    } else {
      setPinError(true);
    }
    setPinInput("");
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(classCode)
      .then(() => {
        toast.success("Class code copied to clipboard!");
      })
      .catch(() => {
        toast.error(`Could not copy — code is: ${classCode}`);
      });
  };

  if (!unlocked) {
    return (
      <Card
        className="p-6 rounded-2xl border-0 shadow-md text-center"
        data-ocid="progress.teacher_pin_gate.panel"
      >
        <GraduationCap size={48} className="text-[#00C9A7] mx-auto mb-3" />
        <h3 className="font-black text-xl text-[#1A1A2E] mb-2">
          Teacher Dashboard
        </h3>
        <p className="text-[#6B6B8A] mb-4">Enter your 4-digit PIN to view</p>
        <Input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="• • • •"
          value={pinInput}
          onChange={(e) => {
            setPinInput(e.target.value);
            setPinError(false);
          }}
          onKeyDown={(e) =>
            e.key === "Enter" && pinInput.length === 4 && handleVerifyPin()
          }
          className={`text-center text-2xl tracking-widest rounded-xl mb-3 ${
            pinError ? "border-[#EF476F]" : ""
          }`}
          data-ocid="progress.teacher_pin.input"
        />
        {pinError && (
          <p className="text-[#EF476F] text-sm mb-2" role="alert">
            Incorrect PIN. Try again.
          </p>
        )}
        <Button
          onClick={handleVerifyPin}
          disabled={pinInput.length !== 4}
          className="w-full bg-[#00C9A7] hover:bg-[#00b096] text-white rounded-xl font-bold"
          data-ocid="progress.teacher_unlock.primary_button"
        >
          Unlock Dashboard
        </Button>
        <button
          type="button"
          onClick={() => {
            setUnlocked(true);
            sessionStorage.setItem("parentUnlocked", "1");
          }}
          className="mt-3 text-xs text-[#6B6B8A] underline"
          data-ocid="progress.teacher_skip_pin.button"
        >
          No PIN set? Enter without PIN
        </button>
      </Card>
    );
  }

  const allProfiles = profiles ?? [];
  const avgStars =
    allProfiles.length > 0
      ? Math.round(
          allProfiles.reduce(
            (s, p) =>
              s +
              getTotalStarsForProfile(
                p as {
                  progress: Array<{
                    lessons?: Array<{ stars: number | bigint }>;
                  }>;
                },
              ),
            0,
          ) / allProfiles.length,
        )
      : 0;
  const avgLessons =
    allProfiles.length > 0
      ? Math.round(
          allProfiles.reduce(
            (s, p) =>
              s +
              getLessonsCompleted(
                p as {
                  progress: Array<{
                    lessons?: Array<{ stars: number | bigint }>;
                  }>;
                },
              ),
            0,
          ) / allProfiles.length,
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4 pb-8"
      data-ocid="progress.teacher_dashboard.panel"
    >
      {/* Class header */}
      <Card className="p-5 rounded-2xl border-0 shadow-md bg-gradient-to-br from-[#00C9A7] to-[#00a88c] text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={20} />
              <span className="font-black text-lg">{className}</span>
            </div>
            <p className="text-white/80 text-xs">Your class code</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="text-3xl font-black tracking-widest bg-white/20 rounded-xl px-4 py-2"
                data-ocid="progress.teacher_class_code.panel"
              >
                {classCode}
              </span>
              <Button
                size="sm"
                onClick={handleCopyCode}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold border-0"
                data-ocid="progress.teacher_copy_code.button"
              >
                <Copy size={14} className="mr-1" /> Copy
              </Button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/70 text-xs">Students</div>
            <div className="text-3xl font-black">{allProfiles.length}</div>
          </div>
        </div>
      </Card>

      {/* Class average */}
      {allProfiles.length > 0 && (
        <Card className="p-4 rounded-2xl border-0 shadow-sm">
          <h3 className="font-black text-[#1A1A2E] text-sm mb-3 flex items-center gap-2">
            <Users size={16} className="text-[#00C9A7]" /> Class Average
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#FFF8E7] rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-[#FFD166]">
                ⭐ {avgStars}
              </div>
              <div className="text-xs text-[#6B6B8A] font-semibold mt-1">
                Avg Stars
              </div>
            </div>
            <div className="bg-[#E8FAF7] rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-[#00C9A7]">
                {avgLessons}
              </div>
              <div className="text-xs text-[#6B6B8A] font-semibold mt-1">
                Avg Lessons
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Student list */}
      <Card className="p-4 rounded-2xl border-0 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-[#1A1A2E] text-sm flex items-center gap-2">
            <BookOpen size={16} className="text-[#5B4FCF]" /> Students
          </h3>
          <Button
            size="sm"
            onClick={onNavigateToSettings}
            className="bg-[#5B4FCF] hover:bg-[#4a3fbe] text-white rounded-xl font-bold text-xs"
            data-ocid="progress.teacher_add_student.primary_button"
          >
            + Add Student
          </Button>
        </div>

        {allProfiles.length === 0 ? (
          <div
            className="text-center py-8 text-[#6B6B8A]"
            data-ocid="progress.teacher_students.empty_state"
          >
            <Users size={36} className="mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-sm">No students yet</p>
            <p className="text-xs mt-1">Add student profiles in Settings</p>
          </div>
        ) : (
          <div
            className="space-y-2 overflow-x-auto"
            data-ocid="progress.teacher_students.list"
          >
            {/* Table header */}
            <div className="grid grid-cols-5 gap-1 px-2 text-[10px] font-black text-[#6B6B8A] uppercase tracking-wide">
              <div className="col-span-2">Student</div>
              <div className="text-center">Stars</div>
              <div className="text-center">Lessons</div>
              <div className="text-center">Streak</div>
            </div>
            {allProfiles.map((profile, idx) => {
              const stars = getTotalStarsForProfile(
                profile as {
                  progress: Array<{
                    lessons?: Array<{ stars: number | bigint }>;
                  }>;
                },
              );
              const lessons = getLessonsCompleted(
                profile as {
                  progress: Array<{
                    lessons?: Array<{ stars: number | bigint }>;
                  }>;
                },
              );
              const streak = Number(
                (profile as { dailyStreak?: { currentStreak?: bigint } })
                  .dailyStreak?.currentStreak ?? 0,
              );
              const highestUnit = getHighestUnit(
                profile as {
                  progress: Array<{
                    unitIndex: number | bigint;
                    lessons?: Array<{ stars: number | bigint }>;
                  }>;
                },
              );
              return (
                <motion.div
                  key={String((profile as { id: bigint }).id)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="grid grid-cols-5 gap-1 items-center bg-[#F4F2FF] rounded-xl px-3 py-2"
                  data-ocid={`progress.teacher_students.item.${idx + 1}`}
                >
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <span className="text-xl flex-shrink-0" aria-hidden="true">
                      {(profile as { avatar: string }).avatar}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-[#1A1A2E] text-xs truncate">
                        {(profile as { name: string }).name}
                      </div>
                      <div className="text-[10px] text-[#6B6B8A]">
                        Unit {highestUnit + 1}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-black text-[#FFD166]">
                      {stars}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-black text-[#5B4FCF]">
                      {lessons}
                    </span>
                  </div>
                  <div className="text-center">
                    <span
                      className={`text-sm font-black ${
                        streak > 0 ? "text-[#FF6B35]" : "text-[#6B6B8A]"
                      }`}
                    >
                      {streak > 0 ? `🔥${streak}` : "–"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Share instructions */}
      <Card className="p-4 rounded-2xl border-0 shadow-sm bg-[#F0FBF9]">
        <div className="flex gap-3">
          <Shield size={20} className="text-[#00C9A7] shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-[#1A1A2E] text-sm">
              Share your class code
            </p>
            <p className="text-xs text-[#6B6B8A] mt-1">
              Give students the code{" "}
              <span className="font-bold text-[#00C9A7]">{classCode}</span> so
              they can identify your class when joining.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
