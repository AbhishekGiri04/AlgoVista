#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Step {
    string type;
    vector<int> arr;
    int i, j, keyIdx;
};

vector<Step> steps;

void recordStep(const vector<int>& arr, int i, int j, int keyIdx, const string& type) {
    steps.push_back({type, arr, i, j, keyIdx});
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
    
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        recordStep(arr, i, j, i, "key_selected");
        
        while (j >= 0 && arr[j] > key) {
            recordStep(arr, i, j, i, "compare");
            arr[j + 1] = arr[j];
            recordStep(arr, i, j, i, "shift");
            j--;
        }
        arr[j + 1] = key;
        recordStep(arr, i, j + 1, i, "insert");
    }
    
    recordStep(arr, -1, -1, -1, "done");
    
    // Output JSON
    cout << "{\"steps\":[";
    for (size_t i = 0; i < steps.size(); i++) {
        auto& s = steps[i];
        cout << "{\"type\":\"" << s.type << "\",\"i\":" << s.i << ",\"j\":" << s.j 
             << ",\"keyIdx\":" << s.keyIdx << ",\"arr\":[";
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