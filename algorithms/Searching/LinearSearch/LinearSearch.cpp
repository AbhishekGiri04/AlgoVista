#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Step {
    string type;
    int index;
    int value;
    int target;
};

vector<Step> steps;

void recordStep(int index, int value, int target, string type) {
    steps.push_back({type, index, value, target});
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"No input provided\"}" << endl;
        return 1;
    }
    
    vector<int> arr;
    string input = argv[1];
    int target = stoi(argv[2]);
    
    size_t pos = 0;
    while (pos < input.length()) {
        size_t comma = input.find(',', pos);
        if (comma == string::npos) comma = input.length();
        arr.push_back(stoi(input.substr(pos, comma - pos)));
        pos = comma + 1;
    }
    
    recordStep(-1, -1, target, "start");
    
    int foundIndex = -1;
    for (int i = 0; i < arr.size(); i++) {
        recordStep(i, arr[i], target, "checking");
        if (arr[i] == target) {
            recordStep(i, arr[i], target, "found");
            foundIndex = i;
            break;
        }
    }
    
    if (foundIndex == -1) {
        recordStep(-1, -1, target, "not_found");
    }
    
    cout << "{\"steps\":[";
    for (size_t i = 0; i < steps.size(); i++) {
        auto& s = steps[i];
        cout << "{\"type\":\"" << s.type << "\",\"index\":" << s.index 
             << ",\"value\":" << s.value << ",\"target\":" << s.target << "}";
        if (i + 1 < steps.size()) cout << ",";
    }
    cout << "],\"found\":" << (foundIndex != -1 ? "true" : "false") 
         << ",\"foundIndex\":" << foundIndex << "}" << endl;
    return 0;
}
