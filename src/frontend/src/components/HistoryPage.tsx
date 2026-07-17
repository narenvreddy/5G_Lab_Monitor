import "../landing.css";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WorkspaceRow } from "./WorkspaceRow";
import {
  type TestRequestRow,
  loadPersistedRows,
  openResultsInNewTab,
} from "./workspaceShared";

// ── Date grouping helpers ────────────────────────────────────────

const UNDATED_KEY = "__undated__";

interface DateGroup {
  key: string;
  label: string;
  rows: TestRequestRow[];
}

/**
 * Returns the timestamp used to sort and group a row.
 * Prefers `completedAt`, falls back to `createdAt`, then null (undated).
 */
function rowTimestamp(row: TestRequestRow): string | null {
  if (row.completedAt?.trim()) return row.completedAt;
  if (row.createdAt?.trim()) return row.createdAt;
  return null;
}

/** Parses an ISO timestamp into a local YYYY-MM-DD calendar key. */
function dateKeyFromTimestamp(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return UNDATED_KEY;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Friendly label like "Jul 17, 2026" for a YYYY-MM-DD key. */
function friendlyLabel(key: string): string {
  if (key === UNDATED_KEY) return "Undated";
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Groups rows by calendar date, ordered most recent first.
 * Rows with no completedAt AND no createdAt land in a final "Undated" group.
 */
function groupRowsByDate(rows: TestRequestRow[]): DateGroup[] {
  const buckets = new Map<string, TestRequestRow[]>();
  for (const row of rows) {
    const ts = rowTimestamp(row);
    const key = ts ? dateKeyFromTimestamp(ts) : UNDATED_KEY;
    const list = buckets.get(key) ?? [];
    list.push(row);
    buckets.set(key, list);
  }

  // Sort each bucket's rows by timestamp descending (most recent first).
  for (const list of buckets.values()) {
    list.sort((a, b) => {
      const ta = rowTimestamp(a);
      const tb = rowTimestamp(b);
      if (!ta && !tb) return a.id - b.id;
      if (!ta) return 1;
      if (!tb) return -1;
      return new Date(tb).getTime() - new Date(ta).getTime();
    });
  }

  const datedKeys = [...buckets.keys()].filter((k) => k !== UNDATED_KEY);
  datedKeys.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)); // descending

  const groups: DateGroup[] = datedKeys.map((key) => ({
    key,
    label: friendlyLabel(key),
    rows: buckets.get(key) ?? [],
  }));

  if (buckets.has(UNDATED_KEY)) {
    groups.push({
      key: UNDATED_KEY,
      label: friendlyLabel(UNDATED_KEY),
      rows: buckets.get(UNDATED_KEY) ?? [],
    });
  }

  return groups;
}

