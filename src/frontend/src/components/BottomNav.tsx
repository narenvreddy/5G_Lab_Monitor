import { BookOpen, Gamepad2, Home, Settings, Star } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

type Tab = "home" | "units" | "arcade" | "progress" | "settings";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  badges?: Partial<Record<Tab, number>>;
}

const tabs = [
  { id: "home" as Tab, label: "Home", Icon: Home },
  { id: "units" as Tab, label: "Units", Icon: BookOpen },
  { id: "arcade" as Tab, label: "Arcade", Icon: Gamepad2 },
  { id: "progress" as Tab, label: "Progress", Icon: Star },
  { id: "settings" as Tab, label: "Settings", Icon: Settings },
];

export function BottomNav({ active, onChange, badges = {} }: BottomNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      data-ocid="bottom_nav.panel"
    >
      <div className="flex items-center justify-around px-2 min-h-[4rem] max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
        {tabs.map(({ id, label, Icon }) => (
          <button
            type="button"
            key={id}
            role="tab"
            aria-selected={active === id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 pt-2 pb-1 rounded-2xl transition-all relative min-w-[44px] min-h-[44px]"
            data-ocid={`bottom_nav.${id}.tab`}
            aria-label={label}
          >
            {active === id && (
              <motion.div
                layoutId="bottomNavPill"
                className="absolute inset-x-1 inset-y-0.5 bg-[#5B4FCF]/15 rounded-2xl"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div
              animate={{ scale: active === id ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative z-10"
            >
              <Icon
                size={24}
                strokeWidth={active === id ? 2.5 : 1.8}
                className={active === id ? "text-[#5B4FCF]" : "text-[#6B6B8A]"}
              />
              {badges[id] && badges[id]! > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-[#EF476F] rounded-full text-white text-[10px] font-black flex items-center justify-center px-0.5 leading-none">
                  {badges[id]! > 9 ? "9+" : badges[id]}
                </span>
              )}
            </motion.div>
            <span
              className={`text-xs font-bold relative z-10 ${
                active === id
                  ? "text-[#5B4FCF] font-extrabold"
                  : "text-[#6B6B8A]"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
