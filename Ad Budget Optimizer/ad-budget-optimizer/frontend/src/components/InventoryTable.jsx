import { fmtINR, fmtEng } from '../utils/format.js';

export default function InventoryTable({ ads, dpResult, grResult }) {
  if (!dpResult || !grResult) return null;

  return (
    <div>
      <div className="section-title">Ad Inventory Table</div>
      <div className="tbl-card">
        <div className="tbl-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Platform</th>
                <th>Cost</th>
                <th>Engagement</th>
                <th>Value/Cost</th>
                <th>DP</th>
                <th>Greedy</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => {
                const inDp  = dpResult.selected.has(ad.id);
                const inGr  = grResult.selected.has(ad.id);
                const ratio = (ad.engagement / ad.cost).toFixed(1);
                return (
                  <tr key={ad.id}>
                    <td style={{ color: 'var(--text3)', fontWeight: 600 }}>{ad.id}</td>
                    <td style={{ fontWeight: 500 }}>{ad.name}</td>
                    <td>{ad.platform}</td>
                    <td>{fmtINR(ad.cost)}</td>
                    <td>
                      {fmtEng(ad.engagement)}{' '}
                      <span style={{ color: 'var(--text3)', fontSize: 10 }}>{ad.metric}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text2)' }}>{ratio}</td>
                    <td>
                      <span className={`tbadge ${inDp ? 'tbadge-dp' : 'tbadge-no'}`}>
                        {inDp ? 'Selected' : '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`tbadge ${inGr ? 'tbadge-gr' : 'tbadge-no'}`}>
                        {inGr ? 'Selected' : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
