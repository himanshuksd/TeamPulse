import { useEffect, useState } from "react";
import api from "../services/api";
import { useTeam } from "../context/TeamContext";
import {
  TrendingUp, TrendingDown, BarChart2, AlertTriangle,
  CheckCircle2, Clock, RefreshCw, Sparkles
} from "lucide-react";

function BarChart({ bars, maxValue }) {
  return (
    <div className="flex items-end gap-2 h-28">
      {bars.map((bar, i) => {
        const pct = maxValue > 0 ? (bar.value / maxValue) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500">{bar.value}%</span>
            <div className="w-full flex flex-col justify-end" style={{ height: 80 }}>
              <div
                className={`w-full rounded-t-md transition-all ${bar.color || "bg-blue-500"}`}
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-400 text-center leading-tight">{bar.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const { activeTeamId, activeTeam } = useTeam();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = () => {
    if (!activeTeamId) return;
    setLoading(true);
    setError(false);
    api.get(`/analytics/team/${activeTeamId}`)
      .then(res => setData(res.data))
      .catch(err => { console.error(err); setError(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [activeTeamId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading analytics…</p>
    </div>
  );

  if (error || !data) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <AlertTriangle size={32} className="text-amber-400" />
      <p className="text-sm text-gray-500 font-medium">Failed to load analytics data.</p>
      <button onClick={fetchData} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );

  const completionRate = data.team_completion_rate ?? 0;
  const overdueRate = data.team_overdue_rate ?? 0;
  const tpiScore = data.team_tpi_score ?? 0;

  const chartBars = [
    { label: "Completion", value: completionRate, color: "bg-blue-500" },
    { label: "Overdue", value: overdueRate, color: "bg-red-400" },
    { label: "On Track", value: Math.max(0, 100 - overdueRate), color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {activeTeam ? `${activeTeam.name} Analytics` : "Team Analytics"}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Performance metrics for your team this sprint.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:shadow-sm transition-all">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completion Rate</p>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={16} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{completionRate}%</p>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-emerald-500" />
            <p className="text-xs text-emerald-600 font-semibold">On track this sprint</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Overdue Rate</p>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <Clock size={16} className="text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{overdueRate}%</p>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-red-400 h-1.5 rounded-full" style={{ width: `${overdueRate}%` }} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            {overdueRate > 20
              ? <><TrendingUp size={12} className="text-red-500" /><p className="text-xs text-red-500 font-semibold">Needs attention</p></>
              : <><TrendingDown size={12} className="text-emerald-500" /><p className="text-xs text-emerald-600 font-semibold">Under control</p></>
            }
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">TPI Score</p>
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <BarChart2 size={16} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{tpiScore}</p>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(tpiScore * 10, 100)}%` }} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-emerald-500" />
            <p className="text-xs text-emerald-600 font-semibold">Out of 10.0</p>
          </div>
        </div>
      </div>

      {/* Chart + AI Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={16} className="text-blue-500" />
            <h3 className="text-sm font-bold text-gray-900">Performance Overview</h3>
          </div>
          <BarChart bars={chartBars} maxValue={100} />
          <div className="flex items-center justify-center gap-6 mt-4">
            {chartBars.map(b => (
              <div key={b.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${b.color}`} />
                <span className="text-xs text-gray-500">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-blue-600" />
              <p className="text-sm font-bold text-blue-900">AI Performance Insight</p>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              {completionRate >= 70
                ? `Great momentum! Your team is completing ${completionRate}% of tasks. Focus on reducing the ${overdueRate}% overdue rate to push TPI above ${(tpiScore + 0.5).toFixed(1)}.`
                : `Your completion rate of ${completionRate}% needs attention. Consider breaking large tasks into smaller ones and reassigning overdue items.`
              }
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Tasks Completed On Time", value: `${completionRate}%`, color: "text-emerald-600" },
                { label: "Tasks Overdue", value: `${overdueRate}%`, color: "text-red-500" },
                { label: "Team Health Score", value: `${tpiScore} / 10`, color: "text-blue-600" },
                {
                  label: "Overall Status",
                  value: tpiScore >= 7 ? "Healthy" : tpiScore >= 5 ? "Moderate" : "At Risk",
                  color: tpiScore >= 7 ? "text-emerald-600" : tpiScore >= 5 ? "text-amber-600" : "text-red-500"
                },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}