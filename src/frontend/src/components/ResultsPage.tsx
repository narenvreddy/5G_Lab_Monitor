import "../landing.css";
import { Check, Copy, Link as LinkIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PipelineState, type PipelineStatus } from "../backend";
import { useActor } from "../hooks/useActor";

interface ResultsPageProps {
  rowId: string;
}

type StageKey = "nlpParser" | "encoder" | "scriptGenerator";

const STAGE_ORDER: StageKey[] = ["nlpParser", "encoder", "scriptGenerator"];

const STAGE_LABELS: Record<StageKey, string> = {
  nlpParser: "NLP Parser",
  encoder: "Encoder",
  scriptGenerator: "Script Generator",
};

function stateLabel(state: PipelineState): string {
  switch (state) {
    case PipelineState.processing:
      return "Processing";
    case PipelineState.completed:
      return "Completed";
    default:
      return "Idle";
  }
}

/**
 * Derive a human-readable overall Status from the pipeline stages.
 * - All completed  → "Completed"
 * - Any processing  → "Processing"
 * - Otherwise       → "Idle"
 */
function deriveStatus(stages: PipelineStatus): string {
  const all = STAGE_ORDER.map((k) => stages[k]);
  if (all.every((s) => s === PipelineState.completed)) return "Completed";
  if (all.some((s) => s === PipelineState.processing)) return "Processing";
  return "Idle";
}

/**
 * Derive a Script_Status from the final stage (scriptGenerator).
 */
function deriveScriptStatus(stages: PipelineStatus): string {
  const final = stages.scriptGenerator;
  switch (final) {
    case PipelineState.completed:
      return "Script Generated";
    case PipelineState.processing:
      return "Generating Script…";
    default:
      return "Awaiting Generation";
  }
}

/**
 * Build a representative Output Prediction string from the pipeline state.
 * This is a read-only display value derived from available backend state.
 */
function deriveOutputPrediction(stages: PipelineStatus, rowId: string): string {
  const lines = STAGE_ORDER.map((k) => {
    return `${STAGE_LABELS[k]}: ${stateLabel(stages[k])}`;
  });
  lines.push("");
  lines.push(`Request ${rowId} pipeline summary derived from backend state.`);
  return lines.join("\n");
}

interface DisplayField {
  key: string;
  label: string;
  value: string;
  tall: boolean;
}

export function ResultsPage({ rowId }: ResultsPageProps) {
  const { actor } = useActor();
  const [stages, setStages] = useState<PipelineStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Fetch pipeline status for the row's test request id
  useEffect(() => {
    let cancelled = false;
    const testRequestId = `req-${rowId}`;
    const fetchStatus = async () => {
      if (!actor) return;
      try {
        const status: PipelineStatus =
          await actor.getPipelineStatus(testRequestId);
        if (!cancelled) {
          setStages(status);
          setLoading(false);
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

  // Derive display values from query param + available pipeline state
  const requestIdValue = `req-${rowId}`;
  const requestDetailsValue = `Test request ${rowId} — details captured from workspace submission.`;
  const statusValue = stages ? deriveStatus(stages) : "Idle";
  const scriptStatusValue = stages
    ? deriveScriptStatus(stages)
    : "Awaiting Generation";
  const outputPredictionValue = stages
    ? deriveOutputPrediction(stages, rowId)
    : "Output prediction will populate once the pipeline reports status.";

  const fields: DisplayField[] = [
    {
      key: "Request_Id",
      label: "Request_Id",
      value: requestIdValue,
      tall: false,
    },
    {
      key: "Request_Details",
      label: "Request_Details",
      value: requestDetailsValue,
      tall: true,
    },
    {
      key: "Output_Prediction",
      label: "Output Prediction",
      value: outputPredictionValue,
      tall: true,
    },
    { key: "Status", label: "Status", value: statusValue, tall: false },
    {
      key: "Script_Status",
      label: "Script_Status",
      value: scriptStatusValue,
      tall: false,
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
          <h1 className="results-title">Request Details</h1>
          <p className="results-sub">
            Read-only snapshot for request <strong>req-{rowId}</strong>. Use the
            copy controls to capture any field.
          </p>
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
            {fields.map((field, idx) => (
              <div
                key={field.key}
                className={`results-field ${field.tall ? "results-field-tall" : ""}`}
                data-ocid={`results.field.item.${idx + 1}`}
              >
                <div className="results-field-header">
                  <label
                    className="results-field-label"
                    htmlFor={`results-${field.key}`}
                  >
                    {field.label}
                  </label>
                  <button
                    type="button"
                    className="results-field-copy"
                    onClick={() => handleCopy(field.key, field.value)}
                    data-ocid={`results.field.copy_button.${idx + 1}`}
                    aria-label={`Copy ${field.label}`}
                  >
                    {copiedKey === field.key ? (
                      <Check size={15} strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <Copy size={15} strokeWidth={2.5} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <div
                  id={`results-${field.key}`}
                  className={`results-field-box ${field.tall ? "results-field-box-tall" : ""}`}
                  data-ocid={`results.field.value.${idx + 1}`}
                  aria-label={field.label}
                >
                  {field.value}
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
