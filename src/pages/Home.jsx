import { Link } from "react-router-dom";
import { Sparkles, BarChart2, ShieldCheck, Zap, ArrowRight, CheckCircle2, TrendingUp, Users } from "lucide-react";

const stats = [
  { label: "Completion Rate", value: "78%", trend: "+12% this sprint" },
  { label: "Risk Score",      value: "Low",  trend: "↓ 3pts this sprint" },
  { label: "TPI Score",       value: "8.4",  trend: "+0.6 this sprint" },
  { label: "Team Velocity",   value: "94%",  trend: "+8% this sprint" },
];

const problems = [
  { icon: "🔍", title: "No Performance Visibility",  desc: "Teams struggle without clear data insights — decisions get made on gut feeling." },
  { icon: "⚠️", title: "Hidden Risk Factors",        desc: "Issues only surface after deadlines fail, leaving teams in reactive mode." },
  { icon: "⚖️", title: "Uneven Workload",            desc: "Some members are overloaded while others sit idle — killing team morale." },
];

const solutions = [
  { icon: BarChart2,   color: "text-blue-600",    bg: "bg-blue-50",    title: "Smart Analytics",       desc: "Track completion rate, overdue tasks, and TPI score in real time." },
  { icon: ShieldCheck, color: "text-emerald-600",  bg: "bg-emerald-50", title: "AI Risk Detection",     desc: "Identify performance drops before they escalate into missed deadlines." },
  { icon: Zap,         color: "text-amber-600",    bg: "bg-amber-50",   title: "Workload Intelligence", desc: "Balance tasks intelligently across team members with AI suggestions." },
];

const features = [
  "Real-time team performance dashboard",
  "AI-powered risk alerts",
  "Workload balancing suggestions",
  "Sprint velocity tracking",
  "Exportable reports",
  "Role-based access control",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-[15px] tracking-tight">
              Team<span className="text-blue-600">Pulse</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Plans", "Resources"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link to="/register">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm transition-all hover:shadow-md">
                Sign Up Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={11} />
              AI-Enhanced Project Management
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
              Capture, Analyze &<br />
              <span className="text-blue-600">Improve Team</span><br />
              Performance.
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
              TeamPulse helps teams track productivity, detect risks early,
              and transform raw team data into intelligent insights.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-8">
              {features.slice(0, 4).map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/register">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
                  Get Started Free
                  <ArrowRight size={15} />
                </button>
              </Link>
              <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                See how it works →
              </a>
            </div>

            <p className="text-xs text-gray-400 mt-4">No credit card required · Free 14-day trial</p>
          </div>

          {/* Right — Dashboard mockup card */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-3xl opacity-30 scale-95" />
            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl p-6">

              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Team Dashboard</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">Engineering · Sprint 12</p>
                </div>
                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {stats.map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
                    <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">{s.trend}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-gray-600">Sprint Progress</p>
                  <p className="text-xs font-bold text-blue-600">78%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full" style={{ width: "78%" }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">6 days remaining · 3 tasks at risk</p>
              </div>

              <div className="flex items-start gap-2.5 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <Sparkles size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 font-medium">
                  AI detected workload imbalance — 2 tasks suggested for reassignment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="bg-gray-50 border-y border-gray-100 py-20" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Managing Teams Shouldn't Feel Blind.
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              Most teams operate without real visibility — reacting to problems instead of preventing them.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">The Solution</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              TeamPulse Makes Performance Visible.
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              Turn messy team data into clear, actionable insights — powered by AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {solutions.map(s => (
              <div key={s.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <p className="text-sm font-bold text-gray-700 mb-5 text-center">Everything you need to run high-performing teams</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="bg-gray-50 border-y border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { icon: Users,       value: "500+", label: "Teams Using TeamPulse" },
              { icon: TrendingUp,  value: "34%",  label: "Avg. Productivity Increase" },
              { icon: ShieldCheck, value: "89%",  label: "Risks Caught Early" },
            ].map(s => (
              <div key={s.label}>
                <s.icon size={22} className="text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={11} />
            Free 14-day trial · No credit card
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Ready to Upgrade Your<br />Team Performance?
          </h2>
          <p className="text-gray-500 text-base mb-8">
            Join hundreds of teams already using TeamPulse to work smarter.
          </p>
          <Link to="/register">
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-base">
              Get Started Free
              <ArrowRight size={17} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Sparkles size={13} className="text-white" />
                </div>
                <span className="font-extrabold text-sm tracking-tight">
                  Team<span className="text-blue-600">Pulse</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">AI-Enhanced Team Performance Platform.</p>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">About TeamPulse</p>
              {["Our Mission", "Careers", "Contact"].map(l => (
                <a key={l} href="#" className="block text-sm text-gray-400 hover:text-gray-700 transition-colors mb-1.5">{l}</a>
              ))}
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Legal</p>
              {["Privacy Policy", "Terms of Service"].map(l => (
                <a key={l} href="#" className="block text-sm text-gray-400 hover:text-gray-700 transition-colors mb-1.5">{l}</a>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 text-center">
            <p className="text-xs text-gray-400">© 2026 TeamPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}