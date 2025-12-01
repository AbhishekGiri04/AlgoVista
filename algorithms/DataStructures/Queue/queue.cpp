#include <iostream>
#include <queue>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    queue<int> q;
    string operation;
    
    while (input >> operation) {
        if (operation == "enqueue") {
            int val;
            input >> val;
            q.push(val);
            output << "Enqueued: " << val << "\n";
        }
        else if (operation == "dequeue") {
            if (!q.empty()) {
                output << "Dequeued: " << q.front() << "\n";
                q.pop();
            } else {
                output << "Queue is empty\n";
            }
        }
        else if (operation == "front") {
            if (!q.empty()) {
                output << "Front: " << q.front() << "\n";
            } else {
                output << "Queue is empty\n";
            }
        }
    }
    
    output << "Final queue size: " << q.size() << "\n";
    
    return 0;
}