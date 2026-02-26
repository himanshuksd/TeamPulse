import api from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import zxcvbn from "zxcvbn";
import "../styles/signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔥 password strength
  const strength = zxcvbn(password);
  const score = password ? strength.score : 0;

  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "#ef4444",
    "#f59e0b",
    "#eab308",
    "#22c55e",
    "#16a34a",
  ];

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const canSubmit =
    name.trim() &&
    email.trim() &&
    password.length >= 6 &&
    passwordsMatch &&
    score >= 2 &&
    !loading;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await api.post("/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSignup}>
        <h2 className="signup-title">Create Account 🚀</h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Full name"
          autoComplete="name"
          className="signup-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          className="signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          className="signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔥 Strength meter */}
        {password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div
                className="strength-fill"
                style={{
                  width: `${(score + 1) * 20}%`,
                  background: strengthColors[score],
                }}
              />
            </div>
            <span
              className="strength-text"
              style={{ color: strengthColors[score] }}
            >
              {strengthLabels[score]}
            </span>
          </div>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          className="signup-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Match indicator */}
        {confirmPassword && (
          <p className={passwordsMatch ? "signup-success" : "signup-error"}>
            {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
          </p>
        )}

        {error && <p className="signup-error">{error}</p>}
        {success && <p className="signup-success">{success}</p>}

        <button type="submit" className="signup-button" disabled={!canSubmit}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
