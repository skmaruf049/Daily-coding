import { color, font, radius, card, pageHeader, pageTitle, pageSubtitle, input } from "./theme";
import { SearchIcon } from "./icons";

/* ---------------- Stat card (Overview) ---------------- */
export function StatCard({ label, value, icon, onClick, accent = color.accent }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        ...card,
        padding: 20,
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13.5, color: color.textSecondary, fontWeight: 500 }}>{label}</span>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.sm,
            background: `${accent}1f`,
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 32,
          fontWeight: 700,
          color: color.textPrimary,
          lineHeight: 1,
        }}
      >
        {value ?? "–"}
      </span>
    </div>
  );
}

/* ---------------- Page header (title + subtitle + actions slot) ---------------- */
export function PageHeader({ title, subtitle, children }) {
  return (
    <div style={pageHeader}>
      <div>
        <h1 style={pageTitle}>{title}</h1>
        {subtitle && <p style={pageSubtitle}>{subtitle}</p>}
      </div>
      {children && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>}
    </div>
  );
}

/* ---------------- Empty state ---------------- */
export function EmptyState({ title, hint }) {
  return (
    <div
      style={{
        padding: "48px 20px",
        textAlign: "center",
        color: color.textSecondary,
      }}
    >
      <p style={{ margin: 0, fontSize: 15, color: color.textPrimary, fontWeight: 600 }}>{title}</p>
      {hint && <p style={{ margin: "6px 0 0", fontSize: 13.5 }}>{hint}</p>}
    </div>
  );
}

/* ---------------- Loading skeleton rows ---------------- */
export function SkeletonRows({ rows = 4 }) {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 44,
            borderRadius: radius.sm,
            background:
              "linear-gradient(90deg, #131d33 0%, #182746 50%, #131d33 100%)",
            backgroundSize: "200% 100%",
            animation: "adminShimmer 1.4s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`@keyframes adminShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

/* ---------------- Avatar (initials) ---------------- */
export function Avatar({ name, size = 32 }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color.accentSoft,
        color: color.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

/* ---------------- Status badge ---------------- */
const badgeTones = {
  success: { bg: color.successSoft, fg: color.success },
  danger: { bg: color.dangerSoft, fg: color.danger },
  warning: { bg: color.warningSoft, fg: color.warning },
  neutral: { bg: color.accentSoft, fg: color.accent },
};
export function Badge({ children, tone = "neutral" }) {
  const t = badgeTones[tone] || badgeTones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        background: t.bg,
        color: t.fg,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ---------------- Search input ---------------- */
export function SearchInput({ value, onChange, placeholder = "Search" }) {
  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 11,
          top: "50%",
          transform: "translateY(-50%)",
          color: color.textTertiary,
          display: "flex",
        }}
      >
        <SearchIcon size={15} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...input, paddingLeft: 32, width: 220 }}
      />
    </div>
  );
}

/* ---------------- Table shell ---------------- */
export function TableCard({ children }) {
  return <div style={{ ...card, overflow: "hidden" }}>{children}</div>;
}

export const tableStyles = {
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: 12.5,
    fontWeight: 600,
    color: color.textSecondary,
    borderBottom: `1px solid ${color.border}`,
    background: color.surfaceRaised,
  },
  td: {
    padding: "13px 16px",
    fontSize: 14,
    color: color.textPrimary,
    borderBottom: `1px solid ${color.borderSoft}`,
    verticalAlign: "middle",
  },
  trHover: { background: "transparent" },
};
