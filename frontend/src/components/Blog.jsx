import React from "react";
import "./Blog.css";

const blogPosts = [
  {
    title: "Why Daily Coding Matters",
    summary:
      "Discover how small daily challenges build long-term mastery and confidence.",
    
    link: "https://www.coolerlearning.com/building-confidence-through-small-daily-challenges/", // internal route or external link
  },
  {
    title: "Frontend vs Backend: Where to Start?",
    summary:
      "Explore the strengths of each path and how to choose based on your goals.",
    
    link: "https://youtu.be/RnIwE8ezAFo?si=TaCg9J-PVhQpwt3r",
  },
  {
    title: "DSA for Interviews: A Smart Strategy",
    summary:
      "Learn how to prepare for coding interviews with focused DSA practice.",
    
    link: "https://medium.com/javarevisited/how-to-prepare-data-structures-and-algorithms-for-coding-interviews-9ae1f9b73111",
  },
];

export default function Blog() {
  return (
    <div className="blog-container" id="Blog">
      <h1 className="blog-title">
        DailyCode <span>Blog</span>
      </h1>
      <p className="blog-subtext">
        Insights, strategies, and stories from our developer community.
      </p>

      <div className="blog-grid">
        {blogPosts.map((post, index) => (
          <div key={index} className="blog-card">
            <h2 className="blog-card-title">{post.title}</h2>
            <p className="blog-card-summary">{post.summary}</p>
            <div className="blog-meta">
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
            {/* Read More link */}
            <a href={post.link} className="blog-read-btn">
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}