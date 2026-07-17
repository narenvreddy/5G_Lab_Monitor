import "../landing.css";
import { Plus } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PipelineState,
  type PipelineStatus,
  type ServerStatus,
} from "../backend";
import { useActor } from "../hooks/useActor";
import { RobotMascot } from "./RobotMascot";
import { WorkspaceRow } from "./WorkspaceRow";
import {
  DISPLAY_STAGES,
  IDLE_STATES,
  type StageKey,
  type TestRequestRow,
  loadPersistedRows,
  openHistoryInNewTab,
  openResultsInNewTab,
  persistRows,
} from "./workspaceShared";

// ── Floating chip icons (inline SVG) ──────────────────────────────
// Each chip keeps its color + size; the SVG scales to 60% of chip size
// and is centered inside the circular chip span.

type ChipIcon = "call" | "mobileData" | "network" | "fiveG" | "noService";

interface FloatChip {
  icon: ChipIcon;
  color: string;
  delay: string;
  dur: string;
  size: number;
  top: string;
  left: string;
}

// Radially symmetric placement around the centered mascot wrap.
// angle = -90deg + i*72deg  →  top, upper-right, lower-right, lower-left, upper-left
// top  = centerY + radius * sin(angle)
// left = centerX + radius * cos(angle)
// centerX = centerY = 50%, radius = 30% (tuned to keep chips close to the
// centered mascot wrap while staying inside the 360x380 area).
const CHIP_CENTER = 50;
const CHIP_RADIUS = 30;

function chipPosition(i: number): { top: string; left: string } {
  const angleDeg = -90 + i * 72;
  const angleRad = (angleDeg * Math.PI) / 180;
  const top = CHIP_CENTER + CHIP_RADIUS * Math.sin(angleRad);
  const left = CHIP_CENTER + CHIP_RADIUS * Math.cos(angleRad);
  return { top: `${top}%`, left: `${left}%` };
}

const CHIP_DEFS: Omit<FloatChip, "top" | "left">[] = [
  // All five chips render at the same size so the set looks uniform.
  { icon: "call", color: "#5B4FCF", delay: "0s", dur: "3.4s", size: 52 },
  {
    icon: "mobileData",
    color: "#FF6B35",
    delay: "0.6s",
    dur: "2.9s",
    size: 52,
  },
  { icon: "network", color: "#00C9A7", delay: "1.1s", dur: "3.7s", size: 52 },
  { icon: "fiveG", color: "#EF476F", delay: "0.85s", dur: "3.2s", size: 52 },
  { icon: "noService", color: "#FFD166", delay: "0.35s", dur: "4s", size: 52 },
];

const FLOAT_CHIPS: FloatChip[] = CHIP_DEFS.map((def, i) => ({
  ...def,
  ...chipPosition(i),
}));

