import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double click

    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Replace with real API
      await new Promise((res) => setTimeout(res, 800));

      // optional remember logic
      if (remember) {
        localStorage.setItem("rememberEmail", email);
      }

      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={login}>
        <h2 className="login-title">Welcome Back 👋</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        {/* Password */}
        <div className="password-wrapper">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <span
            className="toggle-password"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "Hide" : "Show"}
          </span>
        </div>

        {/* Options row */}
        <div className="login-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>

        {error && <p className="login-error">{error}</p>}

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}