#include <stdio.h>
#include <time.h>

struct Ad {
    int cost;
    int engagement;
};

int max(int a, int b) {
    return (a > b) ? a : b;
}

int knapsackDP(struct Ad ads[], int n, int budget) {
    int dp[50][5000];

    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= budget; w++) {
            if (i == 0 || w == 0)
                dp[i][w] = 0;
            else if (ads[i-1].cost <= w)
                dp[i][w] = max(
                    ads[i-1].engagement + dp[i-1][w - ads[i-1].cost],
                    dp[i-1][w]
                );
            else
                dp[i][w] = dp[i-1][w];
        }
    }
    return dp[n][budget];
}

int greedy(struct Ad ads[], int n, int budget) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            float r1 = (float)ads[i].engagement / ads[i].cost;
            float r2 = (float)ads[j].engagement / ads[j].cost;

            if (r2 > r1) {
                struct Ad temp = ads[i];
                ads[i] = ads[j];
                ads[j] = temp;
            }
        }
    }

    int total = 0;
    for (int i = 0; i < n; i++) {
        if (ads[i].cost <= budget) {
            budget -= ads[i].cost;
            total += ads[i].engagement;
        }
    }
    return total;
}

int main() {
    int n = 5;
    int budget = 1000;

    struct Ad ads[5] = {
        {200, 300},
        {300, 500},
        {400, 650},
        {500, 800},
        {250, 400}
    };

    clock_t start, end;

    start = clock();
    int dpResult = knapsackDP(ads, n, budget);
    end = clock();
    double dpTime = (double)(end - start) / CLOCKS_PER_SEC;

    start = clock();
    int grResult = greedy(ads, n, budget);
    end = clock();
    double grTime = (double)(end - start) / CLOCKS_PER_SEC;

    printf("DP:%d\nGreedy:%d\nDP_Time:%f\nGreedy_Time:%f\n",
           dpResult, grResult, dpTime, grTime);

    return 0;
}