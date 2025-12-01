import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const TreeCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Binary Search Tree - C++ Implementation
 * Hierarchical data organization with BST properties
 */

#include <iostream>
using namespace std;

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int value) : data(value), left(nullptr), right(nullptr) {}
};

class BinarySearchTree {
private:
    TreeNode* root;
    
    void inorderHelper(TreeNode* node) {
        if (node) {
            inorderHelper(node->left);
            cout << node->data << " ";
            inorderHelper(node->right);
        }
    }
    
    void preorderHelper(TreeNode* node) {
        if (node) {
            cout << node->data << " ";
            preorderHelper(node->left);
            preorderHelper(node->right);
        }
    }
    
    void postorderHelper(TreeNode* node) {
        if (node) {
            postorderHelper(node->left);
            postorderHelper(node->right);
            cout << node->data << " ";
        }
    }
    
    TreeNode* insertHelper(TreeNode* node, int data) {
        if (!node) {
            return new TreeNode(data);
        }
        
        if (data < node->data) {
            node->left = insertHelper(node->left, data);
        } else if (data > node->data) {
            node->right = insertHelper(node->right, data);
        }
        
        return node;
    }
    
public:
    BinarySearchTree() : root(nullptr) {}
    
    void insert(int data) {
        root = insertHelper(root, data);
        cout << "Inserted " << data << endl;
    }
    
    void inorder() {
        cout << "Inorder: ";
        inorderHelper(root);
        cout << endl;
    }
    
    void preorder() {
        cout << "Preorder: ";
        preorderHelper(root);
        cout << endl;
    }
    
    void postorder() {
        cout << "Postorder: ";
        postorderHelper(root);
        cout << endl;
    }
};

int main() {
    cout << "=== Binary Search Tree ===" << endl;
    BinarySearchTree tree;
    
    tree.insert(50);
    tree.insert(30);
    tree.insert(70);
    tree.insert(20);
    tree.insert(40);
    tree.insert(60);
    tree.insert(80);
    
    tree.inorder();
    tree.preorder();
    tree.postorder();
    
    return 0;
}`,
    c: `/**
 * Binary Search Tree - C Implementation
 * Hierarchical data organization using structures
 */

#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

TreeNode* createNode(int data) {
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

TreeNode* insert(TreeNode* root, int data) {
    if (root == NULL) {
        printf("Inserted %d\n", data);
        return createNode(data);
    }
    
    if (data < root->data) {
        root->left = insert(root->left, data);
    } else if (data > root->data) {
        root->right = insert(root->right, data);
    }
    
    return root;
}

void inorder(TreeNode* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

void preorder(TreeNode* root) {
    if (root != NULL) {
        printf("%d ", root->data);
        preorder(root->left);
        preorder(root->right);
    }
}

void postorder(TreeNode* root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->data);
    }
}

int main() {
    printf("=== Binary Search Tree ===\n");
    TreeNode* root = NULL;
    
    root = insert(root, 50);
    root = insert(root, 30);
    root = insert(root, 70);
    root = insert(root, 20);
    root = insert(root, 40);
    root = insert(root, 60);
    root = insert(root, 80);
    
    printf("Inorder: ");
    inorder(root);
    printf("\n");
    
    printf("Preorder: ");
    preorder(root);
    printf("\n");
    
    printf("Postorder: ");
    postorder(root);
    printf("\n");
    
    return 0;
}`,
    python: `"""
Binary Search Tree - Python Implementation
Hierarchical data organization with BST properties
"""

from typing import Optional

class TreeNode:
    def __init__(self, data: int):
        self.data = data
        self.left: Optional['TreeNode'] = None
        self.right: Optional['TreeNode'] = None

