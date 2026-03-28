import { fmtINR, fmtEng } from '../utils/format.js';

export default function CompareCards({ ads, budget, dpResult, grResult }) {
  if (!dpResult || !grResult) return null;

  const dpList = [...dpResult.selected].map(id => ads.find(a => a.id === id)).filter(Boolean);
  const grList = [...grResult.selected].map(id => ads.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="two-col">
      <div className="compare-card compare-card-dp">
        <div className="compare-h3 compare-h3-dp">DP — Optimal Selection</div>
        <div className="pills-wrap">
          {dpList.map(ad => (
            <span key={ad.id} className="pill pill-dp"
                  title={`${fmtEng(ad.engagement)} ${ad.metric} · ${ad.platform}`}>
              {ad.name} ({fmtINR(ad.cost)})
            </span>
          ))}
          {dpList.length === 0 && (
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>No ads fit the budget</span>
          )}
        </div>
        <div className="compare-foot">
          Budget used: <span>{fmtINR(dpResult.totalCost)}</span> of <span>{fmtINR(budget)}</span>
          &nbsp;·&nbsp;<span>{dpList.length} ads</span>
        </div>
      </div>

      <div className="compare-card compare-card-gr">
        <div className="compare-h3 compare-h3-gr">Greedy — Heuristic Selection</div>
        <div className="pills-wrap">
          {grList.map(ad => (
            <span key={ad.id} className="pill pill-gr"
                  title={`${fmtEng(ad.engagement)} ${ad.metric} · ${ad.platform}`}>
              {ad.name} ({fmtINR(ad.cost)})
            </span>
          ))}
          {grList.length === 0 && (
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>No ads fit the budget</span>
          )}
        </div>
        <div className="compare-foot">
          Budget used: <span>{fmtINR(grResult.totalCost)}</span> of <span>{fmtINR(budget)}</span>
          &nbsp;·&nbsp;<span>{grList.length} ads</span>
        </div>
      </div>
    </div>
  );
}
