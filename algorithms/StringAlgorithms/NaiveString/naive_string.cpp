#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <sstream>
using namespace std;

struct Step {
    int alignment;
    int compareIndex;
    char textChar;
    char patternChar;
    bool isMatch;
    bool isComplete;
    bool foundMatch;
    string status;
};

void naiveSearchVisualized(string txt, string pat, ofstream& output) {
    int M = pat.length();
    int N = txt.length();
    vector<Step> steps;
    vector<int> matches;
    
    output << "{\n";
    output << "  \"text\": \"" << txt << "\",\n";
    output << "  \"pattern\": \"" << pat << "\",\n";
    output << "  \"steps\": [\n";
    
    bool firstStep = true;
    
    // For each alignment position
    for (int i = 0; i <= N - M; i++) {
        int j;
        
        // Compare each character in pattern
        for (j = 0; j < M; j++) {
            if (!firstStep) output << ",\n";
            firstStep = false;
            
            bool match = (txt[i + j] == pat[j]);
            
            output << "    {\n";
            output << "      \"alignment\": " << i << ",\n";
            output << "      \"compareIndex\": " << j << ",\n";
            output << "      \"textChar\": \"" << txt[i + j] << "\",\n";
            output << "      \"patternChar\": \"" << pat[j] << "\",\n";
            output << "      \"isMatch\": " << (match ? "true" : "false") << ",\n";
            output << "      \"isComplete\": false,\n";
            output << "      \"foundMatch\": false,\n";
            output << "      \"status\": \"" << (match ? "Match" : "Mismatch") << "\"\n";
            output << "    }";
            
            if (!match) break; // Stop comparing on mismatch
        }
        
        // Add completion step for this alignment
        if (!firstStep) output << ",\n";
        firstStep = false;
        
        bool fullMatch = (j == M);
        if (fullMatch) matches.push_back(i);
        
        output << "    {\n";
        output << "      \"alignment\": " << i << ",\n";
        output << "      \"compareIndex\": " << j << ",\n";
        output << "      \"textChar\": \"\",\n";
        output << "      \"patternChar\": \"\",\n";
        output << "      \"isMatch\": " << (fullMatch ? "true" : "false") << ",\n";
        output << "      \"isComplete\": true,\n";
        output << "      \"foundMatch\": " << (fullMatch ? "true" : "false") << ",\n";
        output << "      \"status\": \"" << (fullMatch ? "Pattern found at position " + to_string(i) : "Pattern not found at position " + to_string(i)) << "\"\n";
        output << "    }";
    }
    
    output << "\n  ],\n";
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
    
    string txt, pat;
    getline(input, txt);
    getline(input, pat);
    
    naiveSearchVisualized(txt, pat, output);
    
    return 0;
}