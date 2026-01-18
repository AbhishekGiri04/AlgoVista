#include <iostream>
#include <vector>
#include <string>
using namespace std;

#define d 256
#define q 101

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./RabinKarp <text> <pattern>\"}" << endl;
        return 1;
    }
    
    string text = argv[1];
    string pattern = argv[2];
    
    int n = text.length();
    int m = pattern.length();
    vector<int> matches;
    
    int p = 0; // hash value for pattern
    int t = 0; // hash value for text
    int h = 1;
    
    // Calculate h = pow(d, m-1) % q
    for (int i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    // Calculate hash for pattern and first window
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }
    
    // Slide pattern over text
    for (int i = 0; i <= n - m; i++) {
        if (p == t) {
            // Check characters one by one
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
        
        // Calculate hash for next window
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) {
                t = (t + q);
            }
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"Rabin-Karp\",\"text\":\"" << text << "\",\"pattern\":\"" << pattern << "\",\"matches\":[";
    for (size_t i = 0; i < matches.size(); i++) {
        if (i > 0) cout << ",";
        cout << matches[i];
    }
    cout << "],\"totalMatches\":" << matches.size() << "}" << endl;
    
    return 0;
}
