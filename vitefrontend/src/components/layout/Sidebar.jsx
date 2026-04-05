// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard, FolderKanban, CheckSquare,
//   Users, BarChart2, Settings, Sparkles, ChevronRight,
//   MessageSquare, Trophy
// } from "lucide-react";

// const navItems = [
//   { path: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
//   { path: "/projects",   label: "Projects",   icon: FolderKanban    },
//   { path: "/tasks",      label: "Tasks",      icon: CheckSquare     },
//   { path: "/teams",      label: "Teams",      icon: Users           },
//   { path: "/chat",          label: "Chat",          icon: MessageSquare },
//   { path: "/analytics",     label: "Analytics",     icon: BarChart2     },
//   { path: "/gamification",  label: "Gamification",  icon: Trophy        },
//   { path: "/settings",      label: "Settings",      icon: Settings      },
// ];

// export default function Sidebar() {
//   const location = useLocation();
//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col">

//       {/* ── Logo ── */}
//       <div className="h-[60px] flex items-center gap-2 px-5 border-b border-gray-100">
//         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
//           <Sparkles size={15} className="text-white" />
//         </div>
//         <span className="font-extrabold text-[15px] text-gray-900 tracking-tight">
//           Team<span className="text-blue-600">Pulse</span>
//         </span>
//       </div>

//       {/* ── Nav Links ── */}
//       <nav className="flex-1 px-3 py-4 space-y-0.5">
//         <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
//           Main Menu
//         </p>
//         {navItems.map(({ path, label, icon: Icon }) => (
//           <Link
//             key={path}
//             to={path}
//             className={`
//               flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
//               ${isActive(path)
//                 ? "bg-blue-50 text-blue-700"
//                 : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
//               }
//             `}
//           >
//             <Icon
//               size={17}
//               className={isActive(path) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}
//             />
//             <span className="flex-1">{label}</span>
//             {isActive(path) && (
//               <ChevronRight size={14} className="text-blue-400" />
//             )}
//           </Link>
//         ))}
//       </nav>

//       {/* ── AI Badge ── */}
//       <div className="p-3 mx-3 mb-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
//         <div className="flex items-center gap-2 mb-1">
//           <Sparkles size={13} className="text-blue-600" />
//           <span className="text-xs font-bold text-blue-700">AI Enhanced</span>
//         </div>
//         <p className="text-[11px] text-blue-500 leading-relaxed">
//           Smart suggestions and risk detection are active.
//         </p>
//       </div>

//     </div>
//   );
// }
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  Users, BarChart2, Settings, Sparkles, ChevronRight,
  MessageSquare, Trophy
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/projects", label: "Projects", icon: FolderKanban },
  { path: "/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/teams", label: "Teams", icon: Users },
  { path: "/chat", label: "Chat", icon: MessageSquare },
  { path: "/analytics", label: "Analytics", icon: BarChart2 },
  { path: "/gamification", label: "Gamification", icon: Trophy },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50 h-full w-60 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        {/* Logo */}
        <div className="h-[60px] flex items-center gap-2 px-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-extrabold text-[15px] text-gray-900 tracking-tight">
            Team<span className="text-blue-600">Pulse</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>

          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                ${isActive(path)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <Icon
                size={17}
                className={isActive(path)
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-600"
                }
              />
              <span className="flex-1">{label}</span>
              {isActive(path) && (
                <ChevronRight size={14} className="text-blue-400" />
              )}
            </Link>
          ))}
        </nav>

        {/* AI Badge */}
        <div className="p-3 mx-3 mb-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={13} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-700">AI Enhanced</span>
          </div>
          <p className="text-[11px] text-blue-500 leading-relaxed">
            Smart suggestions and risk detection are active.
          </p>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}