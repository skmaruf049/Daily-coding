import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HomePage from "../components/Homepage";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import LoginPage from "../components/login";
import Blog from "../components/Blog";

export default function Main() {
  const [showLogin, setShowLogin] = useState(false);

  //  SOURCE OF TRUTH
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  //  refresh par sync (extra safety)
  useEffect(() => {
    const status = localStorage.getItem("isLogin");
    setIsLogin(status === "true");
  }, []);

  return (
    <div>
      {/* ✅ NAVBAR */}
      <Navbar 
        isLogin={isLogin}
        onLogin={() => setShowLogin(true)}
        onLogout={() => {
          localStorage.clear();
          setIsLogin(false);
        }}
      />

      {/* ✅ PAGES */}
      <HomePage isLogin={isLogin} onLogin={() => setShowLogin(true)} />
      <About />
      <Blog />
      <Contact />
      <Footer />

      {/* ✅ LOGIN MODAL */}
      {showLogin && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeBtn}
              onClick={() => setShowLogin(false)}
            >
              ✖
            </button>

            <LoginPage
              onSuccess={() => {
                // 🔥 MOST IMPORTANT FIX
                setIsLogin(true);
                setShowLogin(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.8)", // dark background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    animation: "fadeIn 0.3s ease", // smooth fade-in
  },
  modal: {
    background: "rgba(255,255,255,0.05)", // glassmorphism
    backdropFilter: "blur(12px)",
    borderRadius: "0", // fullscreen look
    padding: "3rem",
    width: "100%", // full width
    height: "100%", // full height
    color: "white",
    position: "relative",
    overflowY: "auto", // scroll if content is long
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "none",
    border: "none",
    fontSize: "2rem",
    color: "white",
    cursor: "pointer",
  },
};