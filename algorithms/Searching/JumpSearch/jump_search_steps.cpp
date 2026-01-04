#include <iostream>
#include <vector>
#include <sstream>
#include <cmath>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: jump_search_steps <array> <target>\"}";
        return 1;
    }
    
    string arrayStr = argv[1];
    vector<int> arr;
    stringstream ss(arrayStr);
    string num;
    
    while (getline(ss, num, ',')) {
        arr.push_back(stoi(num));
    }
    
    int target = stoi(argv[2]);
    int n = arr.size();
    int step = sqrt(n);
    int prev = 0;
    int stepNum = 1;
    bool found = false;
    int foundIndex = -1;
    
    cout << "{\"algorithm\":\"Jump Search\",\"found\":";
    
    // First pass to determine if found
    int tempPrev = 0;
    while (arr[min(step, n) - 1] < target) {
        tempPrev = step;
        step += sqrt(n);
        if (tempPrev >= n) break;
    }
    
    for (int i = tempPrev; i < min(step, n); i++) {
        if (arr[i] == target) {
            found = true;
            foundIndex = i;
            break;
        }
    }
    
    cout << (found ? "true" : "false") << ",\"totalComparisons\":";
    
    // Count steps
    int stepCount = 0;
    step = sqrt(n);
    prev = 0;
    while (arr[min(step, n) - 1] < target) {
        stepCount++;
        prev = step;
        step += sqrt(n);
        if (prev >= n) break;
    }
    for (int i = prev; i < min(step, n); i++) {
        stepCount++;
        if (arr[i] == target) break;
    }
    
    cout << stepCount << ",\"blockSize\":" << (int)sqrt(n) << ",\"steps\":[";
    
    // Generate steps
    step = sqrt(n);
    prev = 0;
    stepNum = 1;
    bool firstStep = true;
    
    // Jump phase
    while (arr[min(step, n) - 1] < target) {
        if (!firstStep) cout << ",";
        firstStep = false;
        
        cout << "{\"stepNumber\":" << stepNum++
             << ",\"phase\":\"jump\""
             << ",\"blockStart\":" << prev
             << ",\"blockEnd\":" << (min(step, n) - 1)
             << ",\"checkIndex\":" << (min(step, n) - 1)
             << ",\"comparison\":\"arr[" << (min(step, n) - 1) << "] = " << arr[min(step, n) - 1] << " < " << target << " → Jump to next block\""
             << ",\"status\":\"continue\"}";
        
        prev = step;
        step += sqrt(n);
        if (prev >= n) break;
    }
    
    // Linear search phase
    for (int i = prev; i < min(step, n); i++) {
        if (!firstStep) cout << ",";
        firstStep = false;
        
        cout << "{\"stepNumber\":" << stepNum++
             << ",\"phase\":\"linear\""
             << ",\"blockStart\":" << prev
             << ",\"blockEnd\":" << (min(step, n) - 1)
             << ",\"checkIndex\":" << i
             << ",\"comparison\":\"arr[" << i << "] = " << arr[i];
        
        if (arr[i] == target) {
            cout << " == " << target << " ✓\"";
            cout << ",\"status\":\"found\"}";
            break;
        } else {
            cout << " != " << target << " → Continue linear search\"";
            cout << ",\"status\":\"continue\"}";
        }
    }
    
    cout << "]}";
    return 0;
}