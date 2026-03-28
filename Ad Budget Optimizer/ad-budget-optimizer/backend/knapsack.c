#include "knapsack.h"
#include <math.h>

/* ═══════════════════════════════════════════════════════════════
   0-1 KNAPSACK  –  Dynamic Programming (bottom-up)
   ═══════════════════════════════════════════════════════════════
   dp[i][w] = maximum engagement achievable using the first i ads
              with a budget of w K-units.

   Recurrence:
     dp[i][w] = dp[i-1][w]                          (skip ad i)
              = max(dp[i-1][w],
                    dp[i-1][w - cost[i]] + eng[i])   (take ad i, if affordable)

   Final answer : dp[n][budget]
   Traceback    : walk backwards; if dp[i][w] != dp[i-1][w], ad i was taken
   ═══════════════════════════════════════════════════════════════ */
DPResult knapsack_dp(const Ad *ads, int n, int budget,
                     int dp_out[][MAX_BUDGET + 1])
{
    DPResult result = {0};
    long ops = 0;

    /* ── Fill DP table ─────────────────────────────────── */
    for (int i = 1; i <= n; i++) {
        int cost = ads[i - 1].cost;
        int eng  = ads[i - 1].engagement;

        for (int w = 0; w <= budget; w++) {
            ops++;
            dp_out[i][w] = dp_out[i - 1][w];          /* skip */

            if (cost <= w) {
                int take = dp_out[i - 1][w - cost] + eng;
                if (take > dp_out[i][w])
                    dp_out[i][w] = take;               /* take */
            }
        }
    }

    result.max_engagement = dp_out[n][budget];
    result.ops            = ops;

    /* ── Traceback ─────────────────────────────────────── */
    int w = budget;
    for (int i = n; i >= 1; i--) {
        if (dp_out[i][w] != dp_out[i - 1][w]) {
            result.selected[result.n_selected++] = i - 1;  /* 0-indexed */
            result.total_cost += ads[i - 1].cost;
            w -= ads[i - 1].cost;
        }
    }

    return result;
}

/* ═══════════════════════════════════════════════════════════════
   GREEDY HEURISTIC  –  Ratio sort (engagement ÷ cost)
   ═══════════════════════════════════════════════════════════════
   Step 1: sort ads descending by engagement/cost ratio  O(n log n)
   Step 2: iterate; take each ad if it fits              O(n)

   This is OPTIMAL for the fractional knapsack problem but NOT
   for the 0-1 variant — it can miss better combinations.
   ═══════════════════════════════════════════════════════════════ */

/* Comparison for qsort (descending ratio) */
static const Ad *g_ads_ptr;
static int ratio_cmp(const void *a, const void *b)
{
    int ia = *(const int *)a;
    int ib = *(const int *)b;
    double ra = (double)g_ads_ptr[ia].engagement / g_ads_ptr[ia].cost;
    double rb = (double)g_ads_ptr[ib].engagement / g_ads_ptr[ib].cost;
    if (rb > ra) return  1;
    if (rb < ra) return -1;
    return 0;
}

GreedyResult knapsack_greedy(const Ad *ads, int n, int budget)
{
    GreedyResult result = {0};
    int indices[MAX_ADS];
    for (int i = 0; i < n; i++) indices[i] = i;

    /* Sort by ratio */
    g_ads_ptr = ads;
    qsort(indices, n, sizeof(int), ratio_cmp);

    /* Approximate op count: n*log2(n) for sort + n for scan */
    result.ops = (long)(n * log2(n > 1 ? n : 2)) + n;

    int remaining = budget;
    for (int k = 0; k < n; k++) {
        int i = indices[k];
        if (ads[i].cost <= remaining) {
            result.selected[result.n_selected++] = i;   /* 0-indexed */
            remaining             -= ads[i].cost;
            result.total_cost     += ads[i].cost;
            result.max_engagement += ads[i].engagement;
        }
    }

    return result;
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

/** Format K-units as ₹ string: 50→₹50K, 150→₹1.5L, 1000→₹10L */
void fmt_inr(int k_units, char *buf, size_t buflen)
{
    long r = (long)k_units * 1000;
    if (r >= 10000000)
        snprintf(buf, buflen, "₹%.1fCr", r / 10000000.0);
    else if (r >= 100000)
        snprintf(buf, buflen, "₹%.1fL",  r / 100000.0);
    else
        snprintf(buf, buflen, "₹%ldK",   r / 1000);
}

void print_dp_result(const Ad *ads, const DPResult *r)
{
    char inr[32];
    fmt_inr(r->total_cost, inr, sizeof(inr));
    printf("\n─── DP Result (Optimal) ───────────────────────\n");
    printf("Max Engagement : %d\n", r->max_engagement);
    printf("Budget Used    : %s\n", inr);
    printf("Ads selected   : %d\n", r->n_selected);
    printf("Operations     : %ld cell-fills\n", r->ops);
    printf("Selected Ads   :\n");
    for (int i = 0; i < r->n_selected; i++) {
        int idx = r->selected[i];
        char cost_s[32];
        fmt_inr(ads[idx].cost, cost_s, sizeof(cost_s));
        printf("  [%2d] %-20s  %-12s  cost=%s  eng=%d\n",
               ads[idx].id, ads[idx].name, ads[idx].platform,
               cost_s, ads[idx].engagement);
    }
}

void print_greedy_result(const Ad *ads, const GreedyResult *r)
{
    char inr[32];
    fmt_inr(r->total_cost, inr, sizeof(inr));
    printf("\n─── Greedy Result (Heuristic) ──────────────────\n");
    printf("Max Engagement : %d\n", r->max_engagement);
    printf("Budget Used    : %s\n", inr);
    printf("Ads selected   : %d\n", r->n_selected);
    printf("Operations     : ~%ld\n", r->ops);
    printf("Selected Ads   :\n");
    for (int i = 0; i < r->n_selected; i++) {
        int idx = r->selected[i];
        char cost_s[32];
        fmt_inr(ads[idx].cost, cost_s, sizeof(cost_s));
        printf("  [%2d] %-20s  %-12s  cost=%s  eng=%d\n",
               ads[idx].id, ads[idx].name, ads[idx].platform,
               cost_s, ads[idx].engagement);
    }
}

void compare_results(const DPResult *dp, const GreedyResult *gr)
{
    printf("\n════════ Comparison ════════════════════════════\n");
    printf("%-22s  DP          Greedy\n", "");
    printf("%-22s  %-10d  %d\n",    "Max Engagement:",  dp->max_engagement, gr->max_engagement);
    printf("%-22s  %-10ld  ~%ld\n", "Operations:",      dp->ops,            gr->ops);
    if (gr->max_engagement > 0) {
        double gain = 100.0 * (dp->max_engagement - gr->max_engagement)
                             / gr->max_engagement;
        if (gain > 0.001)
            printf("DP advantage: +%.2f%% more engagement\n", gain);
        else
            printf("Both algorithms found the same solution.\n");
    }
    printf("Speed ratio: Greedy is ~%.0fx faster (fewer operations)\n",
           (double)dp->ops / (gr->ops > 0 ? gr->ops : 1));
}
