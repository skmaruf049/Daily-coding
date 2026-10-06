export default function LevelsSidebar({
  levels,
  currentLevel,
  onSelectLevel
}) {
  return (
    <div style={styles.sidebar}>
      <h3 style={styles.heading}>Levels</h3>

      {levels.map((lvl) => {
        let btnStyle = styles.locked;

        if (lvl.level_no < currentLevel) {
          btnStyle = styles.completed;
        } else if (lvl.level_no === currentLevel) {
          btnStyle = styles.current;
        }

        return (
          <button
            key={lvl.level_no}
            style={{ ...styles.btn, ...btnStyle }}
            disabled={lvl.level_no > currentLevel}
            onClick={() => onSelectLevel(lvl.level_no)}
          >
            Level {lvl.level_no}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  sidebar: {
    width: 180,
    padding: 10,
    background: "#0f172a",
    color: "white",
  },
  heading: {
    marginBottom: 10,
    color: "#38bdf8",
  },
  btn: {
    width: "100%",
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  current: {
    background: "#22c55e",
    color: "white",
  },
  completed: {
    background: "#3b82f6",
    color: "white",
  },
  locked: {
    background: "#475569",
    color: "#cbd5e1",
    cursor: "not-allowed",
  },
};
