#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Step {
    string type;
    vector<int> arr;
    int i, j, pivotIdx;
};

vector<Step> steps;

void recordStep(const vector<int>& arr, int i, int j, int pivotIdx, string type) {
    steps.push_back({type, arr, i, j, pivotIdx});
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int pivotIdx = high;
    int i = low - 1;
    
    recordStep(arr, low, high, pivotIdx, "pivot_select");
    
    for (int j = low; j < high; j++) {
        recordStep(arr, i + 1, j, pivotIdx, "compare");
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
            recordStep(arr, i, j, pivotIdx, "swap");
        }
    }
    swap(arr[i + 1], arr[high]);
    recordStep(arr, i + 1, high, i + 1, "pivot_place");
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
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
    
    recordStep(arr, -1, -1, -1, "start");
    quickSort(arr, 0, arr.size() - 1);
    recordStep(arr, -1, -1, -1, "done");
    
    cout << "{\"steps\":[";
    for (size_t i = 0; i < steps.size(); i++) {
        auto& s = steps[i];
        cout << "{\"type\":\"" << s.type << "\",\"i\":" << s.i << ",\"j\":" << s.j 
             << ",\"pivotIdx\":" << s.pivotIdx << ",\"arr\":[";
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
