import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StockDashboard from "../components/StockDashboard.jsx";

export default function DashboardPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (!currentUser) return null;

  return (
    <div className="screen dashboard-screen">
      <div className="dashboard-shell">
        <header className="shell-header">
          <div className="shell-title-block">
            <h1>Live Stock Dashboard</h1>
            <span>Monitor your subscribed tickers in real time</span>
          </div>

          <div className="shell-actions">
            <button className="header-pill" onClick={toggleTheme}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <span className="header-pill">Signed in as {currentUser}</span>
            <button className="header-pill logout-pill" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-main">
          {/* StockDashboard already renders left (supported) + right (subscribed) panels */}
          <StockDashboard currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
