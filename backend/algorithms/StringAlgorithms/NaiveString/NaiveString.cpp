#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./NaiveString <text> <pattern>\"}" << endl;
        return 1;
    }
    
    string text = argv[1];
    string pattern = argv[2];
    
    int n = text.length();
    int m = pattern.length();
    vector<int> matches;
    
    for (int i = 0; i <= n - m; i++) {
        int j;
        for (j = 0; j < m; j++) {
            if (text[i + j] != pattern[j]) {
                break;
            }
        }
        if (j == m) {
            matches.push_back(i);
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"Naive String\",\"text\":\"" << text << "\",\"pattern\":\"" << pattern << "\",\"matches\":[";
    for (size_t i = 0; i < matches.size(); i++) {
        if (i > 0) cout << ",";
        cout << matches[i];
    }
    cout << "],\"totalMatches\":" << matches.size() << "}" << endl;
    
    return 0;
}
