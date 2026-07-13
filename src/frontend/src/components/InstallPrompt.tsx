import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const DISMISSED_KEY = "mathquest_install_dismissed";
const IOS_DISMISSED_KEY = "mathquest_ios_dismissed";

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  return (
    ("standalone" in navigator &&
      (navigator as { standalone?: boolean }).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isInStandaloneMode()) return;

    let androidTimer: ReturnType<typeof setTimeout> | null = null;
    let iosTimer: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!localStorage.getItem(DISMISSED_KEY)) {
        androidTimer = setTimeout(() => setShowAndroid(true), 30000);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (isIOS() && !localStorage.getItem(IOS_DISMISSED_KEY)) {
      iosTimer = setTimeout(() => setShowIOS(true), 30000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (androidTimer) clearTimeout(androidTimer);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      localStorage.setItem(DISMISSED_KEY, "1");
      setShowAndroid(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismissAndroid = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShowAndroid(false);
  };

  const handleDismissIOS = () => {
    localStorage.setItem(IOS_DISMISSED_KEY, "1");
    setShowIOS(false);
  };

  return (
    <>
      {/* Android / Chrome install prompt */}
      <AnimatePresence>
        {showAndroid && (
          <motion.div
            key="android-prompt"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2"
            data-ocid="install_prompt.sheet"
          >
            <div
              className="max-w-lg mx-auto rounded-3xl shadow-2xl overflow-hidden"
              style={{ background: "#F4F2FF", border: "2px solid #5B4FCF22" }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: "#5B4FCF44" }}
                />
              </div>
              <div className="px-6 pb-6 pt-3 text-center">
                <div className="text-5xl mb-3">🤖</div>
                <h2
                  className="text-xl font-black mb-1"
                  style={{ color: "#1A1A2E", fontFamily: "Nunito, sans-serif" }}
                >
                  Add MathSpark to your Home Screen!
                </h2>
                <p
                  className="text-sm font-semibold mb-6"
                  style={{ color: "#6B6B8A", fontFamily: "Nunito, sans-serif" }}
                >
                  Play anytime, even offline! 🚀
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleInstall}
                    className="w-full font-black text-base text-white rounded-2xl py-4 shadow-lg transition-transform active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #5B4FCF, #7B6FEF)",
                      fontFamily: "Nunito, sans-serif",
                      minHeight: "52px",
                    }}
                    data-ocid="install_prompt.primary_button"
                  >
                    ✨ Add to Home Screen
                  </button>
                  <button
                    type="button"
                    onClick={handleDismissAndroid}
                    className="w-full font-bold text-sm rounded-2xl py-4 transition-colors"
                    style={{
                      color: "#6B6B8A",
                      fontFamily: "Nunito, sans-serif",
                      minHeight: "44px",
                    }}
                    data-ocid="install_prompt.cancel_button"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS install banner */}
      <AnimatePresence>
        {showIOS && (
          <motion.div
            key="ios-prompt"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2"
            data-ocid="install_prompt_ios.sheet"
          >
            <div
              className="max-w-lg mx-auto rounded-3xl shadow-2xl overflow-hidden"
              style={{ background: "#1A1A2E", border: "2px solid #5B4FCF" }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: "#5B4FCF88" }}
                />
              </div>
              <div className="px-6 pb-6 pt-3">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">🤖</div>
                  <div className="flex-1">
                    <h2
                      className="text-base font-black mb-1"
                      style={{
                        color: "#F4F2FF",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      Add MathSpark to your Home Screen!
                    </h2>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: "#6B6B8A",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      Tap{" "}
                      <span
                        className="inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-xs font-black mx-1"
                        style={{ background: "#5B4FCF", color: "white" }}
                      >
                        Share ↑
                      </span>{" "}
                      then{" "}
                      <span
                        className="inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-xs font-black mx-1"
                        style={{ background: "#FF6B35", color: "white" }}
                      >
                        Add to Home Screen
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDismissIOS}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-lg"
                    style={{ background: "#5B4FCF33", color: "#F4F2FF" }}
                    aria-label="Dismiss"
                    data-ocid="install_prompt_ios.close_button"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
