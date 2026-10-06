import { useState, useEffect } from "react";
import api from "../api";
import { color, font, card as cardToken, input as inputToken, buttonPrimary, buttonDanger, buttonGhost } from "./theme";

export default function AddLevelWithTestCases() {
  const [level, setLevel] = useState({
    level_no: "",
    title: "",
    description: "",
    difficulty: "Easy",
    youtube_link: "",
  });

  const [testCases, setTestCases] = useState([
    { input_data: "", expected_output: "" },
  ]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleLevelChange = (e) => {
    setLevel({ ...level, [e.target.name]: e.target.value });
  };

  const handleTestChange = (i, e) => {
    const updated = [...testCases];
    updated[i][e.target.name] = e.target.value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input_data: "", expected_output: "" }]);
  };

  const removeTestCase = (i) => {
    setTestCases(testCases.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/level", {
        ...level,
        testCases,
      });

      alert("✅ Level & Test Cases Created Successfully");

      setLevel({
        level_no: "",
        title: "",
        description: "",
        difficulty: "Easy",
        youtube_link: "",
      });

      setTestCases([{ input_data: "", expected_output: "" }]);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving data");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.page}>
      <h2 style={styles.pageTitle}>Create new level</h2>

      {/* ================= LEVEL INFO ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Level Information</h3>

        <div
          style={{
            ...styles.row,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div style={styles.field}>
            <label style={styles.label}>Level Number</label>
            <input
              type="number"
              name="level_no"
              value={level.level_no}
              onChange={handleLevelChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Difficulty</label>
            <select
              name="difficulty"
              value={level.difficulty}
              onChange={handleLevelChange}
              style={styles.input}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Problem Title</label>
          <input
            name="title"
            value={level.title}
            onChange={handleLevelChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Problem Description</label>
          <textarea
            name="description"
            value={level.description}
            onChange={handleLevelChange}
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>YouTube Link</label>
          <input
            name="youtube_link"
            value={level.youtube_link}
            onChange={handleLevelChange}
            placeholder="https://www.youtube.com/..."
            required
            style={styles.input}
          />
        </div>
      </section>

      {/* ================= TEST CASES ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Test Cases</h3>

        {testCases.map((tc, i) => (
          <div key={i} style={styles.testCase}>
            <div style={styles.field}>
              <label style={styles.label}>Input</label>
              <textarea
                name="input_data"
                value={tc.input_data}
                onChange={(e) => handleTestChange(i, e)}
                required
                style={styles.textarea}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Expected Output</label>
              <textarea
                name="expected_output"
                value={tc.expected_output}
                onChange={(e) => handleTestChange(i, e)}
                required
                style={styles.textarea}
              />
            </div>

            {testCases.length > 1 && (
              <button
                type="button"
                onClick={() => removeTestCase(i)}
                style={styles.removeBtn}
              >
                Remove test case
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addTestCase} style={styles.addBtn}>
          + Add another test case
        </button>
      </section>

      {/* ================= SUBMIT ================= */}
      <button type="submit" style={styles.submitBtn}>
        Create level
      </button>
    </form>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    maxWidth: 900,
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 16,
    color: color.textPrimary,
  },
  section: {
    ...cardToken,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    color: color.accent,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 600,
  },
  row: {
    display: "flex",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 14,
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: color.textSecondary,
  },
  input: {
    ...inputToken,
  },
  textarea: {
    ...inputToken,
    minHeight: 90,
    fontFamily: font.mono,
    resize: "vertical",
  },
  testCase: {
    background: color.bg,
    border: `1px solid ${color.border}`,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  addBtn: {
    ...buttonGhost,
    color: color.accent,
    borderColor: color.accentBorder,
  },
  removeBtn: {
    ...buttonDanger,
    marginTop: 6,
  },
  submitBtn: {
    ...buttonPrimary,
    width: "100%",
    padding: "12px",
    fontSize: 15,
    borderRadius: 10,
  },
};
