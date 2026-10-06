import {
  Routes,
  Route,
  useNavigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Dashboard from "./AdminPannel/Dashboard";
import Users from "./pages/Users";
import Problems from "./pages/Problems";
import Feedback from "./pages/Feedback";
import Leaderboard from "./pages/Leaderboard";
import Footer from "./components/Footer";

import { color, font } from "./AdminPannel/theme";

import {
  GridIcon,
  UsersIcon,
  ProblemsIcon,
  FeedbackIcon,
  TrophyIcon,
  LogoutIcon,
  MenuIcon,
} from "./AdminPannel/icons";

import logoIcon from "./assets/logo-icon.png";

/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export default function AdminDashboard() {
  return (
    <>
      <AdminLayout />
      <Footer />
    </>
  );
}

/* =====================================================
   MENU
===================================================== */

const MENU = [
  {
    path: "/admin/dashboard",
    label: "Overview",
    Icon: GridIcon,
  },
  {
    path: "/admin/dashboard/users",
    label: "Users",
    Icon: UsersIcon,
  },
  {
    path: "/admin/dashboard/problems",
    label: "Problems",
    Icon: ProblemsIcon,
  },
  {
    path: "/admin/dashboard/feedback",
    label: "Feedback",
    Icon: FeedbackIcon,
  },
  {
    path: "/admin/dashboard/leaderboard",
    label: "Leaderboard",
    Icon: TrophyIcon,
  },
];

/* =====================================================
   ADMIN LAYOUT
===================================================== */

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768
  );

  const navigate = useNavigate();
  const location = useLocation();

  /* =========================
     RESPONSIVE SIDEBAR
  ========================= */

  useEffect(() => {
    const onResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* =========================
     ACTIVE MENU
  ========================= */

  const active = MENU.find((m) =>
    m.path === "/admin/dashboard"
      ? location.pathname === m.path ||
        location.pathname === m.path + "/"
      : location.pathname.startsWith(m.path)
  );

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.clear();

    navigate("/login", {
      replace: true,
    });

    window.location.reload();
  };

  return (
    <div style={styles.app}>
      {/* =================================================
          TOP BAR
      ================================================= */}

      <header style={styles.topbar}>
        {/* LEFT SIDE */}
        <div style={styles.leftSection}>
          {/* MENU BUTTON */}
          <button
            style={styles.menuBtn}
            onClick={() =>
              setSidebarOpen((prev) => !prev)
            }
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>

          {/* LOGO */}
          <div style={styles.brand}>
            <img
              src={logoIcon}
              alt="DailyCode Logo"
              style={styles.logoIcon}
            />

            <div style={styles.brandText}>
              <div style={styles.logo}>
                <span style={styles.daily}>
                  Daily
                </span>

                <span style={styles.code}>
                  Code
                </span>
              </div>

              <div style={styles.tagline}>
                ONLINE CODING PLATFORM
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <span style={styles.crumbDivider}>
            /
          </span>

          {/* CURRENT PAGE */}
          <span style={styles.crumbCurrent}>
            {active?.label || "Admin"}
          </span>
        </div>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          <LogoutIcon size={15} />
          <span>Log out</span>
        </button>
      </header>

      {/* =================================================
          LAYOUT
      ================================================= */}

      <div style={styles.layout}>
        {/* SIDEBAR */}

        <Sidebar
          sidebarOpen={sidebarOpen}
          closeSidebar={() => {
            if (window.innerWidth <= 768) {
              setSidebarOpen(false);
            }
          }}
        />

        {/* MAIN CONTENT */}

        <main style={styles.content}>
          <Routes>
            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="users"
              element={<Users />}
            />

            <Route
              path="problems"
              element={<Problems />}
            />

            <Route
              path="feedback"
              element={<Feedback />}
            />

            <Route
              path="leaderboard"
              element={<Leaderboard />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* =====================================================
   SIDEBAR
===================================================== */

function Sidebar({
  sidebarOpen,
  closeSidebar,
}) {
  return (
    <>
      {/* MOBILE OVERLAY */}

      {sidebarOpen &&
        window.innerWidth <= 768 && (
          <div
            style={styles.overlay}
            onClick={closeSidebar}
          />
        )}

      {/* SIDEBAR */}

      <aside
        style={{
          ...styles.sidebar,
          transform: sidebarOpen
            ? "translateX(0)"
            : "translateX(-100%)",
        }}
      >
        <nav style={styles.nav}>
          {MENU.map(
            ({
              path,
              label,
              Icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                end={
                  path ===
                  "/admin/dashboard"
                }
                onClick={closeSidebar}
                style={({
                  isActive,
                }) => ({
                  ...styles.navItem,

                  background: isActive
                    ? color.accentSoft
                    : "transparent",

                  color: isActive
                    ? color.accent
                    : color.textSecondary,
                })}
              >
                <Icon size={17} />

                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>
      </aside>
    </>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = {
  /* =========================
     APP
  ========================= */

  app: {
    minHeight: "100vh",
    background: color.bg,
    color: color.textPrimary,
    fontFamily: font.ui,
  },

  /* =========================
     TOP BAR
  ========================= */

  topbar: {
    height: 68,
    background: "#080d1b",
    borderBottom:
      "1px solid rgba(56,189,248,0.12)",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    padding: "0 20px",

    position: "sticky",
    top: 0,

    zIndex: 50,

    boxShadow:
      "0 4px 15px rgba(0,0,0,0.25)",
  },

  /* =========================
     LEFT SECTION
  ========================= */

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: 14,

    minWidth: 0,
  },

  /* =========================
     BRAND
  ========================= */

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,

    flexShrink: 0,
  },

  logoIcon: {
    height: 40,
    width: 40,

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
    fontWeight: 800,
    fontSize: "1.45rem",
    letterSpacing: "0.3px",

    lineHeight: 1.1,

    whiteSpace: "nowrap",
  },

  daily: {
    color: "#00aaff",
  },

  code: {
    color: "#ffffff",
  },

  tagline: {
    color: "#718096",

    fontSize: "0.43rem",

    fontWeight: 600,

    letterSpacing: "1.4px",

    marginTop: 4,

    whiteSpace: "nowrap",
  },

  /* =========================
     BREADCRUMB
  ========================= */

  crumbDivider: {
    color: color.textTertiary,
    fontSize: 14,
  },

  crumbCurrent: {
    color: color.textSecondary,
    fontSize: 14,
    fontWeight: 500,

    whiteSpace: "nowrap",
  },

  /* =========================
     MENU BUTTON
  ========================= */

  menuBtn: {
    background: "none",
    border: "none",

    color: color.textPrimary,

    cursor: "pointer",

    display: "flex",

    alignItems: "center",
    justifyContent: "center",

    padding: 4,
  },

  /* =========================
     LOGOUT
  ========================= */

  logoutBtn: {
    display: "flex",
    alignItems: "center",

    gap: 7,

    background: "transparent",

    border:
      "1px solid rgba(56,189,248,0.25)",

    color: color.textSecondary,

    padding: "7px 13px",

    borderRadius: 8,

    cursor: "pointer",

    fontSize: 13.5,

    fontWeight: 500,

    transition:
      "all 0.2s ease",
  },

  /* =========================
     LAYOUT
  ========================= */

  layout: {
    display: "flex",

    minHeight:
      "calc(100vh - 68px)",
  },

  /* =========================
     SIDEBAR
  ========================= */

  sidebar: {
    width: 232,

    background: color.surface,

    borderRight:
      `1px solid ${color.border}`,

    position: "fixed",

    top: 68,

    bottom: 0,

    left: 0,

    transition:
      "transform 0.22s ease",

    zIndex: 40,

    overflowY: "auto",
  },

  /* =========================
     NAV
  ========================= */

  nav: {
    display: "flex",

    flexDirection: "column",

    padding: 14,

    gap: 3,
  },

  navItem: {
    padding: "10px 12px",

    cursor: "pointer",

    borderRadius: 8,

    display: "flex",

    alignItems: "center",

    gap: 11,

    textDecoration: "none",

    fontSize: 14,

    fontWeight: 500,

    transition:
      "background 0.15s ease, color 0.15s ease",
  },

  /* =========================
     CONTENT
  ========================= */

  content: {
    flex: 1,

    padding:
      "28px 28px 40px",

    marginLeft: 232,

    minWidth: 0,
  },

  /* =========================
     MOBILE OVERLAY
  ========================= */

  overlay: {
    position: "fixed",

    inset: 0,

    background:
      "rgba(0,0,0,0.5)",

    zIndex: 30,
  },
};

/* =====================================================
   RESPONSIVE
===================================================== */

if (window.innerWidth <= 768) {
  styles.sidebar.top = 68;

  styles.content.marginLeft = 0;
}