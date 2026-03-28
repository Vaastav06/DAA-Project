#ifndef KNAPSACK_H
#define KNAPSACK_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ADS     50
#define MAX_BUDGET  2000   /* in K-units (1 unit = ₹1,000) */
#define NAME_LEN    64
#define METRIC_LEN  32

/* ─── Data Structures ─────────────────────────────────── */

typedef struct {
    int  id;
    char name[NAME_LEN];
    char platform[NAME_LEN];
    char metric[METRIC_LEN];
    int  cost;           /* in K-units, e.g. 50 = ₹50,000  */
    int  engagement;     /* clicks / impressions / etc.      */
} Ad;

typedef struct {
    int  max_engagement;
    int  selected[MAX_ADS];
    int  n_selected;
    int  total_cost;
    long ops;            /* cell-fills performed             */
} DPResult;

typedef struct {
    int  max_engagement;
    int  selected[MAX_ADS];
    int  n_selected;
    int  total_cost;
    long ops;            /* comparisons performed            */
} GreedyResult;

/* ─── Function Prototypes ─────────────────────────────── */

/**
 * knapsack_dp  –  0-1 Knapsack via bottom-up Dynamic Programming
 *
 * Time  : O(n × W)   — pseudo-polynomial, guaranteed optimal
 * Space : O(n × W)   — full dp table (traceback-capable)
 *
 * @param ads     array of Ad structs
 * @param n       number of ads
 * @param budget  total budget in K-units
 * @param dp_out  caller-allocated (n+1)×(budget+1) table; filled in-place
 * @return        DPResult with selection, cost, ops
 */
DPResult knapsack_dp(const Ad *ads, int n, int budget, int dp_out[][MAX_BUDGET + 1]);

/**
 * knapsack_greedy  –  Greedy heuristic: sort by engagement/cost ratio
 *
 * Time  : O(n log n)  — NOT guaranteed optimal for 0-1 knapsack
 * Space : O(n)        — index array for sorting
 *
 * @param ads     array of Ad structs
 * @param n       number of ads
 * @param budget  total budget in K-units
 * @return        GreedyResult with selection, cost, ops
 */
GreedyResult knapsack_greedy(const Ad *ads, int n, int budget);

/* ─── Helpers ─────────────────────────────────────────── */
void fmt_inr(int k_units, char *buf, size_t buflen);
void print_dp_result(const Ad *ads, const DPResult *r);
void print_greedy_result(const Ad *ads, const GreedyResult *r);
void compare_results(const DPResult *dp, const GreedyResult *gr);

#endif /* KNAPSACK_H */
