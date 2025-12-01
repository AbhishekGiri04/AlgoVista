#include <iostream>
#include <vector>
#include <fstream>
using namespace std;

void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        swap(arr[min_idx], arr[i]);
    }
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
    
    selectionSort(arr);
    
    output << "Sorted: ";
    for (int x : arr) output << x << " ";
    output << "\n";
    
    return 0;
}