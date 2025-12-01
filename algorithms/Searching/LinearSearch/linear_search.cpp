#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
using namespace std;

struct SearchStep {
    int index;
    int value;
    string status;
    string comparison;
};

class LinearSearch {
private:
    vector<int> arr;
    int target;
    vector<SearchStep> steps;
    bool found;
    int foundIndex;

public:
    void readInput() {
        ifstream input("input.txt");
        if (!input.is_open()) {
            cerr << "Error: Cannot open input.txt" << endl;
            return;
        }
        
        string line;
        // Read array
        if (!getline(input, line)) {
            cerr << "Error: Cannot read array from input.txt" << endl;
            return;
        }
        stringstream ss(line);
        string num;
        while (getline(ss, num, ',')) {
            // Remove any whitespace
            num.erase(0, num.find_first_not_of(" \t\r\n"));
            num.erase(num.find_last_not_of(" \t\r\n") + 1);
            if (!num.empty()) {
                arr.push_back(stoi(num));
            }
        }
        
        // Read target
        if (getline(input, line) && !line.empty()) {
            target = stoi(line);
        } else {
            cerr << "Error: Cannot read target from input.txt" << endl;
            return;
        }
        input.close();
        
        cout << "Input read successfully:" << endl;
        cout << "Array: ";
        for (int i = 0; i < arr.size(); i++) {
            cout << arr[i];
            if (i < arr.size() - 1) cout << ", ";
        }
        cout << endl << "Target: " << target << endl << endl;
    }
    
    void performLinearSearch() {
        found = false;
        foundIndex = -1;
        steps.clear();
        
        cout << "=== Linear Search Process ===" << endl;
        
        for (int i = 0; i < arr.size(); i++) {
            SearchStep step;
            step.index = i;
            step.value = arr[i];
            
            cout << "Step " << (i + 1) << ": Checking index " << i 
                 << " -> arr[" << i << "] = " << arr[i];
            
            if (arr[i] == target) {
                step.status = "found";
                step.comparison = "arr[" + to_string(i) + "] == " + to_string(target) + " ✓";
                found = true;
                foundIndex = i;
                cout << " == " << target << " ✓ FOUND!" << endl;
                steps.push_back(step);
                break;
            } else {
                step.status = "checking";
                step.comparison = "arr[" + to_string(i) + "] != " + to_string(target) + " ✗";
                cout << " != " << target << " ✗ Continue..." << endl;
                steps.push_back(step);
            }
        }
        
        cout << endl;
        if (found) {
            cout << "🎉 SUCCESS: Target " << target << " found at index " << foundIndex << endl;
        } else {
            cout << "❌ NOT FOUND: Target " << target << " is not in the array" << endl;
        }
        cout << "Total comparisons: " << steps.size() << endl;
    }
    
    void writeOutput() {
        ofstream output("output.txt");
        if (!output.is_open()) {
            cerr << "Error: Cannot create output.txt" << endl;
            return;
        }
        
        // Write JSON format for frontend
        output << "{" << endl;
        output << "  \"algorithm\": \"Linear Search\"," << endl;
        output << "  \"array\": [";
        for (int i = 0; i < arr.size(); i++) {
            output << arr[i];
            if (i < arr.size() - 1) output << ", ";
        }
        output << "]," << endl;
        output << "  \"target\": " << target << "," << endl;
        output << "  \"found\": " << (found ? "true" : "false") << "," << endl;
        output << "  \"foundIndex\": " << foundIndex << "," << endl;
        output << "  \"totalComparisons\": " << steps.size() << "," << endl;
        output << "  \"steps\": [" << endl;
        
        for (int i = 0; i < steps.size(); i++) {
            output << "    {" << endl;
            output << "      \"stepNumber\": " << (i + 1) << "," << endl;
            output << "      \"index\": " << steps[i].index << "," << endl;
            output << "      \"value\": " << steps[i].value << "," << endl;
            output << "      \"status\": \"" << steps[i].status << "\"," << endl;
            output << "      \"comparison\": \"" << steps[i].comparison << "\"" << endl;
            output << "    }";
            if (i < steps.size() - 1) output << ",";
            output << endl;
        }
        
        output << "  ]," << endl;
        output << "  \"result\": {" << endl;
        output << "    \"message\": \"";
        if (found) {
            output << "Target " << target << " found at index " << foundIndex;
        } else {
            output << "Target " << target << " not found in array";
        }
        output << "\"," << endl;
        output << "    \"timeComplexity\": \"O(n)\"," << endl;
        output << "    \"spaceComplexity\": \"O(1)\"" << endl;
        output << "  }" << endl;
        output << "}" << endl;
        
        output.close();
        cout << endl << "✅ Results saved to output.txt" << endl;
    }
    
    void displaySteps() {
        cout << endl << "=== Step-by-Step Analysis ===" << endl;
        for (int i = 0; i < steps.size(); i++) {
            cout << "Step " << (i + 1) << ": ";
            cout << "Index " << steps[i].index << " -> ";
            cout << "Value " << steps[i].value << " -> ";
            cout << steps[i].comparison;
            if (steps[i].status == "found") {
                cout << " 🎯";
            }
            cout << endl;
        }
    }
};

int main() {
    cout << "🔍 Linear Search Algorithm" << endl;
    cout << "=========================" << endl << endl;
    
    LinearSearch ls;
    
    // Step 1: Read input from file
    ls.readInput();
    
    // Step 2: Perform linear search
    ls.performLinearSearch();
    
    // Step 3: Display detailed steps
    ls.displaySteps();
    
    // Step 4: Write output to file
    ls.writeOutput();
    
    return 0;
}