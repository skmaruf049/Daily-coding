import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { StatCard, PageHeader, EmptyState, SkeletonRows, Badge } from "./ui";
import { color, card, font } from "./theme";
import { UsersIcon, ProblemsIcon, FeedbackIcon, TrophyIcon } from "./icons";

export default function Dashboard() {
  const [counts, setCounts] = useState(null);
  const [countsError, setCountsError] = useState("");
  const [activity, setActivity] = useState(null);
  const [activityError, setActivityError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/dashboard/counts");
      setCounts(res.data);
    } catch (err) {
      console.error("COUNTS ERROR:", err);
      setCountsError("Couldn't load counts.");
    }

    try {
      const res = await api.get("/dashboard/recent-submissions");
      setActivity(res.data);
    } catch (err) {
      console.error("RECENT SUBMISSIONS ERROR:", err.response?.data || err.message);
      setActivityError(
        err.response?.data?.error || "Couldn't load recent activity."
      );
    }
  };

  return (
    <div>
      <PageHeader title="Overview" subtitle="A snapshot of activity across DailyCode." />

      {countsError && (
        <div style={{ ...card, padding: "12px 16px", marginBottom: 16 }}>
          <span style={{ color: color.danger, fontSize: 13.5 }}>{countsError}</span>
        </div>
      )}

      <div style={styles.statGrid}>
        <StatCard
          label="Users"
          value={counts?.users}
          icon={<UsersIcon size={16} />}
          onClick={() => navigate("/admin/dashboard/users")}
        />
        <StatCard
          label="Problems"
          value={counts?.problems}
          icon={<ProblemsIcon size={16} />}
          onClick={() => navigate("/admin/dashboard/problems")}
          accent="#a78bfa"
        />
        <StatCard
          label="Feedback"
          value={counts?.feedback}
          icon={<FeedbackIcon size={16} />}
          onClick={() => navigate("/admin/dashboard/feedback")}
          accent={color.warning}
        />
        <StatCard
          label="Leaderboard"
          value={counts?.leaderboard}
          icon={<TrophyIcon size={16} />}
          onClick={() => navigate("/admin/dashboard/leaderboard")}
          accent={color.success}
        />
      </div>

      <div style={{ marginTop: 28 }}>
        <h2 style={styles.sectionTitle}>Recent activity</h2>

        <div style={{ ...card, overflow: "hidden" }}>
          {activityError && <EmptyState title="Something went wrong" hint={activityError} />}

          {!activityError && activity === null && <SkeletonRows rows={5} />}

          {!activityError && activity && activity.length === 0 && (
            <EmptyState
              title="No submissions yet"
              hint="Solved problems will show up here as users submit code."
            />
          )}

          {!activityError && activity && activity.length > 0 && (
            <ul style={styles.activityList}>
              {activity.map((a, i) => (
                <li key={i} style={styles.activityRow}>
                  <div style={{ minWidth: 0 }}>
                    <p style={styles.activityMain}>
                      <span style={{ fontWeight: 600 }}>{a.user_name || "A user"}</span>
                      {" solved "}
                      <span style={{ fontWeight: 600 }}>{a.problem_title || "a problem"}</span>
                    </p>
                    <p style={styles.activityMeta}>
                      {a.language && <span style={{ fontFamily: font.mono }}>{a.language}</span>}
                      {a.language && a.created_at && "  ·  "}
                      {a.created_at && new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge tone={a.status === "Accepted" ? "success" : "danger"}>
                    {a.status || "Unknown"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: color.textPrimary,
    margin: "0 0 12px",
  },
  activityList: { listStyle: "none", margin: 0, padding: 0 },
  activityRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 18px",
    borderBottom: `1px solid ${color.borderSoft}`,
  },
  activityMain: { margin: 0, fontSize: 14, color: color.textPrimary },
  activityMeta: { margin: "3px 0 0", fontSize: 12.5, color: color.textTertiary },
};
