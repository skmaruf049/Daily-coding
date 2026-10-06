import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage({ isLogin, onLogin }) {
  const navigate = useNavigate();

  const handleStartCoding = (e) => {
    e.preventDefault();

    if (!isLogin) {
      // User is not logged in → open login modal
      onLogin();
    } else {
      // User is logged in → go to editor
      navigate("/editor");
    }
  };

  return (
    <section id="homePage" className="homepage">

      <div className="hero">

        {/* =====================================================
            LEFT SIDE - HERO TEXT
        ===================================================== */}

        <div className="hero-text">

          <motion.h1
            className="title"
            initial={{
              opacity: 0,
              y: -50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            Welcome to{" "}
            <span className="accent">
              DailyCode
            </span>
          </motion.h1>


          <p className="subtitle">
            🚀 Daily Coding Challenges — Short tasks in
            Python, JavaScript, C++, Java and more.
            <strong> Levels:</strong> Easy / Medium / Hard
          </p>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="cta-row">

            {/* START CODING */}

            <button
              className="cta"
              onClick={handleStartCoding}
            >
              <span>Start Coding</span>
              <span className="arrow">→</span>
            </button>


            {/* LEARN MORE */}

            <a
              className="learn"
              href="https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Learn More</span>
              <span className="arrow">→</span>
            </a>

          </div>

        </div>


        {/* =====================================================
            RIGHT SIDE - HERO IMAGE
        ===================================================== */}

        <div className="hero-image">

          <img
            src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif"
            alt="Developer at work"
          />

        </div>

      </div>

    </section>
  );
}