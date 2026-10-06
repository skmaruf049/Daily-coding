import { useEffect, useState } from "react";
import api from "../api";
import { PageHeader, EmptyState, SkeletonRows, Avatar, TableCard, tableStyles } from "../AdminPannel/ui";
import { color, font } from "../AdminPannel/theme";
import { TrophyIcon } from "../AdminPannel/icons";

const RANK_COLOR = { 1: color.gold, 2: color.silver, 3: color.bronze };

export default function Leaderboard() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/leaderboard");
      setRows(res.data);
    } catch (err) {
      console.error("LEADERBOARD ERROR:", err);
      setError("Couldn't load the leaderboard.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        subtitle={rows ? `${rows.length} ranked solvers` : "Loading…"}
      />

      <TableCard>
        {error && <EmptyState title="Something went wrong" hint={error} />}
        {!error && rows === null && <SkeletonRows rows={6} />}
        {!error && rows && rows.length === 0 && (
          <EmptyState
            title="No ranked solvers yet"
            hint="Users appear here once they start solving problems."
          />
        )}

        {!error && rows && rows.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={tableStyles.th}>Rank</th>
                  <th style={tableStyles.th}>User</th>
                  <th style={tableStyles.th}>Email</th>
                  <th style={{ ...tableStyles.th, textAlign: "right" }}>Current level</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const rank = i + 1;
                  const medal = RANK_COLOR[rank];
                  return (
                    <tr key={r.user_id ?? i}>
                      <td style={tableStyles.td}>
                        <span
                          style={{
                            fontFamily: font.mono,
                            fontWeight: 700,
                            color: medal || color.textSecondary,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {medal && <TrophyIcon size={14} color={medal} />}
                          {String(rank).padStart(2, "0")}
                        </span>
                      </td>
                      <td style={tableStyles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={r.name} />
                          <span style={{ fontWeight: 500 }}>{r.name}</span>
                        </div>
                      </td>
                      <td style={{ ...tableStyles.td, color: color.textSecondary }}>{r.email}</td>
                      <td style={{ ...tableStyles.td, textAlign: "right", fontFamily: font.mono, color: color.accent, fontWeight: 700 }}>
                        {r.current_level ?? 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </div>
  );
}
