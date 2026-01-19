#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> computeLPS(string pattern) {
    int m = pattern.length();
    vector<int> lps(m);
    int len = 0;
    lps[0] = 0;
    
    for (int i = 1; i < m; ) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./KMP <text> <pattern>\"}" << endl;
        return 1;
    }
    
    string text = argv[1];
    string pattern = argv[2];
    
    vector<int> lps = computeLPS(pattern);
    vector<int> matches;
    
    int i = 0, j = 0;
    int n = text.length();
    int m = pattern.length();
    
    while (i < n) {
        if (pattern[j] == text[i]) {
            j++;
            i++;
        }
        
        if (j == m) {
            matches.push_back(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"KMP\",\"text\":\"" << text << "\",\"pattern\":\"" << pattern << "\",\"matches\":[";
    for (size_t i = 0; i < matches.size(); i++) {
        if (i > 0) cout << ",";
        cout << matches[i];
    }
    cout << "],\"totalMatches\":" << matches.size() << "}" << endl;
    
    return 0;
}
