import React from "react";
import "./Footer.css";
import logoIcon from "../assets/logo-icon.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ================= LOGO ================= */}
        <div className="footer-logo">

          {/* LEFT SIDE - IMAGE */}
          <img
            src={logoIcon}
            alt="DailyCode Logo"
            className="footer-logo-icon"
          />

          {/* RIGHT SIDE - HTML/CSS TEXT */}
          <div className="footer-logo-content">

            <div className="footer-brand">
              <span className="footer-daily">Daily</span>
              <span className="footer-code">Code</span>
            </div>

            <div className="footer-tagline">
              ONLINE CODING PLATFORM
            </div>

          </div>
        </div>

        {/* ================= NAVIGATION ================= */}
        <ul className="footer-links">
          <li>
            <a href="#homePage">Home</a>
          </li>

          <li>
            <a href="#About">About Us</a>
          </li>

          <li>
            <a href="#Blog">Blog</a>
          </li>

          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>

        {/* ================= SOCIAL ICONS ================= */}
        <div className="footer-social">

          <button
            type="button"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </button>

          <button
            type="button"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </button>

          <button
            type="button"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </button>

        </div>

        {/* ================= COPYRIGHT ================= */}
        <p className="footer-copy">
          © {new Date().getFullYear()} DailyCode. All rights reserved.
        </p>

      </div>
    </footer>
  );
}