import React, { useState } from 'react';
import { fmtINR } from '../utils/format.js';
import { METRICS } from '../utils/algorithms.js';

export default function AdEditor({ ads, onAdsChange, onReset }) {
  const [open, setOpen] = useState(false);

  const update = (id, field, raw) => {
    const val = (field === 'cost' || field === 'engagement') ? Math.max(1, +raw) : raw;
    onAdsChange(ads.map(ad => ad.id === id ? { ...ad, [field]: val } : ad));
  };

  return (
    <div className="section">
      <div className="editor-topbar">
        <span className="section-title" style={{ margin: 0 }}>Ad Inventory Editor</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {open && <button className="reset-btn" onClick={onReset}>↺ Reset to Generated</button>}
          <button className={`toggle-btn${open ? ' on' : ''}`} onClick={() => setOpen(v => !v)}>
            {open ? '✕ Close Editor' : '✏ Edit Ads'}
          </button>
        </div>
      </div>

      {open && (
        <div className="ed-card">
          <div className="ed-wrap">
            <table className="ed-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ad Name</th>
                  <th>Platform</th>
                  <th>Cost (₹K units)</th>
                  <th>Engagement</th>
                  <th>Metric</th>
                </tr>
              </thead>
              <tbody>
                {ads.map(ad => (
                  <tr key={ad.id}>
                    <td style={{ color: 'var(--text3)', fontWeight: 600, width: 30 }}>{ad.id}</td>
                    <td style={{ minWidth: 130 }}>
                      <input className="ed-input" type="text" value={ad.name}
                             onChange={e => update(ad.id, 'name', e.target.value)} />
                    </td>
                    <td style={{ minWidth: 110 }}>
                      <input className="ed-input" type="text" value={ad.platform}
                             onChange={e => update(ad.id, 'platform', e.target.value)} />
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input className="ed-input" type="number" value={ad.cost}
                               min="5" max="2000" step="5" style={{ width: 70 }}
                               onChange={e => update(ad.id, 'cost', e.target.value)} />
                        <span className="ed-num">{fmtINR(ad.cost)}</span>
                      </div>
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <input className="ed-input" type="number" value={ad.engagement}
                             min="100" max="200000" step="100" style={{ width: 90 }}
                             onChange={e => update(ad.id, 'engagement', e.target.value)} />
                    </td>
                    <td>
                      <select className="ed-select" value={ad.metric}
                              onChange={e => update(ad.id, 'metric', e.target.value)}>
                        {METRICS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