class BinarySearchTree:
    def __init__(self):
        self.root: Optional[TreeNode] = None
    
    def insert(self, data: int) -> None:
        self.root = self._insert_helper(self.root, data)
        print(f"Inserted {data}")
    
    def _insert_helper(self, node: Optional[TreeNode], data: int) -> TreeNode:
        if node is None:
            return TreeNode(data)
        
        if data < node.data:
            node.left = self._insert_helper(node.left, data)
        elif data > node.data:
            node.right = self._insert_helper(node.right, data)
        
        return node
    
    def inorder(self) -> None:
        print("Inorder: ", end="")
        self._inorder_helper(self.root)
        print()
    
    def _inorder_helper(self, node: Optional[TreeNode]) -> None:
        if node:
            self._inorder_helper(node.left)
            print(node.data, end=" ")
            self._inorder_helper(node.right)
    
    def preorder(self) -> None:
        print("Preorder: ", end="")
        self._preorder_helper(self.root)
        print()
    
    def _preorder_helper(self, node: Optional[TreeNode]) -> None:
        if node:
            print(node.data, end=" ")
            self._preorder_helper(node.left)
            self._preorder_helper(node.right)
    
    def postorder(self) -> None:
        print("Postorder: ", end="")
        self._postorder_helper(self.root)
        print()
    
    def _postorder_helper(self, node: Optional[TreeNode]) -> None:
        if node:
            self._postorder_helper(node.left)
            self._postorder_helper(node.right)
            print(node.data, end=" ")

def main() -> None:
    print("=== Binary Search Tree ===")
    tree = BinarySearchTree()
    
    tree.insert(50)
    tree.insert(30)
    tree.insert(70)
    tree.insert(20)
    tree.insert(40)
    tree.insert(60)
    tree.insert(80)
    
    tree.inorder()
    tree.preorder()
    tree.postorder()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Binary Search Tree - Java Implementation
 * Hierarchical data organization with BST properties
 */

class TreeNode {
    int data;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

public class BinarySearchTree {
    private TreeNode root;
    
    public BinarySearchTree() {
        this.root = null;
    }
    
    public void insert(int data) {
        root = insertHelper(root, data);
        System.out.println("Inserted " + data);
    }
    
    private TreeNode insertHelper(TreeNode node, int data) {
        if (node == null) {
            return new TreeNode(data);
        }
        
        if (data < node.data) {
            node.left = insertHelper(node.left, data);
        } else if (data > node.data) {
            node.right = insertHelper(node.right, data);
        }
        
        return node;
    }
    
    public void inorder() {
        System.out.print("Inorder: ");
        inorderHelper(root);
        System.out.println();
    }
    
    private void inorderHelper(TreeNode node) {
        if (node != null) {
            inorderHelper(node.left);
            System.out.print(node.data + " ");
            inorderHelper(node.right);
        }
    }
    
    public void preorder() {
        System.out.print("Preorder: ");
        preorderHelper(root);
        System.out.println();
    }
    
    private void preorderHelper(TreeNode node) {
        if (node != null) {
            System.out.print(node.data + " ");
            preorderHelper(node.left);
            preorderHelper(node.right);
        }
    }
    
    public void postorder() {
        System.out.print("Postorder: ");
        postorderHelper(root);
        System.out.println();
    }
    
    private void postorderHelper(TreeNode node) {
        if (node != null) {
            postorderHelper(node.left);
            postorderHelper(node.right);
            System.out.print(node.data + " ");
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Binary Search Tree ===");
        BinarySearchTree tree = new BinarySearchTree();
        
        tree.insert(50);
        tree.insert(30);
        tree.insert(70);
        tree.insert(20);
        tree.insert(40);
        tree.insert(60);
        tree.insert(80);
        
        tree.inorder();
        tree.preorder();
        tree.postorder();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fdf2f8, #fce7f3, #f9a8d4)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/datastructures" style={{
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
        ← Back to Data Structures
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Tree Code
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
                  {selectedLanguage === 'cpp' ? 'tree.cpp' : 
                   selectedLanguage === 'c' ? 'tree.c' :
                   selectedLanguage === 'python' ? 'tree.py' : 'BinarySearchTree.java'}
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

export default TreeCode;