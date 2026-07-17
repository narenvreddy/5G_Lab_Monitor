import {
  Binary,
  Database,
  FileCode,
  type LucideIcon,
  MessageSquareText,
} from "lucide-react";
import { PipelineState } from "../backend";

export type StageKey = "nlpParser" | "encoder" | "scriptGenerator";

export interface TestRequestRow {
  id: number;
  testId: string;
  requestType: string;
  requestDetails: string;
  stages: Record<StageKey, PipelineState>;
  running: boolean;
  tpLoading: boolean;
  tpError: boolean;
  pipelineError: boolean;
  createdAt?: string;
  completedAt?: string;
}

export interface PersistedRow {
  id: number;
  testId: string;
  requestType: string;
  requestDetails: string;
  stages: Record<StageKey, PipelineState>;
  createdAt?: string;
  completedAt?: string;
}

export const IDLE_STATES: Record<StageKey, PipelineState> = {
  nlpParser: PipelineState.idle,
  encoder: PipelineState.idle,
  scriptGenerator: PipelineState.idle,
};

export interface DisplayStage {
  key: string;
  label: string;
  icon: LucideIcon;
  source: StageKey;
}

export const DISPLAY_STAGES: DisplayStage[] = [
  {
    key: "nlpOutput",
    label: "NLP Output",
    icon: MessageSquareText,
    source: "nlpParser",
  },
  {
    key: "encoder",
    label: "Encoder",
    icon: Binary,
    source: "encoder",
  },
  {
    key: "dataIngestion",
    label: "3GPP data Ingestion",
    icon: Database,
    source: "scriptGenerator",
  },
  {
    key: "scriptCreation",
    label: "Script Creation",
    icon: FileCode,
    source: "scriptGenerator",
  },
];

export const STORAGE_KEY = "tp_workspace_rows";

// Reference/sample data for first-visit demonstration of the History page.
// Injected only when localStorage has no existing tp_workspace_rows entry so
// real user data is never overwritten. Spans 3 calendar dates in July 2026
// (2 rows on the most recent date, 2 on a middle date, 1 on an older date) so
// the date grouping and collapsible per-date sections are visible.
export const SEED_ROWS: PersistedRow[] = [
  {
    id: 1,
    testId: "TC-5G-001",
    requestType: "Attach Procedure",
    requestDetails:
      "Verify UE initial attach to 5G core via AMF, including registration and PDU session setup.",
    stages: {
      nlpParser: PipelineState.completed,
      encoder: PipelineState.completed,
      scriptGenerator: PipelineState.completed,
    },
    createdAt: "2026-07-15T09:12:00.000Z",
    completedAt: "2026-07-15T09:18:42.000Z",
  },
  {
    id: 2,
    testId: "TC-5G-002",
    requestType: "Authentication AKA",
    requestDetails:
      "Validate 5G-AKA authentication flow between UE, AMF and AUSF with mutual challenge-response.",
    stages: {
      nlpParser: PipelineState.completed,
      encoder: PipelineState.completed,
      scriptGenerator: PipelineState.completed,
    },
    createdAt: "2026-07-16T11:03:00.000Z",
    completedAt: "2026-07-16T11:09:17.000Z",
  },
  {
    id: 3,
    testId: "TC-5G-003",
    requestType: "Handover Inter-NR",
    requestDetails:
      "Test inter-gNB handover within the same NR frequency band while maintaining session continuity.",
    stages: {
      nlpParser: PipelineState.completed,
      encoder: PipelineState.completed,
      scriptGenerator: PipelineState.completed,
    },
    createdAt: "2026-07-16T14:47:00.000Z",
    completedAt: "2026-07-16T14:55:31.000Z",
  },
  {
    id: 4,
    testId: "TC-5G-004",
    requestType: "PDU Session Establishment",
    requestDetails:
      "Confirm PDU session establishment request from UE to SMF over N1 interface with QoS flow setup.",
    stages: {
      nlpParser: PipelineState.completed,
      encoder: PipelineState.completed,
      scriptGenerator: PipelineState.completed,
    },
    createdAt: "2026-07-17T08:21:00.000Z",
    completedAt: "2026-07-17T08:27:05.000Z",
  },
  {
    id: 5,
    testId: "TC-5G-005",
    requestType: "RRC Connection Setup",
    requestDetails:
      "Check RRC connection setup and release cycle between UE and gNB including SRB1 establishment.",
    stages: {
      nlpParser: PipelineState.completed,
      encoder: PipelineState.completed,
      scriptGenerator: PipelineState.completed,
    },
    createdAt: "2026-07-17T16:34:00.000Z",
    completedAt: "2026-07-17T16:41:58.000Z",
  },
];

function toTestRequestRow(r: PersistedRow): TestRequestRow {
  return {
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
    createdAt: r.createdAt,
    completedAt: r.completedAt,
  };
}

export function loadPersistedRows(): TestRequestRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // First visit / empty state: inject seed rows so the History page has
    // reference data to demonstrate date grouping. Persist them so subsequent
    // visits keep the seed data without re-injecting over real user data.
    if (!raw) {
      const seeded = SEED_ROWS.map(toTestRequestRow);
      persistRows(seeded);
      return seeded;
    }
    const parsed: PersistedRow[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = SEED_ROWS.map(toTestRequestRow);
      persistRows(seeded);
      return seeded;
    }
    return parsed.map(toTestRequestRow);
  } catch {
    return [];
  }
}

export function stateClass(state: PipelineState): string {
  switch (state) {
    case PipelineState.processing:
      return "ws-stage-state ws-stage-processing";
    case PipelineState.completed:
      return "ws-stage-state ws-stage-completed";
    default:
      return "ws-stage-state ws-stage-idle";
  }
}

export function stateLabel(state: PipelineState): string {
  switch (state) {
    case PipelineState.processing:
      return "Processing";
    case PipelineState.completed:
      return "completed";
    default:
      return "idle";
  }
}

export function persistRows(rows: TestRequestRow[]): void {
  try {
    const persisted: PersistedRow[] = rows.map((r) => ({
      id: r.id,
      testId: r.testId,
      requestType: r.requestType,
      requestDetails: r.requestDetails,
      stages: {
        nlpParser: r.stages.nlpParser,
        encoder: r.stages.encoder,
        scriptGenerator: r.stages.scriptGenerator,
      },
      createdAt: r.createdAt,
      completedAt: r.completedAt,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // ignore storage failures (quota, private mode, etc.)
  }
}

export function openResultsInNewTab(rowId: number): void {
  const url = `${window.location.origin}${window.location.pathname}?result=${rowId}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openHistoryInNewTab(): void {
  const url = `${window.location.origin}${window.location.pathname}?history=1`;
  window.open(url, "_blank", "noopener,noreferrer");
}
