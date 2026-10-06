// Design tokens for the DailyCode admin dashboard.
// One source of truth so every admin page reads the same palette/type scale
// instead of re-declaring near-duplicate hex values.

export const color = {
  bg: "#0b1220",
  surface: "#111a2e",
  surfaceRaised: "#16213b",
  border: "#1f2b44",
  borderSoft: "#1a2438",

  textPrimary: "#eef2f8",
  textSecondary: "#90a0b7",
  textTertiary: "#5b6b84",

  accent: "#4ea8ff",
  accentSoft: "rgba(78, 168, 255, 0.12)",
  accentBorder: "rgba(78, 168, 255, 0.35)",

  success: "#34d399",
  successSoft: "rgba(52, 211, 153, 0.12)",
  danger: "#f87171",
  dangerSoft: "rgba(248, 113, 113, 0.12)",
  warning: "#fbbf24",
  warningSoft: "rgba(251, 191, 36, 0.12)",

  gold: "#f5c451",
  silver: "#c9d3e0",
  bronze: "#d38b5d",
};

export const font = {
  ui: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  mono: `"JetBrains Mono", "Courier New", monospace`,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const shadow = {
  card: "0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px rgba(0,0,0,0.28)",
  raised: "0 1px 0 rgba(255,255,255,0.03) inset, 0 16px 40px rgba(0,0,0,0.4)",
};

// ---- Shared primitives (plain style objects; components below compose them) ----

export const page = {
  minHeight: "100%",
  color: color.textPrimary,
  fontFamily: font.ui,
};

export const pageHeader = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 24,
  flexWrap: "wrap",
};

export const pageTitle = {
  fontSize: 22,
  fontWeight: 700,
  color: color.textPrimary,
  margin: 0,
  letterSpacing: "-0.01em",
};

export const pageSubtitle = {
  fontSize: 14,
  color: color.textSecondary,
  margin: "4px 0 0",
};

export const card = {
  background: color.surface,
  border: `1px solid ${color.border}`,
  borderRadius: radius.lg,
  boxShadow: shadow.card,
};

export const input = {
  background: color.bg,
  border: `1px solid ${color.border}`,
  borderRadius: radius.sm,
  padding: "9px 12px",
  color: color.textPrimary,
  fontSize: 14,
  fontFamily: font.ui,
  outline: "none",
};

export const buttonPrimary = {
  background: color.accent,
  border: "none",
  color: "#06121f",
  fontWeight: 600,
  fontSize: 14,
  padding: "10px 16px",
  borderRadius: radius.sm,
  cursor: "pointer",
};

export const buttonGhost = {
  background: "transparent",
  border: `1px solid ${color.border}`,
  color: color.textPrimary,
  fontWeight: 500,
  fontSize: 14,
  padding: "9px 15px",
  borderRadius: radius.sm,
  cursor: "pointer",
};

export const buttonDanger = {
  background: color.dangerSoft,
  border: `1px solid rgba(248,113,113,0.3)`,
  color: color.danger,
  fontWeight: 500,
  fontSize: 13,
  padding: "7px 12px",
  borderRadius: radius.sm,
  cursor: "pointer",
};
