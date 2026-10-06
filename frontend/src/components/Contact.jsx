import React, { useState } from "react";
import api from "../api";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await api.post(
        "/contact",
        {
          email: formData.email,
          message: formData.message,
        },
        { timeout: 10000 }
      );

      console.log("CONTACT RESPONSE:", res.data);

      setStatus(res.data.msg || "✅ Message sent");
      setFormData({ email: "", message: "" });

    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.msg || error?.message || "Server not responding";
      setStatus(`❌ ${message}`);
    } finally {
      setLoading(false); // ⭐ MOST IMPORTANT LINE
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="5"
            required
          ></textarea>

          <button type="submit" className="contact-btn" disabled={loading}>
            {loading ? "Submitting..." : "Send Message"}
          </button>

          {status && (
            <p
              className="status"
              style={{
                marginTop: "10px",
                color: status.includes("❌") ? "red" : "green",
              }}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
