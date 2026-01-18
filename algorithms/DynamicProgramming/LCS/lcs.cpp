#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./LCS <string1> <string2>\"}" << endl;
        return 1;
    }
    
    string s1 = argv[1];
    string s2 = argv[2];
    
    int m = s1.length();
    int n = s2.length();
    
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    int lcsLength = dp[m][n];
    
    // Reconstruct LCS
    string lcs = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i-1] == s2[j-1]) {
            lcs = s1[i-1] + lcs;
            i--;
            j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"LCS\",\"string1\":\"" << s1 
         << "\",\"string2\":\"" << s2 
         << "\",\"lcsLength\":" << lcsLength 
         << ",\"lcs\":\"" << lcs << "\"}" << endl;
    
    return 0;
}
