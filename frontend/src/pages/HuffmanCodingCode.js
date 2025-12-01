import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const HuffmanCodingCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Huffman Coding - C++ Implementation
 * Data compression using binary trees
 */

#include <iostream>
#include <queue>
#include <unordered_map>
using namespace std;

struct Node {
    char ch;
    int freq;
    Node* left;
    Node* right;
    
    Node(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
    Node(int f) : ch(0), freq(f), left(nullptr), right(nullptr) {}
};

struct Compare {
    bool operator()(Node* a, Node* b) {
        return a->freq > b->freq;
    }
};

class HuffmanCoding {
private:
    Node* root;
    unordered_map<char, string> codes;
    
    void generateCodes(Node* node, string code) {
        if (!node) return;
        
        if (node->ch) {
            codes[node->ch] = code.empty() ? "0" : code;
            return;
        }
        
        generateCodes(node->left, code + "0");
        generateCodes(node->right, code + "1");
    }
    
public:
    void buildTree(string text) {
        unordered_map<char, int> freq;
        for (char c : text) freq[c]++;
        
        priority_queue<Node*, vector<Node*>, Compare> pq;
        for (auto& p : freq) {
            pq.push(new Node(p.first, p.second));
        }
        
        while (pq.size() > 1) {
            Node* left = pq.top(); pq.pop();
            Node* right = pq.top(); pq.pop();
            
            Node* merged = new Node(left->freq + right->freq);
            merged->left = left;
            merged->right = right;
            pq.push(merged);
        }
        
        root = pq.top();
        generateCodes(root, "");
    }
    
    string encode(string text) {
        string encoded = "";
        for (char c : text) {
            encoded += codes[c];
        }
        return encoded;
    }
    
