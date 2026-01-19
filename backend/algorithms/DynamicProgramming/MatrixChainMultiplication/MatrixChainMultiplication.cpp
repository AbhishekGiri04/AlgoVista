#include <iostream>
#include <vector>
#include <sstream>
#include <climits>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"Usage: ./MatrixChainMultiplication <dimensions>\"}" << endl;
        return 1;
    }
    
    string dimsStr = argv[1];
    
    // Parse: "40,20,30,10,30"
    stringstream ss(dimsStr);
    vector<int> dims;
    string val;
    
    while (getline(ss, val, ',')) {
        dims.push_back(stoi(val));
    }
    
    int n = dims.size() - 1;
    vector<vector<int>> dp(n, vector<int>(n, 0));
    
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i < n - len + 1; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + dims[i] * dims[k+1] * dims[j+1];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }
    
    int minCost = dp[0][n-1];
    
    // Output JSON
    cout << "{\"algorithm\":\"Matrix Chain Multiplication\",\"matrices\":" << n 
         << ",\"minMultiplications\":" << minCost << "}" << endl;
    
    return 0;
}
