#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

struct Step {
    string type;
    vector<int> arr;
    vector<int> count;
    int idx;
};

vector<Step> steps;

void recordStep(const vector<int>& arr, const vector<int>& count, int idx, string type) {
    steps.push_back({type, arr, count, idx});
}

void countingSort(vector<int>& arr) {
    int n = arr.size();
    if (n == 0) return;
    
    int max_val = *max_element(arr.begin(), arr.end());
    int min_val = *min_element(arr.begin(), arr.end());
    int range = max_val - min_val + 1;
    
    vector<int> count(range, 0);
    vector<int> output(n);
    
    recordStep(arr, count, -1, "start");
    
    for (int i = 0; i < n; i++) {
        count[arr[i] - min_val]++;
        recordStep(arr, count, i, "counting");
    }
    
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
        recordStep(arr, count, i, "cumulative");
    }
    
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i] - min_val] - 1] = arr[i];
        count[arr[i] - min_val]--;
        recordStep(output, count, i, "placing");
    }
    
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
    
    recordStep(arr, count, -1, "done");
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
    
    countingSort(arr);
    
    cout << "{\"steps\":[";
    for (size_t i = 0; i < steps.size(); i++) {
        auto& s = steps[i];
        cout << "{\"type\":\"" << s.type << "\",\"idx\":" << s.idx << ",\"arr\":[";
        for (size_t k = 0; k < s.arr.size(); k++) {
            cout << s.arr[k];
            if (k + 1 < s.arr.size()) cout << ",";
        }
        cout << "],\"count\":[";
        for (size_t k = 0; k < s.count.size(); k++) {
            cout << s.count[k];
            if (k + 1 < s.count.size()) cout << ",";
        }
        cout << "]}";
        if (i + 1 < steps.size()) cout << ",";
    }
    cout << "]}" << endl;
    return 0;
}
