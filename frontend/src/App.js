import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import AuthPage from "./components/login";
import CodeEditor from "./components/Code_editor";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./AdminDashboard";
import Profile from "./pages/userDash"; // ✅ ADD THIS

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<AuthPage />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= USER ================= */}
      <Route
        path="/editor"
        element={
          <ProtectedRoute role="user">
            <CodeEditor />
          </ProtectedRoute>
        }
      />

      {/* ✅ USER PROFILE (IMPORTANT) */}
      <Route
        path="/userDash"
        element={
          <ProtectedRoute role="user">
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
