import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function PrivateRoute({ children }) {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [theme, setTheme] = useState("dark"); // "dark" | "light"

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className={`app-root theme-${theme}`}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={<LoginPage theme={theme} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage theme={theme} toggleTheme={toggleTheme} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
