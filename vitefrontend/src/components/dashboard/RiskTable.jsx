import { AlertTriangle, Clock } from "lucide-react";

const risks = [
  { task: "API Integration", deadline: "2 days", risk: 72, assignee: "AK" },
  { task: "UI Polish",        deadline: "1 day",  risk: 65, assignee: "RV" },
  { task: "Auth Flow",        deadline: "3 days", risk: 58, assignee: "SK" },
];

const getRiskBadge = (risk) => {
  if (risk >= 70) return "bg-red-50 text-red-700 border border-red-200";
  if (risk >= 50) return "bg-amber-50 text-amber-700 border border-amber-200";
  return               "bg-emerald-50 text-emerald-700 border border-emerald-200";
};

const getRiskBar = (risk) => {
  if (risk >= 70) return "bg-red-500";
  if (risk >= 50) return "bg-amber-500";
  return               "bg-emerald-500";
};

const AVATARS = { AK: "bg-blue-500", RV: "bg-violet-500", SK: "bg-emerald-500" };

export default function RiskTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          <h3 className="text-sm font-bold text-gray-900">High Risk Tasks</h3>
        </div>
        <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
          {risks.length} at risk
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Task</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Deadline</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Risk Level</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {risks.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{r.task}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={12} />
                    {r.deadline}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${getRiskBar(r.risk)}`} style={{ width: `${r.risk}%` }} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRiskBadge(r.risk)}`}>
                      {r.risk}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`w-7 h-7 rounded-full ${AVATARS[r.assignee]} flex items-center justify-center text-white text-xs font-bold`}>
                    {r.assignee}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}