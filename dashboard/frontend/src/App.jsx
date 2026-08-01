import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/Login.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx"; // adjust path if needed
import LandingPage from "./components/Landingpage .jsx";

function LoginRoute({ onLoginSuccess }) {
  const navigate = useNavigate();
  return (
    <Login
      onLoginSuccess={() => {
        onLoginSuccess();
        navigate("/dashboard");
      }}
    />
  );
}

function DashboardRoute({ authed, onLogout }) {
  if (!authed) return <Navigate to="/login" replace />;
  return <Dashboard onLogout={onLogout} />;
}

export default function App() {
  const [authed, setAuthed] = useState(() =>
    Boolean(localStorage.getItem("recruitos_token")),
  );

  function handleLogout() {
    localStorage.removeItem("recruitos_token");
    localStorage.removeItem("recruitos_candidate");
    setAuthed(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin bypasses candidate auth entirely, same as before */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Login redirects to dashboard if already authed */}
        <Route
          path="/login"
          element={
            authed ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginRoute onLoginSuccess={() => setAuthed(true)} />
            )
          }
        />

        {/* Dashboard requires auth, bounces to /login otherwise */}
        <Route
          path="/dashboard"
          element={<DashboardRoute authed={authed} onLogout={handleLogout} />}
        />

        {/* Fallback: unknown paths go back to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
