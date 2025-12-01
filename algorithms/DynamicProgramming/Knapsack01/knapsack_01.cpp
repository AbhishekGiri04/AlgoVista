#include <iostream>
#include <vector>
#include <fstream>
using namespace std;

struct KnapsackStep {
    int i, w;
    int itemValue, itemWeight;
    int takeValue, skipValue;
    int dpValue;
    bool canTake;
    string decision;
};

void knapsack01WithSteps(vector<int>& weights, vector<int>& values, int capacity, ofstream& output) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    vector<KnapsackStep> steps;
    
    // Fill DP table with steps
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            KnapsackStep step;
            step.i = i;
            step.w = w;
            step.itemValue = values[i-1];
            step.itemWeight = weights[i-1];
            step.canTake = (weights[i-1] <= w);
            
            if (step.canTake) {
                step.takeValue = values[i-1] + dp[i-1][w - weights[i-1]];
                step.skipValue = dp[i-1][w];
                dp[i][w] = max(step.takeValue, step.skipValue);
                step.decision = (step.takeValue > step.skipValue) ? "Take item" : "Skip item";
            } else {
                step.takeValue = -1;
                step.skipValue = dp[i-1][w];
                dp[i][w] = dp[i-1][w];
                step.decision = "Cannot take (too heavy)";
            }
            
            step.dpValue = dp[i][w];
            steps.push_back(step);
        }
    }
    
    // Backtrack to find selected items
    vector<bool> selected(n, false);
    int w = capacity;
    for (int i = n; i > 0 && dp[i][w] > 0; i--) {
        if (dp[i][w] != dp[i-1][w]) {
            selected[i-1] = true;
            w -= weights[i-1];
        }
    }
    
    // Output JSON
    output << "{\n";
    output << "  \"n\": " << n << ",\n";
    output << "  \"capacity\": " << capacity << ",\n";
    
    // Items
    output << "  \"items\": [\n";
    for (int i = 0; i < n; i++) {
        if (i > 0) output << ",\n";
        output << "    {\n";
        output << "      \"id\": " << (i+1) << ",\n";
        output << "      \"value\": " << values[i] << ",\n";
        output << "      \"weight\": " << weights[i] << ",\n";
        output << "      \"selected\": " << (selected[i] ? "true" : "false") << "\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    // DP Table
    output << "  \"dpTable\": [\n";
    for (int i = 0; i <= n; i++) {
        if (i > 0) output << ",\n";
        output << "    [";
        for (int w = 0; w <= capacity; w++) {
            if (w > 0) output << ", ";
            output << dp[i][w];
        }
        output << "]";
    }
    output << "\n  ],\n";
    
    // Steps
    output << "  \"steps\": [\n";
    for (int s = 0; s < steps.size(); s++) {
        if (s > 0) output << ",\n";
        auto& step = steps[s];
        output << "    {\n";
        output << "      \"i\": " << step.i << ",\n";
        output << "      \"w\": " << step.w << ",\n";
        output << "      \"itemValue\": " << step.itemValue << ",\n";
        output << "      \"itemWeight\": " << step.itemWeight << ",\n";
        output << "      \"canTake\": " << (step.canTake ? "true" : "false") << ",\n";
        output << "      \"takeValue\": " << step.takeValue << ",\n";
        output << "      \"skipValue\": " << step.skipValue << ",\n";
        output << "      \"dpValue\": " << step.dpValue << ",\n";
        output << "      \"decision\": \"" << step.decision << "\"\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    // Calculate totals
    int totalWeight = 0, totalValue = 0;
    for (int i = 0; i < n; i++) {
        if (selected[i]) {
            totalWeight += weights[i];
            totalValue += values[i];
        }
    }
    
    output << "  \"maxValue\": " << dp[n][capacity] << ",\n";
    output << "  \"totalWeight\": " << totalWeight << ",\n";
    output << "  \"totalValue\": " << totalValue << "\n";
    output << "}\n";
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int n, capacity;
    input >> n >> capacity;
    
    vector<int> values(n), weights(n);
    for (int i = 0; i < n; i++) {
        input >> values[i] >> weights[i];
    }
    
    knapsack01WithSteps(weights, values, capacity, output);
    
    return 0;
}