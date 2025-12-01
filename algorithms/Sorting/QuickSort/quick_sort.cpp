#include <iostream>
#include <vector>
#include <fstream>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
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
    
    quickSort(arr, 0, n-1);
    
    output << "Sorted: ";
    for (int x : arr) output << x << " ";
    output << "\n";
    
    return 0;
}