#include <iostream>
#include <vector>
#include <fstream>
using namespace std;

void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
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
    
    insertionSort(arr);
    
    output << "Sorted: ";
    for (int x : arr) output << x << " ";
    output << "\n";
    
    return 0;
}