    void printCodes() {
        cout << "Huffman Codes:" << endl;
        for (auto& p : codes) {
            cout << p.first << ": " << p.second << endl;
        }
    }
};

int main() {
    cout << "=== Huffman Coding ===" << endl;
    string text = "ABRACADABRA";
    
    HuffmanCoding hc;
    hc.buildTree(text);
    hc.printCodes();
    
    string encoded = hc.encode(text);
    cout << "Original: " << text << endl;
    cout << "Encoded: " << encoded << endl;
    
    return 0;
}`,
    c: `/**
 * Huffman Coding - C Implementation
 * Data compression using binary trees
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_CHARS 256

typedef struct Node {
    char ch;
    int freq;
    struct Node* left;
    struct Node* right;
} Node;

typedef struct {
    Node** array;
    int size;
    int capacity;
} MinHeap;

Node* createNode(char ch, int freq) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->ch = ch;
    node->freq = freq;
    node->left = node->right = NULL;
    return node;
}

MinHeap* createMinHeap(int capacity) {
    MinHeap* heap = (MinHeap*)malloc(sizeof(MinHeap));
    heap->size = 0;
    heap->capacity = capacity;
    heap->array = (Node**)malloc(capacity * sizeof(Node*));
    return heap;
}

void swapNodes(Node** a, Node** b) {
    Node* temp = *a;
    *a = *b;
    *b = temp;
}

void minHeapify(MinHeap* heap, int idx) {
    int smallest = idx;
    int left = 2 * idx + 1;
    int right = 2 * idx + 2;
    
    if (left < heap->size && heap->array[left]->freq < heap->array[smallest]->freq)
        smallest = left;
    
    if (right < heap->size && heap->array[right]->freq < heap->array[smallest]->freq)
        smallest = right;
    
    if (smallest != idx) {
        swapNodes(&heap->array[smallest], &heap->array[idx]);
        minHeapify(heap, smallest);
    }
}

Node* extractMin(MinHeap* heap) {
    Node* temp = heap->array[0];
    heap->array[0] = heap->array[heap->size - 1];
    heap->size--;
    minHeapify(heap, 0);
    return temp;
}

void insertMinHeap(MinHeap* heap, Node* node) {
    heap->size++;
    int i = heap->size - 1;
    
    while (i && node->freq < heap->array[(i - 1) / 2]->freq) {
        heap->array[i] = heap->array[(i - 1) / 2];
        i = (i - 1) / 2;
    }
    heap->array[i] = node;
}

void printCodes(Node* root, char* code, int top) {
    if (root->left) {
        code[top] = '0';
        printCodes(root->left, code, top + 1);
    }
    
    if (root->right) {
        code[top] = '1';
        printCodes(root->right, code, top + 1);
    }
    
    if (!root->left && !root->right) {
        code[top] = '\\0';
        printf("%c: %s\\n", root->ch, code);
    }
}

Node* buildHuffmanTree(char* text) {
    int freq[MAX_CHARS] = {0};
    int len = strlen(text);
    
    for (int i = 0; i < len; i++) {
        freq[text[i]]++;
    }
    
    MinHeap* heap = createMinHeap(MAX_CHARS);
    
    for (int i = 0; i < MAX_CHARS; i++) {
        if (freq[i] > 0) {
            insertMinHeap(heap, createNode(i, freq[i]));
        }
    }
    
    while (heap->size > 1) {
        Node* left = extractMin(heap);
        Node* right = extractMin(heap);
        
        Node* merged = createNode('$', left->freq + right->freq);
        merged->left = left;
        merged->right = right;
        
        insertMinHeap(heap, merged);
    }
    
    return extractMin(heap);
}

int main() {
    printf("=== Huffman Coding ===\\n");
    char text[] = "ABRACADABRA";
    
    Node* root = buildHuffmanTree(text);
    
    printf("Huffman Codes:\\n");
    char code[100];
    printCodes(root, code, 0);
    
    printf("Original: %s\\n", text);
    
    return 0;
}`,
    python: `"""
Huffman Coding - Python Implementation
Data compression using binary trees
"""

import heapq
from collections import defaultdict, Counter
from typing import Dict, Optional

class Node:
    def __init__(self, char: Optional[str] = None, freq: int = 0):
        self.char = char
        self.freq = freq
        self.left: Optional['Node'] = None
        self.right: Optional['Node'] = None
    
    def __lt__(self, other):
        return self.freq < other.freq

class HuffmanCoding:
    def __init__(self):
        self.root: Optional[Node] = None
        self.codes: Dict[str, str] = {}
    
    def build_tree(self, text: str) -> None:
        freq = Counter(text)
        
        heap = [Node(char, freq) for char, freq in freq.items()]
        heapq.heapify(heap)
        
        while len(heap) > 1:
            left = heapq.heappop(heap)
            right = heapq.heappop(heap)
            
            merged = Node(freq=left.freq + right.freq)
            merged.left = left
            merged.right = right
            
            heapq.heappush(heap, merged)
        
        self.root = heap[0] if heap else None
        self._generate_codes(self.root, "")
    
    def _generate_codes(self, node: Optional[Node], code: str) -> None:
        if not node:
            return
        
        if node.char:
            self.codes[node.char] = code if code else "0"
            return
        
        self._generate_codes(node.left, code + "0")
        self._generate_codes(node.right, code + "1")
    
    def encode(self, text: str) -> str:
        return ''.join(self.codes[char] for char in text)
    
    def print_codes(self) -> None:
        print("Huffman Codes:")
        for char, code in sorted(self.codes.items()):
            print(f"{char}: {code}")

def main() -> None:
    print("=== Huffman Coding ===")
    text = "ABRACADABRA"
    
    hc = HuffmanCoding()
    hc.build_tree(text)
    hc.print_codes()
    
    encoded = hc.encode(text)
    print(f"Original: {text}")
    print(f"Encoded: {encoded}")

if __name__ == "__main__":
    main()`,
    java: `/**
 * Huffman Coding - Java Implementation
 * Data compression using binary trees
 */

import java.util.*;

class Node implements Comparable<Node> {
    char ch;
    int freq;
    Node left, right;
    
    Node(char ch, int freq) {
        this.ch = ch;
        this.freq = freq;
    }
    
    Node(int freq) {
        this.ch = 0;
        this.freq = freq;
    }
    
    public int compareTo(Node other) {
        return Integer.compare(this.freq, other.freq);
    }
}

public class HuffmanCoding {
    private Node root;
    private Map<Character, String> codes;
    
    public HuffmanCoding() {
        this.codes = new HashMap<>();
    }
    
    public void buildTree(String text) {
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : text.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }
        