function ChipIconSvg({ icon, size }: { icon: ChipIcon; size: number }) {
  const svgSize = size * 0.6;
  const common = {
    width: svgSize,
    height: svgSize,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    role: "presentation",
    "aria-hidden": true,
    focusable: false as const,
  };
  switch (icon) {
    case "call":
      // Phone handset
      return (
        <svg {...common}>
          <title>call icon</title>
          <path
            d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.1 2.2z"
            fill="#fff"
          />
        </svg>
      );
    case "mobileData":
      // Signal arrows up/down
      return (
        <svg {...common}>
          <title>mobile data icon</title>
          <path
            d="M12 3v7"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8.5 6.5 12 3l3.5 3.5"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M12 21v-7"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8.5 17.5 12 21l3.5-3.5"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    case "network":
      // "4G" text styled identically to the existing "5G" icon
      return (
        <svg {...common}>
          <title>4G icon</title>
          <text
            x="12"
            y="17"
            textAnchor="middle"
            fontFamily="Nunito, sans-serif"
            fontSize="9.5"
            fontWeight="900"
            fill="#fff"
          >
            4G
          </text>
        </svg>
      );
    case "fiveG":
      // "5G" text styled
      return (
        <svg {...common}>
          <title>5G icon</title>
          <text
            x="12"
            y="17"
            textAnchor="middle"
            fontFamily="Nunito, sans-serif"
            fontSize="9.5"
            fontWeight="900"
            fill="#fff"
          >
            5G
          </text>
        </svg>
      );
    case "noService":
      // Signal bars with slash
      return (
        <svg {...common}>
          <title>no service icon</title>
          <path
            d="M4 14v4M9 11v7M14 8v10"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M3 3 21 21"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

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

// Re-export shared types/constants so existing imports elsewhere still work.
export {
  type StageKey,
  type TestRequestRow,
  DISPLAY_STAGES,
  IDLE_STATES,
  loadPersistedRows,
  persistRows,
};

function persistRowsLocal(rows: TestRequestRow[]): void {
  persistRows(rows);
}

export function LandingPage() {
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
    persistRowsLocal(rows);
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
        // Use max(existing ids) + 1 so a new row never collides with an
        // existing id. (After removeRow renumbers to 1..n, prev.length + 1
        // would also work, but the max approach is robust to any state.)
        id: prev.length === 0 ? 1 : Math.max(...prev.map((r) => r.id)) + 1,
        testId: "",
        requestType: "",
        requestDetails: "",
        stages: { ...IDLE_STATES },
        running: false,
        tpLoading: false,
        tpError: false,
        pipelineError: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const removeRow = useCallback((rowId: number) => {
    // Filter out the deleted row, then renumber the remaining rows to a
    // contiguous 1..n sequence so serial badges stay sequential after any
    // deletion.
    setRows((prev) =>
      prev.filter((r) => r.id !== rowId).map((r, i) => ({ ...r, id: i + 1 })),
    );
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
    const encoded = encodeURIComponent(trimmed);
    const results = await Promise.allSettled([
      fetch(`http://107.111.159.37:8000/api/tp/data/${encoded}/testType`),
      fetch(`http://107.111.159.37:8000/api/tp/data/${encoded}/description`),
    ]);
    const [testTypeResult, testDetailResult] = results;
    const readText = async (
      result: PromiseSettledResult<Response>,
    ): Promise<string> => {
      if (result.status !== "fulfilled") return "";
      const res = result.value;
      if (!res.ok) return "";
      const text = (await res.text()).trim();
      return text;
    };
    const testType = await readText(testTypeResult);
    const testDetail = await readText(testDetailResult);
    const bothSucceeded =
      testTypeResult.status === "fulfilled" &&
      testTypeResult.value.ok &&
      testDetailResult.status === "fulfilled" &&
      testDetailResult.value.ok;
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? {
              ...r,
              tpLoading: false,
              tpError: !bothSucceeded,
              requestType: testType || r.requestType,
              requestDetails: testDetail || r.requestDetails,
            }
          : r,
      ),
    );
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
          prev.map((r) => {
            if (r.id !== rowId) return r;
            const allDone =
              status.nlpParser === PipelineState.completed &&
              status.encoder === PipelineState.completed &&
              status.scriptGenerator === PipelineState.completed;
            return {
              ...r,
              stages: {
                nlpParser: status.nlpParser,
                encoder: status.encoder,
                scriptGenerator: status.scriptGenerator,
              },
              completedAt:
                allDone && !r.completedAt
                  ? new Date().toISOString()
                  : r.completedAt,
            };
          }),
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
      {/* Fixed top-right mascot + floating chips
          Rendered via a portal into document.body so the fixed-positioned
          .hero-mascot-area is a DIRECT child of <body>. This guarantees its
          containing block is the viewport (per CSS spec) and it cannot be
          affected by any ancestor in the LandingPage tree — no matter how
          tall the page grows, the mascot stays pinned to the top-right. */}
      {createPortal(
        <div className="hero-mascot-area" aria-hidden="true">
          {FLOAT_CHIPS.map((chip) => (
            <span
              key={chip.icon}
              className="float-chip animate-float"
              style={
                {
                  background: chip.color,
                  top: chip.top,
                  left: chip.left,
                  width: chip.size,
                  height: chip.size,
                  animationDelay: chip.delay,
                  animationDuration: chip.dur,
                } as React.CSSProperties
              }
            >
              <ChipIconSvg icon={chip.icon} size={chip.size} />
            </span>
          ))}
          <div className="hero-mascot-wrap">
            <RobotMascot size={180} mood="happy" />
          </div>
        </div>,
        document.body,
      )}

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

          <div className="workspace-controls">
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
            <button
              type="button"
              className="history-control"
              onClick={openHistoryInNewTab}
              data-ocid="landing.workspace.history_button"
              aria-label="Open history in a new tab"
              title="Open history in a new tab"
            >
              <span>History</span>
            </button>
          </div>

          <div className="workspace-rows" data-ocid="landing.workspace.list">
            {rows.length === 0 && (
              <p
                className="workspace-empty"
                data-ocid="landing.workspace.empty_state"
              >
                No test requests yet. Click the + control above to add one.
              </p>
            )}
            {rows.map((row, idx) => (
              <WorkspaceRow
                key={row.id}
                row={row}
                index={idx}
                ocidPrefix="landing.workspace"
                mode="edit"
                onRemove={removeRow}
                onTestIdChange={updateTestId}
                onTestIdBlur={handleTestIdBlur}
                onRequestTypeChange={updateRequestType}
                onRequestDetailsChange={updateRequestDetails}
                onStart={runPipeline}
                onOpenResults={openResultsInNewTab}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
