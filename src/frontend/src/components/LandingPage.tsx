import "../landing.css";
import { AlertCircle, ChevronRight, ExternalLink, Plus } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  PipelineState,
  type PipelineStatus,
  type ServerStatus,
} from "../backend";
import { useActor } from "../hooks/useActor";
import { RobotMascot } from "./RobotMascot";

interface LandingPageProps {
  login: () => void;
  isLoggingIn: boolean;
}

const FLOAT_CHIPS = [
  {
    symbol: "+",
    color: "#5B4FCF",
    top: "12%",
    left: "10%",
    delay: "0s",
    dur: "3.4s",
    size: 56,
  },
  {
    symbol: "×",
    color: "#FF6B35",
    top: "22%",
    right: "8%",
    delay: "0.6s",
    dur: "2.9s",
    size: 52,
  },
  {
    symbol: "÷",
    color: "#00C9A7",
    top: "60%",
    right: "12%",
    delay: "1.1s",
    dur: "3.7s",
    size: 50,
  },
  {
    symbol: "π",
    color: "#EF476F",
    top: "68%",
    left: "6%",
    delay: "0.85s",
    dur: "3.2s",
    size: 48,
  },
  {
    symbol: "∞",
    color: "#FFD166",
    top: "40%",
    right: "4%",
    delay: "0.35s",
    dur: "4s",
    size: 46,
  },
];

const SPARK_GRAD_ID = "lp-spark-bolt-grad";
const SPARK_FILTER_ID = "lp-spark-bolt-glow";

function SparkLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="spark-shimmer"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: 6,
        flexShrink: 0,
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient
          id={SPARK_GRAD_ID}
          x1="18"
          y1="1"
          x2="10"
          y2="31"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#9b8fff" />
          <stop offset="45%" stopColor="#5B4FCF" />
          <stop offset="100%" stopColor="#FFD166" />
        </linearGradient>
        <filter
          id={SPARK_FILTER_ID}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
          <feFlood floodColor="#FF6B35" floodOpacity="0.55" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M16 2 L18.5 13.5 L30 16 L18.5 18.5 L16 30 L13.5 18.5 L2 16 L13.5 13.5 Z"
        fill={`url(#${SPARK_GRAD_ID})`}
      />
    </svg>
  );
}

type StageKey = "nlpParser" | "encoder" | "scriptGenerator";

interface TestRequestRow {
  id: number;
  testId: string;
  requestType: string;
  requestDetails: string;
  stages: Record<StageKey, PipelineState>;
  running: boolean;
  tpLoading: boolean;
  tpError: boolean;
  pipelineError: boolean;
}

interface PersistedRow {
  id: number;
  testId: string;
  requestType: string;
  requestDetails: string;
  stages: Record<StageKey, PipelineState>;
}

const STAGE_LABELS: Record<StageKey, string> = {
  nlpParser: "NLP Parser",
  encoder: "Encoder",
  scriptGenerator: "Script generator",
};

const STAGE_ORDER: StageKey[] = ["nlpParser", "encoder", "scriptGenerator"];

const IDLE_STATES: Record<StageKey, PipelineState> = {
  nlpParser: PipelineState.idle,
  encoder: PipelineState.idle,
  scriptGenerator: PipelineState.idle,
};

const STORAGE_KEY = "tp_workspace_rows";

function loadPersistedRows(): TestRequestRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: PersistedRow[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r) => ({
      id: r.id,
      testId: r.testId ?? "",
      requestType: r.requestType ?? "",
      requestDetails: r.requestDetails ?? "",
      stages: {
        nlpParser: r.stages?.nlpParser ?? PipelineState.idle,
        encoder: r.stages?.encoder ?? PipelineState.idle,
        scriptGenerator: r.stages?.scriptGenerator ?? PipelineState.idle,
      },
      running: false,
      tpLoading: false,
      tpError: false,
      pipelineError: false,
    }));
  } catch {
    return [];
  }
}

