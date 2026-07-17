import "../landing.css";
import {
  Binary,
  Check,
  Copy,
  Database,
  FileCode,
  Link as LinkIcon,
  type LucideIcon,
  MessageSquareText,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PipelineState, type PipelineStatus } from "../backend";
import { useActor } from "../hooks/useActor";

interface ResultsPageProps {
  rowId: string;
}

/* ── 4-stage pipeline definition ──────────────────────
   The backend only tracks 3 stages (nlpParser, encoder,
   scriptGenerator). We map the user's 4-stage view onto
   that state: AI Parser → nlpParser, Encoder → encoder,
   NLP Action → derived from encoder+scriptGenerator,
   Script Creation → scriptGenerator. The first three are
   shown as "completed" and the last as "Ongoing" per the
   requirement, but we still derive a live state so the
   visual effects reflect real backend progress when it
   arrives. */

type DisplayStageKey =
  | "nlpOutput"
  | "encoder"
  | "dataIngestion"
  | "scriptCreation";

interface DisplayStage {
  key: DisplayStageKey;
  label: string;
  color: string;
  colorRgb: string;
  icon: LucideIcon;
}

const DISPLAY_STAGES: DisplayStage[] = [
  {
    key: "nlpOutput",
    label: "NLP Output",
    color: "#5b4fcf",
    colorRgb: "91, 79, 207",
    icon: MessageSquareText,
  },
  {
    key: "encoder",
    label: "Encoder",
    color: "#00C9A7",
    colorRgb: "0, 201, 167",
    icon: Binary,
  },
  {
    key: "dataIngestion",
    label: "3GPP data Ingestion",
    color: "#FF6B35",
    colorRgb: "255, 107, 53",
    icon: Database,
  },
  {
    key: "scriptCreation",
    label: "Script Creation",
    color: "#FFD166",
    colorRgb: "255, 209, 102",
    icon: FileCode,
  },
];

type StageStatus = "completed" | "ongoing" | "idle";

/**
 * Derive the display status for each of the 4 stages from the
 * backend PipelineStatus. Falls back to the requirement's
 * default (first 3 completed, last ongoing) when no status yet.
 */
function deriveStageStatuses(stages: PipelineStatus | null): StageStatus[] {
  if (!stages) {
    return ["completed", "completed", "completed", "ongoing"];
  }
  const mapState = (s: PipelineState): StageStatus => {
    if (s === PipelineState.completed) return "completed";
    if (s === PipelineState.processing) return "ongoing";
    return "idle";
  };
  // NLP Action is "completed" once the encoder has completed
  // (it represents the action-decoding step between encoder
  // and script generation).
  const nlpActionStatus: StageStatus =
    stages.encoder === PipelineState.completed ? "completed" : "ongoing";
  return [
    mapState(stages.nlpParser),
    mapState(stages.encoder),
    nlpActionStatus,
    mapState(stages.scriptGenerator),
  ];
}

/**
 * Derive a representative Request Details string from the
 * pipeline state. This is the only backend method available,
 * so the display value is composed client-side from it.
 */
function deriveRequestDetails(
  stages: PipelineStatus | null,
  rowId: string,
): string {
  if (!stages) {
    return `Test request ${rowId} — details captured from workspace submission. Awaiting pipeline status from backend.`;
  }
  const lines = [
    `Request: req-${rowId}`,
    `AI Parser: ${stages.nlpParser}`,
    `Encoder: ${stages.encoder}`,
    `Script Generator: ${stages.scriptGenerator}`,
    "",
    "Details derived from the latest pipeline status response (actor.getPipelineStatus).",
  ];
  return lines.join("\n");
}

/**
 * Derive an Output Prediction summary from the pipeline state.
 */
function deriveOutputPrediction(
  stages: PipelineStatus | null,
  rowId: string,
): string {
  if (!stages) {
    return `Output prediction for request req-${rowId} will populate once the pipeline reports status.`;
  }
  const statuses = deriveStageStatuses(stages);
  const lines = DISPLAY_STAGES.map((s, i) => `${s.label}: ${statuses[i]}`);
  lines.push("");
  lines.push(`Predicted modem protocol script output for req-${rowId}.`);
  return lines.join("\n");
}

/**
 * Derive a Script Name from the row id + pipeline state.
 */
