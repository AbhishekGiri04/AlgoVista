#include <iostream>
#include <vector>
#include <fstream>
#include <cmath>
using namespace std;

int jumpSearch(vector<int>& arr, int target) {
    int n = arr.size();
    int step = sqrt(n);
    int prev = 0;
    
    while (arr[min(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n)
            return -1;
    }
    
    while (arr[prev] < target) {
        prev++;
        if (prev == min(step, n))
            return -1;
    }
    
    if (arr[prev] == target)
        return prev;
    
    return -1;
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
    
    int result = jumpSearch(arr, target);
    
    if (result != -1)
        output << "Found at index: " << result << "\n";
    else
        output << "Not found\n";
    
    return 0;
}