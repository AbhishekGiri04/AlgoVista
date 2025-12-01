#include <iostream>
#include <vector>
#include <fstream>
#include <algorithm>
using namespace std;

void countingSort(vector<int>& arr) {
    int n = arr.size();
    if (n == 0) return;
    
    int max_val = *max_element(arr.begin(), arr.end());
    int min_val = *min_element(arr.begin(), arr.end());
    int range = max_val - min_val + 1;
    
    vector<int> count(range, 0);
    vector<int> output(n);
    
    for (int i = 0; i < n; i++)
        count[arr[i] - min_val]++;
    
    for (int i = 1; i < range; i++)
        count[i] += count[i - 1];
    
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i] - min_val] - 1] = arr[i];
        count[arr[i] - min_val]--;
    }
    
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int n;
    input >> n;
    vector<int> arr(n);
    
    for (int i = 0; i < n; i++) {
        input >> arr[i];
    }
    
    output << "Original: ";
    for (int x : arr) output << x << " ";
    output << "\n";
    
    countingSort(arr);
    
    output << "Sorted: ";
    for (int x : arr) output << x << " ";
    output << "\n";
    
    return 0;
}