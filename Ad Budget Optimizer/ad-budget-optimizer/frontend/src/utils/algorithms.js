/**
 * algorithms.js — JavaScript port of backend/knapsack.c
 *
 * knapsackDP    mirrors knapsack_dp()     — O(n×W), globally optimal
 * knapsackGreedy mirrors knapsack_greedy() — O(n log n), heuristic
 * genAds        generates seeded random ad data
 */

export const PLATFORMS = [
  'Instagram', 'Facebook', 'YouTube', 'TikTok',
  'Google', 'X (Twitter)', 'LinkedIn', 'Pinterest',
];
export const AD_TYPES = [
  'Banner', 'Video', 'Story', 'Carousel',
  'Search', 'Display', 'Reel', 'Sponsored',
];
export const METRICS = ['Clicks', 'Impressions', 'Conversions', 'Views', 'Reach'];

function seededRand(seed) {
  let s = (seed * 1_664_525 + 1_013_904_223) >>> 0;
  return () => {
    s = ((s * 1_664_525 + 1_013_904_223)) >>> 0;
    return s / 0xFFFFFFFF;
  };
}

export function genAds(n, seed) {
  const r = seededRand(seed);
  return Array.from({ length: n }, (_, i) => {
    const cost       = (Math.floor(r() * 19) + 1) * 5;  // 5–95 K-units
    const engagement = Math.floor(r() * 8_000) + 2_000; // 2K–10K
    return {
      id:         i + 1,
      name:       AD_TYPES[i % AD_TYPES.length] + ' ' + (i + 1),
      platform:   PLATFORMS[Math.floor(r() * PLATFORMS.length)],
      cost,
      engagement,
      metric:     METRICS[Math.floor(r() * METRICS.length)],
    };
  });
}

/**
 * 0-1 Knapsack DP — O(n × W) — guaranteed optimal
 * Mirrors knapsack_dp() in backend/knapsack.c
 */
export function knapsackDP(ads, budget) {
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

  const selected = new Set();
  const traceSet = new Set();
  let w = W;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.add(ads[i - 1].id);
      traceSet.add(`${i}-${w}`);
      w -= ads[i - 1].cost;
    }
    traceSet.add(`${i}-${w}`);
  }

  const totalCost = [...selected].reduce(
    (s, id) => s + (ads.find(a => a.id === id)?.cost ?? 0), 0
  );

  return { maxVal: dp[n][W], selected, dp, traceSet, totalCost, ops };
}

/**
 * Greedy (ratio sort) — O(n log n) — NOT guaranteed optimal for 0-1
 * Mirrors knapsack_greedy() in backend/knapsack.c
 */
export function knapsackGreedy(ads, budget) {
  const n      = ads.length;
  const sorted = [...ads].sort(
    (a, b) => b.engagement / b.cost - a.engagement / a.cost
  );
  let rem   = budget;
  let total = 0;
  const selected = new Set();
  const ops = Math.ceil(n * Math.log2(n + 1)) + n;

  for (const ad of sorted) {
    if (ad.cost <= rem) {
      selected.add(ad.id);
      rem   -= ad.cost;
      total += ad.engagement;
    }
  }

  const totalCost = [...selected].reduce(
    (s, id) => s + (ads.find(a => a.id === id)?.cost ?? 0), 0
  );

  return { maxVal: total, selected, totalCost, ops };
}
