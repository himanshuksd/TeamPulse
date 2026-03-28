// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { registerUser } from "../services/auth";
// import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

// const perks = [
//   "Free 14-day trial, no credit card",
//   "AI-powered risk detection",
//   "Real-time team dashboards",
//   "Cancel anytime",
// ];

// export default function Register() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name || !form.email || !form.password) {
//       setError("All fields are required.");
//       return;
//     }
//     if (form.password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     try {
//       setLoading(true);
//       setError("");

//       await registerUser(form.name, form.email, form.password);

//       // Navigate to dashboard after successful registration
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err?.response?.data?.message || "Error creating account. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

//       {/* ── LEFT PANEL ── */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-12 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
//         <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

//         {/* Logo */}
//         <div className="flex items-center gap-2.5 relative z-10">
//           <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
//             <Sparkles size={18} className="text-white" />
//           </div>
//           <span className="font-extrabold text-white text-lg tracking-tight">TeamPulse</span>
//         </div>

//         {/* Center content */}
//         <div className="relative z-10">
//           <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
//             <Sparkles size={10} />
//             Join 500+ high-performing teams
//           </div>
//           <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
//             Start making<br />smarter team<br />decisions.
//           </h2>
//           <p className="text-blue-100 text-sm leading-relaxed max-w-xs mb-8">
//             Set up in minutes. No complex onboarding — just clear insights from day one.
//           </p>

//           {/* Perks */}
//           <div className="space-y-3">
//             {perks.map(p => (
//               <div key={p} className="flex items-center gap-3">
//                 <CheckCircle2 size={16} className="text-blue-300 flex-shrink-0" />
//                 <span className="text-sm text-blue-100">{p}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <p className="text-blue-200 text-xs relative z-10">© 2026 TeamPulse. All rights reserved.</p>
//       </div>

//       {/* ── RIGHT PANEL ── */}
//       <div className="flex-1 flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-md">

//           {/* Mobile logo */}
//           <div className="flex items-center gap-2 mb-8 lg:hidden">
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
//               <Sparkles size={15} className="text-white" />
//             </div>
//             <span className="font-extrabold text-[15px] tracking-tight">
//               Team<span className="text-blue-600">Pulse</span>
//             </span>
//           </div>

//           {/* Heading */}
//           <div className="mb-8">
//             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Create your account</h1>
//             <p className="text-sm text-gray-500">
//               Already have an account?{" "}
//               <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
//                 Sign in
//               </Link>
//             </p>
//           </div>

//           {/* Google button */}
//           <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-sm mb-6">
//             <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4" />
//             Continue with Google
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-3 mb-6">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">

//             {/* Name */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full name</label>
//               <div className="relative">
//                 <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input
//                   type="text"
//                   placeholder="Your Name"
//                   value={form.name}
//                   onChange={update("name")}
//                   className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
//               <div className="relative">
//                 <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input
//                   type="email"
//                   placeholder="you@company.com"
//                   value={form.email}
//                   onChange={update("email")}
//                   className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input
//                   type={showPass ? "text" : "password"}
//                   placeholder="Min. 6 characters"
//                   value={form.password}
//                   onChange={update("password")}
//                   className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPass(!showPass)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
//                 </button>
//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3.5 py-2.5 rounded-xl">
//                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
//                 {error}
//               </div>
//             )}

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                   </svg>
//                   Creating account…
//                 </>
//               ) : (
//                 <>
//                   Create Account
//                   <ArrowRight size={15} />
//                 </>
//               )}
//             </button>
//           </form>

//           <p className="text-center text-xs text-gray-400 mt-6">
//             By signing up, you agree to our{" "}
//             <a href="#" className="text-gray-500 hover:text-gray-700 underline">Terms</a>{" "}
//             and{" "}
//             <a href="#" className="text-gray-500 hover:text-gray-700 underline">Privacy Policy</a>.
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const perks = [
  "Free 14-day trial, no credit card",
  "AI-powered risk detection",
  "Real-time team dashboards",
  "Cancel anytime",
];

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      setError("");

      await registerUser(form.name, form.email, form.password);

      // ── Check for pending invite link ────────────────────────────────
      const pendingInvite = localStorage.getItem("pending_invite");
      if (pendingInvite) {
        navigate(`/join/${pendingInvite}`);
      } else {
        navigate("/dashboard");
      }
      // ────────────────────────────────────────────────────────────────
    } catch (err) {
      setError(err?.response?.data?.message || "Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight">TeamPulse</span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={10} />
            Join 500+ high-performing teams
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Start making<br />smarter team<br />decisions.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xs mb-8">
            Set up in minutes. No complex onboarding — just clear insights from day one.
          </p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-blue-300 flex-shrink-0" />
                <span className="text-sm text-blue-100">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-200 text-xs relative z-10">© 2026 TeamPulse. All rights reserved.</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-[15px] tracking-tight">
              Team<span className="text-blue-600">Pulse</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Create your account</h1>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Sign in</Link>
            </p>
          </div>

          {/* Google button */}
          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-sm mb-6">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" placeholder="Your Name" value={form.name} onChange={update("name")}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="email" placeholder="you@company.com" value={form.email} onChange={update("email")}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={update("password")}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3.5 py-2.5 rounded-xl">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>Creating account…</>
              ) : (<>Create Account<ArrowRight size={15} /></>)}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing up, you agree to our{" "}
            <a href="#" className="text-gray-500 hover:text-gray-700 underline">Terms</a>{" "}and{" "}
            <a href="#" className="text-gray-500 hover:text-gray-700 underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}