import Leaderboard from "./Leaderboard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import logoIcon from "../assets/logo-icon.png";

export default function UserDash() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <div>
      {/* Top Navbar */}
      <header style={styles.topbar}>
        <div style={styles.brand}>
          {/* DailyCode Logo Icon */}
          <img
            src={logoIcon}
            alt="DailyCode Logo"
            style={styles.logoIcon}
          />

          {/* DailyCode Text */}
          <div style={styles.brandText}>
            <div style={styles.logo}>
              <span style={styles.daily}>Daily</span>
              <span style={styles.code}>Code</span>
            </div>

            <div style={styles.tagline}>
              ONLINE CODING PLATFORM
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <Leaderboard />

      <Footer />
    </div>
  );
}

const styles = {
  topbar: {
    minHeight: 68,
    background: "#080d1b",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 50,
    borderBottom: "1px solid rgba(56, 189, 248, 0.12)",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 11,
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
    fontSize: "1.55rem",
    fontWeight: 800,
    letterSpacing: "0.5px",
    margin: 0,
    lineHeight: 1.1,
  },

  daily: {
    color: "#00aaff",
  },

  code: {
    color: "#ffffff",
  },

  tagline: {
    color: "#718096",
    fontSize: "0.52rem",
    fontWeight: 600,
    letterSpacing: "1.5px",
    marginTop: 4,
  },

  logoutBtn: {
    background: "transparent",
    border: "1px solid #ef4444",
    color: "#ef4444",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
};