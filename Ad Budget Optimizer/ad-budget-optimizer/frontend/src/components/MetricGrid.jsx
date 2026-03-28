import { fmtINR, fmtEng } from '../utils/format.js';

export default function MetricGrid({ budget, dpResult, grResult }) {
  if (!dpResult || !grResult) return null;

  const pct  = grResult.maxVal > 0
    ? ((dpResult.maxVal - grResult.maxVal) / grResult.maxVal * 100)
    : 0;
  const gain = dpResult.maxVal - grResult.maxVal;

  return (
    <div className="metric-grid">
      <div className="metric-card">
        <div className="metric-label">Budget</div>
        <div className="metric-value">{fmtINR(budget)}</div>
        <div className="metric-sub">Total campaign budget</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">DP Engagement</div>
        <div className="metric-value" style={{ color: '#1B8F6A' }}>
          {fmtEng(dpResult.maxVal)}
        </div>
        <div className="metric-sub">
          {dpResult.selected.size} ads · {fmtINR(dpResult.totalCost)} used
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Greedy Engagement</div>
        <div className="metric-value" style={{ color: '#C37B10' }}>
          {fmtEng(grResult.maxVal)}
        </div>
        <div className="metric-sub">
          {grResult.selected.size} ads · {fmtINR(grResult.totalCost)} used
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">DP Advantage</div>
        <div className="metric-value" style={{ color: pct > 0 ? '#1B8F6A' : '#888' }}>
          {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
        </div>
        <div className="metric-sub">
          {pct === 0
            ? 'Algorithms tied this run'
            : `DP gained ${fmtEng(gain)} more engagement`}
        </div>
      </div>
    </div>
  );
}
