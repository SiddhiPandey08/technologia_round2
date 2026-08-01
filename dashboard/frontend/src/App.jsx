import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/Login.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx"; // adjust path if needed
import MissionComplete from "./components/MissionComplete.jsx";
import LandingPage from "./components/Landingpage.jsx";
export default function App() {
  const [authed, setAuthed] = useState(() =>
    Boolean(localStorage.getItem("recruitos_token")),
  );
  const [pathname, setPathname] = useState(window.location.pathname);

  // Listen for navigation or URL changes
  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 1. If the URL is /admin, bypass student login and show the Admin Dashboard
  if (pathname === "/admin" || pathname === "/admin/") {
    return <AdminDashboard />;
  }

  // Check for Mission Complete Page
  if (pathname === "/complete" || pathname === "/complete/") {
    return <MissionComplete />;
  }

  // 2. Standard Candidate Flow
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
              <Login onLoginSuccess={() => setAuthed(true)} />
            )
          }
        />

        {/* Dashboard requires auth, bounces to /login otherwise */}
        <Route
          path="/dashboard"
          element={<Dashboard authed={authed} onLogout={handleLogout} />}
        />

        {/* Fallback: unknown paths go back to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
