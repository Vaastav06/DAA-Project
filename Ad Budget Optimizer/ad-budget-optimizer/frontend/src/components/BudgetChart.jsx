import { useEffect, useRef } from 'react';
import { fmtINR } from '../utils/format.js';

export default function BudgetChart({ dpResult, grResult, budget }) {
  const ref  = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!dpResult || !grResult || !ref.current) return;
    if (inst.current) { inst.current.destroy(); inst.current = null; }

    const remaining = [
      budget - dpResult.totalCost,
      budget - grResult.totalCost,
    ];

    inst.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: ['DP (Optimal)', 'Greedy'],
        datasets: [
          {
            label: 'Budget Used',
            data: [dpResult.totalCost, grResult.totalCost],
            backgroundColor: ['#1B8F6A', '#C37B10'],
            borderRadius: 4,
            stack: 'budget',
          },
          {
            label: 'Remaining',
            data: remaining,
            backgroundColor: ['rgba(27,143,106,0.15)', 'rgba(195,123,16,0.15)'],
            borderRadius: 4,
            stack: 'budget',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 12, padding: 14 } },
          tooltip: {
            callbacks: {
              label: ctx => {
                const label = ctx.dataset.label;
                return ` ${label}: ${fmtINR(ctx.raw)}`;
              },
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 12, weight: '600' } }, grid: { display: false }, stacked: true },
          y: {
            beginAtZero: true,
            stacked: true,
            ticks: { callback: v => fmtINR(v) },
          },
        },
      },
    });

    return () => { if (inst.current) { inst.current.destroy(); inst.current = null; } };
  }, [dpResult, grResult, budget]);

  return (
    <div className="chart-card">
      <div className="section-title">Budget Used: DP vs Greedy</div>
      <div className="chart-wrap-med"><canvas ref={ref} /></div>
    </div>
  );
}
