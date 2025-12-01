import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const TopologicalSortCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Topological Sort - C++ Implementation
 * Order vertices linearly using DFS
 */

#include <iostream>
#include <vector>
#include <stack>
using namespace std;

class Graph {
private:
    int vertices;
    vector<vector<int>> adjList;
    
    void topologicalSortUtil(int v, vector<bool>& visited, stack<int>& Stack) {
        visited[v] = true;
        
        for (int neighbor : adjList[v]) {
            if (!visited[neighbor]) {
                topologicalSortUtil(neighbor, visited, Stack);
            }
        }
        
        Stack.push(v);
    }
    
public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int src, int dest) {
        adjList[src].push_back(dest);
    }
    
    void topologicalSort() {
        stack<int> Stack;
        vector<bool> visited(vertices, false);
        
        for (int i = 0; i < vertices; i++) {
            if (!visited[i]) {
                topologicalSortUtil(i, visited, Stack);
            }
        }
        
        cout << "Topological Sort: ";
        while (!Stack.empty()) {
            cout << Stack.top() << " ";
            Stack.pop();
        }
        cout << endl;
    }
};

int main() {
    cout << "=== Topological Sort ===" << endl;
    Graph g(6);
    
    g.addEdge(5, 2);
    g.addEdge(5, 0);
    g.addEdge(4, 0);
    g.addEdge(4, 1);
    g.addEdge(2, 3);
    g.addEdge(3, 1);
    
    g.topologicalSort();
    
    return 0;
}`,
    c: `/**
 * Topological Sort - C Implementation
 * Order vertices linearly using DFS
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 100

typedef struct {
    int items[MAX_VERTICES];
    int top;
} Stack;

void initStack(Stack* s) {
    s->top = -1;
}

void push(Stack* s, int item) {
    s->items[++s->top] = item;
}

int pop(Stack* s) {
    return s->items[s->top--];
}

bool isEmpty(Stack* s) {
    return s->top == -1;
}

void topologicalSortUtil(int adjMatrix[][MAX_VERTICES], int v, bool visited[], Stack* stack, int V) {
    visited[v] = true;
    
    for (int i = 0; i < V; i++) {
        if (adjMatrix[v][i] && !visited[i]) {
            topologicalSortUtil(adjMatrix, i, visited, stack, V);
        }
    }
    
    push(stack, v);
}

void topologicalSort(int adjMatrix[][MAX_VERTICES], int V) {
    Stack stack;
    initStack(&stack);
    bool visited[MAX_VERTICES] = {false};
    
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            topologicalSortUtil(adjMatrix, i, visited, &stack, V);
        }
    }
    
    printf("Topological Sort: ");
    while (!isEmpty(&stack)) {
        printf("%d ", pop(&stack));
    }
    printf("\\n");
}

int main() {
    printf("=== Topological Sort ===\\n");
    int adjMatrix[MAX_VERTICES][MAX_VERTICES] = {0};
    
    // Add edges
    adjMatrix[5][2] = 1;
    adjMatrix[5][0] = 1;
    adjMatrix[4][0] = 1;
    adjMatrix[4][1] = 1;
    adjMatrix[2][3] = 1;
    adjMatrix[3][1] = 1;
    
    topologicalSort(adjMatrix, 6);
    
    return 0;
}`,
    python: `"""
Topological Sort - Python Implementation
Order vertices linearly using DFS
"""

from collections import defaultdict
from typing import List

class Graph:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.graph = defaultdict(list)
    
    def add_edge(self, src: int, dest: int) -> None:
        self.graph[src].append(dest)
    
    def topological_sort_util(self, v: int, visited: List[bool], stack: List[int]) -> None:
        visited[v] = True
        
        for neighbor in self.graph[v]:
            if not visited[neighbor]:
                self.topological_sort_util(neighbor, visited, stack)
        
        stack.append(v)
    
    def topological_sort(self) -> None:
        visited = [False] * self.vertices
        stack = []
        
        for i in range(self.vertices):
            if not visited[i]:
                self.topological_sort_util(i, visited, stack)
        
        print("Topological Sort:", end=" ")
        while stack:
            print(stack.pop(), end=" ")
        print()

def main() -> None:
    print("=== Topological Sort ===")
    g = Graph(6)
    
    g.add_edge(5, 2)
    g.add_edge(5, 0)
    g.add_edge(4, 0)
    g.add_edge(4, 1)
    g.add_edge(2, 3)
    g.add_edge(3, 1)
    
    g.topological_sort()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Topological Sort - Java Implementation
 * Order vertices linearly using DFS
 */

import java.util.*;

public class TopologicalSort {
    private int vertices;
    private Map<Integer, List<Integer>> adjList;
    
    public TopologicalSort(int vertices) {
        this.vertices = vertices;
        this.adjList = new HashMap<>();
        for (int i = 0; i < vertices; i++) {
            adjList.put(i, new ArrayList<>());
        }
    }
    
    public void addEdge(int src, int dest) {
        adjList.get(src).add(dest);
    }
    
    private void topologicalSortUtil(int v, boolean[] visited, Stack<Integer> stack) {
        visited[v] = true;
        
        for (int neighbor : adjList.get(v)) {
            if (!visited[neighbor]) {
                topologicalSortUtil(neighbor, visited, stack);
            }
        }
        
        stack.push(v);
    }
    
    public void topologicalSort() {
        Stack<Integer> stack = new Stack<>();
        boolean[] visited = new boolean[vertices];
        
        for (int i = 0; i < vertices; i++) {
            if (!visited[i]) {
                topologicalSortUtil(i, visited, stack);
            }
        }
        
        System.out.print("Topological Sort: ");
        while (!stack.isEmpty()) {
            System.out.print(stack.pop() + " ");
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        System.out.println("=== Topological Sort ===");
        TopologicalSort g = new TopologicalSort(6);
        
        g.addEdge(5, 2);
        g.addEdge(5, 0);
        g.addEdge(4, 0);
        g.addEdge(4, 1);
        g.addEdge(2, 3);
        g.addEdge(3, 1);
        
        g.topologicalSort();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #e2e8f0, #94a3b8)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/graphalgorithms" style={{
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
        ← Back to Graph Algorithms
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Topological Sort Code
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
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
                  {selectedLanguage === 'cpp' ? 'topological_sort.cpp' : 
                   selectedLanguage === 'c' ? 'topological_sort.c' :
                   selectedLanguage === 'python' ? 'topological_sort.py' : 'TopologicalSort.java'}
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
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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

export default TopologicalSortCode;