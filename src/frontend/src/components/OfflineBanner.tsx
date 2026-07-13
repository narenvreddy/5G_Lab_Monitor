import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <output
      aria-live="polite"
      style={{ backgroundColor: "#FF6B35" }}
      className="fixed top-0 left-0 right-0 z-[9999] py-2 px-4 text-center text-white text-sm font-bold shadow-md block"
      data-ocid="app.offline.toast"
    >
      📶 No internet connection — progress won&apos;t save
    </output>
  );
}
