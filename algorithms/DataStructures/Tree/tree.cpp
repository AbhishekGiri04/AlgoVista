#include <iostream>
#include <fstream>
#include <vector>
#include <queue>
#include <string>
#include <sstream>
#include <iomanip>
using namespace std;

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    int id;
    
    TreeNode(int val, int nodeId) : data(val), left(nullptr), right(nullptr), id(nodeId) {}
};

struct Step {
    string type;
    int nodeId;
    int value;
    string operation;
    string description;
    vector<int> path;
    vector<int> visited;
};

class BinarySearchTree {
private:
    TreeNode* root;
    int nodeIdCounter;
    vector<Step> steps;
    
    TreeNode* insertHelper(TreeNode* node, int val, vector<int>& path) {
        if (!node) {
            TreeNode* newNode = new TreeNode(val, ++nodeIdCounter);
            steps.push_back({"insert", newNode->id, val, "create", 
                           "Created new node with value " + to_string(val), path, {}});
            return newNode;
        }
        
        path.push_back(node->id);
        steps.push_back({"focus", node->id, node->data, "compare", 
                        "Comparing " + to_string(val) + " with " + to_string(node->data), path, {}});
        
        if (val < node->data) {
            steps.push_back({"navigate", node->id, val, "left", 
                           "Going left: " + to_string(val) + " < " + to_string(node->data), path, {}});
            node->left = insertHelper(node->left, val, path);
        } else if (val > node->data) {
            steps.push_back({"navigate", node->id, val, "right", 
                           "Going right: " + to_string(val) + " > " + to_string(node->data), path, {}});
            node->right = insertHelper(node->right, val, path);
        } else {
            steps.push_back({"duplicate", node->id, val, "skip", 
                           "Value " + to_string(val) + " already exists", path, {}});
        }
        
        path.pop_back();
        return node;
    }
    
    bool searchHelper(TreeNode* node, int val, vector<int>& path) {
        if (!node) {
            steps.push_back({"notfound", -1, val, "fail", 
                           "Value " + to_string(val) + " not found", path, {}});
            return false;
        }
        
        path.push_back(node->id);
        steps.push_back({"focus", node->id, node->data, "compare", 
                        "Comparing " + to_string(val) + " with " + to_string(node->data), path, {}});
        
        if (val == node->data) {
            steps.push_back({"found", node->id, val, "success", 
                           "Found value " + to_string(val), path, {}});
            return true;
        } else if (val < node->data) {
            steps.push_back({"navigate", node->id, val, "left", 
                           "Going left: " + to_string(val) + " < " + to_string(node->data), path, {}});
            return searchHelper(node->left, val, path);
        } else {
            steps.push_back({"navigate", node->id, val, "right", 
                           "Going right: " + to_string(val) + " > " + to_string(node->data), path, {}});
            return searchHelper(node->right, val, path);
        }
    }
    
    void inorderHelper(TreeNode* node, vector<int>& result, vector<int>& visited) {
        if (node) {
            steps.push_back({"visit", node->id, node->data, "traverse", 
                           "Visiting node " + to_string(node->data), {}, visited});
            
            inorderHelper(node->left, result, visited);
            
            result.push_back(node->data);
            visited.push_back(node->id);
            steps.push_back({"process", node->id, node->data, "inorder", 
                           "Processing node " + to_string(node->data) + " (inorder)", {}, visited});
            
            inorderHelper(node->right, result, visited);
        }
    }
    
    void preorderHelper(TreeNode* node, vector<int>& result, vector<int>& visited) {
        if (node) {
            result.push_back(node->data);
            visited.push_back(node->id);
            steps.push_back({"process", node->id, node->data, "preorder", 
                           "Processing node " + to_string(node->data) + " (preorder)", {}, visited});
            
            preorderHelper(node->left, result, visited);
            preorderHelper(node->right, result, visited);
        }
    }
    
    void postorderHelper(TreeNode* node, vector<int>& result, vector<int>& visited) {
        if (node) {
            postorderHelper(node->left, result, visited);
            postorderHelper(node->right, result, visited);
            
            result.push_back(node->data);
            visited.push_back(node->id);
            steps.push_back({"process", node->id, node->data, "postorder", 
                           "Processing node " + to_string(node->data) + " (postorder)", {}, visited});
        }
    }
    
    void levelOrderHelper(vector<int>& result) {
        if (!root) return;
        
        queue<TreeNode*> q;
        q.push(root);
        vector<int> visited;
        
        while (!q.empty()) {
            TreeNode* current = q.front();
            q.pop();
            
            result.push_back(current->data);
            visited.push_back(current->id);
            steps.push_back({"process", current->id, current->data, "levelorder", 
                           "Processing node " + to_string(current->data) + " (level order)", {}, visited});
            
            if (current->left) q.push(current->left);
            if (current->right) q.push(current->right);
        }
    }
    
    void serializeTree(TreeNode* node, vector<pair<int, int>>& nodes, vector<pair<int, int>>& edges) {
        if (!node) return;
        
        nodes.push_back({node->id, node->data});
        
        if (node->left) {
            edges.push_back({node->id, node->left->id});
            serializeTree(node->left, nodes, edges);
        }
        if (node->right) {
            edges.push_back({node->id, node->right->id});
            serializeTree(node->right, nodes, edges);
        }
    }
    
public:
    BinarySearchTree() : root(nullptr), nodeIdCounter(0) {}
    
