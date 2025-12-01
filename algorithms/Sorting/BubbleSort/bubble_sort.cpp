#include <iostream>
#include <vector>
#include <fstream>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
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
    
    bubbleSort(arr);
    
    output << "Sorted: ";
    for (int x : arr) output << x << " ";
    output << "\n";
    
    return 0;
}