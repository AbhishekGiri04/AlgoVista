#include <iostream>
#include <vector>
#include <fstream>
#include <algorithm>
using namespace std;

int binarySearch(vector<int>& arr, int left, int right, int target) {
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target)
            return mid;
        
        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    
    return -1;
}

int exponentialSearch(vector<int>& arr, int target) {
    int n = arr.size();
    
    if (arr[0] == target)
        return 0;
    
    int i = 1;
    while (i < n && arr[i] <= target)
        i = i * 2;
    
    return binarySearch(arr, i / 2, min(i, n - 1), target);
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int n, target;
    input >> n;
    vector<int> arr(n);
    
    for (int i = 0; i < n; i++) {
        input >> arr[i];
    }
    input >> target;
    
    output << "Array: ";
    for (int x : arr) output << x << " ";
    output << "\nTarget: " << target << "\n";
    
    int result = exponentialSearch(arr, target);
    
    if (result != -1)
        output << "Found at index: " << result << "\n";
    else
        output << "Not found\n";
    
    return 0;
}