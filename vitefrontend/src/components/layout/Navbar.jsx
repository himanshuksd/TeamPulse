// import { useTeam } from "../../context/TeamContext";
// import { Bell, ChevronDown, LogOut, Settings, Sparkles, Search } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// export default function Navbar() {
//   const { teams, activeTeamId, setActiveTeamId } = useTeam();
//   const navigate = useNavigate();

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);

//   const [user] = useState(() => {
//     const saved = localStorage.getItem("user");
//     return saved ? JSON.parse(saved) : null;
//   });

//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await api.get("/notifications");
//         setNotifications(res.data.notifications || []);
//       } catch {
//         setNotifications([
//           { id: 1, message: "AI suggested 3 task reassignments", time: "2m ago", read: false },
//           { id: 2, message: "Sprint 12 deadline approaching", time: "1h ago", read: false },
//           { id: 3, message: "Riya commented on Login Bug", time: "3h ago", read: true },
//         ]);
//       }
//     };
//     fetchNotifications();
//   }, []);

//   const getInitials = (name) => {
//     if (!name) return "??";
//     return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
//   };

//   const handleSignOut = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("activeTeamId");
//     setProfileOpen(false);
//     navigate("/login");
//   };

//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">

//       {/* LEFT */}
//       <div className="flex items-center gap-3">
//         <h2 className="text-sm font-semibold text-gray-800 tracking-tight">Project Dashboard</h2>
//         <span className="hidden md:flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
//           <Sparkles size={9} /> AI Enhanced
//         </span>
//       </div>

//       {/* RIGHT */}
//       <div className="flex items-center gap-2">

//         {/* Search */}
//         <div className="relative hidden md:block">
//           <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//           <input
//             type="text"
//             placeholder="Search tasks, members…"
//             className="pl-8 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-48 focus:w-64"
//           />
//         </div>

//         {/* Team Selector */}
//         <div className="relative">
//           <select
//             value={activeTeamId || ""}
//             onChange={e => setActiveTeamId(Number(e.target.value))}
//             className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold pl-3 pr-8 py-1.5 rounded-lg cursor-pointer outline-none hover:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
//           >
//             {teams.map(team => (
//               <option key={team.id} value={team.id}>{team.name}</option>
//             ))}
//           </select>
//           <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//         </div>

//         {/* Notification Bell */}
//         <div className="relative">
//           <button
//             onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
//             className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <Bell size={18} />
//             {unreadCount > 0 && (
//               <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {notifOpen && (
//             <>
//               <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
//               <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
//                 <div className="px-4 py-3 border-b border-gray-100">
//                   <p className="text-sm font-bold text-gray-900">Notifications</p>
//                 </div>

//                 {notifications.length === 0 ? (
//                   <p className="text-xs text-gray-400 text-center py-6">No notifications yet</p>
//                 ) : (
//                   notifications.map(n => (
//                     <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
//                       <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-blue-500" : "bg-gray-200"}`} />
//                       <div>
//                         <p className={`text-[13px] text-gray-800 ${!n.read ? "font-semibold" : "font-normal"}`}>
//                           {n.message || n.text}
//                         </p>
//                         <p className="text-[11px] text-gray-400 mt-0.5">{n.time || "Recently"}</p>
//                       </div>
//                     </div>
//                   ))
//                 )}

//                 <div className="px-4 py-2.5 border-t border-gray-100">
//                   <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
//                     View all notifications →
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Profile */}
//         <div className="relative">
//           <button
//             onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
//             className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
//           >
//             <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
//               {getInitials(user?.name)}
//             </div>
//             <span className="hidden md:block text-sm font-semibold text-gray-700">
//               {user?.name || "User"}
//             </span>
//             <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
//           </button>

//           {profileOpen && (
//             <>
//               <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
//               <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
//                 <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//                     {getInitials(user?.name)}
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-gray-900">{user?.name || "User"}</p>
//                     <p className="text-[11px] text-gray-400">{user?.email || "No email"}</p>
//                   </div>
//                 </div>
//                 <div className="py-1">
//                   <a href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                     <Settings size={15} className="text-gray-400" /> Settings
//                   </a>
//                   <button
//                     onClick={handleSignOut}
//                     className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <LogOut size={15} /> Sign out
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//       </div>
//     </header>
//   );
// }



import { useTeam } from "../../context/TeamContext";
import { Bell, ChevronDown, LogOut, Settings, Sparkles, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Navbar({ setOpen }) {
  const { teams, activeTeamId, setActiveTeamId } = useTeam();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [user] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications || []);
      } catch {
        setNotifications([
          { id: 1, message: "AI suggested 3 task reassignments", time: "2m ago", read: false },
          { id: 2, message: "Sprint 12 deadline approaching", time: "1h ago", read: false },
          { id: 3, message: "Riya commented on Login Bug", time: "3h ago", read: true },
        ]);
      }
    };
    fetchNotifications();
  }, []);

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeTeamId");
    setProfileOpen(false);
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* ✅ MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(prev => !prev)}
          className="md:hidden text-gray-700 text-xl"
        >
          ☰
        </button>

        <h2 className="text-sm font-semibold text-gray-800 tracking-tight">
          Project Dashboard
        </h2>

        <span className="hidden md:flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
          <Sparkles size={9} /> AI Enhanced
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks, members…"
            className="pl-8 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-48 focus:w-64"
          />
        </div>

        {/* Team Selector */}
        <div className="relative">
          <select
            value={activeTeamId || ""}
            onChange={e => setActiveTeamId(Number(e.target.value))}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold pl-3 pr-8 py-1.5 rounded-lg cursor-pointer outline-none hover:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">Notifications</p>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No notifications yet</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${!n.read ? "bg-blue-500" : "bg-gray-200"}`} />
                      <div>
                        <p className={`text-[13px] ${!n.read ? "font-semibold" : ""}`}>
                          {n.message || n.text}
                        </p>
                        <p className="text-[11px] text-gray-400">{n.time || "Recently"}</p>
                      </div>
                    </div>
                  ))
                )}

                <div className="px-4 py-2.5 border-t border-gray-100">
                  <button className="text-xs font-semibold text-blue-600">
                    View all notifications →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:block text-sm font-semibold text-gray-700">
              {user?.name || "User"}
            </span>
            <ChevronDown size={13} className={`${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-xl z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-bold">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <div>
                  <a href="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Settings
                  </a>
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}