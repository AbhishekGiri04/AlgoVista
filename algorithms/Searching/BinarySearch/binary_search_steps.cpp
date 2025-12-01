#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: binary_search_steps <array> <target>\"}";
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
    int left = 0, right = arr.size() - 1;
    int stepNum = 1;
    bool found = false;
    
    cout << "{\"algorithm\":\"Binary Search\",\"found\":";
    
    // First pass to determine if found
    int tempLeft = left, tempRight = right;
    while (tempLeft <= tempRight) {
        int mid = tempLeft + (tempRight - tempLeft) / 2;
        if (arr[mid] == target) {
            found = true;
            break;
        } else if (arr[mid] < target) {
            tempLeft = mid + 1;
        } else {
            tempRight = mid - 1;
        }
    }
    
    cout << (found ? "true" : "false") << ",\"totalComparisons\":";
    
    // Count steps
    int stepCount = 0;
    tempLeft = left; tempRight = right;
    while (tempLeft <= tempRight) {
        int mid = tempLeft + (tempRight - tempLeft) / 2;
        stepCount++;
        if (arr[mid] == target) break;
        else if (arr[mid] < target) tempLeft = mid + 1;
        else tempRight = mid - 1;
    }
    
    cout << stepCount << ",\"steps\":[";
    
    // Generate steps
    bool firstStep = true;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (!firstStep) cout << ",";
        firstStep = false;
        
        cout << "{\"stepNumber\":" << stepNum++ 
             << ",\"left\":" << left 
             << ",\"right\":" << right 
             << ",\"mid\":" << mid;
        
        if (arr[mid] == target) {
            cout << ",\"comparison\":\"arr[" << mid << "] = " << arr[mid] << " == " << target << " ✓\"";
            cout << ",\"status\":\"found\"}";
            break;
        } else if (arr[mid] < target) {
            cout << ",\"comparison\":\"arr[" << mid << "] = " << arr[mid] << " < " << target << " → Search right half\"";
            cout << ",\"status\":\"continue\"}";
            left = mid + 1;
        } else {
            cout << ",\"comparison\":\"arr[" << mid << "] = " << arr[mid] << " > " << target << " → Search left half\"";
            cout << ",\"status\":\"continue\"}";
            right = mid - 1;
        }
    }
    
    cout << "]}";
    return 0;
}