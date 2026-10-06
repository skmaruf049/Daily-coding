export default function Card({ title, value, onClick, icon }) {
  return (
    <div
      style={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {icon && <div style={styles.icon}>{icon}</div>}
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.value}>{value}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "linear-gradient(145deg, #020617, #0f172a)",
    color: "#fff",
    padding: "28px",
    borderRadius: "16px",
    cursor: "pointer",
    height: "160px",

    /* CENTER CONTENT */
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    /* EFFECTS */
    transition: "all 0.25s ease",
    boxShadow: "0 15px 35px rgba(0,0,0,0.45)",
  },

  cardHover: {
    transform: "translateY(-6px)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
  },

  icon: {
    fontSize: "26px",
    marginBottom: "8px",
    opacity: 0.9,
  },

  title: {
    fontSize: "14px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    opacity: 0.7,
    marginBottom: "6px",
  },

  value: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#38bdf8",
  },
};