function persistRows(rows: TestRequestRow[]) {
  try {
    const serializable: PersistedRow[] = rows.map((r) => ({
      id: r.id,
      testId: r.testId,
      requestType: r.requestType,
      requestDetails: r.requestDetails,
      stages: r.stages,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // localStorage may be unavailable; non-fatal
  }
}

function stateClass(state: PipelineState): string {
  switch (state) {
    case PipelineState.processing:
      return "ws-stage-state ws-stage-processing";
    case PipelineState.completed:
      return "ws-stage-state ws-stage-completed";
    default:
      return "ws-stage-state ws-stage-idle";
  }
}

function stateLabel(state: PipelineState): string {
  switch (state) {
    case PipelineState.processing:
      return "Processing";
    case PipelineState.completed:
      return "completed";
    default:
      return "idle";
  }
}

export function LandingPage({
  login: _login,
  isLoggingIn: _isLoggingIn,
}: LandingPageProps) {
  const { actor } = useActor();
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [rows, setRows] = useState<TestRequestRow[]>([]);
  const hydratedRef = useRef(false);

  // Restore saved rows from localStorage on mount
  useEffect(() => {
    setRows(loadPersistedRows());
    hydratedRef.current = true;
  }, []);

  // Persist rows to localStorage whenever they change (after hydration)
  useEffect(() => {
    if (!hydratedRef.current) return;
    persistRows(rows);
  }, [rows]);

  // Poll server status every 10s
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!actor) return;
      try {
        const status: ServerStatus = await actor.getServerStatus();
        if (!cancelled) setServerOnline(status.online);
      } catch {
        if (!cancelled) setServerOnline(false);
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [actor]);

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        testId: "",
        requestType: "",
        requestDetails: "",
        stages: { ...IDLE_STATES },
        running: false,
        tpLoading: false,
        tpError: false,
        pipelineError: false,
      },
    ]);
  }, []);

  const updateTestId = useCallback((rowId: number, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, testId: value, tpError: false } : r,
      ),
    );
  }, []);

  const updateRequestType = useCallback((rowId: number, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, requestType: value } : r)),
    );
  }, []);

  const updateRequestDetails = useCallback((rowId: number, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, requestDetails: value } : r)),
    );
  }, []);

  // TP API auto-fetch: triggered when Test ID input loses focus and value starts with "TP"
  const handleTestIdBlur = useCallback(async (rowId: number, value: string) => {
    const trimmed = value.trim();
    if (!trimmed.toUpperCase().startsWith("TP")) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, tpLoading: true, tpError: false } : r,
      ),
    );
    try {
      const res = await fetch(
        `http://107.111.159.37:8000/api/tp/data/${encodeURIComponent(trimmed)}`,
      );
      if (!res.ok) throw new Error(`TP API responded ${res.status}`);
      const data: unknown = await res.json();
      const obj = (data ?? {}) as Record<string, unknown>;
      const testType = typeof obj.testType === "string" ? obj.testType : "";
      const testDetail =
        typeof obj.testDetail === "string" ? obj.testDetail : "";
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? {
                ...r,
                tpLoading: false,
                tpError: false,
                requestType: testType || r.requestType,
                requestDetails: testDetail || r.requestDetails,
              }
            : r,
        ),
      );
    } catch {
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId ? { ...r, tpLoading: false, tpError: true } : r,
        ),
      );
    }
  }, []);

  const openResults = useCallback((rowId: number) => {
    const url = `${window.location.origin}/?result=${rowId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const runPipeline = useCallback(
    async (rowId: number) => {
      if (!actor) return;
      const testRequestId = `req-${rowId}`;

      // Mark running, clear any prior error, reset stages to idle so progress
      // is reflected purely from backend state as it advances.
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? {
                ...r,
                running: true,
                pipelineError: false,
                stages: { ...IDLE_STATES },
              }
            : r,
        ),
      );

      // Helper to sync a row's stages from a polled PipelineStatus.
      const applyStatus = (status: PipelineStatus) => {
        setRows((prev) =>
          prev.map((r) =>
            r.id === rowId
              ? {
                  ...r,
                  stages: {
                    nlpParser: status.nlpParser,
                    encoder: status.encoder,
                    scriptGenerator: status.scriptGenerator,
                  },
                }
              : r,
          ),
        );
      };

      const allCompleted = (status: PipelineStatus) =>
        status.nlpParser === PipelineState.completed &&
        status.encoder === PipelineState.completed &&
        status.scriptGenerator === PipelineState.completed;

      // Start polling the backend status on a short interval so the three
      // indicators update in real time as the backend progresses each stage.
      const POLL_INTERVAL_MS = 1500;
      const pollId = window.setInterval(async () => {
        try {
          const status: PipelineStatus =
            await actor.getPipelineStatus(testRequestId);
          applyStatus(status);
        } catch {
          // Polling error is non-fatal; the runPipeline promise below is the
          // source of truth for terminal error handling.
        }
      }, POLL_INTERVAL_MS);

      try {
        // Kick off the backend-driven pipeline. The backend sequentially
        // drives NLP Parser → Encoder → Script Generator and returns the
        // final PipelineStatus once all stages complete.
        const finalStatus: PipelineStatus =
          await actor.runPipeline(testRequestId);
        applyStatus(finalStatus);
      } catch {
        // Surface an error state so the user can retry the Start button.
        setRows((prev) =>
          prev.map((r) => (r.id === rowId ? { ...r, pipelineError: true } : r)),
        );
      } finally {
        window.clearInterval(pollId);
        // One last poll to capture the terminal backend state, then mark not
        // running so the Start button becomes re-enabled.
        try {
          const status: PipelineStatus =
            await actor.getPipelineStatus(testRequestId);
          applyStatus(status);
          // If the backend reports all-completed despite a thrown error, the
          // run effectively succeeded — clear the error flag.
          if (allCompleted(status)) {
            setRows((prev) =>
              prev.map((r) =>
                r.id === rowId ? { ...r, pipelineError: false } : r,
              ),
            );
          }
        } catch {
          // Best-effort final sync; ignore.
        }
        setRows((prev) =>
          prev.map((r) => (r.id === rowId ? { ...r, running: false } : r)),
        );
      }
    },
    [actor],
  );

  return (
    <div className="landing-root" data-ocid="landing.page">
      {/* Fixed top-right mascot + floating chips */}
      <div className="hero-mascot-area" aria-hidden="true">
        {FLOAT_CHIPS.map((chip) => (
          <span
            key={chip.symbol}
            className="float-chip animate-float"
            style={
              {
                background: chip.color,
                top: chip.top,
                left: (chip as { left?: string }).left,
                right: (chip as { right?: string }).right,
                width: chip.size,
                height: chip.size,
                fontSize: chip.size * 0.38,
                animationDelay: chip.delay,
                animationDuration: chip.dur,
              } as React.CSSProperties
            }
          >
            {chip.symbol}
          </span>
        ))}
        <div className="hero-mascot-wrap">
          <RobotMascot size={180} mood="happy" />
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────── */}
      <section
        className="landing-section hero-section"
        data-ocid="landing.hero.section"
      >
        {/* Background blobs */}
        <div className="hero-blob hero-blob-purple" aria-hidden="true" />
        <div className="hero-blob hero-blob-teal" aria-hidden="true" />

        <div className="hero-layout">
          {/* Single column — brand, headline, sub */}
          <div className="hero-left">
            <div className="hero-brand">
              <SparkLogo size={34} />
            </div>

            <h1 className="hero-headline">
              AI Assist Modem Protocol
              <br />
              <span className="hero-accent">Script Development</span>
            </h1>

            <p className="hero-sub">
              Auto generates protocol scripts from the input parsed with 3GPP
              compliance.
            </p>
          </div>
        </div>

        {/* ── WORKSPACE (full page width) ─────────── */}
        <div
          className="workspace-section"
          data-ocid="landing.workspace.section"
        >
          <div className="workspace-header">
            <h2 className="workspace-title">Workspace</h2>
            <span
              className="server-status"
              data-ocid="landing.workspace.server_status"
              aria-label={`Server ${serverOnline === null ? "unknown" : serverOnline ? "online" : "offline"}`}
            >
              <span
                className={`server-status-dot ${serverOnline === null ? "server-status-unknown" : serverOnline ? "server-status-online" : "server-status-offline"}`}
                aria-hidden="true"
              />
              Server status
            </span>
          </div>

          <button
            type="button"
            className="add-request-control"
            onClick={addRow}
            data-ocid="landing.workspace.add_request_button"
            aria-label="Add test request"
          >
            <Plus size={18} strokeWidth={3} className="add-request-icon" />
            <span>Add test request</span>
          </button>

          <div className="workspace-rows" data-ocid="landing.workspace.list">
            {rows.length === 0 && (
              <p
                className="workspace-empty"
                data-ocid="landing.workspace.empty_state"
              >
                No test requests yet. Click the + control above to add one.
              </p>
            )}
            {rows.map((row, idx) => {
              const encoderCompleted =
                row.stages.encoder === PipelineState.completed;
              const resultsDisabled = !encoderCompleted;
              return (
                <div
                  key={row.id}
                  className="workspace-row"
                  data-ocid={`landing.workspace.item.${idx + 1}`}
                >
                  <div className="workspace-row-top">
                    <span className="workspace-serial">{row.id}</span>
                    <input
                      type="text"
                      className="workspace-test-id-input"
                      placeholder="Test ID"
                      value={row.testId}
                      onChange={(e) => updateTestId(row.id, e.target.value)}
                      onBlur={(e) => handleTestIdBlur(row.id, e.target.value)}
                      data-ocid={`landing.workspace.input.${idx + 1}`}
                      aria-label={`Test ID for row ${row.id}`}
                    />
                    <input
                      type="text"
                      className="workspace-field-input workspace-field-type-input"
                      placeholder="Request Type"
                      value={row.requestType}
                      onChange={(e) =>
                        updateRequestType(row.id, e.target.value)
                      }
                      data-ocid={`landing.workspace.request_type_input.${idx + 1}`}
                      aria-label={`Request Type for row ${row.id}`}
                    />
                    <input
                      type="text"
                      className="workspace-field-input workspace-field-details-input"
                      placeholder="Request Details"
                      value={row.requestDetails}
                      onChange={(e) =>
                        updateRequestDetails(row.id, e.target.value)
                      }
                      data-ocid={`landing.workspace.request_details_input.${idx + 1}`}
                      aria-label={`Request Details for row ${row.id}`}
                    />
                    <button
                      type="button"
                      className="workspace-start-btn"
                      onClick={() => runPipeline(row.id)}
                      disabled={row.running}
                      data-ocid={`landing.workspace.start_button.${idx + 1}`}
                      aria-label={
                        row.pipelineError && !row.running
                          ? `Retry pipeline for row ${row.id}`
                          : `Start pipeline for row ${row.id}`
                      }
                      title={
                        row.pipelineError && !row.running
                          ? "Pipeline failed — click to retry"
                          : undefined
                      }
                    >
                      {row.running
                        ? "Running…"
                        : row.pipelineError
                          ? "Retry"
                          : "Start"}
                    </button>
                  </div>
                  <div
                    className="workspace-pipeline"
                    data-ocid={`landing.workspace.pipeline.${idx + 1}`}
                  >
                    {STAGE_ORDER.map((stage, sIdx) => (
                      <React.Fragment key={stage}>
                        <span
                          className={stateClass(row.stages[stage])}
                          data-ocid={`landing.workspace.stage.${idx + 1}.${stage}`}
                        >
                          <span className="ws-stage-dot" aria-hidden="true" />
                          {STAGE_LABELS[stage]} ·{" "}
                          {stateLabel(row.stages[stage])}
                        </span>
                        {sIdx < STAGE_ORDER.length - 1 && (
                          <ChevronRight
                            size={16}
                            className="ws-stage-sep"
                            aria-hidden="true"
                          />
                        )}
                      </React.Fragment>
                    ))}
                    {row.tpLoading && (
                      <output
                        className="workspace-tp-status workspace-tp-loading"
                        data-ocid={`landing.workspace.tp_loading_state.${idx + 1}`}
                        aria-live="polite"
                      >
                        <span
                          className="workspace-tp-spinner"
                          aria-hidden="true"
                        />
                        Fetching TP…
                      </output>
                    )}
                    {row.tpError && !row.tpLoading && (
                      <output
                        className="workspace-tp-status workspace-tp-error"
                        data-ocid={`landing.workspace.tp_error_state.${idx + 1}`}
                        aria-live="polite"
                      >
                        <AlertCircle size={12} aria-hidden="true" />
                        TP fetch failed
                      </output>
                    )}
                    {row.pipelineError && !row.running && (
                      <output
                        className="workspace-tp-status workspace-tp-error"
                        data-ocid={`landing.workspace.pipeline_error_state.${idx + 1}`}
                        role="alert"
                        aria-live="assertive"
                      >
                        <AlertCircle size={12} aria-hidden="true" />
                        Pipeline failed — retry
                      </output>
                    )}
                    {encoderCompleted && (
                      <span
                        className="ws-stage-state ws-stage-completed workspace-encoder-done"
                        data-ocid={`landing.workspace.encoder_completed_state.${idx + 1}`}
                        aria-label={`Encoder completed for row ${row.id}; Results button enabled`}
                      >
                        <span className="ws-stage-dot" aria-hidden="true" />
                        Encoder completed
                      </span>
                    )}
                    <button
                      type="button"
                      className="workspace-results-btn"
                      onClick={() => openResults(row.id)}
                      disabled={resultsDisabled}
                      aria-disabled={resultsDisabled}
                      title={
                        resultsDisabled
                          ? "Results available once Encoder completes"
                          : "Open results in a new tab"
                      }
                      data-ocid={`landing.workspace.results_button.${idx + 1}`}
                      aria-label={`Open results for row ${row.id}`}
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                      Results
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
