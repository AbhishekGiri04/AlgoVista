#include <iostream>
#include <vector>
#include <sstream>
#include <climits>
#include <cstring>
using namespace std;

int n;
vector<vector<int>> dist;
int dp[16][16];

int tspDP(int mask, int pos) {
    if (mask == (1 << n) - 1) {
        return dist[pos][0];
    }
    
    if (dp[mask][pos] != -1)
        return dp[mask][pos];
    
    int ans = INT_MAX;
    
    for (int city = 0; city < n; city++) {
        if ((mask & (1 << city)) == 0) {
            int newCost = dist[pos][city] + tspDP(mask | (1 << city), city);
            ans = min(ans, newCost);
        }
    }
    
    return dp[mask][pos] = ans;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"Usage: ./TSP <matrix>\"}" << endl;
        return 1;
    }
    
    string matrixStr = argv[1];
    stringstream ss(matrixStr);
    
    // Parse: "4;0,10,15,20;10,0,35,25;15,35,0,30;20,25,30,0"
    string token;
    getline(ss, token, ';');
    n = stoi(token);
    
    dist.assign(n, vector<int>(n));
    
    for (int i = 0; i < n; i++) {
        getline(ss, token, ';');
        stringstream rowSS(token);
        string val;
        for (int j = 0; j < n; j++) {
            getline(rowSS, val, ',');
            dist[i][j] = stoi(val);
        }
    }
    
    memset(dp, -1, sizeof(dp));
    int minCost = tspDP(1, 0);
    
    // Output JSON
    cout << "{\"algorithm\":\"TSP\",\"cities\":" << n << ",\"minCost\":" << minCost << "}" << endl;
    
    return 0;
}
