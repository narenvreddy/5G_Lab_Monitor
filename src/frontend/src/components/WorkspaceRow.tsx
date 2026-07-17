import { AlertCircle, ChevronRight, X } from "lucide-react";
import React from "react";
import { PipelineState } from "../backend";
import {
  DISPLAY_STAGES,
  type StageKey,
  type TestRequestRow,
  stateClass,
  stateLabel,
} from "./workspaceShared";

export interface WorkspaceRowProps {
  row: TestRequestRow;
  index: number;
  ocidPrefix: string;
  mode: "edit" | "history";
  onRemove?: (rowId: number) => void;
  onTestIdChange?: (rowId: number, value: string) => void;
  onTestIdBlur?: (rowId: number, value: string) => void;
  onRequestTypeChange?: (rowId: number, value: string) => void;
  onRequestDetailsChange?: (rowId: number, value: string) => void;
  onStart?: (rowId: number) => void;
  onOpenResults?: (rowId: number) => void;
}

export function WorkspaceRow({
  row,
  index,
  ocidPrefix,
  mode,
  onRemove,
  onTestIdChange,
  onTestIdBlur,
  onRequestTypeChange,
  onRequestDetailsChange,
  onStart,
  onOpenResults,
}: WorkspaceRowProps) {
  const threeGppCompleted =
    row.stages.scriptGenerator === PipelineState.completed;
  const isHistory = mode === "history";

  return (
    <div
      className="workspace-row"
      data-ocid={`${ocidPrefix}.item.${index + 1}`}
    >
      {!isHistory && onRemove && (
        <button
          type="button"
          className="workspace-row-close"
          onClick={() => onRemove(row.id)}
          data-ocid={`${ocidPrefix}.delete_button.${index + 1}`}
          aria-label={`Remove test request row ${row.id}`}
          title={`Remove row ${row.id}`}
        >
          <X size={12} strokeWidth={3} aria-hidden="true" />
        </button>
      )}
      <div className="workspace-row-top">
        <span className="workspace-serial">{row.id}</span>
        <input
          type="text"
          className="workspace-test-id-input"
          placeholder="Test ID"
          value={row.testId}
          onChange={
            onTestIdChange
              ? (e) => onTestIdChange(row.id, e.target.value)
              : undefined
          }
          onBlur={
            onTestIdBlur
              ? (e) => onTestIdBlur(row.id, e.target.value)
              : undefined
          }
          readOnly={isHistory}
          data-ocid={`${ocidPrefix}.input.${index + 1}`}
          aria-label={`Test ID for row ${row.id}`}
        />
        <input
          type="text"
          className="workspace-field-input workspace-field-type-input"
          placeholder="Request Type"
          value={row.requestType}
          onChange={
            onRequestTypeChange
              ? (e) => onRequestTypeChange(row.id, e.target.value)
              : undefined
          }
          readOnly={isHistory}
          data-ocid={`${ocidPrefix}.request_type_input.${index + 1}`}
          aria-label={`Request Type for row ${row.id}`}
        />
        <input
          type="text"
          className="workspace-field-input workspace-field-details-input"
          placeholder="Request Details"
          value={row.requestDetails}
          onChange={
            onRequestDetailsChange
              ? (e) => onRequestDetailsChange(row.id, e.target.value)
              : undefined
          }
          readOnly={isHistory}
          data-ocid={`${ocidPrefix}.request_details_input.${index + 1}`}
          aria-label={`Request Details for row ${row.id}`}
        />
        {isHistory ? (
          <button
            type="button"
            className="workspace-results-btn workspace-results-btn-inline"
            onClick={() => onOpenResults?.(row.id)}
            data-ocid={`${ocidPrefix}.results_button.${index + 1}`}
            aria-label={`Open results for row ${row.id} in a new tab`}
            title="Open results in a new tab"
          >
            Results
          </button>
        ) : (
          <button
            type="button"
            className="workspace-start-btn"
            onClick={() => onStart?.(row.id)}
            disabled={row.running}
            data-ocid={`${ocidPrefix}.start_button.${index + 1}`}
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
            {row.running ? "Running…" : row.pipelineError ? "Retry" : "Start"}
          </button>
        )}
      </div>
      <div
        className="workspace-pipeline"
        data-ocid={`${ocidPrefix}.pipeline.${index + 1}`}
      >
        {DISPLAY_STAGES.map((stage, sIdx) => {
          const StageIcon = stage.icon;
          const state = row.stages[stage.source as StageKey];
          return (
            <React.Fragment key={stage.key}>
              <span
                className={stateClass(state)}
                data-ocid={`${ocidPrefix}.stage.${index + 1}.${stage.key}`}
              >
                <StageIcon
                  size={13}
                  className="ws-stage-icon"
                  aria-hidden="true"
                />
                {stage.label} · {stateLabel(state)}
              </span>
              {sIdx < DISPLAY_STAGES.length - 1 && (
                <ChevronRight
                  size={16}
                  className="ws-stage-sep"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
        {row.tpLoading && (
          <output
            className="workspace-tp-status workspace-tp-loading"
            data-ocid={`${ocidPrefix}.tp_loading_state.${index + 1}`}
            aria-live="polite"
          >
            <span className="workspace-tp-spinner" aria-hidden="true" />
            Fetching TP…
          </output>
        )}
        {row.tpError && !row.tpLoading && (
          <output
            className="workspace-tp-status workspace-tp-error"
            data-ocid={`${ocidPrefix}.tp_error_state.${index + 1}`}
            aria-live="polite"
          >
            <AlertCircle size={12} aria-hidden="true" />
            TP fetch failed
          </output>
        )}
        {row.pipelineError && !row.running && (
          <output
            className="workspace-tp-status workspace-tp-error"
            data-ocid={`${ocidPrefix}.pipeline_error_state.${index + 1}`}
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={12} aria-hidden="true" />
            Pipeline failed — retry
          </output>
        )}
        {!isHistory && threeGppCompleted && onOpenResults && (
          <button
            type="button"
            className="workspace-results-btn"
            onClick={() => onOpenResults(row.id)}
            data-ocid={`${ocidPrefix}.results_button.${index + 1}`}
            aria-label={`Open results for row ${row.id} in a new tab`}
            title="Open results in a new tab"
          >
            Results
          </button>
        )}
      </div>
    </div>
  );
}
