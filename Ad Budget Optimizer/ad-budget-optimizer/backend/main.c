#include "knapsack.h"
#include <stdio.h>

/* ─── Static DP table (stack-allocated for simplicity) ─── */
static int dp_table[MAX_ADS + 1][MAX_BUDGET + 1];

int main(void)
{
    /* ── Sample Ad Data (INR, cost in K-units = ₹1,000 each) ── */
    Ad ads[] = {
        {1,  "Banner 1",   "Instagram", "Clicks",      30,  4500},
        {2,  "Video 2",    "YouTube",   "Views",       80,  9200},
        {3,  "Story 3",    "Facebook",  "Impressions", 20,  3100},
        {4,  "Carousel 4", "Instagram", "Reach",       50,  6800},
        {5,  "Search 5",   "Google",    "Clicks",      40,  5200},
        {6,  "Display 6",  "Google",    "Impressions", 25,  3400},
        {7,  "Reel 7",     "Instagram", "Views",       60,  7900},
        {8,  "Sponsored 8","LinkedIn",  "Clicks",      35,  4100},
        {9,  "Banner 9",   "TikTok",    "Views",       45,  5900},
        {10, "Video 10",   "YouTube",   "Views",       90,  8800},
    };
    int n      = sizeof(ads) / sizeof(ads[0]);
    int budget = 200;   /* ₹2,00,000 = 200 K-units */

    char budget_str[32];
    fmt_inr(budget, budget_str, sizeof(budget_str));
    printf("Ad Budget Optimizer — 0-1 Knapsack\n");
    printf("Ads: %d   Budget: %s\n\n", n, budget_str);

    /* ── Run DP ───────────────────────────────────────── */
    memset(dp_table, 0, sizeof(dp_table));
    DPResult dp = knapsack_dp(ads, n, budget, dp_table);
    print_dp_result(ads, &dp);

    /* ── Run Greedy ───────────────────────────────────── */
    GreedyResult gr = knapsack_greedy(ads, n, budget);
    print_greedy_result(ads, &gr);

    /* ── Compare ──────────────────────────────────────── */
    compare_results(&dp, &gr);

    /* ── Print partial DP table (first 5 ads, 11 budget cols) ── */
    printf("\n─── Partial DP Table (rows=ads, cols=budget) ───\n");
    int show_n = (n < 5) ? n : 5;
    int step   = budget / 10;
    if (step < 1) step = 1;

    printf("%-18s", "Ad \\ Budget");
    for (int w = 0; w <= budget; w += step)
        printf("  %4d", w);
    printf("\n");

    for (int i = 0; i <= show_n; i++) {
        if (i == 0) printf("%-18s", "(none)");
        else        printf("%-18s", ads[i-1].name);
        for (int w = 0; w <= budget; w += step)
            printf("  %4d", dp_table[i][w]);
        printf("\n");
    }
    if (n > 5)
        printf("... %d more rows\n", n - 5);

    return 0;
}
