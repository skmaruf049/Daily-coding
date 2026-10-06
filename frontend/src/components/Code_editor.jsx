import { useEffect, useState, useCallback } from "react";
import api from "../api";
import CodeEditor from "./CodeEditor";
import LevelsSidebar from "./LevelsSidebar";
import logoIcon from "../assets/logo-icon.png";

export default function App() {
  const userId = localStorage.getItem("userId");

  const [levels, setLevels] = useState([]);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [viewingLevel, setViewingLevel] = useState(1);

  const [level, setLevel] = useState(null);
  const [sampleTest, setSampleTest] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [submitResult, setSubmitResult] = useState(null);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================
     LOAD LEVELS
  ========================= */
  const loadLevels = useCallback(() => {
    return api
      .get(`/levels/${userId}`)
      .then((res) => {
        setLevels(res.data.levels);
        setUnlockedLevel(res.data.currentLevel);
        setViewingLevel((prev) => prev ?? res.data.currentLevel);
        setError("");
      })
      .catch(() => setError("Failed to load levels"));
  }, [userId]);

  useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  /* =========================
     LOAD CURRENT LEVEL
  ========================= */
  const loadLevel = useCallback(() => {
    return api
      .get(`/level/${userId}`, {
        params: {
          level: viewingLevel,
        },
      })
      .then((res) => {
        setLevel(res.data.level);
        setSampleTest(res.data.sampleTest);
        setCode("");
        setInput("");
        setOutput("");
        setSubmitResult(null);
        setError("");
      })
      .catch(() => setError("Failed to load level"));
  }, [userId, viewingLevel]);

  useEffect(() => {
    if (viewingLevel) {
      loadLevel();
    }
  }, [loadLevel, viewingLevel]);

  /* =========================
     RETRY
  ========================= */
  const handleRetry = () => {
    setError("");
    loadLevels();
    loadLevel();
  };

  /* =========================
     ERROR
  ========================= */
  if (error) {
    return (
      <div style={styles.errorPage}>
        <h2>{error}</h2>

        <button
          style={{
            ...styles.btn,
            ...styles.runBtn,
          }}
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  /* =========================
     LOADING
  ========================= */
  if (!level) {
    return (
      <div style={styles.loadingPage}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* =========================
          RESPONSIVE CSS
      ========================= */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        @media (max-width: 900px) {
          .dc-menu-btn {
            display: inline-block !important;
          }

          .dc-close-btn {
            display: inline-block !important;
          }

          .dc-sidebar {
            position: fixed !important;
            top: 68px !important;
            left: -280px !important;
            height: calc(100vh - 68px) !important;
            width: 280px !important;
            z-index: 100 !important;
            transition: left 0.25s ease;
          }

          .dc-sidebar.dc-sidebar-open {
            left: 0 !important;
          }

          .dc-navbar {
            flex-wrap: wrap;
            row-gap: 8px;
          }

          .dc-io-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .dc-navbar {
            padding: 10px 12px !important;
          }

          .dc-logo {
            font-size: 1.2rem !important;
          }

          .dc-logo-icon {
            width: 34px !important;
            height: 34px !important;
          }

          .dc-tagline {
            font-size: 0.4rem !important;
          }

          .dc-lang-label {
            display: none;
          }

          .dc-main {
            padding: 10px !important;
          }

          .dc-card,
          .dc-editor-card,
          .dc-io-card,
          .dc-submit-result-card {
            padding: 12px !important;
          }

          .dc-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .dc-editor-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .dc-btn-row {
            width: 100%;
          }

          .dc-btn {
            flex: 1;
          }

          .dc-editor-box {
            min-height: 240px !important;
          }

          .dc-textarea {
            width: 100% !important;
            box-sizing: border-box;
          }
        }

        @media (max-width: 420px) {
          .dc-brand-text {
            display: none !important;
          }

          .dc-lang-box {
            margin-left: auto;
          }
        }
      `}</style>

      {/* =========================
          TOP NAVBAR
      ========================= */}
      <div
        className="dc-navbar"
        style={styles.navbar}
      >
        {/* Mobile Menu Button */}
        <button
          className="dc-menu-btn"
          style={styles.menuBtn}
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* =========================
            DAILYCODE BRAND
        ========================= */}
        <div
          className="dc-brand"
          style={styles.brand}
        >
          <img
            src={logoIcon}
            alt="DailyCode Logo"
            className="dc-logo-icon"
            style={styles.logoIcon}
          />

          <div
            className="dc-brand-text"
            style={styles.brandText}
          >
            <div
              className="dc-logo"
              style={styles.logo}
            >
              <span style={styles.daily}>Daily</span>
              <span style={styles.codeText}>Code</span>
            </div>

            <div
              className="dc-tagline"
              style={styles.tagline}
            >
              ONLINE CODING PLATFORM
            </div>
          </div>
        </div>

        {/* =========================
            LANGUAGE SELECTOR
        ========================= */}
        <div
          className="dc-lang-box"
          style={styles.langBox}
        >
          <span
            className="dc-lang-label"
            style={styles.langLabel}
          >
            Language:
          </span>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      {/* =========================
          MAIN LAYOUT
      ========================= */}
      <div style={styles.layout}>
        {/* =========================
            SIDEBAR
        ========================= */}
        <div
          className={`dc-sidebar${
            sidebarOpen ? " dc-sidebar-open" : ""
          }`}
          style={{
            ...styles.sidebar,
            ...(sidebarOpen ? styles.sidebarOpen : {}),
          }}
        >
          <div style={styles.sidebarHeader}>
            <h3 style={styles.levelHeading}>
              Levels
            </h3>

            <button
              className="dc-close-btn"
              style={styles.closeBtn}
              onClick={() => setSidebarOpen(false)}
            >
              ✖
            </button>
          </div>

          <LevelsSidebar
            levels={levels}
            currentLevel={unlockedLevel}
            onSelectLevel={(lvl) => {
              if (lvl <= unlockedLevel) {
                setViewingLevel(lvl);
                setSidebarOpen(false);
              }
            }}
          />
        </div>

        {/* =========================
            MAIN AREA
        ========================= */}
        <div
          className="dc-main"
          style={styles.main}
        >
          {/* =========================
              PROBLEM CARD
          ========================= */}
          <div
            className="dc-card"
            style={styles.card}
          >
            <div
              className="dc-card-header"
              style={styles.cardHeader}
            >
              <h2 style={styles.title}>
                Level {level.level_no}: {level.title}
              </h2>

              <span style={styles.badge}>
                Unlocked ✅
              </span>
            </div>

            <p style={styles.desc}>
              {level.description}
            </p>
          </div>

          {/* =========================
              YOUTUBE EXPLANATION
          ========================= */}
          {level.youtube_link && (
            <a
              href={level.youtube_link}
              target="_blank"
              rel="noreferrer"
              style={styles.youtubeLink}
            >
              ▶ Watch Explanation
            </a>
          )}

          {/* =========================
              SAMPLE INPUT
          ========================= */}
          {sampleTest && (
            <div
              className="dc-card"
              style={styles.card}
            >
              <h4 style={styles.sampleTitle}>
                Sample Input
              </h4>

              <pre style={styles.sampleInput}>
                {sampleTest.input_data}
              </pre>
            </div>
          )}

          {/* =========================
              EDITOR CARD
          ========================= */}
          <div
            className="dc-editor-card"
            style={styles.editorCard}
          >
            <div
              className="dc-editor-header"
              style={styles.editorHeader}
            >
              <h3 style={styles.editorTitle}>
                Editor
              </h3>

              <div
                className="dc-btn-row"
                style={styles.btnRow}
              >
                {/* RUN */}
                <button
                  className="dc-btn"
                  style={{
                    ...styles.btn,
                    ...styles.runBtn,
                  }}
                  onClick={async () => {
                    if (!input.trim()) {
                      alert("Input required for Run");
                      return;
                    }

                    try {
                      const res = await api.post("/run", {
                        code,
                        language,
                        input,
                      });

                      setOutput(res.data.output);
                    } catch (err) {
                      console.error(err);

                      alert(
                        err.response?.data?.error ||
                          "Run failed. Please try again."
                      );
                    }
                  }}
                >
                  ▶ Run
                </button>

                {/* SUBMIT */}
                <button
                  className="dc-btn"
                  style={{
                    ...styles.btn,
                    ...styles.submitBtn,
                  }}
                  onClick={async () => {
                    if (!userId) {
                      alert(
                        "Please log in before submitting code."
                      );
                      return;
                    }

                    setSubmitResult(null);

                    try {
                      const res = await api.post(
                        "/submit",
                        {
                          userId,
                          code,
                          language,
                          level: viewingLevel,
                        }
                      );

                      if (res.data?.error) {
                        alert(res.data.error);
                        return;
                      }

                      /* WRONG ANSWER */
                      if (
                        res.data.verdict?.includes(
                          "Wrong Answer"
                        )
                      ) {
                        setSubmitResult({
                          verdict: res.data.verdict,
                          failed_test:
                            res.data.failed_test,
                          input: res.data.input,
                          expected_output:
                            res.data.expected_output,
                          actual_output:
                            res.data.actual_output,
                          tests: res.data.tests,
                        });

                        return;
                      }

                      /* ACCEPTED */
                      if (
                        res.data.verdict?.includes(
                          "Accepted"
                        )
                      ) {
                        const next =
                          res.data.next_level ??
                          viewingLevel + 1;

                        setSubmitResult({
                          verdict: res.data.verdict,
                          passed_tests:
                            res.data.passed_tests,
                          next_level: next,
                          tests: res.data.tests,
                        });

                        if (
                          viewingLevel >=
                          unlockedLevel
                        ) {
                          setUnlockedLevel(next);
                          setViewingLevel(next);
                        }

                        loadLevels();
                      }
                    } catch (err) {
                      console.error(err);

                      alert(
                        err.response?.data?.error ||
                          "Submission failed. Please try again."
                      );
                    }
                  }}
                >
                  ✔ Submit
                </button>
              </div>
            </div>

            {/* CODE EDITOR */}
            <div style={styles.editorBody}>
              <div
                className="dc-editor-box"
                style={styles.editorBox}
              >
                <CodeEditor
                  code={code}
                  setCode={setCode}
                />
              </div>
            </div>
          </div>

          {/* =========================
              INPUT / OUTPUT
          ========================= */}
          <div
            className="dc-io-grid"
            style={styles.ioGrid}
          >
            {/* INPUT */}
            <div
              className="dc-io-card"
              style={styles.ioCard}
            >
              <h4 style={styles.ioTitle}>
                Your Input (Run only)
              </h4>

              <textarea
                className="dc-textarea"
                style={styles.textarea}
                rows={6}
                value={input}
                placeholder="Enter your input here..."
                onChange={(e) =>
                  setInput(e.target.value)
                }
              />
            </div>

            {/* OUTPUT */}
            <div
              className="dc-io-card"
              style={styles.ioCard}
            >
              <h4 style={styles.ioTitle}>
                Your Output
              </h4>

              <pre style={styles.outputBox}>
                {output ||
                  "Output will appear here..."}
              </pre>
            </div>
          </div>

          {/* =========================
              SUBMISSION RESULT
          ========================= */}
          {submitResult && (
            <div
              className="dc-submit-result-card"
              style={styles.submitResultCard}
            >
              <h4 style={styles.ioTitle}>
                Submission Result
              </h4>

              <p style={styles.resultText}>
                {submitResult.verdict}
              </p>

              {/* FAILED TEST */}
              {submitResult.failed_test && (
                <div style={styles.resultDetails}>
                  <p>
                    Failed test:{" "}
                    {submitResult.failed_test}
                  </p>

                  <p>
                    Input:{" "}
                    {submitResult.input || "(none)"}
                  </p>

                  <p>
                    Expected:{" "}
                    {submitResult.expected_output ||
                      "(none)"}
                  </p>

                  <p>
                    Actual:{" "}
                    {submitResult.actual_output ||
                      "(none)"}
                  </p>
                </div>
              )}

              {/* PASSED TESTS */}
              {submitResult.passed_tests && (
                <div style={styles.resultDetails}>
                  <p>
                    Passed tests:{" "}
                    {submitResult.passed_tests}
                  </p>

                  <p>
                    Next level:{" "}
                    {submitResult.next_level}
                  </p>
                </div>
              )}

              {/* TEST LIST */}
              {submitResult.tests &&
                submitResult.tests.length > 0 && (
                  <div style={styles.testList}>
                    <h5 style={styles.testHeading}>
                      Level{" "}
                      {submitResult.current_level ||
                        viewingLevel}{" "}
                      test cases
                    </h5>

                    {submitResult.tests.map(
                      (test, index) => (
                        <div
                          key={test.id || index}
                          style={styles.testItem}
                        >
                          <strong>
                            Test {index + 1}
                          </strong>

                          <p>
                            Input:{" "}
                            {test.input || "(none)"}
                          </p>

                          <p>
                            Expected:{" "}
                            {test.expected_output ||
                              "(none)"}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* =========================
          MOBILE OVERLAY
      ========================= */}
      {sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = {
  /* =========================
     PAGE
  ========================= */
  page: {
    background: "#080d1b",
    color: "#f1f5f9",
    minHeight: "100vh",
    fontFamily:
      "Inter, Arial, sans-serif",
  },

  errorPage: {
    padding: 30,
    minHeight: "100vh",
    background: "#080d1b",
    color: "#ffffff",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#080d1b",
    color: "#38bdf8",
  },

  /* =========================
     NAVBAR
  ========================= */
  navbar: {
    minHeight: 68,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#080d1b",
    padding: "10px 20px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.35)",
    borderBottom:
      "1px solid rgba(56,189,248,0.12)",
    position: "sticky",
    top: 0,
    zIndex: 60,
  },

  /* =========================
     BRAND
  ========================= */
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  logoIcon: {
    width: 40,
    height: 40,
    objectFit: "contain",
    flexShrink: 0,
  },

  brandText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    lineHeight: 1,
  },

  logo: {
    fontSize: "1.55rem",
    fontWeight: 800,
    letterSpacing: "0.5px",
    margin: 0,
    lineHeight: 1.1,
  },

  daily: {
    color: "#00aaff",
  },

  codeText: {
    color: "#ffffff",
  },

  tagline: {
    color: "#718096",
    fontSize: "0.48rem",
    fontWeight: 600,
    letterSpacing: "1.4px",
    marginTop: 4,
  },

  /* =========================
     MENU
  ========================= */
  menuBtn: {
    background: "transparent",
    color: "#ffffff",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    display: "none",
  },

  /* =========================
     LANGUAGE
  ========================= */
  langBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#38bdf8",
  },

  langLabel: {
    fontSize: 14,
    opacity: 0.9,
  },

  select: {
    padding: "7px 10px",
    borderRadius: 8,
    border:
      "1px solid #334155",
    background: "#111827",
    color: "#ffffff",
    outline: "none",
    cursor: "pointer",
  },

  /* =========================
     LAYOUT
  ========================= */
  layout: {
    display: "flex",
    minHeight:
      "calc(100vh - 68px)",
    background: "#080d1b",
  },

  /* =========================
     SIDEBAR
  ========================= */
  sidebar: {
    width: 280,
    minWidth: 280,
    borderRight:
      "1px solid #1e293b",
    padding: 12,
    overflowY: "auto",
    background: "#0b1220",
  },

  sidebarOpen: {
    position: "fixed",
    top: 68,
    left: 0,
    height:
      "calc(100vh - 68px)",
    width: 280,
    zIndex: 100,
  },

  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  levelHeading: {
    margin: 0,
    color: "#38bdf8",
    fontSize: "1.1rem",
  },

  closeBtn: {
    border: "none",
    background: "#1e293b",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    display: "none",
  },

  /* =========================
     MAIN
  ========================= */
  main: {
    flex: 1,
    padding: 16,
    overflowY: "auto",
    minWidth: 0,
  },

  /* =========================
     PROBLEM CARD
  ========================= */
  card: {
    borderRadius: 14,
    padding: 16,
    background: "#111c2f",
    marginBottom: 14,
    border:
      "1px solid rgba(56,189,248,0.08)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#38bdf8",
    margin: 0,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 15px",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    boxShadow:
      "0 8px 20px rgba(34,197,94,0.2)",
    whiteSpace: "nowrap",
  },

  desc: {
    marginTop: 10,
    color: "#cbd5e1",
    lineHeight: 1.6,
  },

  youtubeLink: {
    display: "inline-block",
    marginBottom: 14,
    color: "#38bdf8",
    textDecoration: "none",
    fontWeight: 600,
  },

  sampleTitle: {
    color: "#38bdf8",
    marginTop: 0,
  },

  sampleInput: {
    background: "#0b1220",
    color: "#e2e8f0",
    padding: 12,
    borderRadius: 8,
    overflowX: "auto",
  },

  /* =========================
     EDITOR
  ========================= */
  editorCard: {
    background: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  editorHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  editorTitle: {
    margin: 0,
    color: "#0f172a",
  },

  btnRow: {
    display: "flex",
    gap: 10,
  },

  btn: {
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    transition:
      "transform 0.2s ease, opacity 0.2s ease",
  },

  runBtn: {
    background:
      "linear-gradient(135deg, #2563eb, #0284c7)",
    color: "#ffffff",
  },

  submitBtn: {
    background:
      "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#ffffff",
  },

  editorBody: {
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #0f172a",
  },

  editorBox: {
    minHeight: 320,
    background: "#0f172a",
  },

  /* =========================
     INPUT / OUTPUT
  ========================= */
  ioGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: 14,
  },

  ioCard: {
    background: "#111c2f",
    borderRadius: 14,
    padding: 14,
    border:
      "1px solid rgba(56,189,248,0.08)",
  },

  ioTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#38bdf8",
    marginTop: 0,
  },

  textarea: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    fontFamily: "monospace",
    background: "#0b1220",
    color: "#ffffff",
    border:
      "1px solid #334155",
    outline: "none",
    resize: "vertical",
  },

  outputBox: {
    background: "#0b1220",
    padding: 12,
    borderRadius: 8,
    color: "#38bdf8",
    minHeight: 120,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
  },

  /* =========================
     SUBMISSION RESULT
  ========================= */
  submitResultCard: {
    background: "#0b1220",
    border:
      "1px solid #1e293b",
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    color: "#e2e8f0",
  },

  resultText: {
    margin: "8px 0",
    fontWeight: 700,
    color: "#f8fafc",
  },

  resultDetails: {
    background: "#111c2f",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    color: "#d1d5db",
  },

  testList: {
    marginTop: 12,
  },

  testHeading: {
    color: "#38bdf8",
  },

  testItem: {
    background: "#1e293b",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    color: "#e2e8f0",
  },

  /* =========================
     OVERLAY
  ========================= */
  overlay: {
    position: "fixed",
    top: 68,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "rgba(0,0,0,0.55)",
    zIndex: 90,
  },
};