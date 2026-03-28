import { useEffect, useRef } from 'react';
import { fmtEng } from '../utils/format.js';

export default function EngagementChart({ dpResult, grResult }) {
  const ref  = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!dpResult || !grResult || !ref.current) return;
    if (inst.current) { inst.current.destroy(); inst.current = null; }

    inst.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: ['DP (Optimal)', 'Greedy'],
        datasets: [
          {
            label: 'Total Engagement',
            data: [dpResult.maxVal, grResult.maxVal],
            backgroundColor: ['#1B8F6A', '#C37B10'],
            borderRadius: 6,
            barThickness: 60,
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
              label: ctx => ` Engagement: ${fmtEng(ctx.raw)}`,
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 13, weight: '600' } }, grid: { display: false } },
          y: {
            beginAtZero: true,
            ticks: { callback: v => fmtEng(v) },
          },
        },
      },
    });

    return () => { if (inst.current) { inst.current.destroy(); inst.current = null; } };
  }, [dpResult, grResult]);

  return (
    <div className="chart-card">
      <div className="section-title">Engagement Comparison: DP vs Greedy</div>
      <div className="chart-wrap-med"><canvas ref={ref} /></div>
    </div>
  );
}