        PriorityQueue<Node> pq = new PriorityQueue<>();
        for (Map.Entry<Character, Integer> entry : freq.entrySet()) {
            pq.offer(new Node(entry.getKey(), entry.getValue()));
        }
        
        while (pq.size() > 1) {
            Node left = pq.poll();
            Node right = pq.poll();
            
            Node merged = new Node(left.freq + right.freq);
            merged.left = left;
            merged.right = right;
            
            pq.offer(merged);
        }
        
        root = pq.poll();
        generateCodes(root, "");
    }
    
    private void generateCodes(Node node, String code) {
        if (node == null) return;
        
        if (node.ch != 0) {
            codes.put(node.ch, code.isEmpty() ? "0" : code);
            return;
        }
        
        generateCodes(node.left, code + "0");
        generateCodes(node.right, code + "1");
    }
    
    public String encode(String text) {
        StringBuilder encoded = new StringBuilder();
        for (char c : text.toCharArray()) {
            encoded.append(codes.get(c));
        }
        return encoded.toString();
    }
    
    public void printCodes() {
        System.out.println("Huffman Codes:");
        codes.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(entry -> System.out.println(entry.getKey() + ": " + entry.getValue()));
    }
    
    public static void main(String[] args) {
        System.out.println("=== Huffman Coding ===");
        String text = "ABRACADABRA";
        
        HuffmanCoding hc = new HuffmanCoding();
        hc.buildTree(text);
        hc.printCodes();
        
        String encoded = hc.encode(text);
        System.out.println("Original: " + text);
        System.out.println("Encoded: " + encoded);
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7, #86efac)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/greedyalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '14px 24px',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
        display: 'inline-block',
        marginBottom: '40px'
      }}>
        ← Back to Greedy Algorithms
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Huffman Coding Code
      </h1>
      
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
          borderRadius: '16px',
          padding: '6px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          {[
            { key: 'cpp', label: 'C++', color: '#0ea5e9' },
            { key: 'c', label: 'C', color: '#8b5cf6' },
            { key: 'python', label: 'Python', color: '#10b981' },
            { key: 'java', label: 'Java', color: '#f59e0b' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setSelectedLanguage(key)}
              style={{
                background: selectedLanguage === key 
                  ? `linear-gradient(135deg, ${color}20, ${color}10)` 
                  : 'rgba(255, 255, 255, 0.03)',
                color: selectedLanguage === key ? '#ffffff' : '#1a202c',
                border: selectedLanguage === key 
                  ? `1px solid ${color}60` 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: selectedLanguage === key ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                margin: '0 2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textShadow: selectedLanguage === key 
                  ? `0 0 20px ${color}, 0 0 40px ${color}80, 0 0 60px ${color}60` 
                  : 'none',
                boxShadow: selectedLanguage === key 
                  ? `0 4px 20px ${color}30, inset 0 1px 0 rgba(255,255,255,0.1)` 
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
                transform: selectedLanguage === key 
                  ? 'translateY(-1px)' 
                  : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (selectedLanguage !== key) {
                  e.target.style.color = color;
                  e.target.style.background = `${color}10`;
                  e.target.style.borderColor = `${color}40`;
                  e.target.style.textShadow = `0 0 10px ${color}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLanguage !== key) {
                  e.target.style.color = '#1a202c';
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.textShadow = 'none';
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '30px'
        }}>
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            borderRadius: '16px',
            border: '1px solid #334155',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #374151, #4b5563)',
              padding: '12px 20px',
              borderBottom: '1px solid #374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '6px'
                }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <span style={{
                  color: '#d1d5db',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {selectedLanguage === 'cpp' ? 'huffman.cpp' : 
                   selectedLanguage === 'c' ? 'huffman.c' :
                   selectedLanguage === 'python' ? 'huffman.py' : 'HuffmanCoding.java'}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(codeExamples[selectedLanguage]);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  background: copied 
                    ? 'linear-gradient(135deg, #10b981, #059669)' 
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: copied 
                    ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                    : '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                  }
                }}
              >
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <div style={{ padding: '0', margin: '0' }}>
              <CodeBlock 
                language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'c' ? 'c' : selectedLanguage === 'python' ? 'python' : 'java'}
                code={codeExamples[selectedLanguage]}
                showContainer={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuffmanCodingCode;