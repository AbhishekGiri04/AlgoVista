#include <iostream>
#include <vector>
#include <fstream>
#include <climits>
#include <cstring>
using namespace std;

struct TSPStep {
    int mask;
    int currentCity;
    int cost;
    vector<int> path;
    string action;
    bool isComplete;
};

int n;
vector<vector<int>> dist;
int dp[16][16];
vector<TSPStep> steps;

int tspDP(int mask, int pos, vector<int>& currentPath) {
    if (mask == (1 << n) - 1) {
        TSPStep step;
        step.mask = mask;
        step.currentCity = pos;
        step.cost = dist[pos][0];
        step.path = currentPath;
        step.path.push_back(0);
        step.action = "Return to start city";
        step.isComplete = true;
        steps.push_back(step);
        return dist[pos][0];
    }
    
    if (dp[mask][pos] != -1)
        return dp[mask][pos];
    
    int ans = INT_MAX;
    vector<int> bestNextPath;
    
    for (int city = 0; city < n; city++) {
        if ((mask & (1 << city)) == 0) {
            vector<int> nextPath = currentPath;
            nextPath.push_back(city);
            
            int newCost = dist[pos][city] + tspDP(mask | (1 << city), city, nextPath);
            if (newCost < ans) {
                ans = newCost;
                bestNextPath = nextPath;
            }
        }
    }
    
    TSPStep step;
    step.mask = mask;
    step.currentCity = pos;
    step.cost = ans;
    step.path = currentPath;
    step.action = "Exploring from city " + to_string(pos);
    step.isComplete = false;
    steps.push_back(step);
    
    return dp[mask][pos] = ans;
}

void solveTSPWithSteps(ofstream& output) {
    memset(dp, -1, sizeof(dp));
    steps.clear();
    
    vector<int> startPath = {0};
    int minCost = tspDP(1, 0, startPath);
    
    // Find best path from steps
    vector<int> bestPath;
    for (auto& step : steps) {
        if (step.isComplete && step.cost == minCost - dist[step.currentCity][0]) {
            bestPath = step.path;
            break;
        }
    }
    
    // Output JSON
    output << "{\n";
    output << "  \"n\": " << n << ",\n";
    
    // Distance matrix
    output << "  \"distanceMatrix\": [\n";
    for (int i = 0; i < n; i++) {
        output << "    [";
        for (int j = 0; j < n; j++) {
            output << dist[i][j];
            if (j < n - 1) output << ", ";
        }
        output << "]";
        if (i < n - 1) output << ",";
        output << "\n";
    }
    output << "  ],\n";
    
    // Steps
    output << "  \"steps\": [\n";
    for (int i = 0; i < steps.size(); i++) {
        if (i > 0) output << ",\n";
        auto& step = steps[i];
        output << "    {\n";
        output << "      \"mask\": " << step.mask << ",\n";
        output << "      \"maskBinary\": \"";
        for (int j = n - 1; j >= 0; j--) {
            output << ((step.mask >> j) & 1);
        }
        output << "\",\n";
        output << "      \"currentCity\": " << step.currentCity << ",\n";
        output << "      \"cost\": " << step.cost << ",\n";
        output << "      \"path\": [";
        for (int j = 0; j < step.path.size(); j++) {
            output << step.path[j];
            if (j < step.path.size() - 1) output << ", ";
        }
        output << "],\n";
        output << "      \"action\": \"" << step.action << "\",\n";
        output << "      \"isComplete\": " << (step.isComplete ? "true" : "false") << "\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    // Result
    output << "  \"minCost\": " << minCost << ",\n";
    output << "  \"bestPath\": [";
    
    // Reconstruct best path
    vector<int> finalPath = {0};
    int mask = 1, pos = 0;
    
    while (mask != (1 << n) - 1) {
        int nextCity = -1, minNext = INT_MAX;
        for (int city = 0; city < n; city++) {
            if ((mask & (1 << city)) == 0) {
                if (dp[mask | (1 << city)][city] + dist[pos][city] < minNext) {
                    minNext = dp[mask | (1 << city)][city] + dist[pos][city];
                    nextCity = city;
                }
            }
        }
        finalPath.push_back(nextCity);
        mask |= (1 << nextCity);
        pos = nextCity;
    }
    finalPath.push_back(0);
    
    for (int i = 0; i < finalPath.size(); i++) {
        output << finalPath[i];
        if (i < finalPath.size() - 1) output << ", ";
    }
    output << "]\n";
    output << "}\n";
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    input >> n;
    dist.assign(n, vector<int>(n));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            input >> dist[i][j];
        }
    }
    
    solveTSPWithSteps(output);
    
    return 0;
}