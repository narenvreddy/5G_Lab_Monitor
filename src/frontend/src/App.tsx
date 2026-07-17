import { useEffect, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HistoryPage } from "./components/HistoryPage";
import { LandingPage } from "./components/LandingPage";
import { OfflineBanner } from "./components/OfflineBanner";
import { ResultsPage } from "./components/ResultsPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [resultId, setResultId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Detect Results page via ?result=<rowId> query param (opens in a new tab)
  // and History page via ?history=1 query param (opens in a new tab).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("result");
    if (result !== null) {
      setResultId(result);
      document.title = "AI assist Modem Protocol Script Development";
      return;
    }
    const history = params.get("history");
    if (history !== null) {
      setShowHistory(true);
      document.title = "History — AI assist Modem Protocol Script Development";
    }
  }, []);

  if (resultId !== null) {
    return (
      <ErrorBoundary>
        <ResultsPage rowId={resultId} />
        <Toaster position="top-center" richColors />
      </ErrorBoundary>
    );
  }

  if (showHistory) {
    return (
      <ErrorBoundary>
        <HistoryPage />
        <Toaster position="top-center" richColors />
      </ErrorBoundary>
    );
  }

  return (
    <>
      <OfflineBanner />
      <LandingPage />
    </>
  );
}
