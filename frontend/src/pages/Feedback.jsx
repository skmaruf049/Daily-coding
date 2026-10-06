import { useEffect, useState } from "react";
import api from "../api";
import { PageHeader, EmptyState, SkeletonRows, Avatar } from "../AdminPannel/ui";
import { color, font, card } from "../AdminPannel/theme";

export default function Feedback() {
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/feedback");
      setFeedback(res.data);
    } catch (err) {
      console.error("FEEDBACK ERROR:", err);
      setError("Couldn't load feedback.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Feedback"
        subtitle={feedback ? `${feedback.length} messages` : "Loading…"}
      />

      {error && (
        <div style={cardStyle}>
          <EmptyState title="Something went wrong" hint={error} />
        </div>
      )}

      {!error && feedback === null && (
        <div style={cardStyle}>
          <SkeletonRows rows={4} />
        </div>
      )}

      {!error && feedback && feedback.length === 0 && (
        <div style={cardStyle}>
          <EmptyState
            title="No feedback yet"
            hint="Messages submitted through the Contact form will appear here."
          />
        </div>
      )}

      {!error && feedback && feedback.length > 0 && (
        <div style={styles.list}>
          {feedback.map((f) => (
            <div key={f.id} style={cardStyle}>
              <div style={styles.row}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={f.email} size={30} />
                  <span style={styles.email}>{f.email || "Anonymous"}</span>
                </div>
                {f.created_at && (
                  <span style={styles.date}>
                    {new Date(f.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p style={styles.message}>{f.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle = { ...card, padding: 20 };

const styles = {
  list: { display: "flex", flexDirection: "column", gap: 12 },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  email: { fontWeight: 600, fontSize: 14, color: color.textPrimary },
  date: { fontSize: 12.5, color: color.textTertiary, fontFamily: font.mono },
  message: { margin: 0, fontSize: 14, color: color.textSecondary, lineHeight: 1.6 },
};
