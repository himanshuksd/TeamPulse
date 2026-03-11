import { Users } from "lucide-react";

const members = [
  { name: "Member A", avatar: "MA", color: "bg-blue-500",    tasks: 8,  completed: 6, score: 84 },
  { name: "Member B", avatar: "MB", color: "bg-violet-500",  tasks: 10, completed: 5, score: 62 },
  { name: "Member C", avatar: "MC", color: "bg-emerald-500", tasks: 7,  completed: 7, score: 95 },
];

const getScoreStyle = (score) => {
  if (score >= 80) return { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (score >= 60) return { text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   };
  return                  { text: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"     };
};

export default function TeamTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-gray-900">Team Performance</h3>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
          Sprint 12
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Member</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Tasks</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Progress</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.map((m, i) => {
              const pct        = Math.round((m.completed / m.tasks) * 100);
              const scoreStyle = getScoreStyle(m.score);
              return (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {m.avatar}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">{m.completed}</span>/{m.tasks}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreStyle.text} ${scoreStyle.bg} ${scoreStyle.border}`}>
                      {m.score}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}