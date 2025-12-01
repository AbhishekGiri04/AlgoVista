#include <iostream>
#include <fstream>
#include <string>
using namespace std;

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BST {
private:
    TreeNode* root;
    
    TreeNode* insert(TreeNode* node, int val) {
        if (!node) return new TreeNode(val);
        
        if (val < node->data)
            node->left = insert(node->left, val);
        else if (val > node->data)
            node->right = insert(node->right, val);
        
        return node;
    }
    
    bool search(TreeNode* node, int val) {
        if (!node) return false;
        if (node->data == val) return true;
        
        if (val < node->data)
            return search(node->left, val);
        else
            return search(node->right, val);
    }
    
    void inorder(TreeNode* node, ofstream& output) {
        if (node) {
            inorder(node->left, output);
            output << node->data << " ";
            inorder(node->right, output);
        }
    }
    
public:
    BST() : root(nullptr) {}
    
    void insert(int val) {
        root = insert(root, val);
    }
    
    bool search(int val) {
        return search(root, val);
    }
    
    void display(ofstream& output) {
        output << "Inorder: ";
        inorder(root, output);
        output << "\n";
    }
};

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    BST tree;
    string operation;
    
    while (input >> operation) {
        if (operation == "insert") {
            int val;
            input >> val;
            tree.insert(val);
            output << "Inserted: " << val << "\n";
        }
        else if (operation == "search") {
            int val;
            input >> val;
            if (tree.search(val)) {
                output << "Found: " << val << "\n";
            } else {
                output << val << " not found\n";
            }
        }
        else if (operation == "display") {
            tree.display(output);
        }
    }
    
    return 0;
}