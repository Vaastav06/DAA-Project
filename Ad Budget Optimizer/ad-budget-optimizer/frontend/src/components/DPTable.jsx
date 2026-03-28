import { fmtINR, fmtEng } from '../utils/format.js';

export default function DPTable({ ads, dpResult, budget }) {
  if (!dpResult) return null;

  const n    = ads.length;
  const W    = budget;
  const step = Math.max(1, Math.floor(W / 14));
  const cols = [];
  for (let w = 0; w <= W; w += step) cols.push(w);
  if (cols[cols.length - 1] !== W) cols.push(W);
  const maxRows = Math.min(n + 1, 13);

  return (
    <div>
      <div className="section-title">DP Table — Sub-problem Grid</div>
      <div className="dp-note">
        Rows = ads added one by one · Cols = budget capacity {fmtINR(0)} → {fmtINR(W)} ·{' '}
        <span style={{ background: '#EEF0FE', color: '#3730A3', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>
          purple
        </span>{' '}= traceback path ·{' '}
        <span style={{ background: 'var(--dp-bg)', color: 'var(--dp-text)', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>
          green
        </span>{' '}= optimal value
      </div>
      <div className="tbl-card">
        <div className="dp-outer">
          <table className="dp-table">
            <thead>
              <tr>
                <th className="row-head">Ad \ W</th>
                {cols.map(w => <th key={w}>{fmtINR(w)}</th>)}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxRows }, (_, i) => (
                <tr key={i}>
                  <th className="row-head">{i === 0 ? '—' : ads[i - 1].name}</th>
                  {cols.map(w => {
                    const isMax   = (i === n) && dpResult.dp[i][w] === dpResult.maxVal && dpResult.dp[i][w] > 0;
                    const isTrace = dpResult.traceSet.has(`${i}-${w}`);
                    return (
                      <td key={w} className={isMax ? 'cell-max' : isTrace ? 'cell-trace' : ''}>
                        {fmtEng(dpResult.dp[i][w])}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {n > 12 && (
                <tr>
                  <td colSpan={cols.length + 1}
                      style={{ textAlign: 'center', color: 'var(--text3)', fontStyle: 'italic', padding: '8px' }}>
                    … {n - 12} more rows hidden — reduce ads to see full table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
