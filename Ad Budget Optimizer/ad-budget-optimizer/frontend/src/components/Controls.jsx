import { fmtINR } from '../utils/format.js';

const BUDGET_PRESETS = [
  { label: '₹50K',  value: 50   },
  { label: '₹1L',   value: 100  },
  { label: '₹2L',   value: 200  },
  { label: '₹5L',   value: 500  },
  { label: '₹10L',  value: 1000 },
  { label: '₹20L',  value: 2000 },
];

export default function Controls({ numAds, setNumAds, budget, setBudget, seed, setSeed, onRun }) {
  return (
    <div className="controls">
      <div className="ctrl-group">
        <span className="ctrl-label">Ads</span>
        <input type="range" min="5" max="20" value={numAds} step="1"
               onChange={e => setNumAds(+e.target.value)} style={{ width: 80 }} />
        <span className="ctrl-val">{numAds}</span>
      </div>

      <div className="ctrl-group ctrl-group-budget">
        <span className="ctrl-label">Budget</span>
        <input type="range" min="50" max="2000" value={budget} step="10"
               onChange={e => setBudget(+e.target.value)} style={{ width: 110 }} />
        <span className="ctrl-val">{fmtINR(budget)}</span>
        <div className="budget-presets">
          {BUDGET_PRESETS.map(p => (
            <button
              key={p.value}
              className={`preset-btn${budget === p.value ? ' preset-btn-active' : ''}`}
              onClick={() => setBudget(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ctrl-group">
        <span className="ctrl-label">Seed</span>
        <input type="range" min="1" max="99" value={seed} step="1"
               onChange={e => setSeed(+e.target.value)} style={{ width: 70 }} />
        <span className="ctrl-val">{seed}</span>
      </div>

      <button className="run-btn" onClick={onRun}>Regenerate ↗</button>
    </div>
  );
}
