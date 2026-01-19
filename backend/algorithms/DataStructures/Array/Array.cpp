#include <iostream>
#include <vector>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    vector<int> arr;
    string operation;
    
    while (input >> operation) {
        if (operation == "insert") {
            int val;
            input >> val;
            arr.push_back(val);
            output << "Inserted: " << val << "\n";
        }
        else if (operation == "delete") {
            int index;
            input >> index;
            if (index >= 0 && index < arr.size()) {
                output << "Deleted: " << arr[index] << " at index " << index << "\n";
                arr.erase(arr.begin() + index);
            } else {
                output << "Invalid index\n";
            }
        }
        else if (operation == "search") {
            int val;
            input >> val;
            bool found = false;
            for (int i = 0; i < arr.size(); i++) {
                if (arr[i] == val) {
                    output << "Found " << val << " at index " << i << "\n";
                    found = true;
                    break;
                }
            }
            if (!found) {
                output << val << " not found\n";
            }
        }
        else if (operation == "display") {
            output << "Array: ";
            for (int x : arr) output << x << " ";
            output << "\n";
        }
    }
    
    output << "Final array size: " << arr.size() << "\n";
    
    return 0;
}