function deriveScriptName(
  stages: PipelineStatus | null,
  rowId: string,
): string {
  const base = `modem_protocol_req-${rowId}`;
  if (!stages) return `${base}_draft`;
  if (stages.scriptGenerator === PipelineState.completed) {
    return `${base}_v1.script`;
  }
  if (stages.scriptGenerator === PipelineState.processing) {
    return `${base}_generating…`;
  }
  return `${base}_pending`;
}

export function ResultsPage({ rowId }: ResultsPageProps) {
  const { actor } = useActor();
  const [stages, setStages] = useState<PipelineStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);

  // Track first-seen + last-completed timestamps for the header.
  const firstSeenRef = useRef<number | null>(null);
  const [createdTs, setCreatedTs] = useState<string>("—");
  const [processedTs, setProcessedTs] = useState<string>("—");

  // Fetch pipeline status for the row's test request id
  useEffect(() => {
    let cancelled = false;
    const testRequestId = `req-${rowId}`;
    if (firstSeenRef.current === null) {
      firstSeenRef.current = Date.now();
    }
    const fetchStatus = async () => {
      if (!actor) return;
      try {
        const status: PipelineStatus =
          await actor.getPipelineStatus(testRequestId);
        if (cancelled) return;
        setStages(status);
        setLoading(false);
        setApiCallCount((c) => c + 1);
        // Created timestamp: first successful fetch.
        setCreatedTs((prev) =>
          prev === "—"
            ? new Date(firstSeenRef.current ?? Date.now()).toLocaleString()
            : prev,
        );
        // Processed timestamp: when all 3 backend stages are completed.
        const allDone =
          status.nlpParser === PipelineState.completed &&
          status.encoder === PipelineState.completed &&
          status.scriptGenerator === PipelineState.completed;
        if (allDone) {
          setProcessedTs((prev) =>
            prev === "—" ? new Date().toLocaleString() : prev,
          );
        }
      } catch {
        if (!cancelled) {
          setStages(null);
          setLoading(false);
        }
      }
    };
    fetchStatus();
    const id = setInterval(fetchStatus, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [actor, rowId]);

  const handleCopy = useCallback(async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast.success(`${key} copied to clipboard`);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
    } catch {
      toast.error(`Could not copy ${key}`);
    }
  }, []);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      toast.success("Page URL copied to clipboard");
      setTimeout(() => setCopiedUrl(false), 1800);
    } catch {
      toast.error("Could not copy URL");
    }
  }, []);

  // Derive display values
  const requestIdValue = `req-${rowId}`;
  const stageStatuses = deriveStageStatuses(stages);
  const requestDetailsValue = deriveRequestDetails(stages, rowId);
  const outputPredictionValue = deriveOutputPrediction(stages, rowId);
  const scriptNameValue = deriveScriptName(stages, rowId);

  // Header meta items
  const headerItems = [
    { label: "Test ID", value: requestIdValue },
    { label: "Request Ref. Number", value: `REF-${rowId}` },
    { label: "Created", value: createdTs },
    { label: "Processed", value: processedTs },
    { label: "Duration", value: String(apiCallCount) },
    { label: "Script Name", value: scriptNameValue, isScriptName: true },
  ];

  // Display boxes
  const boxes = [
    {
      key: "Request_Details",
      label: "Request Details",
      value: requestDetailsValue,
      tall: true,
    },
    {
      key: "Output_Prediction",
      label: "Output Prediction",
      value: outputPredictionValue,
      tall: true,
    },
  ];

  return (
    <div className="results-root" data-ocid="results.page">
      <div className="results-blob results-blob-purple" aria-hidden="true" />
      <div className="results-blob results-blob-teal" aria-hidden="true" />

      <h1 className="results-page-heading" data-ocid="results.page_heading">
        AI assist Modem Protocol{" "}
        <span className="results-page-heading-accent">Script Development</span>
      </h1>

      <header className="results-header" data-ocid="results.header.section">
        <div className="results-header-left">
          <span className="results-tag">Results</span>
          <h2 className="results-title">Request Snapshot</h2>
          <div
            className="results-meta-grid"
            data-ocid="results.header.meta.list"
          >
            {headerItems.map((item, idx) => {
              const isScriptName = (item as { isScriptName?: boolean })
                .isScriptName;
              const scriptValue = String(item.value);
              const hasScript = isScriptName && scriptValue.trim() !== "";
              return (
                <div
                  key={item.label}
                  className="results-meta-item"
                  data-ocid={`results.header.meta.item.${idx + 1}`}
                >
                  <span className="results-meta-label">{item.label}</span>
                  {hasScript ? (
                    <button
                      type="button"
                      className="results-meta-link"
                      data-ocid={`results.header.meta.script_name.link.${idx + 1}`}
                      onClick={() => {
                        window.open(
                          scriptValue,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      title={`Open ${scriptValue} in a new tab`}
                    >
                      {scriptValue}
                    </button>
                  ) : (
                    <span className="results-meta-value">{item.value}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className="results-copy-url"
          onClick={handleCopyUrl}
          data-ocid="results.copy_url_button"
          aria-label="Copy page URL"
        >
          {copiedUrl ? (
            <Check size={16} strokeWidth={3} aria-hidden="true" />
          ) : (
            <LinkIcon size={16} strokeWidth={2.5} aria-hidden="true" />
          )}
          <span>{copiedUrl ? "Copied" : "Copy URL"}</span>
        </button>
      </header>

      {/* 4-stage pipeline with visual effects */}
      <section
        className="results-pipeline"
        data-ocid="results.pipeline.section"
        aria-label="Pipeline status"
      >
        {DISPLAY_STAGES.map((stage, idx) => {
          const status = stageStatuses[idx];
          return (
            <React.Fragment key={stage.key}>
              <div
                className={`results-pipeline-stage results-pipeline-stage-${status}`}
                style={
                  {
                    "--stage-color": stage.color,
                    "--stage-color-rgb": stage.colorRgb,
                  } as React.CSSProperties
                }
                data-ocid={`results.pipeline.stage.item.${idx + 1}`}
              >
                <div className="results-pipeline-node" aria-hidden="true">
                  <div className="results-pipeline-node-ring" />
                  <div className="results-pipeline-node-core" />
                  {status === "completed" && (
                    <Check
                      className="results-pipeline-node-check"
                      size={16}
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  )}
                  {status === "ongoing" && (
                    <div
                      className="results-pipeline-node-spinner"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="results-pipeline-label">
                  {(() => {
                    const Icon = stage.icon;
                    return (
                      <Icon
                        size={16}
                        strokeWidth={2.5}
                        className="results-pipeline-stage-icon"
                        aria-hidden="true"
                      />
                    );
                  })()}
                  {stage.label}
                </div>
                <div
                  className={`results-pipeline-status results-pipeline-status-${status}`}
                >
                  {status === "completed"
                    ? "completed"
                    : status === "ongoing"
                      ? "Ongoing"
                      : "Idle"}
                </div>
                {status === "ongoing" && (
                  <div className="results-pipeline-progress" aria-hidden="true">
                    <div className="results-pipeline-progress-bar" />
                  </div>
                )}
              </div>
              {idx < DISPLAY_STAGES.length - 1 && (
                <div
                  className={`results-pipeline-connector ${
                    stageStatuses[idx] === "completed"
                      ? "results-pipeline-connector-active"
                      : ""
                  }`}
                  aria-hidden="true"
                >
                  <div className="results-pipeline-connector-line" />
                  <div className="results-pipeline-connector-flow" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </section>

      <main className="results-section" data-ocid="results.content.section">
        {loading && (
          <output
            className="results-loading"
            data-ocid="results.loading_state"
            aria-live="polite"
          >
            <div className="results-spinner" aria-hidden="true" />
            <span>Loading request details…</span>
          </output>
        )}

        {!loading && (
          <div className="results-fields" data-ocid="results.fields.list">
            {boxes.map((box, idx) => (
              <div
                key={box.key}
                className="results-field"
                data-ocid={`results.field.item.${idx + 1}`}
              >
                <div className="results-field-header">
                  <label
                    className="results-field-label"
                    htmlFor={`results-${box.key}`}
                  >
                    {box.label}
                  </label>
                  <button
                    type="button"
                    className="results-field-copy"
                    onClick={() => handleCopy(box.key, box.value)}
                    data-ocid={`results.field.copy_button.${idx + 1}`}
                    aria-label={`Copy ${box.label}`}
                  >
                    {copiedKey === box.key ? (
                      <Check size={15} strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <Copy size={15} strokeWidth={2.5} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <div
                  id={`results-${box.key}`}
                  className={`results-field-box ${box.tall ? "results-field-box-tall" : ""}`}
                  data-ocid={`results.field.value.${idx + 1}`}
                  aria-label={box.label}
                >
                  {box.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="results-footer" data-ocid="results.footer.section">
        <span>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="results-footer-link"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
