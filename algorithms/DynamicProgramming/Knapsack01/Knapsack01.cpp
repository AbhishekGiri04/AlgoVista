#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./Knapsack01 <capacity> <items>\"}" << endl;
        return 1;
    }
    
    int capacity = stoi(argv[1]);
    string itemsStr = argv[2];
    
    // Parse: "4;60,10;100,20;120,30;80,15"
    stringstream ss(itemsStr);
    string token;
    getline(ss, token, ';');
    int n = stoi(token);
    
    vector<int> values(n), weights(n);
    for (int i = 0; i < n; i++) {
        getline(ss, token, ';');
        stringstream itemSS(token);
        string val;
        
        getline(itemSS, val, ',');
        values[i] = stoi(val);
        
        getline(itemSS, val, ',');
        weights[i] = stoi(val);
    }
    
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]]);
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    int maxValue = dp[n][capacity];
    
    // Output JSON
    cout << "{\"algorithm\":\"0/1 Knapsack\",\"capacity\":" << capacity 
         << ",\"items\":" << n << ",\"maxValue\":" << maxValue << "}" << endl;
    
    return 0;
}
