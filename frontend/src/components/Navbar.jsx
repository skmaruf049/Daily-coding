import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logoIcon from "../assets/logo-icon.png";
import "./navbar.css";

export default function Navbar({ isLogin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  /* =========================
     LOAD USER DATA
  ========================= */

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setEmail(localStorage.getItem("email") || "");
    setRole(localStorage.getItem("role") || "");
  }, [isLogin]);

  /* =========================
     CLOSE PROFILE DROPDOWN
  ========================= */

  useEffect(() => {
    if (!profileOpen) return;

    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [profileOpen]);

  /* =========================
     USER INITIAL
  ========================= */

  const firstLetter = name
    ? name.trim().charAt(0).toUpperCase()
    : "U";

  /* =========================
     DASHBOARD
  ========================= */

  const goToDashboard = () => {
    setProfileOpen(false);

    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/userDash");
    }
  };

  /* =========================
     NAVIGATION LINKS
  ========================= */

  const links = [
    {
      name: "Home",
      id: "homePage",
    },
    {
      name: "About Us",
      id: "About",
    },
 
    {
      name: "Blog",
      id: "Blog",
    },
       {
      name: "Contact Us",
      id: "contact",
    },
  ];

  /* =========================
     CLOSE MOBILE MENU
  ========================= */

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* =================================================
          DAILYCODE BRAND
      ================================================= */}

      <Link
        to="/"
        className="dc-brand"
        onClick={() => setMenuOpen(false)}
      >

        {/* LEFT - IMAGE ONLY */}
        <img
          src={logoIcon}
          alt="DailyCode Logo"
          className="dc-brand-icon"
        />

        {/* RIGHT - HTML/CSS */}
        <div className="dc-brand-content">

          <div className="dc-brand-name">
            <span className="dc-daily">Daily</span>
            <span className="dc-code">Code</span>
          </div>

          <div className="dc-brand-tagline">
            ONLINE CODING PLATFORM
          </div>

        </div>

      </Link>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <ul
        className={`nav-links ${
          menuOpen ? "active" : ""
        }`}
      >

        {links.map((link, i) => (
          <li key={i}>
            <a
              href={`#${link.id}`}
              onClick={handleNavClick}
            >
              {link.name}
            </a>
          </li>
        ))}

        {/* =================================================
            AUTH SECTION
        ================================================= */}

        {!isLogin ? (

          <li>
            <Link
              to="/login"
              onClick={handleNavClick}
            >
              Login
            </Link>
          </li>

        ) : (

          <li
            className="profile-container"
            ref={dropdownRef}
          >

            {/* PROFILE BUTTON */}

            <button
              className="dc-avatar"
              onClick={() =>
                setProfileOpen((p) => !p)
              }
              aria-haspopup="true"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              {firstLetter}
            </button>

            {/* PROFILE DROPDOWN */}

            <AnimatePresence>

              {profileOpen && (

                <motion.div
                  className="dc-dropdown"

                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.97,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}

                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.97,
                  }}

                  transition={{
                    duration: 0.16,
                    ease: "easeOut",
                  }}

                  role="menu"
                >

                  {/* USER INFO */}

                  <div className="dc-dropdown-header">

                    <div className="dc-avatar dc-avatar--static">
                      {firstLetter}
                    </div>

                    <div className="dc-dropdown-identity">

                      <p className="dc-dropdown-name">
                        {name || "User"}
                      </p>

                      <p className="dc-dropdown-email">
                        {email}
                      </p>

                    </div>

                  </div>

                  <div className="dc-dropdown-divider" />

                  {/* DASHBOARD */}

                  <button
                    className="dc-dropdown-item"
                    onClick={goToDashboard}
                  >
                    <DashboardIcon />
                    View Dashboard
                  </button>

                  {/* LOGOUT */}

                  <button
                    className="dc-dropdown-item dc-dropdown-item--danger"

                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                      navigate("/login");
                    }}
                  >
                    <LogoutIcon />
                    Logout
                  </button>

                </motion.div>

              )}

            </AnimatePresence>

          </li>

        )}

      </ul>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <button
        className="menu-btn"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "✖" : "☰"}
      </button>

    </nav>
  );
}


/* =====================================================
   DASHBOARD ICON
===================================================== */

function DashboardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="9"
        rx="1.5"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="5"
        rx="1.5"
      />

      <rect
        x="14"
        y="12"
        width="7"
        height="9"
        rx="1.5"
      />

      <rect
        x="3"
        y="16"
        width="7"
        height="5"
        rx="1.5"
      />
    </svg>
  );
}


/* =====================================================
   LOGOUT ICON
===================================================== */

function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

      <path d="M16 17l5-5-5-5" />

      <path d="M21 12H9" />
    </svg>
  );
}