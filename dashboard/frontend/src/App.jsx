import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/Login.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx"; // adjust path if needed
export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [authed, setAuthed] = useState(() =>
    Boolean(localStorage.getItem("recruitos_token")),
  );

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

  // 2. Standard Candidate Flow
  function handleLogout() {
    localStorage.removeItem("recruitos_token");
    localStorage.removeItem("recruitos_candidate");
    setAuthed(false);
  }

  if (!authed) {
    return <Login onLoginSuccess={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
