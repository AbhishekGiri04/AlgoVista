#include <iostream>
#include <queue>
#include <unordered_map>
#include <string>
using namespace std;

struct Node {
    char ch;
    int freq;
    Node *left, *right;
    
    Node(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};

struct Compare {
    bool operator()(Node* a, Node* b) {
        return a->freq > b->freq;
    }
};

void generateCodes(Node* root, string code, unordered_map<char, string>& codes) {
    if (!root) return;
    
    if (!root->left && !root->right) {
        codes[root->ch] = code;
    }
    
    generateCodes(root->left, code + "0", codes);
    generateCodes(root->right, code + "1", codes);
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"Usage: ./HuffmanCoding <text>\"}" << endl;
        return 1;
    }
    
    string text = argv[1];
    
    unordered_map<char, int> freq;
    for (char ch : text) {
        freq[ch]++;
    }
    
    priority_queue<Node*, vector<Node*>, Compare> pq;
    for (auto& p : freq) {
        pq.push(new Node(p.first, p.second));
    }
    
    while (pq.size() > 1) {
        Node* left = pq.top(); pq.pop();
        Node* right = pq.top(); pq.pop();
        
        Node* parent = new Node('\0', left->freq + right->freq);
        parent->left = left;
        parent->right = right;
        pq.push(parent);
    }
    
    Node* root = pq.top();
    unordered_map<char, string> codes;
    generateCodes(root, "", codes);
    
    int originalBits = text.length() * 8;
    int compressedBits = 0;
    for (char ch : text) {
        compressedBits += codes[ch].length();
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"Huffman Coding\",\"originalSize\":" << originalBits 
         << ",\"compressedSize\":" << compressedBits 
         << ",\"compressionRatio\":" << (double)compressedBits / originalBits << "}" << endl;
    
    return 0;
}
