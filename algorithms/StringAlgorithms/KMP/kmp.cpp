#include <iostream>
#include <vector>
#include <string>
#include <fstream>
using namespace std;

struct LPSStep {
    int i, len, lpsValue;
    char currentChar, compareChar;
    bool isMatch;
    string action;
};

struct SearchStep {
    int textIndex, patternIndex;
    char textChar, patternChar;
    bool isMatch, isComplete, foundMatch;
    string action, status;
};

vector<int> computeLPSWithSteps(string pattern, vector<LPSStep>& lpsSteps) {
    int m = pattern.length();
    vector<int> lps(m);
    int len = 0;
    int i = 1;
    lps[0] = 0;
    
    while (i < m) {
        LPSStep step;
        step.i = i;
        step.len = len;
        step.currentChar = pattern[i];
        step.compareChar = (len > 0) ? pattern[len] : ' ';
        
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            step.lpsValue = len;
            step.isMatch = true;
            step.action = "Match: extend prefix";
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
                step.lpsValue = lps[i];
                step.isMatch = false;
                step.action = "Mismatch: fallback using LPS";
            } else {
                lps[i] = 0;
                step.lpsValue = 0;
                step.isMatch = false;
                step.action = "Mismatch: no prefix, set 0";
                i++;
            }
        }
        lpsSteps.push_back(step);
    }
    return lps;
}

void KMPSearchWithSteps(string text, string pattern, ofstream& output) {
    int n = text.length();
    int m = pattern.length();
    
    vector<LPSStep> lpsSteps;
    vector<int> lps = computeLPSWithSteps(pattern, lpsSteps);
    
    vector<SearchStep> searchSteps;
    vector<int> matches;
    
    int i = 0, j = 0;
    
    while (i < n) {
        SearchStep step;
        step.textIndex = i;
        step.patternIndex = j;
        step.textChar = text[i];
        step.patternChar = (j < m) ? pattern[j] : ' ';
        step.isComplete = false;
        step.foundMatch = false;
        
        if (j < m && pattern[j] == text[i]) {
            step.isMatch = true;
            step.action = "Match: advance both pointers";
            step.status = "Comparing T[" + to_string(i) + "] = '" + text[i] + "' with P[" + to_string(j) + "] = '" + pattern[j] + "'";
            j++;
            i++;
        } else if (j < m) {
            step.isMatch = false;
            if (j != 0) {
                step.action = "Mismatch: use LPS[" + to_string(j-1) + "] = " + to_string(lps[j-1]);
                step.status = "Skip " + to_string(j - lps[j-1]) + " characters using LPS";
                j = lps[j - 1];
            } else {
                step.action = "Mismatch: advance text pointer";
                step.status = "No prefix to reuse, move to next character";
                i++;
            }
        }
        
        if (j == m) {
            step.isComplete = true;
            step.foundMatch = true;
            step.status = "Pattern found at position " + to_string(i - j);
            matches.push_back(i - j);
            j = lps[j - 1];
        }
        
        searchSteps.push_back(step);
    }
    
    // Output JSON
    output << "{\n";
    output << "  \"text\": \"" << text << "\",\n";
    output << "  \"pattern\": \"" << pattern << "\",\n";
    
    // LPS Array
    output << "  \"lps\": [";
    for (int i = 0; i < lps.size(); i++) {
        if (i > 0) output << ", ";
        output << lps[i];
    }
    output << "],\n";
    
    // LPS Steps
    output << "  \"lpsSteps\": [\n";
    for (int i = 0; i < lpsSteps.size(); i++) {
        if (i > 0) output << ",\n";
        auto& step = lpsSteps[i];
        output << "    {\n";
        output << "      \"i\": " << step.i << ",\n";
        output << "      \"len\": " << step.len << ",\n";
        output << "      \"currentChar\": \"" << step.currentChar << "\",\n";
        output << "      \"compareChar\": \"" << step.compareChar << "\",\n";
        output << "      \"isMatch\": " << (step.isMatch ? "true" : "false") << ",\n";
        output << "      \"lpsValue\": " << step.lpsValue << ",\n";
        output << "      \"action\": \"" << step.action << "\"\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    // Search Steps
    output << "  \"searchSteps\": [\n";
    for (int i = 0; i < searchSteps.size(); i++) {
        if (i > 0) output << ",\n";
        auto& step = searchSteps[i];
        output << "    {\n";
        output << "      \"textIndex\": " << step.textIndex << ",\n";
        output << "      \"patternIndex\": " << step.patternIndex << ",\n";
        output << "      \"textChar\": \"" << step.textChar << "\",\n";
        output << "      \"patternChar\": \"" << step.patternChar << "\",\n";
        output << "      \"isMatch\": " << (step.isMatch ? "true" : "false") << ",\n";
        output << "      \"isComplete\": " << (step.isComplete ? "true" : "false") << ",\n";
        output << "      \"foundMatch\": " << (step.foundMatch ? "true" : "false") << ",\n";
        output << "      \"action\": \"" << step.action << "\",\n";
        output << "      \"status\": \"" << step.status << "\"\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    // Matches
    output << "  \"matches\": [";
    for (int i = 0; i < matches.size(); i++) {
        if (i > 0) output << ", ";
        output << matches[i];
    }
    output << "],\n";
    output << "  \"totalMatches\": " << matches.size() << "\n";
    output << "}\n";
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    string text, pattern;
    getline(input, text);
    getline(input, pattern);
    
    KMPSearchWithSteps(text, pattern, output);
    
    return 0;
}