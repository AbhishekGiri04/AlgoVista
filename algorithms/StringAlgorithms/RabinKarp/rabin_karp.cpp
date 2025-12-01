#include <iostream>
#include <string>
#include <fstream>
#include <vector>
using namespace std;

const int d = 256;
const int q = 101;

struct RabinKarpStep {
    int windowIndex;
    string windowText;
    int windowHash;
    int patternHash;
    bool hashMatch;
    bool actualMatch;
    bool isCollision;
    string action;
    string status;
};

void rabinKarpSearchWithSteps(string text, string pattern, ofstream& output) {
    int n = text.length();
    int m = pattern.length();
    int p = 0, t = 0, h = 1;
    
    vector<RabinKarpStep> steps;
    vector<int> matches;
    
    // Calculate h = pow(d, m-1) % q
    for (int i = 0; i < m - 1; i++)
        h = (h * d) % q;
    
    // Calculate hash of pattern and first window
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }
    
    // Slide pattern over text
    for (int i = 0; i <= n - m; i++) {
        RabinKarpStep step;
        step.windowIndex = i;
        step.windowText = text.substr(i, m);
        step.windowHash = t;
        step.patternHash = p;
        step.hashMatch = (p == t);
        step.actualMatch = false;
        step.isCollision = false;
        
        if (step.hashMatch) {
            // Verify character by character
            bool match = true;
            for (int j = 0; j < m; j++) {
                if (text[i + j] != pattern[j]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                step.actualMatch = true;
                step.action = "Hash match + Character verification";
                step.status = "Pattern found at position " + to_string(i);
                matches.push_back(i);
            } else {
                step.isCollision = true;
                step.action = "Hash collision detected";
                step.status = "Hash matches but characters don't - false positive";
            }
        } else {
            step.action = "Hash comparison";
            step.status = "Hash mismatch - skip character verification";
        }
        
        steps.push_back(step);
        
        // Calculate hash for next window
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) t = (t + q);
        }
    }
    
    // Output JSON
    output << "{\n";
    output << "  \"text\": \"" << text << "\",\n";
    output << "  \"pattern\": \"" << pattern << "\",\n";
    output << "  \"patternHash\": " << p << ",\n";
    output << "  \"base\": " << d << ",\n";
    output << "  \"modulus\": " << q << ",\n";
    
    // Steps
    output << "  \"steps\": [\n";
    for (int i = 0; i < steps.size(); i++) {
        if (i > 0) output << ",\n";
        auto& step = steps[i];
        output << "    {\n";
        output << "      \"windowIndex\": " << step.windowIndex << ",\n";
        output << "      \"windowText\": \"" << step.windowText << "\",\n";
        output << "      \"windowHash\": " << step.windowHash << ",\n";
        output << "      \"patternHash\": " << step.patternHash << ",\n";
        output << "      \"hashMatch\": " << (step.hashMatch ? "true" : "false") << ",\n";
        output << "      \"actualMatch\": " << (step.actualMatch ? "true" : "false") << ",\n";
        output << "      \"isCollision\": " << (step.isCollision ? "true" : "false") << ",\n";
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
    
    rabinKarpSearchWithSteps(text, pattern, output);
    
    return 0;
}