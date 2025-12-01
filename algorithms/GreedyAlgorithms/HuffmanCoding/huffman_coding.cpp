#include <iostream>
#include <queue>
#include <unordered_map>
#include <fstream>
#include <string>
#include <vector>
using namespace std;

struct Node {
    char ch;
    int freq;
    Node* left;
    Node* right;
    int id;
    
    Node(char c, int f, int i) : ch(c), freq(f), left(nullptr), right(nullptr), id(i) {}
    Node(int f, int i) : ch(0), freq(f), left(nullptr), right(nullptr), id(i) {}
};

struct Compare {
    bool operator()(Node* a, Node* b) {
        return a->freq > b->freq;
    }
};

struct HuffmanStep {
    int stepNum;
    vector<pair<char, int>> heapState;
    char leftChar, rightChar;
    int leftFreq, rightFreq;
    int mergedFreq;
    string action;
};

void generateCodes(Node* root, string code, unordered_map<char, string>& codes) {
    if (!root) return;
    
    if (root->ch != 0) {
        codes[root->ch] = code.empty() ? "0" : code;
        return;
    }
    
    generateCodes(root->left, code + "0", codes);
    generateCodes(root->right, code + "1", codes);
}

void huffmanWithSteps(unordered_map<char, int>& freq, ofstream& output) {
    priority_queue<Node*, vector<Node*>, Compare> pq;
    vector<HuffmanStep> steps;
    int nodeId = 0;
    
    // Build initial heap
    for (auto& p : freq) {
        pq.push(new Node(p.first, p.second, nodeId++));
    }
    
    int stepNum = 1;
    
    // Build tree with steps
    while (pq.size() > 1) {
        HuffmanStep step;
        step.stepNum = stepNum++;
        
        // Capture heap state
        priority_queue<Node*, vector<Node*>, Compare> tempPq = pq;
        while (!tempPq.empty()) {
            Node* node = tempPq.top();
            tempPq.pop();
            if (node->ch != 0) {
                step.heapState.push_back({node->ch, node->freq});
            } else {
                step.heapState.push_back({'*', node->freq});
            }
        }
        
        Node* left = pq.top(); pq.pop();
        Node* right = pq.top(); pq.pop();
        
        step.leftChar = left->ch != 0 ? left->ch : '*';
        step.leftFreq = left->freq;
        step.rightChar = right->ch != 0 ? right->ch : '*';
        step.rightFreq = right->freq;
        step.mergedFreq = left->freq + right->freq;
        step.action = "Merge nodes with frequencies " + to_string(left->freq) + " and " + to_string(right->freq);
        
        Node* merged = new Node(left->freq + right->freq, nodeId++);
        merged->left = left;
        merged->right = right;
        
        pq.push(merged);
        steps.push_back(step);
    }
    
    Node* root = pq.top();
    unordered_map<char, string> codes;
    generateCodes(root, "", codes);
    
    // Calculate compression stats
    int originalBits = 0, compressedBits = 0;
    for (auto& p : freq) {
        originalBits += p.second * 8; // ASCII = 8 bits
        compressedBits += p.second * codes[p.first].length();
    }
    
    // Output JSON
    output << "{\n";
    
    // Frequencies
    output << "  \"frequencies\": {\n";
    bool first = true;
    for (auto& p : freq) {
        if (!first) output << ",\n";
        output << "    \"" << p.first << "\": " << p.second;
        first = false;
    }
    output << "\n  },\n";
    
    // Steps
    output << "  \"steps\": [\n";
    for (int i = 0; i < steps.size(); i++) {
        if (i > 0) output << ",\n";
        auto& step = steps[i];
        output << "    {\n";
        output << "      \"stepNum\": " << step.stepNum << ",\n";
        output << "      \"leftChar\": \"" << step.leftChar << "\",\n";
        output << "      \"leftFreq\": " << step.leftFreq << ",\n";
        output << "      \"rightChar\": \"" << step.rightChar << "\",\n";
        output << "      \"rightFreq\": " << step.rightFreq << ",\n";
        output << "      \"mergedFreq\": " << step.mergedFreq << ",\n";
        output << "      \"action\": \"" << step.action << "\"\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    // Codes
    output << "  \"codes\": {\n";
    first = true;
    for (auto& p : codes) {
        if (!first) output << ",\n";
        output << "    \"" << p.first << "\": \"" << p.second << "\"";
        first = false;
    }
    output << "\n  },\n";
    
    output << "  \"originalBits\": " << originalBits << ",\n";
    output << "  \"compressedBits\": " << compressedBits << ",\n";
    output << "  \"compressionRatio\": " << (double)compressedBits / originalBits << "\n";
    output << "}\n";
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    string text;
    getline(input, text);
    
    unordered_map<char, int> freq;
    for (char c : text) {
        freq[c]++;
    }
    
    huffmanWithSteps(freq, output);
    
    return 0;
}