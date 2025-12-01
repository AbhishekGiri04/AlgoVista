#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <algorithm>
using namespace std;

struct LCSStep {
    int i, j;
    char charX, charY;
    bool isMatch;
    int dpValue;
    string action;
};

void lcsWithSteps(string X, string Y, ofstream& output) {
    int m = X.length();
    int n = Y.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    vector<LCSStep> steps;
    
    // Fill DP table with steps
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            LCSStep step;
            step.i = i;
            step.j = j;
            
            if (i == 0 || j == 0) {
                dp[i][j] = 0;
                step.charX = (i > 0) ? X[i-1] : ' ';
                step.charY = (j > 0) ? Y[j-1] : ' ';
                step.isMatch = false;
                step.dpValue = 0;
                step.action = "Base case: empty string";
            } else {
                step.charX = X[i-1];
                step.charY = Y[j-1];
                
                if (X[i-1] == Y[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                    step.isMatch = true;
                    step.action = "Match: take diagonal + 1";
                } else {
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
                    step.isMatch = false;
                    step.action = "No match: take max(top, left)";
                }
                step.dpValue = dp[i][j];
            }
            
            if (i > 0 || j > 0) steps.push_back(step);
        }
    }
    
    // Reconstruct LCS
    string lcsStr = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (X[i-1] == Y[j-1]) {
            lcsStr += X[i-1];
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    reverse(lcsStr.begin(), lcsStr.end());
    
    // Output JSON
    output << "{\n";
    output << "  \"stringX\": \"" << X << "\",\n";
    output << "  \"stringY\": \"" << Y << "\",\n";
    output << "  \"lengthX\": " << m << ",\n";
    output << "  \"lengthY\": " << n << ",\n";
    
    // DP Table
    output << "  \"dpTable\": [\n";
    for (int i = 0; i <= m; i++) {
        if (i > 0) output << ",\n";
        output << "    [";
        for (int j = 0; j <= n; j++) {
            if (j > 0) output << ", ";
            output << dp[i][j];
        }
        output << "]";
    }
    output << "\n  ],\n";
    
    // Steps
    output << "  \"steps\": [\n";
    for (int k = 0; k < steps.size(); k++) {
        if (k > 0) output << ",\n";
        auto& step = steps[k];
        output << "    {\n";
        output << "      \"i\": " << step.i << ",\n";
        output << "      \"j\": " << step.j << ",\n";
        output << "      \"charX\": \"" << step.charX << "\",\n";
        output << "      \"charY\": \"" << step.charY << "\",\n";
        output << "      \"isMatch\": " << (step.isMatch ? "true" : "false") << ",\n";
        output << "      \"dpValue\": " << step.dpValue << ",\n";
        output << "      \"action\": \"" << step.action << "\"\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    output << "  \"lcsString\": \"" << lcsStr << "\",\n";
    output << "  \"lcsLength\": " << dp[m][n] << "\n";
    output << "}\n";
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    string X, Y;
    getline(input, X);
    getline(input, Y);
    
    lcsWithSteps(X, Y, output);
    
    return 0;
}