import { useEffect, useState } from "react";
import api from "../services/api";
import { useTeam } from "../context/TeamContext";
import {
  CheckSquare, Plus, RefreshCw, AlertTriangle,
  Search, Clock, CheckCircle2, Circle, X, Filter
} from "lucide-react";

const STATUS_STYLE = {
  DONE: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", label: "Done" },
  IN_PROGRESS: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", label: "In Progress" },
  TODO: { text: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200", dot: "bg-gray-400", label: "To Do" },
};

const getStyle = (status) => STATUS_STYLE[status] || STATUS_STYLE.TODO;

const FILTERS = ["All", "TODO", "IN_PROGRESS", "DONE"];

export default function Tasks() {
  const { activeTeamId } = useTeam();

  // ── Fetch all projects for the active team, then all their tasks ──
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);
  const [completing, setCompleting] = useState(null);

  // New task form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchAll = async () => {
    if (!activeTeamId) return;
    setFetching(true);
    setError(false);
    try {
      // 1. Get all projects for this team
      const projRes = await api.get(`/projects/team/${activeTeamId}`);
      const teamProjects = projRes.data;
      setProjects(teamProjects);

      if (selectedProject === "" && teamProjects.length > 0) {
        setSelectedProject(String(teamProjects[0].id));
      }

      // 2. Get tasks for each project in parallel
      const taskArrays = await Promise.all(
        teamProjects.map(p =>
          api.get(`/projects/${p.id}/tasks`)
            .then(r => r.data.map(t => ({ ...t, projectName: p.name })))
            .catch(() => [])
        )
      );

      // Flatten + sort: incomplete first, then by deadline
      const allTasks = taskArrays.flat().sort((a, b) => {
        if (a.status === "DONE" && b.status !== "DONE") return 1;
        if (a.status !== "DONE" && b.status === "DONE") return -1;
        if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
        return 0;
      });

      setTasks(allTasks);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchAll(); }, [activeTeamId]);

  const handleCreate = async () => {
    if (!title.trim() || !selectedProject) return;
    setLoading(true);
    try {
      await api.post("/tasks", {
        title,
        project_id: parseInt(selectedProject),
        assigned_user_id: currentUser.id || 1,
        complexity_score: 1,
        deadline: null,
      });
      setTitle("");
      setShowForm(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (taskId) => {
    setCompleting(taskId);
    try {
      await api.put(`/tasks/${taskId}/complete`);
      // Optimistic update
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: "DONE" } : t
      ));
    } catch (err) {
      console.error(err);
      fetchAll();
    } finally {
      setCompleting(null);
    }
  };

  const filtered = tasks
    .filter(t => filter === "All" || t.status === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    All: tasks.length,
    TODO: tasks.filter(t => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter(t => t.status === "DONE").length,
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading tasks…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <AlertTriangle size={32} className="text-amber-400" />
      <p className="text-sm text-gray-500 font-medium">Failed to load tasks.</p>
      <button onClick={fetchAll} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700">
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Tasks</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} across {projects.length} project{projects.length !== 1 ? "s" : ""} · {counts.DONE} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAll} className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:shadow-sm transition-all">
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Create New Task</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <CheckSquare size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setShowForm(false); }}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select project…</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                onClick={handleCreate}
                disabled={loading || !title.trim() || !selectedProject}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                {loading
                  ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  : <Plus size={15} />}
                {loading ? "Adding…" : "Add Task"}
              </button>
            </div>
            <p className="text-xs text-gray-400 ml-1">Press Enter to add · Esc to cancel</p>
          </div>
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={13} className="text-gray-400" />
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}>
              {f === "All" ? "All" : STATUS_STYLE[f]?.label || f}
              <span className={`ml-1.5 text-[10px] font-bold ${filter === f ? "text-blue-200" : "text-gray-400"}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text" placeholder="Search tasks…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-48"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle2 size={28} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">
              {search || filter !== "All" ? "No tasks match your filter" : "No tasks yet"}
            </p>
            {!search && filter === "All" && (
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all">
                <Plus size={14} /> Create first task
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(task => {
              const s = getStyle(task.status);
              const done = task.status === "DONE";
              return (
                <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                  {/* Complete button */}
                  <button
                    onClick={() => !done && handleComplete(task.id)}
                    disabled={done || completing === task.id}
                    className="flex-shrink-0 transition-all"
                  >
                    {completing === task.id
                      ? <svg className="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      : done
                        ? <CheckCircle2 size={20} className="text-emerald-500" />
                        : <Circle size={20} className="text-gray-300 hover:text-blue-500 transition-colors" />
                    }
                  </button>

                  {/* Task info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${done ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {task.projectName && (
                        <span className="text-xs text-blue-500 font-medium">{task.projectName}</span>
                      )}
                      {task.deadline && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={10} />
                          {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                      {task.complexity_score && (
                        <span className="text-xs text-gray-400">Complexity: {task.complexity_score}</span>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${s.text} ${s.bg} ${s.border}`}>
                    {s.label}
                  </span>

                  {/* Mark done — appears on hover */}
                  {!done && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-all flex-shrink-0"
                    >
                      <CheckCircle2 size={12} /> Mark Done
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}