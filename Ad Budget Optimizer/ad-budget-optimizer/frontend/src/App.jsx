import { useState, useMemo, useCallback } from 'react';
import { genAds, knapsackDP, knapsackGreedy } from './utils/algorithms.js';

import Header              from './components/Header.jsx';
import Controls            from './components/Controls.jsx';
import MetricGrid          from './components/MetricGrid.jsx';
import AlgorithmEfficiency from './components/AlgorithmEfficiency.jsx';
import CompareCards        from './components/CompareCards.jsx';
import AdEditor            from './components/AdEditor.jsx';
import BarChart            from './components/BarChart.jsx';
import EngagementChart     from './components/EngagementChart.jsx';
import BudgetChart         from './components/BudgetChart.jsx';
import InventoryTable      from './components/InventoryTable.jsx';
import DPTable             from './components/DPTable.jsx';

export default function App() {
  const [numAds,  setNumAds]  = useState(10);
  const [budget,  setBudget]  = useState(350);   // ₹3.5L default
  const [seed,    setSeed]    = useState(42);
  const [ads,     setAds]     = useState(() => genAds(10, 42));
  const [baseAds, setBaseAds] = useState(() => genAds(10, 42));

  /* Re-run algorithms automatically whenever ads or budget change */
  const dpResult = useMemo(
    () => ads.length > 0 ? knapsackDP(ads, budget) : null,
    [ads, budget]
  );
  const grResult = useMemo(
    () => ads.length > 0 ? knapsackGreedy(ads, budget) : null,
    [ads, budget]
  );

  const regenerate = useCallback(() => {
    const fresh = genAds(numAds, seed);
    setBaseAds(fresh);
    setAds(fresh);
  }, [numAds, seed]);

  const handleAdsChange = useCallback(updated => setAds(updated), []);
  const handleReset     = useCallback(() => setAds([...baseAds]), [baseAds]);

  return (
    <div>
      <Header />
      <div className="main">

        {/* Controls */}
        <div className="section">
          <Controls
            numAds={numAds} setNumAds={setNumAds}
            budget={budget}  setBudget={setBudget}
            seed={seed}      setSeed={setSeed}
            onRun={regenerate}
          />
        </div>

        {/* KPI Cards */}
        <div className="section">
          <MetricGrid budget={budget} dpResult={dpResult} grResult={grResult} />
        </div>

        {/* Efficiency comparison */}
        <div className="section">
          <AlgorithmEfficiency
            dpResult={dpResult} grResult={grResult}
            numAds={numAds} budget={budget}
          />
        </div>

        {/* Selected ads per algorithm */}
        <div className="section">
          <div className="section-title">Selected Ads per Algorithm</div>
          <CompareCards ads={ads} budget={budget} dpResult={dpResult} grResult={grResult} />
        </div>

        {/* Ad Editor */}
        <AdEditor ads={ads} onAdsChange={handleAdsChange} onReset={handleReset} />

        {/* Cost vs Engagement chart */}
        <div className="section">
          <BarChart ads={ads} dpResult={dpResult} grResult={grResult} />
        </div>

        {/* Engagement comparison + Budget comparison side by side */}
        <div className="section two-col">
          <EngagementChart dpResult={dpResult} grResult={grResult} />
          <BudgetChart     dpResult={dpResult} grResult={grResult} budget={budget} />
        </div>

        {/* Inventory table */}
        <div className="section">
          <InventoryTable ads={ads} dpResult={dpResult} grResult={grResult} />
        </div>

        {/* DP table */}
        <div className="section">
          <DPTable ads={ads} dpResult={dpResult} budget={budget} />
        </div>

      </div>

      <footer className="footer">
        Ad Budget Optimizer · 0-1 Knapsack — Vaastav B - Pranav
      </footer>
    </div>
  );
}
