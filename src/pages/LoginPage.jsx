import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ theme, toggleTheme }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // If already logged in, go directly to dashboard
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    localStorage.setItem("currentUser", email);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="screen login-screen">
      <div className="login-shell">
        <div className="login-header-row">
          <button className="mode-pill" onClick={toggleTheme}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>

        <h1 className="login-title">Stock Broker Dashboard</h1>
        <p className="login-subtitle">
          Sign in with your email to view live stock prices.
        </p>

        <div className="login-label">Email address</div>

        <div className="login-form">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          <button onClick={handleLogin}>Login</button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
