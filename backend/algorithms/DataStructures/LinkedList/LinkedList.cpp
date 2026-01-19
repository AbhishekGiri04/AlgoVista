#include <iostream>
#include <fstream>
#include <string>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
    
public:
    LinkedList() : head(nullptr) {}
    
    void insert(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }
    
    void deleteVal(int val) {
        if (!head) return;
        
        if (head->data == val) {
            Node* temp = head;
            head = head->next;
            delete temp;
            return;
        }
        
        Node* current = head;
        while (current->next && current->next->data != val) {
            current = current->next;
        }
        
        if (current->next) {
            Node* temp = current->next;
            current->next = current->next->next;
            delete temp;
        }
    }
    
    bool search(int val) {
        Node* current = head;
        while (current) {
            if (current->data == val) return true;
            current = current->next;
        }
        return false;
    }
    
    void display(ofstream& output) {
        output << "List: ";
        Node* current = head;
        while (current) {
            output << current->data << " ";
            current = current->next;
        }
        output << "\n";
    }
};

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    LinkedList list;
    string operation;
    
    while (input >> operation) {
        if (operation == "insert") {
            int val;
            input >> val;
            list.insert(val);
            output << "Inserted: " << val << "\n";
        }
        else if (operation == "delete") {
            int val;
            input >> val;
            if (list.search(val)) {
                list.deleteVal(val);
                output << "Deleted: " << val << "\n";
            } else {
                output << val << " not found\n";
            }
        }
        else if (operation == "search") {
            int val;
            input >> val;
            if (list.search(val)) {
                output << "Found: " << val << "\n";
            } else {
                output << val << " not found\n";
            }
        }
        else if (operation == "display") {
            list.display(output);
        }
    }
    
    return 0;
}