    void insert(int val) {
        steps.clear();
        vector<int> path;
        root = insertHelper(root, val, path);
    }
    
    bool search(int val) {
        steps.clear();
        vector<int> path;
        return searchHelper(root, val, path);
    }
    
    vector<int> inorderTraversal() {
        steps.clear();
        vector<int> result;
        vector<int> visited;
        inorderHelper(root, result, visited);
        return result;
    }
    
    vector<int> preorderTraversal() {
        steps.clear();
        vector<int> result;
        vector<int> visited;
        preorderHelper(root, result, visited);
        return result;
    }
    
    vector<int> postorderTraversal() {
        steps.clear();
        vector<int> result;
        vector<int> visited;
        postorderHelper(root, result, visited);
        return result;
    }
    
    vector<int> levelOrderTraversal() {
        steps.clear();
        vector<int> result;
        levelOrderHelper(result);
        return result;
    }
    
    string getStepsJSON() {
        stringstream ss;
        ss << "{\"steps\":[";
        
        for (size_t i = 0; i < steps.size(); i++) {
            if (i > 0) ss << ",";
            ss << "{";
            ss << "\"type\":\"" << steps[i].type << "\",";
            ss << "\"nodeId\":" << steps[i].nodeId << ",";
            ss << "\"value\":" << steps[i].value << ",";
            ss << "\"operation\":\"" << steps[i].operation << "\",";
            ss << "\"description\":\"" << steps[i].description << "\",";
            
            ss << "\"path\":[";
            for (size_t j = 0; j < steps[i].path.size(); j++) {
                if (j > 0) ss << ",";
                ss << steps[i].path[j];
            }
            ss << "],";
            
            ss << "\"visited\":[";
            for (size_t j = 0; j < steps[i].visited.size(); j++) {
                if (j > 0) ss << ",";
                ss << steps[i].visited[j];
            }
            ss << "]";
            ss << "}";
        }
        
        ss << "],";
        
        // Add tree structure
        vector<pair<int, int>> nodes;
        vector<pair<int, int>> edges;
        if (root) {
            serializeTree(root, nodes, edges);
        }
        
        ss << "\"tree\":{";
        ss << "\"nodes\":[";
        for (size_t i = 0; i < nodes.size(); i++) {
            if (i > 0) ss << ",";
            ss << "{\"id\":" << nodes[i].first << ",\"value\":" << nodes[i].second << "}";
        }
        ss << "],";
        
        ss << "\"edges\":[";
        for (size_t i = 0; i < edges.size(); i++) {
            if (i > 0) ss << ",";
            ss << "{\"from\":" << edges[i].first << ",\"to\":" << edges[i].second << "}";
        }
        ss << "]";
        ss << "}";
        
        ss << "}";
        return ss.str();
    }
};

int main(int argc, char* argv[]) {
    BinarySearchTree bst;
    
    if (argc < 2) {
        cout << "{\"error\":\"No operation specified\"}" << endl;
        return 1;
    }
    
    string operation = argv[1];
    
    if (operation == "insert" && argc >= 3) {
        int value = stoi(argv[2]);
        bst.insert(value);
        cout << bst.getStepsJSON() << endl;
    }
    else if (operation == "search" && argc >= 3) {
        // First insert some values for demonstration
        vector<int> values = {50, 30, 70, 20, 40, 60, 80};
        for (int val : values) {
            bst.insert(val);
        }
        
        int value = stoi(argv[2]);
        bool found = bst.search(value);
        cout << bst.getStepsJSON() << endl;
    }
    else if (operation == "inorder") {
        // Insert demo values
        vector<int> values = {50, 30, 70, 20, 40, 60, 80};
        for (int val : values) {
            bst.insert(val);
        }
        
        vector<int> result = bst.inorderTraversal();
        cout << bst.getStepsJSON() << endl;
    }
    else if (operation == "preorder") {
        // Insert demo values
        vector<int> values = {50, 30, 70, 20, 40, 60, 80};
        for (int val : values) {
            bst.insert(val);
        }
        
        vector<int> result = bst.preorderTraversal();
        cout << bst.getStepsJSON() << endl;
    }
    else if (operation == "postorder") {
        // Insert demo values
        vector<int> values = {50, 30, 70, 20, 40, 60, 80};
        for (int val : values) {
            bst.insert(val);
        }
        
        vector<int> result = bst.postorderTraversal();
        cout << bst.getStepsJSON() << endl;
    }
    else if (operation == "levelorder") {
        // Insert demo values
        vector<int> values = {50, 30, 70, 20, 40, 60, 80};
        for (int val : values) {
            bst.insert(val);
        }
        
        vector<int> result = bst.levelOrderTraversal();
        cout << bst.getStepsJSON() << endl;
    }
    else {
        cout << "{\"error\":\"Invalid operation\"}" << endl;
        return 1;
    }
    
    return 0;
}