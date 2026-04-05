import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import api from '../services/api';
import {
  CheckCircle, Clock, AlertTriangle, TrendingUp,
  Sparkles, ArrowRight, BarChart2, RefreshCw,
  ChevronRight, Calendar, Flame, Star,
  ShieldCheck, ShieldAlert, ShieldX, Users
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nameColor(str = '') {
  const palette = ['#4F81C7', '#E8956D', '#6EB589', '#C39BD3', '#F0B27A', '#5DADE2', '#EC7063'];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

function StatusPill({ status }) {
  const map = {
    IN_PROGRESS: 'bg-blue-50 text-blue-600 border-blue-100',
    TODO: 'bg-gray-100 text-gray-500 border-gray-200',
    DONE: 'bg-green-50 text-green-600 border-green-100',
  };
  const label = { IN_PROGRESS: 'In Progress', TODO: 'To Do', DONE: 'Done' };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${map[status] ?? map.TODO}`}>
      {label[status] ?? status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeTeamId, teams, teamsLoading } = useTeam();

  const [dashData, setDashData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Fix 1: read from localStorage "user" JSON key ─────────────────────────
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // AI Summary
  const [aiSummary, setAiSummary] = useState('');
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryDone, setAiSummaryDone] = useState(false);

  useEffect(() => {
    if (activeTeamId) fetchAll();
  }, [activeTeamId]);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Dashboard stats
      const dashRes = await api.get(`/dashboard/${activeTeamId}`);
      setDashData(dashRes.data);

      // 2. Projects + task counts
      const projRes = await api.get(`/projects/team/${activeTeamId}`);
      const enriched = await Promise.all(
        projRes.data.map(async (p) => {
          try {
            const tRes = await api.get(`/projects/${p.id}/tasks`);
            const tasks = tRes.data;
            const done = tasks.filter(t => t.status === 'DONE').length;
            return {
              ...p,
              taskCount: tasks.length,
              progress: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
              tasks,
            };
          } catch {
            return { ...p, taskCount: 0, progress: 0, tasks: [] };
          }
        })
      );
      setProjects(enriched);

      // 3. Analytics
      try {
        const anaRes = await api.get(`/analytics/team/${activeTeamId}`);
        setAnalytics(anaRes.data);
      } catch { /* optional */ }

      // ── Fix 2: use /teams/{team_id}/members directly ──────────────────────
      try {
        const membersRes = await api.get(`/teams/${activeTeamId}/members`);
        // Returns: [{ user_id, name, email, role, joined_at, points, level, streak, total_completed }]
        const allTasks = enriched.flatMap(p => p.tasks || []);
        const memberList = membersRes.data.map(m => ({
          id: m.user_id,
          name: m.name,
          email: m.email,
          role: m.role,
          points: m.points || 0,
          level: m.level || 1,
          streak: m.streak || 0,
          tasksCompleted: m.total_completed ||
            allTasks.filter(t => t.assigned_user_id === m.user_id && t.status === 'DONE').length,
        }));
        setMembers(memberList);
      } catch { /* optional */ }

    } catch (err) {
      console.error('Dashboard fetch failed:', err);
      setError('Failed to load dashboard. Make sure you are part of a team.');
    } finally {
      setLoading(false);
    }
  };

  // ── AI Daily Summary ───────────────────────────────────────────────────────
  const generateAISummary = async () => {
    if (!dashData) return;
    setAiSummaryLoading(true);
    setAiSummary('');
    setAiSummaryDone(false);

    const projectSummary = projects.map(p => `"${p.name}" — ${p.progress}% done, ${p.taskCount} tasks`).join('; ');
    const recentTaskSummary = (dashData.recent_tasks || []).map(t => `"${t.title}" [${t.status}] assigned to ${t.assignee}${t.deadline ? ', due ' + new Date(t.deadline).toLocaleDateString() : ''}`).join('; ');
    const memberSummary = members.map(m => `${m.name} (${m.tasksCompleted} tasks done, role: ${m.role})`).join(', ');

    // ── Fix 3: calculate overdue_rate if not returned by API ─────────────────
    const overdueRate = dashData.total_tasks > 0
      ? Math.round((dashData.overdue_tasks / dashData.total_tasks) * 100)
      : 0;

    const context = `
Team stats: ${dashData.total_tasks} total tasks, ${dashData.completed_tasks} completed, ${dashData.overdue_tasks} overdue
Sprint progress: ${dashData.sprint_progress ?? dashData.completion_rate ?? 0}%, TPI: ${dashData.tpi_score}, Overdue rate: ${overdueRate}%
Risk: ${dashData.risk_level} — ${dashData.risk_reason}
Projects: ${projectSummary || 'None'}
Recent tasks: ${recentTaskSummary || 'None'}
Team: ${memberSummary || 'Unknown'}
    `.trim();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are Team AI inside TeamPulse. Generate a sharp, friendly daily standup summary in 3 sections: ✅ What's going well, ⚠️ Watch out for, 💡 Today's focus. Use **bold** for key names/numbers. Under 120 words. Be specific with real data — never generic.`,
          messages: [{ role: 'user', content: `Generate today's team summary:\n\n${context}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || 'Unable to generate summary right now.';
      const words = text.split(' ');
      let current = '';
      for (let i = 0; i < words.length; i++) {
        current += (i === 0 ? '' : ' ') + words[i];
        setAiSummary(current);
        await new Promise(r => setTimeout(r, 30));
      }
      setAiSummaryDone(true);
    } catch {
      setAiSummary('AI summary unavailable. Please check your connection.');
      setAiSummaryDone(true);
    }
    setAiSummaryLoading(false);
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const inProgressTasks = dashData
    ? Math.max(dashData.total_tasks - dashData.completed_tasks - dashData.overdue_tasks, 0)
    : 0;

  // ── Fix 3: calculate overdue_rate locally ────────────────────────────────
  const overdueRate = dashData?.total_tasks > 0
    ? Math.round((dashData.overdue_tasks / dashData.total_tasks) * 100)
    : 0;

  const riskConfig = {
    'Low Risk': { icon: <ShieldCheck size={15} />, cls: 'text-green-600 bg-green-50 border-green-100' },
    'Moderate Risk': { icon: <ShieldAlert size={15} />, cls: 'text-amber-600 bg-amber-50 border-amber-100' },
    'High Risk': { icon: <ShieldX size={15} />, cls: 'text-red-500   bg-red-50   border-red-100' },
    'No Data': { icon: <ShieldCheck size={15} />, cls: 'text-gray-400  bg-gray-50  border-gray-200' },
  };
  const risk = riskConfig[dashData?.risk_level] ?? riskConfig['No Data'];

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (teamsLoading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading your teams…</p>
    </div>
  );

  if (!activeTeamId && !teamsLoading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-5">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
        <Users size={32} className="text-blue-500" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Welcome to TeamPulse! 👋</h2>
        <p className="text-sm text-gray-400">You don't have any team yet. Create one to get started.</p>
      </div>
      <button onClick={() => navigate('/teams')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
        Create Your First Team →
      </button>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <AlertTriangle size={32} className="text-red-400" />
      <p className="text-gray-600 text-sm font-medium">{error}</p>
      <button onClick={fetchAll} className="text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg">
        Retry
      </button>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
            {greeting}, {currentUser?.name || 'there'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your team today.</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Tasks',
            value: dashData?.total_tasks ?? 0,
            sub: `${dashData?.sprint_progress ?? dashData?.completion_rate ?? 0}% complete`,
            icon: <BarChart2 size={18} />,
            iconBg: 'bg-blue-50', iconClr: 'text-blue-600',
            bar: true, barPct: dashData?.sprint_progress ?? dashData?.completion_rate ?? 0,
          },
          {
            label: 'In Progress',
            value: inProgressTasks,
            sub: 'active right now',
            icon: <Clock size={18} />,
            iconBg: 'bg-amber-50', iconClr: 'text-amber-500',
          },
          {
            label: 'Completed',
            value: dashData?.completed_tasks ?? 0,
            sub: `${dashData?.completion_rate ?? 0}% completion rate`,
            icon: <CheckCircle size={18} />,
            iconBg: 'bg-green-50', iconClr: 'text-green-600',
          },
          {
            label: 'Overdue',
            value: dashData?.overdue_tasks ?? 0,
            sub: `${overdueRate}% overdue rate`,
            icon: <AlertTriangle size={18} />,
            iconBg: 'bg-red-50', iconClr: 'text-red-500',
            urgent: (dashData?.overdue_tasks ?? 0) > 0,
          },
        ].map((s, i) => (
          <div key={i} className={`bg-white border rounded-xl p-5 shadow-sm ${s.urgent ? 'border-red-200' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${s.iconBg} ${s.iconClr}`}>{s.icon}</div>
              {s.urgent && <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full">Urgent</span>}
            </div>
            <div className="text-2xl font-extrabold text-gray-900 tabular-nums">{s.value}</div>
            <div className="text-sm font-semibold text-gray-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            {s.bar && (
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700" style={{ width: `${s.barPct}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* TPI + Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg"><TrendingUp size={15} className="text-blue-600" /></div>
              <span className="text-sm font-bold text-gray-900">Team Performance Index</span>
            </div>
            <span className="text-2xl font-extrabold text-blue-700 tabular-nums">
              {dashData?.tpi_score ?? 0}<span className="text-sm font-semibold text-gray-400">/100</span>
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${(dashData?.tpi_score ?? 0) >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : (dashData?.tpi_score ?? 0) >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
              style={{ width: `${dashData?.tpi_score ?? 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>0 — Critical</span><span>50 — Moderate</span><span>100 — Excellent</span>
          </div>
        </div>

        <div className={`bg-white border rounded-xl p-5 shadow-sm ${dashData?.risk_level === 'High Risk' ? 'border-red-200' : dashData?.risk_level === 'Moderate Risk' ? 'border-amber-200' : 'border-gray-100'}`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg border mt-0.5 ${risk.cls}`}>{risk.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">Risk Assessment</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.cls}`}>{dashData?.risk_level ?? 'No Data'}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{dashData?.risk_reason ?? 'No tasks available yet.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Daily Summary */}
      <div className={`bg-white border rounded-xl shadow-sm overflow-hidden ${aiSummaryDone ? 'border-purple-100' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 rounded-lg"><Sparkles size={15} className="text-purple-600" /></div>
            <span className="text-sm font-bold text-gray-900">AI Daily Summary</span>
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">AI Enhanced</span>
          </div>
          <button
            onClick={generateAISummary}
            disabled={aiSummaryLoading}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors disabled:opacity-50"
          >
            {aiSummaryLoading
              ? <><span className="animate-spin inline-block w-3 h-3 border border-purple-400 border-t-transparent rounded-full" /> Generating…</>
              : <><RefreshCw size={12} /> {aiSummaryDone ? 'Regenerate' : 'Generate Summary'}</>
            }
          </button>
        </div>
        <div className="px-5 py-4">
          {!aiSummary && !aiSummaryLoading ? (
            <div className="flex items-center gap-4 py-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Get your AI standup in one click</p>
                <p className="text-xs text-gray-400 mt-0.5">Analyzes your real tasks, TPI score, and team load to generate a smart summary.</p>
              </div>
              <button onClick={generateAISummary} className="ml-auto flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0">
                Generate <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {aiSummary.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                part.startsWith('**')
                  ? <strong key={i} className="text-gray-900">{part.slice(2, -2)}</strong>
                  : part
              )}
              {aiSummaryLoading && <span className="inline-block w-1.5 h-4 bg-purple-400 animate-pulse rounded-sm ml-0.5 align-middle" />}
            </p>
          )}
        </div>
      </div>

      {/* Projects + Recent Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <span className="text-sm font-bold text-gray-900">
              Projects
              <span className="ml-2 text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{projects.length}</span>
            </span>
            <button onClick={() => navigate('/projects')} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {projects.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-400">
                No projects yet. <button onClick={() => navigate('/projects')} className="text-blue-500 underline">Create one</button>
              </div>
            ) : projects.slice(0, 5).map(project => (
              <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{project.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800 truncate">{project.name}</span>
                    <span className="text-xs text-gray-400 tabular-nums ml-2 flex-shrink-0">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{project.taskCount} tasks</span>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <span className="text-sm font-bold text-gray-900">Recent Tasks</span>
            <button onClick={() => navigate('/tasks')} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold">
              All tasks <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {(dashData?.recent_tasks ?? []).length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-400">No tasks yet.</div>
            ) : (dashData?.recent_tasks ?? []).map(task => {
              const daysLeft = task.deadline ? Math.ceil((new Date(task.deadline) - new Date()) / 86400000) : null;
              const isOverdue = daysLeft !== null && daysLeft < 0 && task.status !== 'DONE';
              return (
                <div key={task.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'DONE' ? 'bg-green-400' : isOverdue ? 'bg-red-500' : task.status === 'IN_PROGRESS' ? 'bg-blue-400' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <StatusPill status={task.status} />
                      {task.assignee && <span className="text-xs text-gray-400">{task.assignee}</span>}
                      {task.deadline && (
                        <span className={`flex items-center gap-0.5 text-xs ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                          <Calendar size={10} />
                          {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analytics + Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <span className="text-sm font-bold text-gray-900">Sprint Analytics</span>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Completion Rate', value: analytics?.team_completion_rate ?? dashData?.completion_rate ?? 0, color: 'bg-green-500' },
              { label: 'Overdue Rate', value: analytics?.team_overdue_rate ?? overdueRate, color: 'bg-red-400' },
              { label: 'TPI Score', value: analytics?.team_tpi_score ?? dashData?.tpi_score ?? 0, color: 'bg-blue-500' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-gray-600">{stat.label}</span>
                  <span className="font-bold text-gray-800 tabular-nums">{stat.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${stat.color} transition-all duration-700`} style={{ width: `${Math.min(stat.value, 100)}%` }} />
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/analytics')} className="w-full mt-2 text-xs text-center text-blue-600 hover:text-blue-700 font-semibold py-1">
              View full analytics →
            </button>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Team Members</span>
              <Flame size={14} className="text-orange-400" />
            </div>
            <button onClick={() => navigate('/gamification')} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold">
              Leaderboard <ChevronRight size={13} />
            </button>
          </div>
          {members.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-400">No team members found.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {[...members].sort((a, b) => b.points - a.points).map((member, rank) => (
                <div key={member.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-sm w-6 text-center flex-shrink-0">
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : <span className="text-xs font-bold text-gray-300">#{rank + 1}</span>}
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ fontSize: 10, background: nameColor(member.name) }}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {member.name}
                        {member.id === currentUser?.id && <span className="ml-1 text-[10px] text-blue-500 font-bold">(you)</span>}
                      </p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${member.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{member.tasksCompleted} tasks completed</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-gray-700 tabular-nums">{member.points}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}