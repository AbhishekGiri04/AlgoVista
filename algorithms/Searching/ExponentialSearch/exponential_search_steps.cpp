#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

int binarySearch(vector<int>& arr, int left, int right, int target, vector<string>& steps, int& stepNum) {
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            steps.push_back("{\"stepNumber\":" + to_string(stepNum++) + 
                          ",\"phase\":\"binary\",\"left\":" + to_string(left) + 
                          ",\"right\":" + to_string(right) + ",\"mid\":" + to_string(mid) + 
                          ",\"comparison\":\"arr[" + to_string(mid) + "] = " + to_string(arr[mid]) + 
                          " == " + to_string(target) + " ✓\",\"status\":\"found\"}");
            return mid;
        } else if (arr[mid] < target) {
            steps.push_back("{\"stepNumber\":" + to_string(stepNum++) + 
                          ",\"phase\":\"binary\",\"left\":" + to_string(left) + 
                          ",\"right\":" + to_string(right) + ",\"mid\":" + to_string(mid) + 
                          ",\"comparison\":\"arr[" + to_string(mid) + "] = " + to_string(arr[mid]) + 
                          " < " + to_string(target) + " → Search right half\",\"status\":\"continue\"}");
            left = mid + 1;
        } else {
            steps.push_back("{\"stepNumber\":" + to_string(stepNum++) + 
                          ",\"phase\":\"binary\",\"left\":" + to_string(left) + 
                          ",\"right\":" + to_string(right) + ",\"mid\":" + to_string(mid) + 
                          ",\"comparison\":\"arr[" + to_string(mid) + "] = " + to_string(arr[mid]) + 
                          " > " + to_string(target) + " → Search left half\",\"status\":\"continue\"}");
            right = mid - 1;
        }
    }
    return -1;
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: exponential_search_steps <array> <target>\"}";
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
    int stepNum = 1;
    bool found = false;
    int foundIndex = -1;
    vector<string> steps;
    
    cout << "{\"algorithm\":\"Exponential Search\",\"found\":";
    
    // Check if first element is target
    if (arr[0] == target) {
        found = true;
        foundIndex = 0;
        steps.push_back("{\"stepNumber\":" + to_string(stepNum++) + 
                      ",\"phase\":\"exponential\",\"bound\":0" + 
                      ",\"comparison\":\"arr[0] = " + to_string(arr[0]) + 
                      " == " + to_string(target) + " ✓\",\"status\":\"found\"}");
    } else {
        // Find range for binary search by repeated doubling
        int bound = 1;
        while (bound < n && arr[bound] < target) {
            steps.push_back("{\"stepNumber\":" + to_string(stepNum++) + 
                          ",\"phase\":\"exponential\",\"bound\":" + to_string(bound) + 
                          ",\"comparison\":\"arr[" + to_string(bound) + "] = " + to_string(arr[bound]) + 
                          " < " + to_string(target) + " → Double bound to " + to_string(bound * 2) + 
                          "\",\"status\":\"continue\"}");
            bound *= 2;
        }
        
        // Binary search in the found range
        int left = bound / 2;
        int right = min(bound, n - 1);
        
        steps.push_back("{\"stepNumber\":" + to_string(stepNum++) + 
                      ",\"phase\":\"transition\",\"left\":" + to_string(left) + 
                      ",\"right\":" + to_string(right) + 
                      ",\"comparison\":\"Range found [" + to_string(left) + ", " + to_string(right) + 
                      "] → Start binary search\",\"status\":\"continue\"}");
        
        foundIndex = binarySearch(arr, left, right, target, steps, stepNum);
        found = (foundIndex != -1);
    }
    
    cout << (found ? "true" : "false") << ",\"totalComparisons\":" << steps.size() << ",\"steps\":[";
    
    for (int i = 0; i < steps.size(); i++) {
        if (i > 0) cout << ",";
        cout << steps[i];
    }
    
    cout << "]}";
    return 0;
}