import { fmtEng, fmtINR } from '../utils/format.js';

export default function AlgorithmEfficiency({ dpResult, grResult, numAds, budget }) {
  if (!dpResult || !grResult) return null;

  const diff       = dpResult.maxVal - grResult.maxVal;
  const pct        = grResult.maxVal > 0
    ? ((diff / grResult.maxVal) * 100).toFixed(1)
    : '0';
  const speedRatio = (dpResult.ops / Math.max(grResult.ops, 1)).toFixed(0);
  const dpWins     = diff > 0;

  return (
    <div className="algo-wrap">
      <div className="section-title">Algorithm Efficiency Comparison</div>

      {/* Simple summary strip */}
      <div className="algo-summary-strip">
        <div className="algo-summary-item algo-summary-dp">
          <div className="algo-summary-name">Dynamic Programming</div>
          <div className="algo-summary-big">{fmtEng(dpResult.maxVal)}</div>
          <div className="algo-summary-sub">engagement</div>
          <div className="algo-summary-tag tag-dp">✓ Optimal · O(n×W)</div>
        </div>

        <div className="algo-vs-col">
          <div className="vs-circle">VS</div>
          {dpWins
            ? <div className="vs-label dp-win">DP +{pct}%</div>
            : <div className="vs-label tie-label">Tied!</div>
          }
          <div className="vs-speed">{speedRatio}× slower</div>
        </div>

        <div className="algo-summary-item algo-summary-gr">
          <div className="algo-summary-name">Greedy Heuristic</div>
          <div className="algo-summary-big">{fmtEng(grResult.maxVal)}</div>
          <div className="algo-summary-sub">engagement</div>
          <div className="algo-summary-tag tag-gr">⚡ Fast · O(n log n)</div>
        </div>
      </div>

      {/* Simple explanation */}
      <div className="algo-explain">
        {dpWins ? (
          <>
            <strong>Why DP wins:</strong> Greedy picks ads with the best engagement-per-rupee ratio,
            but this can block better combinations. DP tests every possible combination ({dpResult.ops.toLocaleString()} sub-problems)
            and guarantees the best answer — at the cost of being <strong>{speedRatio}× more operations</strong>.
            Here it found <strong>+{pct}% more engagement</strong> ({fmtEng(diff)} extra) for the same {fmtINR(budget)} budget.
          </>
        ) : (
          <>
            <strong>Greedy matched DP this time!</strong> With this particular mix of costs and engagements,
            the greedy selection happened to pick the same ads as the optimal DP solution.
            Change the seed or budget to see them diverge. Greedy was still <strong>{speedRatio}× fewer operations</strong>.
          </>
        )}
      </div>
    </div>
  );
}
