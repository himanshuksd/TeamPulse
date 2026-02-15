import "../styles/home.css";
import { Link, useNavigate } from "react-router-dom";
import Showcase from "../components/Showcase";
import Stats from "../components/Stats";
import { useEffect, useState } from "react";

function Home() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleStart = () => {
        if (isLoggedIn) {
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <h2>TeamPulse</h2>
                <div>
                   
                    <Link to="/dashboard" className="nav-btn primary">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="container hero-content">
                    <div>
                        <h1>Lead With Confidence.</h1>
                        <p>
                            TeamPulse gives you real-time visibility into your team’s
                            progress, workload, and momentum — so you can make
                            smarter decisions with clarity.
                        </p>
                        <button onClick={handleStart} className="primary-btn">
                            Get Started Free
                        </button>
                    </div>

                    <div className="mockup">
                        <img
                            src="/images/dashboard.png"
                            alt="TeamPulse Dashboard"
                            className="hero-image"
                        />
                    </div>
                </div>
            </section>

            {/* Problem */}
            <section className="container about">
                <h2 className="section-title">Why Teams Lose Clarity</h2>
                <p className="about-text">
                    Scattered updates, unclear ownership, and hidden delays make it
                    difficult for leaders to understand the true progress of their teams.
                    Without visibility, confidence suffers.
                </p>
            </section>

            {/* Solution */}
            <section className="container">
                <h2 className="section-title">How TeamPulse Helps</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Real-Time Visibility</h3>
                        <p>See what’s happening across all projects instantly.</p>
                    </div>

                    <div className="feature-card">
                        <h3>Momentum Tracking</h3>
                        <p>Monitor completion trends and performance signals.</p>
                    </div>

                    <div className="feature-card">
                        <h3>Workload Balance</h3>
                        <p>Identify overload and reduce team burnout.</p>
                    </div>
                </div>
            </section>

            {/* Live Stats */}
            <Stats />

            {/* Showcase */}
            <Showcase />

            {/* CTA */}
            <section className="cta">
                <h2>Start Leading With Confidence Today</h2>
                <button onClick={handleStart} className="primary-btn">
                    Try TeamPulse
                </button>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2026 TeamPulse. All rights reserved.</p>
            </footer>
        </>
    );
}

export default Home;