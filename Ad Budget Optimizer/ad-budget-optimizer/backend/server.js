/**
 * server.js — Ad Budget Optimizer Backend
 *
 * Exposes a REST API that runs the 0-1 Knapsack algorithm.
 * This is a faithful JavaScript port of backend/knapsack.c.
 * The C source in this directory can be compiled with `make`
 * and run as a standalone CLI for the same results.
 *
 * POST /api/optimize  { ads: Ad[], budget: number } → { dpResult, grResult }
 */

const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/* ═══════════════════════════════════════════════════════════
   ALGORITHM — JavaScript port of knapsack.c
   ═══════════════════════════════════════════════════════════ */

/**
 * 0-1 Knapsack DP  —  O(n × W)  —  guaranteed optimal
 * Mirrors knapsack_dp() in knapsack.c
 */
function knapsackDP(ads, budget) {
  const n = ads.length;
  const W = budget;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  let ops = 0;

  for (let i = 1; i <= n; i++) {
    const { cost, engagement } = ads[i - 1];
    for (let w = 0; w <= W; w++) {
      ops++;
      dp[i][w] = dp[i - 1][w];
      if (cost <= w) {
        const take = dp[i - 1][w - cost] + engagement;
        if (take > dp[i][w]) dp[i][w] = take;
      }
    }
  }

  const selected = [];
  const traceSet = new Set();
  let w = W;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(ads[i - 1].id);
      traceSet.add(`${i}-${w}`);
      w -= ads[i - 1].cost;
    }
    traceSet.add(`${i}-${w}`);
  }

  const totalCost = selected.reduce(
    (s, id) => s + (ads.find(a => a.id === id)?.cost ?? 0), 0
  );

  return {
    maxVal:    dp[n][W],
    selected,
    dp,
    traceSet:  [...traceSet],
    totalCost,
    ops,
  };
}

/**
 * Greedy (ratio sort)  —  O(n log n)  —  NOT guaranteed optimal for 0-1
 * Mirrors knapsack_greedy() in knapsack.c
 */
function knapsackGreedy(ads, budget) {
  const n      = ads.length;
  const sorted = [...ads].sort(
    (a, b) => b.engagement / b.cost - a.engagement / a.cost
  );
  let rem   = budget;
  let total = 0;
  const selected = [];
  const ops = Math.ceil(n * Math.log2(n + 1)) + n;

  for (const ad of sorted) {
    if (ad.cost <= rem) {
      selected.push(ad.id);
      rem   -= ad.cost;
      total += ad.engagement;
    }
  }

  const totalCost = selected.reduce(
    (s, id) => s + (ads.find(a => a.id === id)?.cost ?? 0), 0
  );

  return { maxVal: total, selected, totalCost, ops };
}

/* ═══════════════════════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════════════════════ */

app.post('/api/optimize', (req, res) => {
  const { ads, budget } = req.body;

  if (!Array.isArray(ads) || ads.length === 0 || !budget) {
    return res.status(400).json({ error: 'ads[] and budget are required' });
  }

  const dpResult = knapsackDP(ads, budget);
  const grResult = knapsackGreedy(ads, budget);

  res.json({ dpResult, grResult });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Ad Budget Optimizer API running on http://localhost:${PORT}`);
  console.log(`POST /api/optimize  { ads, budget } → { dpResult, grResult }`);
});
