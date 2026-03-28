import { useState, useEffect } from "react";
import { useTeam } from "../context/TeamContext";
import api from "../services/api";
import {
  Trophy, Star, Zap, Target, Award, TrendingUp,
  Crown, Medal, Flame, CheckCircle2, Lock, Sparkles,
  RefreshCw
} from "lucide-react";

const BADGE_DEFS = [
  { id: "first_task", label: "First Step", desc: "Complete your first task", icon: CheckCircle2, req: 1, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
  { id: "ten_tasks", label: "Getting Started", desc: "Complete 10 tasks", icon: Target, req: 10, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "fifty_tasks", label: "100 Club", desc: "Complete 50 tasks", icon: Trophy, req: 50, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" },
  { id: "level5", label: "Rising Star", desc: "Reach Level 5", icon: Star, req: 5, color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-200" },
  { id: "streak7", label: "On Fire", desc: "7-day streak", icon: Flame, req: 7, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  { id: "points500", label: "Point Hoarder", desc: "Earn 500 points", icon: Zap, req: 500, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
  { id: "level10", label: "Sprint Champion", desc: "Reach Level 10", icon: Crown, req: 10, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
  { id: "points1000", label: "Legend", desc: "Earn 1000 points", icon: Medal, req: 1000, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200" },
];

const RANK_ICON = { 1: Crown, 2: Medal, 3: Award };

export default function Gamification() {
  const { activeTeam, activeTeamId } = useTeam();
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [loading, setLoading] = useState(true);
  const [myStats, setMyStats] = useState(null);      // { points, level, streak, total_completed }
  const [leaderboard, setLeaderboard] = useState([]);

  // ── current user from localStorage ─────────────────────────
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    if (!activeTeamId) return;
    setLoading(true);
    try {
      // GET /teams/{id}/members → [{user_id, name, email, role, points, level, streak, total_completed}]
      const membersRes = await api.get(`/teams/${activeTeamId}/members`);
      const members = membersRes.data;

      // Build leaderboard sorted by points
      const board = members
        .map(m => ({
          user_id: m.user_id,
          name: m.name,
          points: m.points ?? 0,
          level: m.level ?? 1,
          streak: m.streak ?? 0,
          total_completed: m.total_completed ?? 0,
          avatar: m.name.slice(0, 2).toUpperCase(),
        }))
        .sort((a, b) => b.points - a.points)
        .map((m, i) => ({ ...m, rank: i + 1 }));

      setLeaderboard(board);

      // My own stats
      const me = board.find(m => m.user_id === currentUser.id);
      if (me) {
        const nextLevel = me.level * 200;
        const prevLevel = (me.level - 1) * 200;
        const progress = Math.min(100, Math.round(((me.points - prevLevel) / (nextLevel - prevLevel)) * 100));
        setMyStats({ ...me, nextLevel, progress });
      }
    } catch (err) {
      console.error("Failed to load gamification data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTeamId]);

  // ── badge computation ────────────────────────────────────────
  const badges = BADGE_DEFS.map(b => {
    let earned = false;
    if (!myStats) return { ...b, earned: false };
    if (b.id === "first_task") earned = myStats.total_completed >= 1;
    if (b.id === "ten_tasks") earned = myStats.total_completed >= 10;
    if (b.id === "fifty_tasks") earned = myStats.total_completed >= 50;
    if (b.id === "level5") earned = myStats.level >= 5;
    if (b.id === "streak7") earned = myStats.streak >= 7;
    if (b.id === "points500") earned = myStats.points >= 500;
    if (b.id === "level10") earned = myStats.level >= 10;
    if (b.id === "points1000") earned = myStats.points >= 1000;
    return { ...b, earned };
  });

  const earnedCount = badges.filter(b => b.earned).length;

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  if (!activeTeamId) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm">
      <Trophy size={32} className="mb-3 opacity-30" />
      No active team selected. Go to Teams and set one active.
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Gamification</h1>
          <p className="text-sm text-gray-400 mt-0.5">Earn points, unlock badges, climb the leaderboard.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <RefreshCw size={13} /> Refresh
          </button>
          {myStats && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl shadow-sm">
              <Sparkles size={14} className="text-blue-200" />
              <span className="text-xs font-bold">Level {myStats.level}</span>
            </div>
          )}
        </div>
      </div>

      {/* MY STATS ROW */}
      {myStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "My Points", value: myStats.points, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
            { label: "Current Level", value: `Level ${myStats.level}`, icon: Trophy, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Day Streak", value: `${myStats.streak} days`, icon: Flame, color: "text-red-500", bg: "bg-red-50" },
            { label: "Badges Earned", value: `${earnedCount} / ${badges.length}`, icon: Award, color: "text-violet-500", bg: "bg-violet-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon size={15} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* LEVEL PROGRESS BAR */}
      {myStats && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={15} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Level {myStats.level} → Level {myStats.level + 1}</p>
                <p className="text-xs text-gray-400">{myStats.points} / {myStats.nextLevel} points</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-blue-600">{myStats.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all relative overflow-hidden"
              style={{ width: `${myStats.progress}%` }}>
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{myStats.nextLevel - myStats.points} points to reach Level {myStats.level + 1}</p>
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: "leaderboard", label: "Leaderboard", icon: Trophy },
          { id: "badges", label: "Badges", icon: Award },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === id ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* LEADERBOARD TAB */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4">
          {/* Top 3 podium */}
          {leaderboard.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {leaderboard.slice(0, 3).map(member => {
                const RankIcon = RANK_ICON[member.rank] || Medal;
                const isMe = member.user_id === currentUser.id;
                return (
                  <div key={member.rank} className={`bg-white border-2 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all ${isMe ? "border-blue-400" : member.rank === 1 ? "border-yellow-200" : member.rank === 2 ? "border-gray-200" : "border-orange-200"
                    }`}>
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-lg font-extrabold">
                          {member.avatar}
                        </div>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${member.rank === 1 ? "bg-yellow-400" : member.rank === 2 ? "bg-gray-300" : "bg-orange-400"
                          }`}>
                          <RankIcon size={12} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{member.name}</p>
                    {isMe && <p className="text-[10px] font-bold text-blue-600 mb-1">You</p>}
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{member.points}</p>
                    <p className="text-xs text-gray-400">points</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Flame size={11} className="text-red-400" />
                      <span className="text-xs text-gray-500">{member.streak}d streak</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Trophy size={15} className="text-yellow-500" />
              <h3 className="text-sm font-bold text-gray-900">{activeTeam?.name || "Team"} Rankings</h3>
            </div>
            {leaderboard.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No members found.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {leaderboard.map(member => {
                  const isMe = member.user_id === currentUser.id;
                  return (
                    <div key={member.rank} className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${isMe ? "bg-blue-50" : ""}`}>
                      <span className={`text-sm font-extrabold w-5 text-center ${member.rank === 1 ? "text-yellow-500" : member.rank === 2 ? "text-gray-400" : member.rank === 3 ? "text-orange-400" : "text-gray-400"
                        }`}>{member.rank}</span>
                      <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                          {isMe && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">You</span>}
                        </div>
                        <p className="text-xs text-gray-400">{member.total_completed} tasks · Level {member.level}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame size={12} className="text-red-400" />
                        <span className="text-xs text-gray-500">{member.streak}d</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-gray-900">{member.points}</p>
                        <p className="text-xs text-gray-400">pts</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BADGES TAB */}
      {activeTab === "badges" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(badge => {
              const Icon = badge.icon;
              return (
                <div key={badge.id} className={`bg-white border rounded-2xl p-5 text-center shadow-sm transition-all ${badge.earned ? `${badge.border} hover:shadow-md hover:-translate-y-0.5` : "border-gray-100 opacity-50 grayscale"
                  }`}>
                  <div className={`w-14 h-14 ${badge.earned ? badge.bg : "bg-gray-50"} rounded-2xl flex items-center justify-center mx-auto mb-3 border ${badge.earned ? badge.border : "border-gray-100"}`}>
                    {badge.earned ? <Icon size={24} className={badge.color} /> : <Lock size={20} className="text-gray-300" />}
                  </div>
                  <p className="text-xs font-bold text-gray-900 mb-1">{badge.label}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{badge.desc}</p>
                  {badge.earned && (
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600">Earned</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-800 mb-1">How to Earn Points</p>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {[
                  { action: "Complete a task", pts: "+20" },
                  { action: "Complete before deadline", pts: "+30" },
                  { action: "Daily streak bonus", pts: "+10" },
                  { action: "Earn a badge", pts: "+50" },
                  { action: "Help a teammate", pts: "+15" },
                  { action: "Sprint top performer", pts: "+100" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-blue-100 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-gray-600">{item.action}</span>
                    <span className="text-xs font-extrabold text-emerald-600">{item.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}