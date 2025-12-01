#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Step {
    string type;
    vector<int> arr;
    int i, j, minIdx;
};

vector<Step> steps;

void recordStep(const vector<int>& arr, int i, int j, int minIdx, string type) {
    steps.push_back({type, arr, i, j, minIdx});
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"No input provided\"}" << endl;
        return 1;
    }
    
    vector<int> arr;
    string input = argv[1];
    
    // Parse comma-separated input
    size_t pos = 0;
    while (pos < input.length()) {
        size_t comma = input.find(',', pos);
        if (comma == string::npos) comma = input.length();
        arr.push_back(stoi(input.substr(pos, comma - pos)));
        pos = comma + 1;
    }
    
    int n = arr.size();
    recordStep(arr, -1, -1, -1, "start");
    
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            recordStep(arr, i, j, minIdx, "compare");
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                recordStep(arr, i, j, minIdx, "min_update");
            }
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
            recordStep(arr, i, minIdx, minIdx, "swap");
        }
    }
    
    recordStep(arr, -1, -1, -1, "done");
    
    // Output JSON
    cout << "{\"steps\":[";
    for (size_t i = 0; i < steps.size(); i++) {
        auto& s = steps[i];
        cout << "{\"type\":\"" << s.type << "\",\"i\":" << s.i << ",\"j\":" << s.j 
             << ",\"minIdx\":" << s.minIdx << ",\"arr\":[";
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