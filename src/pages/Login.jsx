// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { loginUser } from "../services/auth";
// import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
// import { useGoogleLogin } from "@react-oauth/google";
// import api from "../services/api";

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) { setError("All fields are required."); return; }
//     try {
//       setLoading(true);
//       setError("");
//       const data = await loginUser(email, password);
//       if (data.access_token) {
//         const pendingInvite = localStorage.getItem("pending_invite");
//         navigate(pendingInvite ? `/join/${pendingInvite}` : "/dashboard");
//       } else {
//         setError("Invalid credentials. Please try again.");
//       }
//     } catch (err) {
//       setError("Login failed. Please check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = useGoogleLogin({
//     flow: "auth-code",
//     onSuccess: async (tokenResponse) => {
//       setGoogleLoading(true);
//       setError("");
//       try {
//         // Fetch user info on frontend directly from Google
//         const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
//           headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
//         });
//         const userInfo = await userInfoRes.json();

//         // Send email + name to backend
//         const res = await api.post("/auth/google", {
//           token: tokenResponse.access_token,
//           email: userInfo.email,
//           name: userInfo.name
//         });
//         const data = res.data;
//         localStorage.setItem("token", data.access_token);
//         localStorage.setItem("user", JSON.stringify({ id: data.user_id, name: data.name, email: data.email }));
//         window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: data.access_token }));
//         const pendingInvite = localStorage.getItem("pending_invite");
//         navigate(pendingInvite ? `/join/${pendingInvite}` : "/dashboard");
//       } catch (err) {
//         setError("Google login failed. Please try again.");
//       } finally {
//         setGoogleLoading(false);
//       }
//     },
//     onError: () => setError("Google login failed. Please try again."),
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-12 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
//         <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
//         <div className="flex items-center gap-2.5 relative z-10">
//           <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
//             <Sparkles size={18} className="text-white" />
//           </div>
//           <span className="font-extrabold text-white text-lg tracking-tight">TeamPulse</span>
//         </div>
//         <div className="relative z-10">
//           <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
//             <Sparkles size={10} /> AI-Enhanced Project Management
//           </div>
//           <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">Welcome back.<br />Your team<br />is waiting.</h2>
//           <p className="text-blue-100 text-sm leading-relaxed max-w-xs">Track productivity, detect risks early, and transform team data into intelligent insights.</p>
//           <div className="grid grid-cols-3 gap-4 mt-10">
//             {[{ value: "500+", label: "Teams" }, { value: "34%", label: "Productivity" }, { value: "89%", label: "Risks Caught" }].map(s => (
//               <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
//                 <p className="text-xl font-extrabold text-white">{s.value}</p>
//                 <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <p className="text-blue-200 text-xs relative z-10">© 2026 TeamPulse. All rights reserved.</p>
//       </div>
//       <div className="flex-1 flex items-center justify-center px-6 py-12">
//         <div className="w-full max-w-md">
//           <div className="mb-8">
//             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Sign in to your account</h1>
//             <p className="text-sm text-gray-500">Don't have an account?{" "}<Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Sign up free</Link></p>
//           </div>
//           <button onClick={() => handleGoogleLogin()} disabled={googleLoading}
//             className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-sm mb-6 disabled:opacity-60">
//             {googleLoading ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4" />}
//             {googleLoading ? "Signing in..." : "Continue with Google"}
//           </button>
//           <div className="flex items-center gap-3 mb-6">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
//               <div className="relative">
//                 <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <label className="text-xs font-semibold text-gray-700">Password</label>
//                 <a href="#" className="text-xs text-blue-600 font-semibold hover:text-blue-700">Forgot password?</a>
//               </div>
//               <div className="relative">
//                 <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 <input type={showPass ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
//                 <button onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
//               </div>
//             </div>
//             {error && <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3.5 py-2.5 rounded-xl"><span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />{error}</div>}
//             <button onClick={handleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-md transition-all">
//               {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Signing in...</> : <>Sign In<ArrowRight size={15} /></>}
//             </button>
//           </div>
//           <p className="text-center text-xs text-gray-400 mt-6">By signing in, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await loginUser(email, password);

      if (data.access_token) {
        const pendingInvite = localStorage.getItem("pending_invite");
        navigate(pendingInvite ? `/join/${pendingInvite}` : "/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError("");

      try {
        const res = await api.post("/auth/google", {
          code: tokenResponse.code,
        });

        const data = res.data;

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.user_id,
              name: data.name,
              email: data.email,
            })
          );

          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "token",
              newValue: data.access_token,
            })
          );

          const pendingInvite = localStorage.getItem("pending_invite");
          navigate(pendingInvite ? `/join/${pendingInvite}` : "/dashboard");
        } else {
          setError("Google login failed. No access token returned.");
        }
      } catch (err) {
        console.error("Google login error:", err?.response?.data || err);
        setError(
          err?.response?.data?.detail ||
          "Google login failed. Please try again."
        );
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
      setGoogleLoading(false);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
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
            <Sparkles size={10} /> AI-Enhanced Project Management
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Welcome back.<br />Your team<br />is waiting.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
            Track productivity, detect risks early, and transform team data into intelligent insights.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[{ value: "500+", label: "Teams" }, { value: "34%", label: "Productivity" }, { value: "89%", label: "Risks Caught" }].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                <p className="text-xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-xs relative z-10">© 2026 TeamPulse. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Sign in to your account</h1>
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          <button
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-sm mb-6 disabled:opacity-60"
          >
            {googleLoading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-4 h-4" />
            )}
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 font-semibold hover:text-blue-700">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3.5 py-2.5 rounded-xl">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-md transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}