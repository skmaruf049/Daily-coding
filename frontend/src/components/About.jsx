import React from "react";
import "./About.css";

export default function About() {
  // Store both name and role
  const team = [
    { name: "Faiz Nagpurwala", role: "Frontend Developer" },
    { name: "Maruf", role: "Dashboard Developer" },
    { name: "Satyam Gupta", role: "Full-Stack Developer" },
  ];

  return (
    <div id="About" className="about-container">
      {/* HEADER */}
      <h1 className="about-title">
        About <span>DailyCode</span>
      </h1>

      <p className="about-subtext">
        Helping students & developers grow through structured coding challenges,
        real-world projects, and community support.
      </p>

      {/* MAIN SECTION */}
      <div className="about-grid">
        {/* Mission */}
        <div className="about-card">
          <h2 className="card-title">Our Mission</h2>
          <p className="card-text">
            Our mission is to make coding simple and accessible for everyone.
            Whether you're just starting out or already an experienced programmer,
            we help you grow through hands-on challenges, mini coding tasks,
            real-world projects, and interview-focused practice.
            We believe that learning programming should be easy, engaging, and
            practical—one small step (and one small code task) at a time.
          </p>
        </div>

        {/* Offer */}
        <div className="about-card">
          <h2 className="card-title">What We Offer</h2>
          <ul className="offer-list">
            <li>Daily coding challenges</li>
            <li>Learning coding in competitive environment</li>
            <li>Interview-level coding questions</li>
            <li>Clean UI & easy learning experience</li>
            <li> Community guidance</li>
          </ul>
        </div>
      </div>

      {/* TEAM ROLES SECTION */}
      <h2 className="team-title">Choose Your Programming Language</h2>

      <div className="role-grid">
        <div className="role-card">
          <h3 className="role-name">Python</h3>
          <p className="role-desc">Dive into data and intelligent systems.</p>
          <button className="role-btn">Explore</button>
        </div>

        <div className="role-card">
          <h3 className="role-name">Java</h3>
          <p className="role-desc">Master algorithms and problem-solving.</p>
          <button className="role-btn">Explore</button>
        </div>

        <div className="role-card">
          <h3 className="role-name">JavaScript</h3>
          <p className="role-desc">Craft beautiful UIs and responsive layouts.</p>
          <button className="role-btn">Explore</button>
        </div>

        <div className="role-card">
          <h3 className="role-name">C/C++</h3>
          <p className="role-desc">Build scalable APIs and server logic.</p>
          <button className="role-btn">Explore</button>
        </div>
      </div>

      {/* TEAM SECTION */}
      <h2 className="team-title">Meet the Team</h2>

      <div className="team-grid">
        {team.map((member, index) => (
          <div key={index} className="team-card">
            <div className="team-avatar">{member.name[0]}</div>
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}