import { useEffect, useRef } from 'react';
import { fmtINR, fmtEng } from '../utils/format.js';

export default function BarChart({ ads, dpResult, grResult }) {
  const ref  = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!ads.length || !dpResult || !grResult || !ref.current) return;
    if (inst.current) { inst.current.destroy(); inst.current = null; }

    const dpS = dpResult.selected;
    const grS = grResult.selected;

    // DP-selected: vibrant green; greedy-only: warm amber; neither: faded
    const barColors  = ads.map(a =>
      dpS.has(a.id) ? '#1B8F6A' :
      grS.has(a.id) ? '#C37B10' :
                      'rgba(180,177,168,0.30)');
    const barBorders = ads.map(a =>
      dpS.has(a.id) ? '#0D7050' :
      grS.has(a.id) ? '#9E5F00' :
                      'transparent');

    // Engagement line: selected ads are fully visible, others fade
    const ptColors = ads.map(a =>
      (dpS.has(a.id) || grS.has(a.id)) ? 'rgba(99,89,220,0.9)' : 'rgba(160,155,210,0.20)');
    const ptRadius = ads.map(a =>
      (dpS.has(a.id) || grS.has(a.id)) ? 6 : 2);
    const lineSegColors = ads.map(a =>
      (dpS.has(a.id) || grS.has(a.id)) ? 'rgba(99,89,220,0.75)' : 'rgba(180,175,230,0.20)');

    inst.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: ads.map(a => a.name),
        datasets: [
          {
            label: 'Cost (₹K units)',
            data: ads.map(a => a.cost),
            backgroundColor: barColors,
            borderColor: barBorders,
            borderWidth: 1.5,
            borderRadius: 4,
            yAxisID: 'y',
            order: 2,
          },
          {
            label: 'Engagement',
            data: ads.map(a => a.engagement),
            type: 'line',
            borderColor: 'rgba(99,89,220,0.5)',
            segment: {
              borderColor: ctx => {
                const i = ctx.p0DataIndex;
                return lineSegColors[i] ?? 'rgba(99,89,220,0.5)';
              },
            },
            backgroundColor: ptColors,
            pointBackgroundColor: ptColors,
            pointRadius: ptRadius,
            pointHoverRadius: 8,
            tension: 0.35,
            yAxisID: 'y2',
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: ctx => {
                const ad = ads[ctx[0].dataIndex];
                const inDp = dpS.has(ad.id), inGr = grS.has(ad.id);
                const tag = inDp && inGr ? ' [DP + Greedy]'
                          : inDp         ? ' [DP selected]'
                          : inGr         ? ' [Greedy only]'
                          :               '';
                return ad.name + tag;
              },
              label: ctx => {
                const ad = ads[ctx.dataIndex];
                if (ctx.datasetIndex === 0) return ` Cost: ${fmtINR(ad.cost)}`;
                return ` ${ad.metric}: ${fmtEng(ad.engagement)}`;
              },
            },
          },
        },
        scales: {
          x:  {
            ticks: { font: { size: 10 }, maxRotation: 45, autoSkip: false },
            grid: { display: false },
          },
          y:  {
            title: { display: true, text: 'Cost (₹K units)', font: { size: 11 } },
            ticks: { callback: v => fmtINR(v) },
          },
          y2: {
            position: 'right',
            title: { display: true, text: 'Engagement', font: { size: 11 } },
            grid: { drawOnChartArea: false },
            ticks: { callback: v => fmtEng(v) },
          },
        },
      },
    });

    return () => { if (inst.current) { inst.current.destroy(); inst.current = null; } };
  }, [ads, dpResult, grResult]);

  return (
    <div className="chart-card">
      <div className="section-title">Cost vs Engagement — Selected Ads Highlighted</div>
      <div className="chart-wrap-tall"><canvas ref={ref} /></div>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#1B8F6A' }} />DP Selected
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#C37B10' }} />Greedy Only
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'rgba(180,177,168,0.4)' }} />Not Selected
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#6359DC' }} />
          Engagement (highlighted when selected)
        </div>
      </div>
    </div>
  );
}
