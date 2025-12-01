#include <iostream>
#include <vector>
#include <fstream>
#include <climits>
#include <string>
using namespace std;

struct MCMStep {
    int i, j, k;
    int chainLength;
    int cost;
    int minCost;
    string action;
};

string getOptimalParens(vector<vector<int>>& split, int i, int j) {
    if (i == j) {
        return "M" + to_string(i + 1);
    } else {
        return "(" + getOptimalParens(split, i, split[i][j]) + 
               getOptimalParens(split, split[i][j] + 1, j) + ")";
    }
}

void matrixChainOrderWithSteps(vector<int>& p, ofstream& output) {
    int n = p.size() - 1;
    vector<vector<int>> dp(n, vector<int>(n, 0));
    vector<vector<int>> split(n, vector<int>(n, 0));
    vector<MCMStep> steps;
    
    // Fill DP table with steps
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + p[i] * p[k+1] * p[j+1];
                
                MCMStep step;
                step.i = i;
                step.j = j;
                step.k = k;
                step.chainLength = len;
                step.cost = cost;
                step.action = "Split at k=" + to_string(k) + ": cost = " + 
                             to_string(dp[i][k]) + " + " + to_string(dp[k+1][j]) + 
                             " + " + to_string(p[i]) + "*" + to_string(p[k+1]) + "*" + to_string(p[j+1]);
                
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    split[i][j] = k;
                }
                
                step.minCost = dp[i][j];
                steps.push_back(step);
            }
        }
    }
    
    string optimalParens = getOptimalParens(split, 0, n-1);
    
    // Output JSON
    output << "{\n";
    output << "  \"n\": " << n << ",\n";
    
    // Matrix dimensions
    output << "  \"matrices\": [\n";
    for (int i = 0; i < n; i++) {
        if (i > 0) output << ",\n";
        output << "    {\n";
        output << "      \"name\": \"M" << (i+1) << "\",\n";
        output << "      \"rows\": " << p[i] << ",\n";
        output << "      \"cols\": " << p[i+1] << "\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    // DP Table
    output << "  \"dpTable\": [\n";
    for (int i = 0; i < n; i++) {
        if (i > 0) output << ",\n";
        output << "    [";
        for (int j = 0; j < n; j++) {
            if (j > 0) output << ", ";
            if (i <= j) output << dp[i][j];
            else output << "0";
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
        output << "      \"j\": " << step.j << ",\n";
        output << "      \"k\": " << step.k << ",\n";
        output << "      \"chainLength\": " << step.chainLength << ",\n";
        output << "      \"cost\": " << step.cost << ",\n";
        output << "      \"minCost\": " << step.minCost << ",\n";
        output << "      \"action\": \"" << step.action << "\"\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    output << "  \"minCost\": " << dp[0][n-1] << ",\n";
    output << "  \"optimalParenthesization\": \"" << optimalParens << "\"\n";
    output << "}\n";
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int n;
    input >> n;
    
    vector<int> p(n + 1);
    for (int i = 0; i <= n; i++) {
        input >> p[i];
    }
    
    matrixChainOrderWithSteps(p, output);
    
    return 0;
}