export function HistoryPage() {
  const [rows, setRows] = useState<TestRequestRow[]>([]);

  // Filter state for the history filter section.
  const [filterTestId, setFilterTestId] = useState("");
  const [filterRequestType, setFilterRequestType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDetails, setFilterDetails] = useState("");

  // Load persisted workspace rows so history reflects past requests.
  useEffect(() => {
    setRows(loadPersistedRows());
  }, []);

  // Apply all non-empty filters (AND logic) before date grouping.
  const filteredRows = useMemo(() => {
    const testIdQ = filterTestId.trim().toLowerCase();
    const typeQ = filterRequestType.trim().toLowerCase();
    const detailsQ = filterDetails.trim().toLowerCase();
    const hasDate = filterDate.trim().length > 0;
    return rows.filter((row) => {
      if (testIdQ && !row.testId.toLowerCase().includes(testIdQ)) return false;
      if (typeQ && !row.requestType.toLowerCase().includes(typeQ)) return false;
      if (detailsQ && !row.requestDetails.toLowerCase().includes(detailsQ))
        return false;
      if (hasDate) {
        const ts = row.completedAt?.trim() || row.createdAt?.trim() || "";
        if (!ts) return false;
        if (dateKeyFromTimestamp(ts) !== filterDate) return false;
      }
      return true;
    });
  }, [rows, filterTestId, filterRequestType, filterDate, filterDetails]);

  // Group filtered rows by date, most recent first; undated rows land last.
  const groups = useMemo(() => groupRowsByDate(filteredRows), [filteredRows]);

  // All date groups default to expanded.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  // Running index across all groups so data-ocid item markers stay unique
  // and deterministic per the workspace row contract.
  let runningIndex = 0;

  return (
    <div className="results-root" data-ocid="history.page">
      <div className="results-blob results-blob-purple" aria-hidden="true" />
      <div className="results-blob results-blob-teal" aria-hidden="true" />

      {/* ── Results-style header (no mascot, no chips, no hero-sub) ── */}
      <h1 className="results-page-heading" data-ocid="history.page_heading">
        AI assist Modem Protocol{" "}
        <span className="results-page-heading-accent">Script Development</span>
      </h1>

      <header className="results-header" data-ocid="history.header.section">
        <div className="results-header-left">
          <span className="results-tag">History</span>
          <h2 className="results-title">Request History</h2>
        </div>
      </header>

      {/* ── Filter section ──── */}
      <div className="history-filters" data-ocid="history.filters.section">
        <h3 className="history-filters-title" data-ocid="history.filters.title">
          Filters
        </h3>
        <div className="history-filter">
          <label
            className="history-filter-label"
            htmlFor="history-filter-test-id"
          >
            Test ID
          </label>
          <input
            id="history-filter-test-id"
            type="text"
            className="history-filter-input"
            placeholder="e.g. TC-5G-001"
            value={filterTestId}
            onChange={(e) => setFilterTestId(e.target.value)}
            data-ocid="history.filters.test_id.input"
          />
        </div>
        <div className="history-filter">
          <label
            className="history-filter-label"
            htmlFor="history-filter-request-type"
          >
            Request Type
          </label>
          <input
            id="history-filter-request-type"
            type="text"
            className="history-filter-input"
            placeholder="e.g. Attach Procedure"
            value={filterRequestType}
            onChange={(e) => setFilterRequestType(e.target.value)}
            data-ocid="history.filters.request_type.input"
          />
        </div>
        <div className="history-filter">
          <label className="history-filter-label" htmlFor="history-filter-date">
            Date
          </label>
          <input
            id="history-filter-date"
            type="date"
            className="history-filter-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            data-ocid="history.filters.date.input"
          />
        </div>
        <div className="history-filter">
          <label
            className="history-filter-label"
            htmlFor="history-filter-details"
          >
            Details
          </label>
          <input
            id="history-filter-details"
            type="text"
            className="history-filter-input"
            placeholder="Search request details"
            value={filterDetails}
            onChange={(e) => setFilterDetails(e.target.value)}
            data-ocid="history.filters.details.input"
          />
        </div>
      </div>

      {/* ── HISTORY (date-grouped, collapsible) ──── */}
      <div className="workspace-section" data-ocid="history.workspace.section">
        <div className="workspace-rows" data-ocid="history.workspace.list">
          {filteredRows.length === 0 && (
            <p
              className="workspace-empty"
              data-ocid="history.workspace.empty_state"
            >
              No past test requests yet. Requests created in the workspace will
              appear here.
            </p>
          )}

          {groups.map((group) => {
            const isCollapsed = !!collapsed[group.key];
            return (
              <div
                key={group.key}
                className="history-date-group"
                data-ocid={`history.workspace.date_group.${group.key}`}
              >
                <button
                  type="button"
                  className="history-date-header"
                  onClick={() => toggle(group.key)}
                  aria-expanded={!isCollapsed}
                  aria-controls={`history-group-panel-${group.key}`}
                  data-ocid={`history.workspace.date_group.${group.key}.toggle`}
                  aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${group.label} (${group.rows.length} ${group.rows.length === 1 ? "request" : "requests"})`}
                >
                  {isCollapsed ? (
                    <ChevronRight
                      size={18}
                      aria-hidden="true"
                      className="history-chevron"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className="history-chevron"
                    />
                  )}
                  <span className="history-date-label">{group.label}</span>
                  <span className="history-date-count">
                    {group.rows.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <div
                    id={`history-group-panel-${group.key}`}
                    className="history-date-rows"
                  >
                    {group.rows.map((row) => {
                      runningIndex += 1;
                      return (
                        <WorkspaceRow
                          key={row.id}
                          row={row}
                          index={runningIndex - 1}
                          ocidPrefix="history.workspace"
                          mode="history"
                          onOpenResults={openResultsInNewTab}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Local styles for date-grouped collapsible History sections.
          Kept scoped to this page so the shared landing.css stays untouched. */}
      <style>{`
        .history-date-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .history-date-group + .history-date-group {
          margin-top: 0.4rem;
        }
        .history-date-header {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          background: rgba(91, 79, 207, 0.06);
          border: 1px solid rgba(91, 79, 207, 0.18);
          border-radius: 0.6rem;
          padding: 0.55rem 0.8rem;
          font-family: "Nunito", sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          color: #1a1a2e;
          cursor: pointer;
          text-align: left;
          transition: background 0.18s ease, box-shadow 0.18s ease;
          box-sizing: border-box;
        }
        .history-date-header:hover {
          background: rgba(91, 79, 207, 0.12);
        }
        .history-date-header:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(91, 79, 207, 0.28);
        }
        .history-chevron {
          color: #5b4fcf;
          flex-shrink: 0;
        }
        .history-date-label {
          flex: 1;
          min-width: 0;
        }
        .history-date-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.6rem;
          height: 1.4rem;
          padding: 0 0.45rem;
          background: rgba(91, 79, 207, 0.14);
          color: #5b4fcf;
          border-radius: 2rem;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.02em;
        }
        .history-date-rows {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-left: 0.25rem;
        }
      `}</style>
    </div>
  );
}
