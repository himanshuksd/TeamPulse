import { TrendingUp, TrendingDown } from "lucide-react";

const getRiskStyle = (value) => {
  if (value === "Low Risk")      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" };
  if (value === "Moderate Risk") return { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500"   };
  if (value === "High Risk")     return { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500"     };
  return                                { bg: "bg-gray-50",    text: "text-gray-700",    border: "border-gray-200",    dot: "bg-gray-400"    };
};

export default function RiskCard({ title, value, trend, trendUp }) {
  const isRiskCard = title?.toLowerCase().includes("risk");
  const riskStyle  = getRiskStyle(value);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>

      {isRiskCard ? (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}>
          <span className={`w-2 h-2 rounded-full ${riskStyle.dot}`} />
          {value}
        </div>
      ) : (
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      )}

      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      )}
    </div>
  );
}