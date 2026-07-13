import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ChildProfile } from "../backend";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import { type ColorBlindType, useApp } from "../contexts/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getOrCreateClassCode } from "../utils/classCode";
import { hashPin } from "../utils/pinHash";

export function SettingsScreen({ onSignOut }: { onSignOut?: () => void }) {
  const {
    settings,
    updateSettings,
    profiles,
    activeProfile,
    refreshProfiles,
    colorBlindType,
    setColorBlindType,
  } = useApp();
  const { actor } = useActor();
  const { clear } = useInternetIdentity();
  const [showInlineAddProfile, setShowInlineAddProfile] = useState(false);
  const [profileToDeleteConfirm, setProfileToDeleteConfirm] = useState<
    bigint | null
  >(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [currentPinError, setCurrentPinError] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinSaved, setPinSaved] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [addingProfile, setAddingProfile] = useState(false);
  const [hasPinSet, setHasPinSet] = useState(false);

  // Classroom state
  const role = localStorage.getItem("mathspark_role") || "child";
  const isTeacher = role === "teacher";
  const [classNameValue, setClassNameValue] = useState(
    () => localStorage.getItem("mathspark_class_name") || "My Class",
  );
  const [classCode] = useState(() => getOrCreateClassCode());
  const [codeCopied, setCodeCopied] = useState(false);

  // Join class state (for non-teachers)
  const [joinCode, setJoinCode] = useState("");
  const [joinedClass, setJoinedClass] = useState(
    () => localStorage.getItem("mathspark_joined_class") || "",
  );

  useEffect(() => {
    if (!actor) return;
    actor
      .hasParentPin()
      .then(setHasPinSet)
      .catch(() => setHasPinSet(false));
  }, [actor]);

  const toggle = async (key: keyof typeof settings) => {
    await updateSettings({ ...settings, [key]: !settings[key] });
  };

  const handleAddProfile = async () => {
    if (!actor || !newProfileName.trim() || addingProfile) return;
    setAddingProfile(true);
    try {
      const p: ChildProfile = {
        id: BigInt(Date.now()),
        name: newProfileName.trim(),
        avatar: "\ud83e\udd16",
        progress: [],
        dailyStreak: { currentStreak: BigInt(0), lastActivity: BigInt(0) },
        arcadeHighScores: [],
      };
      await actor.saveProfile(p);
      await actor.switchActiveProfile(p.id);
      await refreshProfiles();
      setShowInlineAddProfile(false);
      setNewProfileName("");
    } finally {
      setAddingProfile(false);
    }
  };

  const handleSavePin = async () => {
    if (!actor || newPin.length !== 4) return;
    if (hasPinSet) {
      const ok = await actor.verifyParentPin(hashPin(currentPin));
      if (!ok) {
        setCurrentPinError(true);
        return;
      }
    }
    await actor.setParentPin(hashPin(newPin));
    setHasPinSet(true);
    setCurrentPin("");
    setNewPin("");
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!actor || profileToDeleteConfirm === null) return;
    const wasActive = activeProfile?.id === profileToDeleteConfirm;
    await actor.deleteProfile(profileToDeleteConfirm);
    if (wasActive) {
      const remaining = profiles.filter((p) => p.id !== profileToDeleteConfirm);
      if (remaining.length > 0) {
        await actor.switchActiveProfile(remaining[0].id);
      }
    }
    await refreshProfiles();
    setProfileToDeleteConfirm(null);
  };

  const handleSwitchProfile = async (id: bigint) => {
    if (!actor) return;
    await actor.switchActiveProfile(id);
    await refreshProfiles();
  };

  const voiceSpeedLabel = (v: number) => {
    if (v <= 7) return "Slow";
    if (v <= 13) return "Normal";
    return "Fast";
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(classCode)
      .then(() => {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
        toast.success("Class code copied!");
      })
      .catch(() => {
        toast.error(`Could not copy — code is: ${classCode}`);
      });
  };

  const handleSaveClassName = () => {
    localStorage.setItem("mathspark_class_name", classNameValue);
    toast.success("Class name saved!");
  };

  const handleJoinClass = () => {
    if (joinCode.trim().length !== 6) return;
    const code = joinCode.trim().toUpperCase();
    localStorage.setItem("mathspark_joined_class", code);
    setJoinedClass(code);
    setJoinCode("");
    toast.success(`Joined class ${code}!`);
  };

  const handleLeaveClass = () => {
    localStorage.removeItem("mathspark_joined_class");
    setJoinedClass("");
    toast.success("Left class.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F2FF] pb-20">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-[#5B4FCF] via-[#6B5FDF] to-[#7B6FDF] px-6 pt-10 md:pt-12 pb-6 rounded-b-[40px] shadow-lg">
        <h1 className="text-white font-black text-2xl md:text-3xl">
          ⚙️ Settings
        </h1>
        <p className="text-purple-200 mt-1">
          Customize your MathSpark experience
        </p>
      </div>

      <div className="px-4 md:px-6 pt-5 space-y-4 max-w-2xl md:max-w-none">
        {/* Profiles */}
        <Card className="p-5 rounded-2xl border-0 shadow-md">
          <h2 className="font-black text-[#1A1A2E] mb-3">Profiles</h2>
          <div className="space-y-2">
            {(profiles ?? []).map((p) => (
              <React.Fragment key={String(p.id)}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    activeProfile?.id === p.id
                      ? "bg-[#F4F2FF] border border-[#5B4FCF]/30"
                      : "bg-gray-50"
                  }`}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {p.avatar}
                  </span>
                  <span className="font-bold text-[#1A1A2E] flex-1">
                    {p.name}
                  </span>
                  {activeProfile?.id === p.id ? (
                    <span className="text-xs bg-[#5B4FCF] text-white rounded-full px-2 py-0.5 font-bold">
                      Active
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSwitchProfile(p.id)}
                        className="rounded-xl text-xs"
                        data-ocid="settings.switch_profile.button"
                        aria-label={`Switch to ${p.name}`}
                      >
                        Switch
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setProfileToDeleteConfirm(
                            profileToDeleteConfirm === p.id ? null : p.id,
                          )
                        }
                        className="rounded-xl text-xs text-[#EF476F] border-[#EF476F]/30"
                        data-ocid="settings.delete_profile.delete_button"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 size={12} aria-hidden="true" />
                      </Button>
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {profileToDeleteConfirm === p.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 p-2 bg-[#FFF0E8] rounded-xl flex items-center justify-between gap-2 border border-[#EF476F]/20">
                        <span className="text-xs text-[#EF476F] font-semibold flex-1">
                          Delete {p.name}? This can't be undone.
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setProfileToDeleteConfirm(null)}
                          className="rounded-xl text-xs h-7 px-2"
                          data-ocid="settings.delete_profile.cancel_button"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleConfirmDelete}
                          className="rounded-xl text-xs h-7 px-2 bg-[#EF476F] hover:bg-red-600 text-white"
                          data-ocid="settings.delete_profile.confirm_button"
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </div>
          <AnimatePresence>
            {showInlineAddProfile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="bg-[#F4F2FF] rounded-xl p-3 space-y-2 border border-[#5B4FCF]/20">
                  <label htmlFor="new-profile-name-input" className="sr-only">
                    Profile name
                  </label>
                  <Input
                    id="new-profile-name-input"
                    placeholder="Enter name"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddProfile()}
                    disabled={addingProfile}
                    className="rounded-xl text-lg"
                    data-ocid="settings.new_profile_name.input"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setShowInlineAddProfile(false);
                        setNewProfileName("");
                      }}
                      variant="outline"
                      className="flex-1 rounded-xl text-sm"
                      data-ocid="settings.add_profile.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddProfile}
                      disabled={!newProfileName.trim() || addingProfile}
                      className="flex-1 bg-[#5B4FCF] hover:bg-[#4a3fbe] text-white font-bold rounded-xl text-sm"
                      data-ocid="settings.add_profile.submit_button"
                    >
                      {addingProfile ? "Adding..." : "Add Profile"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!showInlineAddProfile && (
            <Button
              onClick={() => setShowInlineAddProfile(true)}
              className="mt-3 w-full bg-[#5B4FCF] hover:bg-[#4a3fbe] text-white font-bold rounded-xl"
              data-ocid="settings.add_profile.primary_button"
            >
              <Plus size={16} className="mr-2" aria-hidden="true" /> Add Profile
            </Button>
          )}
        </Card>

        {/* Accessibility */}
        <Card className="p-5 rounded-2xl border-0 shadow-md">
          <h2 className="font-black text-[#1A1A2E] mb-3">Accessibility</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1A2E]">Text-to-Speech</div>
                <div className="text-xs text-[#6B6B8A]">
                  Read questions aloud
                </div>
              </div>
              <Switch
                checked={!!settings.textToSpeechEnabled}
                onCheckedChange={() => toggle("textToSpeechEnabled")}
                aria-label="Enable text to speech"
                data-ocid="settings.tts.switch"
              />
            </div>
            {settings.textToSpeechEnabled && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-[#1A1A2E] text-sm">
                    Voice Speed
                  </div>
                  <span className="text-xs font-bold text-[#5B4FCF] bg-purple-50 px-2 py-0.5 rounded-full">
                    {voiceSpeedLabel(Number(settings.voiceSpeed ?? 10))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B6B8A] font-semibold w-10">
                    Slow
                  </span>
                  <Slider
                    min={5}
                    max={20}
                    step={1}
                    value={[Number(settings.voiceSpeed ?? 10)]}
                    onValueChange={([v]) =>
                      updateSettings({
                        ...settings,
                        voiceSpeed: BigInt(v ?? 10),
                      })
                    }
                    className="flex-1"
                    aria-label="Voice speed"
                    data-ocid="settings.voice_speed.input"
                  />
                  <span className="text-xs text-[#6B6B8A] font-semibold w-10 text-right">
                    Fast
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1A2E]">Dyslexia Font</div>
                <div className="text-xs text-[#6B6B8A]">
                  Use OpenDyslexic font
                </div>
              </div>
              <Switch
                checked={!!settings.dyslexicFont}
                onCheckedChange={() => toggle("dyslexicFont")}
                aria-label="Enable dyslexia friendly font"
                data-ocid="settings.dyslexic_font.switch"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1A2E]">High Contrast</div>
                <div className="text-xs text-[#6B6B8A]">
                  Increase text contrast
                </div>
              </div>
              <Switch
                checked={!!settings.highContrastMode}
                onCheckedChange={() => toggle("highContrastMode")}
                aria-label="Enable high contrast mode"
                data-ocid="settings.high_contrast.switch"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1A2E]">Reduce Motion</div>
                <div className="text-xs text-[#6B6B8A]">Fewer animations</div>
              </div>
              <Switch
                checked={!!settings.reduceMotion}
                onCheckedChange={() => toggle("reduceMotion")}
                aria-label="Reduce animations and motion"
                data-ocid="settings.reduce_motion.switch"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1A2E]">
                  Large Tap Targets
                </div>
                <div className="text-xs text-[#6B6B8A]">
                  Bigger buttons &amp; inputs
                </div>
              </div>
              <Switch
                checked={!!settings.largeTapTargets}
                onCheckedChange={() => toggle("largeTapTargets")}
                aria-label="Enable large tap targets"
                data-ocid="settings.large_tap.switch"
              />
            </div>
            <div className="space-y-2">
              <div>
                <div className="font-bold text-[#1A1A2E]">
                  Color Vision Mode
                </div>
                <div className="text-xs text-[#6B6B8A] mb-3">
                  Adjust colors for color vision differences
                </div>
              </div>
              <fieldset
                className="grid grid-cols-2 gap-2 border-0 p-0 m-0"
                data-ocid="settings.color_mode.select"
              >
                <legend className="sr-only">Color vision mode</legend>
                {(
                  [
                    {
                      value: "off" as ColorBlindType,
                      label: "Off",
                      emoji: "\ud83d\udc41\ufe0f",
                    },
                    {
                      value: "deuteranopia" as ColorBlindType,
                      label: "Deuteranopia",
                      emoji: "\ud83d\udfe2",
                    },
                    {
                      value: "protanopia" as ColorBlindType,
                      label: "Protanopia",
                      emoji: "\ud83d\udd34",
                    },
                    {
                      value: "tritanopia" as ColorBlindType,
                      label: "Tritanopia",
                      emoji: "\ud83d\udd35",
                    },
                  ] as const
                ).map(({ value, label, emoji }) => {
                  const isActive = colorBlindType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={async () => {
                        setColorBlindType(value);
                        await updateSettings({
                          ...settings,
                          colorBlindnessMode: value !== "off",
                        });
                      }}
                      aria-pressed={isActive}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                        isActive
                          ? "bg-[#5B4FCF] text-white border-[#5B4FCF]"
                          : "bg-white text-[#1A1A2E] border-[#E5E0FF] hover:border-[#5B4FCF]/40"
                      }`}
                      data-ocid={`settings.color_mode.${value}.toggle`}
                    >
                      <span aria-hidden="true">{emoji}</span>
                      <span className="leading-tight">{label}</span>
                    </button>
                  );
                })}
              </fieldset>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1A1A2E]">Auto-Advance</div>
                <div className="text-xs text-[#6B6B8A]">
                  Skip to next slide automatically
                </div>
              </div>
              <Switch
                checked={!!settings.autoAdvance}
                onCheckedChange={() => toggle("autoAdvance")}
                aria-label="Enable auto-advance to next slide"
                data-ocid="settings.auto_advance.switch"
              />
            </div>
          </div>
        </Card>

        {/* Audio */}
        <Card className="p-5 rounded-2xl border-0 shadow-md">
          <h2 className="font-black text-[#1A1A2E] mb-3">Audio</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1A1A2E]">Sound Effects</div>
              <div className="text-xs text-[#6B6B8A]">
                Correct/wrong/celebration sounds
              </div>
            </div>
            <Switch
              checked={!!settings.soundEnabled}
              onCheckedChange={() => toggle("soundEnabled")}
              aria-label="Enable sound effects"
              data-ocid="settings.sound_effects.switch"
            />
          </div>
        </Card>

        {/* Parent PIN */}
        <Card className="p-5 rounded-2xl border-0 shadow-md">
          <h2 className="font-black text-[#1A1A2E] mb-1">Parent PIN</h2>
          <p className="text-xs text-[#6B6B8A] mb-3">
            Protects the parent dashboard and profile deletion
          </p>
          <div className="space-y-2">
            {hasPinSet && (
              <>
                <label htmlFor="current-pin-input" className="sr-only">
                  Current PIN
                </label>
                <Input
                  id="current-pin-input"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={(e) => {
                    setCurrentPin(e.target.value);
                    setCurrentPinError(false);
                  }}
                  className={`text-center text-xl tracking-widest rounded-xl ${
                    currentPinError ? "border-[#EF476F]" : ""
                  }`}
                  aria-invalid={currentPinError}
                  aria-describedby={
                    currentPinError ? "current-pin-error" : undefined
                  }
                  data-ocid="settings.current_pin.input"
                />
                {currentPinError && (
                  <p
                    id="current-pin-error"
                    className="text-[#EF476F] text-xs font-semibold"
                    role="alert"
                  >
                    Incorrect current PIN.
                  </p>
                )}
              </>
            )}
            <label htmlFor="new-pin-input" className="sr-only">
              New 4-digit PIN
            </label>
            <Input
              id="new-pin-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Set new 4-digit PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="text-center text-xl tracking-widest rounded-xl"
              data-ocid="settings.parent_pin.input"
            />
            <Button
              onClick={handleSavePin}
              disabled={
                newPin.length !== 4 || (hasPinSet && currentPin.length !== 4)
              }
              className="w-full bg-[#00C9A7] text-white rounded-xl font-bold"
              data-ocid="settings.save_pin.primary_button"
            >
              {pinSaved ? (
                <>
                  <Check size={16} className="mr-2" aria-hidden="true" /> PIN
                  Saved!
                </>
              ) : (
                "Save PIN"
              )}
            </Button>
          </div>
        </Card>

        {/* Classroom section (teacher only) */}
        {isTeacher && (
          <Card className="p-5 rounded-2xl border-0 shadow-md border-l-4 border-l-[#00C9A7]">
            <h2 className="font-black text-[#1A1A2E] mb-1 flex items-center gap-2">
              <span>🏫</span> Classroom
            </h2>
            <p className="text-xs text-[#6B6B8A] mb-4">
              Manage your class settings
            </p>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="class-name-input"
                  className="text-sm font-bold text-[#1A1A2E] block mb-1"
                >
                  Class Name
                </label>
                <div className="flex gap-2">
                  <Input
                    id="class-name-input"
                    value={classNameValue}
                    onChange={(e) => setClassNameValue(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSaveClassName()
                    }
                    placeholder="My Class"
                    className="rounded-xl flex-1"
                    data-ocid="settings.class_name.input"
                  />
                  <Button
                    onClick={handleSaveClassName}
                    size="sm"
                    className="bg-[#00C9A7] hover:bg-[#00b096] text-white rounded-xl font-bold shrink-0"
                    data-ocid="settings.class_name.save_button"
                  >
                    <Check size={14} />
                  </Button>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-[#1A1A2E] mb-2">
                  Class Code
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-widest text-[#00C9A7] bg-[#E8FAF7] rounded-xl px-4 py-2">
                    {classCode}
                  </span>
                  <Button
                    size="sm"
                    onClick={handleCopyCode}
                    variant="outline"
                    className="rounded-xl font-bold text-[#00C9A7] border-[#00C9A7]/30"
                    data-ocid="settings.copy_class_code.button"
                  >
                    {codeCopied ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Copy size={14} className="mr-1" />
                    )}
                    {codeCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-xs text-[#6B6B8A] mt-2">
                  Share this code with students to identify your class
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Join a Class (non-teacher) */}
        {!isTeacher && (
          <Card className="p-5 rounded-2xl border-0 shadow-md">
            <h2 className="font-black text-[#1A1A2E] mb-1 flex items-center gap-2">
              <span>🏫</span> Join a Class
            </h2>
            <p className="text-xs text-[#6B6B8A] mb-4">
              Enter the code your teacher gave you
            </p>
            {joinedClass ? (
              <div
                className="flex items-center justify-between bg-[#E8FAF7] rounded-xl px-4 py-3"
                data-ocid="settings.joined_class.panel"
              >
                <div>
                  <div className="text-xs text-[#6B6B8A] font-semibold">
                    Current class
                  </div>
                  <div className="text-xl font-black tracking-widest text-[#00C9A7]">
                    {joinedClass}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLeaveClass}
                  className="text-[#EF476F] border-[#EF476F]/30 rounded-xl font-bold"
                  data-ocid="settings.leave_class.delete_button"
                >
                  Leave
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="6-character code"
                  value={joinCode}
                  onChange={(e) =>
                    setJoinCode(e.target.value.toUpperCase().slice(0, 6))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleJoinClass()}
                  className="rounded-xl flex-1 tracking-widest font-bold text-center uppercase"
                  maxLength={6}
                  data-ocid="settings.join_class.input"
                />
                <Button
                  onClick={handleJoinClass}
                  disabled={joinCode.trim().length !== 6}
                  className="bg-[#00C9A7] hover:bg-[#00b096] text-white rounded-xl font-bold shrink-0"
                  data-ocid="settings.join_class.primary_button"
                >
                  Join
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Account */}
        <Card className="p-5 rounded-2xl border-0 shadow-md">
          <h2 className="font-black text-[#1A1A2E] mb-3">Account</h2>
          <Button
            onClick={() => setShowSignOutConfirm(!showSignOutConfirm)}
            variant="outline"
            className="w-full border-[#EF476F]/40 text-[#EF476F] hover:bg-[#EF476F]/10 rounded-xl font-bold"
            data-ocid="settings.logout.delete_button"
          >
            Sign Out
          </Button>
          <AnimatePresence>
            {showSignOutConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-3 bg-[#FFF0E8] rounded-xl border border-[#EF476F]/20">
                  <p className="text-sm text-[#6B6B8A] mb-3">
                    Are you sure? Your progress is saved.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowSignOutConfirm(false)}
                      variant="outline"
                      className="flex-1 rounded-xl text-sm"
                      data-ocid="settings.signout.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        onSignOut ? onSignOut() : clear();
                      }}
                      className="flex-1 rounded-xl bg-[#EF476F] hover:bg-red-600 text-white text-sm font-bold"
                      data-ocid="settings.signout.confirm_button"
                    >
                      Confirm Sign Out
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
