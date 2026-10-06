import { useEffect, useState, Fragment } from "react";
import api from "../api";
import AddLevelWithTestCases from "../AdminPannel/AddLevelWithTestCases";
import { PageHeader, EmptyState, SkeletonRows, Badge, TableCard, tableStyles } from "../AdminPannel/ui";
import { color, font, buttonPrimary, buttonGhost, buttonDanger } from "../AdminPannel/theme";
import { PlusIcon, TrashIcon } from "../AdminPannel/icons";

const DIFFICULTY_TONE = { easy: "success", medium: "warning", hard: "danger" };

export default function Problems() {
  const [problems, setProblems] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const res = await api.get("/problems");
      setProblems(res.data);
    } catch (err) {
      console.error("PROBLEMS ERROR:", err);
      setError("Couldn't load problems.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem? This can't be undone.")) return;
    try {
      await api.delete(`/problems/${id}`);
      setProblems((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <PageHeader title="Problems" subtitle={problems ? `${problems.length} levels` : "Loading…"}>
        <button
          style={showForm ? buttonGhost : buttonPrimary}
          onClick={() => setShowForm((p) => !p)}
        >
          {showForm ? "Close form" : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <PlusIcon size={14} /> Add problem
            </span>
          )}
        </button>
      </PageHeader>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <AddLevelWithTestCases />
          <button
            style={{ ...buttonGhost, marginTop: 12 }}
            onClick={() => {
              setShowForm(false);
              loadProblems();
            }}
          >
            Refresh list
          </button>
        </div>
      )}

      <TableCard>
        {error && <EmptyState title="Something went wrong" hint={error} />}
        {!error && problems === null && <SkeletonRows rows={5} />}
        {!error && problems && problems.length === 0 && (
          <EmptyState title="No problems yet" hint="Add your first level to get started." />
        )}

        {!error && problems && problems.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={tableStyles.th}>Level</th>
                  <th style={tableStyles.th}>Title</th>
                  <th style={tableStyles.th}>Difficulty</th>
                  <th style={tableStyles.th}>Test cases</th>
                  <th style={{ ...tableStyles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p) => (
                  <Fragment key={p.id}>
                    <tr>
                      <td style={{ ...tableStyles.td, fontFamily: font.mono, color: color.accent, fontWeight: 700 }}>
                        {String(p.level_no ?? p.id).padStart(2, "0")}
                      </td>
                      <td style={tableStyles.td}>{p.title}</td>
                      <td style={tableStyles.td}>
                        {p.difficulty ? (
                          <Badge tone={DIFFICULTY_TONE[p.difficulty?.toLowerCase()] || "neutral"}>
                            {p.difficulty}
                          </Badge>
                        ) : (
                          <span style={{ color: color.textTertiary }}>—</span>
                        )}
                      </td>
                      <td style={tableStyles.td}>
                        <button
                          onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: color.accent,
                            cursor: "pointer",
                            fontSize: 13.5,
                            padding: 0,
                            fontWeight: 500,
                          }}
                        >
                          {p.test_case_count ?? 0} case{p.test_case_count === 1 ? "" : "s"}
                          {" "}{expanded === p.id ? "▲" : "▾"}
                        </button>
                      </td>
                      <td style={{ ...tableStyles.td, textAlign: "right" }}>
                        <button style={buttonDanger} onClick={() => handleDelete(p.id)}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                            <TrashIcon /> Delete
                          </span>
                        </button>
                      </td>
                    </tr>
                    {expanded === p.id && (
                      <tr>
                        <td colSpan={5} style={{ ...tableStyles.td, background: "#0d1730" }}>
                          <pre style={styles.code}>{p.test_cases || "No test cases"}</pre>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
}

const styles = {
  code: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: 12.5,
    whiteSpace: "pre-wrap",
    color: color.textSecondary,
    lineHeight: 1.6,
  },
};
