import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
export default function AuthPage({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  // ✅ VALIDATION
  const Validate = {
    name: (v) => {
      if (!v.trim()) return "Name is required";
      if (v.length < 5) return "Name must be at least 5 characters";
      return "";
    },
    email: (v) => {
      if (!v.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return "Invalid email format";
      return "";
    },
    password: (v) => {
      if (!v.trim()) return "Password is required";
      if (v.length < 6) return "Password must be at least 6 characters";
      return "";
    },
    cpassword: (p, cp) => {
      if (p !== cp) return "Passwords do not match";
      return "";
    },
  };
  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  // ✅ SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    let error = "";

    if (isLogin) {
      error =
        Validate.email(form.email) ||
        Validate.password(form.password);
    } else {
      error =
        Validate.name(form.name) ||
        Validate.email(form.email) ||
        Validate.password(form.password) ||
        Validate.cpassword(form.password, form.cpassword);
    }

    if (error) {
      setMessage(error);
      return;
    }

    try {
      if (isLogin) {
        // 🔐 LOGIN

        const res = await api.post("/auth/login",
          {
            email: form.email,
            password: form.password,
          });
        console.log("LOGIN RESPONSE 👉", res.data);
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("email", form.email);
        localStorage.setItem("role", res.data.role); // 🔥 IMPORTANT

        if (onSuccess) {
          onSuccess();
        }

        // 🔀 ROLE BASED REDIRECT
        if (res.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }

      } else {
        // 📝 SIGNUP
        const res = await api.post("/auth/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        alert(res.data.message);
        setIsLogin(true);
      }
    } catch (err) {
      // ✅ ONLY REAL API ERRORS
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        console.log("Non-API error 👉", err);
      }
    }
  };

  return (
    <div id="auth" style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>
        <p style={styles.subtitle}>
          {isLogin
            ? "Login to continue your DailyCode journey"
            : "Register to start your DailyCode journey"}
        </p>
        {message && <p style={{ color: "red" }}>{message}</p>}

        <form style={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleForm}
              style={styles.input}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleForm}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleForm}
            style={styles.input}
          />

          {!isLogin && (
            <input
              type="password"
              name="cpassword"
              placeholder="Confirm Password"
              value={form.cpassword}
              onChange={handleForm}
              style={styles.input}
            />
          )}

          <button type="submit" style={styles.button}>
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p style={styles.footer}>
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <span style={styles.link} onClick={() => setIsLogin(false)}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={styles.link} onClick={() => setIsLogin(true)}>
                Log in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    fontFamily: "sans-serif",
    padding: "1rem",
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "400px",
    color: "white",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#38bdf8",
  },
  subtitle: {
    fontSize: "0.95rem",
    marginBottom: "1.5rem",
    color: "#e5e7eb",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    fontSize: "1rem",
    background: "rgba(255,255,255,0.2)",
    color: "white",
  },
  button: {
    padding: "0.9rem",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  footer: {
    marginTop: "1.5rem",
    fontSize: "0.9rem",
    color: "#d1d5db",
  },
  link: {
    color: "#38bdf8",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
