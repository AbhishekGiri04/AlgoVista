#include <iostream>
#include <stack>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    stack<int> st;
    string operation;
    
    while (input >> operation) {
        if (operation == "push") {
            int val;
            input >> val;
            st.push(val);
            output << "Pushed: " << val << "\n";
        }
        else if (operation == "pop") {
            if (!st.empty()) {
                output << "Popped: " << st.top() << "\n";
                st.pop();
            } else {
                output << "Stack is empty\n";
            }
        }
        else if (operation == "top") {
            if (!st.empty()) {
                output << "Top: " << st.top() << "\n";
            } else {
                output << "Stack is empty\n";
            }
        }
    }
    
    output << "Final stack size: " << st.size() << "\n";
    
    return 0;
}