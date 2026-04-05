import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTeam } from "../context/TeamContext";
import {
  FolderKanban, Plus, RefreshCw, AlertTriangle,
  Search, Calendar, ChevronRight, X
} from "lucide-react";

const STATUS_STYLE = {
  active:     { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", label: "Active"      },
  completed:  { text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    dot: "bg-blue-500",    label: "Completed"   },
  on_hold:    { text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-500",   label: "On Hold"     },
  default:    { text: "text-gray-600",    bg: "bg-gray-50",    border: "border-gray-200",    dot: "bg-gray-400",    label: "In Progress" },
};

const getStatus = (project) =>
  STATUS_STYLE[project.status] || STATUS_STYLE.default;

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-cyan-500",
];

export default function Projects() {
  const { activeTeamId, activeTeam } = useTeam();
  const navigate = useNavigate();
  const [projects, setProjects]       = useState([]);
  const [projectName, setProjectName] = useState("");
  const [search, setSearch]           = useState("");
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(true);
  const [error, setError]             = useState(false);
  const [showForm, setShowForm]       = useState(false);

  // ✅ Single useEffect — fetches correct team projects
  const fetchProjects = () => {
    if (!activeTeamId) return;
    setFetching(true);
    setError(false);
    api.get(`/projects/team/${activeTeamId}`)
      .then(res => setProjects(res.data))
      .catch(err => { console.error(err); setError(true); })
      .finally(() => setFetching(false));
  };

  useEffect(() => { fetchProjects(); }, [activeTeamId]);

  // Create project
  const handleCreate = async () => {
    if (!projectName.trim()) return;
    try {
      setLoading(true);
      await api.post("/projects", { name: projectName, team_id: activeTeamId });
      setProjectName("");
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") setShowForm(false);
  };

  // Filter by search
  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Loading ──
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading projects…</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle size={32} className="text-amber-400" />
        <p className="text-sm text-gray-500 font-medium">Failed to load projects.</p>
        <button onClick={fetchProjects} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
          <RefreshCw size={14} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {activeTeam ? `${activeTeam.name} Projects` : "Projects"}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""} in this team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProjects} className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:shadow-sm transition-all">
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* ── CREATE FORM ── */}
      {showForm && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Create New Project</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FolderKanban size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter project name…"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={loading || !projectName.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : <Plus size={15} />}
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-1">Press Enter to create · Esc to cancel</p>
        </div>
      )}

      {/* ── SEARCH ── */}
      {projects.length > 0 && (
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      )}

      {/* ── PROJECT GRID ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
            <FolderKanban size={24} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500">
              {search ? "No projects match your search" : "No projects yet"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {search ? "Try a different search term" : "Create your first project to get started"}
            </p>
          </div>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Plus size={15} /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => {
            const s           = getStatus(project);
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const initials    = project.name.slice(0, 2).toUpperCase();

            return (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                {/* Card top */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {initials}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${s.text} ${s.bg} ${s.border}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot} mr-1.5`} />
                    {s.label}
                  </span>
                </div>

                {/* Project name */}
                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Team #{project.team_id}
                </p>

                {/* Progress bar (mock or real) */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs font-bold text-gray-600">
                      {project.completion_rate ?? "—"}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${project.completion_rate ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={11} />
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "No date"
                    }
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${project.id}`);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    View <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}