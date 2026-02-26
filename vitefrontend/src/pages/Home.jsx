import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet";

// ✅ lazy imports
const Showcase = lazy(() => import("../components/Showcase"));
const Stats = lazy(() => import("../components/Stats"));

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ check auth once on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  // ✅ AOS init (safe)
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const handleStart = () => {
    navigate(isLoggedIn ? "/dashboard" : "/login");
  };

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <title>TeamPulse | Real-Time Team Performance Dashboard</title>
        <meta
          name="description"
          content="Track workload, progress, and team momentum in real-time with TeamPulse."
        />
      </Helmet>

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <h2>TeamPulse</h2>

        <div>
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="nav-btn primary"
              aria-label="Go to dashboard"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="nav-btn primary"
              aria-label="Get started"
            >
              Get Started
            </button>
          )}
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-left" data-aos="fade-right">
            <h1>Lead With Confidence.</h1>

            <p>
              TeamPulse gives you real-time visibility into your team’s
              progress, workload, and momentum — so you can make smarter
              decisions with clarity.
            </p>

            <button onClick={handleStart} className="primary-btn">
              Get Started Free
            </button>
          </div>

          <div className="mockup" data-aos="fade-left">
            <img
              src="/images/dashboard.png"
              alt="TeamPulse dashboard showing project analytics and charts"
              className="hero-image"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section className="container about" data-aos="fade-up">
        <h2 className="section-title">Why Teams Lose Clarity</h2>

        <p className="about-text">
          Scattered updates, unclear ownership, and hidden delays make it
          difficult for leaders to understand the true progress of their teams.
          Without visibility, confidence suffers.
        </p>
      </section>

      {/* ================= SOLUTION ================= */}
      <section className="container">
        <h2 className="section-title" data-aos="fade-up">
          How TeamPulse Helps
        </h2>

        <div className="features-grid">
          <div className="feature-card" data-aos="fade-up">
            <h3>Real-Time Visibility</h3>
            <p>See what’s happening across all projects instantly.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="150">
            <h3>Momentum Tracking</h3>
            <p>Monitor completion trends and performance signals.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <h3>Workload Balance</h3>
            <p>Identify overload and reduce team burnout.</p>
          </div>
        </div>
      </section>

      {/* ================= LAZY SECTIONS ================= */}
      <Suspense
        fallback={
          <div style={{ textAlign: "center", padding: "40px" }}>Loading…</div>
        }
      >
        <Stats />
        <Showcase />
      </Suspense>

      {/* ================= CTA ================= */}
      <section className="cta" data-aos="zoom-in">
        <h2>Start Leading With Confidence Today</h2>

        <button onClick={handleStart} className="primary-btn">
          Try TeamPulse
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} TeamPulse. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Home;
