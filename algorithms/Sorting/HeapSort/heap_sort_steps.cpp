#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Step {
    string type;
    vector<int> arr;
    int i, largest, heapSize;
};

vector<Step> steps;

void recordStep(const vector<int>& arr, int i, int largest, int heapSize, string type) {
    steps.push_back({type, arr, i, largest, heapSize});
}

void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    recordStep(arr, i, largest, n, "heapify_start");
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        recordStep(arr, i, largest, n, "heapify_swap");
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = n / 2 - 1; i >= 0; i--) {
        recordStep(arr, i, -1, n, "build_heap");
        heapify(arr, n, i);
    }
    
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        recordStep(arr, 0, i, i, "extract_max");
        heapify(arr, i, 0);
    }
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"No input provided\"}" << endl;
        return 1;
    }
    
    vector<int> arr;
    string input = argv[1];
    
    size_t pos = 0;
    while (pos < input.length()) {
        size_t comma = input.find(',', pos);
        if (comma == string::npos) comma = input.length();
        arr.push_back(stoi(input.substr(pos, comma - pos)));
        pos = comma + 1;
    }
    
    recordStep(arr, -1, -1, arr.size(), "start");
    heapSort(arr);
    recordStep(arr, -1, -1, 0, "done");
    
    cout << "{\"steps\":[";
    for (size_t i = 0; i < steps.size(); i++) {
        auto& s = steps[i];
        cout << "{\"type\":\"" << s.type << "\",\"i\":" << s.i << ",\"largest\":" << s.largest 
             << ",\"heapSize\":" << s.heapSize << ",\"arr\":[";
        for (size_t k = 0; k < s.arr.size(); k++) {
            cout << s.arr[k];
            if (k + 1 < s.arr.size()) cout << ",";
        }
        cout << "]}";
        if (i + 1 < steps.size()) cout << ",";
    }
    cout << "]}" << endl;
    return 0;
}
