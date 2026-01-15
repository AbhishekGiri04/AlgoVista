#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

struct Step {
    string type;
    vector<int> arr;
    int exp, digit;
};

vector<Step> steps;

void recordStep(const vector<int>& arr, int exp, int digit, string type) {
    steps.push_back({type, arr, exp, digit});
}

int getMax(vector<int>& arr) {
    return *max_element(arr.begin(), arr.end());
}

void countSort(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n);
    vector<int> count(10, 0);
    
    recordStep(arr, exp, -1, "count_start");
    
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
        recordStep(output, exp, digit, "placing");
    }
    
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
    
    recordStep(arr, exp, -1, "pass_done");
}

void radixSort(vector<int>& arr) {
    int max_val = getMax(arr);
    
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        recordStep(arr, exp, -1, "pass_start");
        countSort(arr, exp);
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
    
    recordStep(arr, -1, -1, "start");
    radixSort(arr);
    recordStep(arr, -1, -1, "done");
    
    cout << "{\"steps\":[";
    for (size_t i = 0; i < steps.size(); i++) {
        auto& s = steps[i];
        cout << "{\"type\":\"" << s.type << "\",\"exp\":" << s.exp << ",\"digit\":" << s.digit << ",\"arr\":[";
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
