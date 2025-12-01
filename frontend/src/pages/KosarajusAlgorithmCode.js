import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const KosarajusAlgorithmCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Kosaraju's Algorithm - C++ Implementation
 * Find strongly connected components using DFS
 */

#include <iostream>
#include <vector>
#include <stack>
using namespace std;

class Graph {
private:
    int vertices;
    vector<vector<int>> adjList;
    
    void DFSUtil(int v, vector<bool>& visited, stack<int>& Stack) {
        visited[v] = true;
        
        for (int neighbor : adjList[v]) {
            if (!visited[neighbor]) {
                DFSUtil(neighbor, visited, Stack);
            }
        }
        
        Stack.push(v);
    }
    
    void DFSUtil2(int v, vector<bool>& visited, vector<int>& component) {
        visited[v] = true;
        component.push_back(v);
        
        for (int neighbor : adjList[v]) {
            if (!visited[neighbor]) {
                DFSUtil2(neighbor, visited, component);
            }
        }
    }
    
    Graph getTranspose() {
        Graph transpose(vertices);
        for (int v = 0; v < vertices; v++) {
            for (int neighbor : adjList[v]) {
                transpose.adjList[neighbor].push_back(v);
            }
        }
        return transpose;
    }
    
public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int src, int dest) {
        adjList[src].push_back(dest);
    }
    
    void kosarajuSCC() {
        stack<int> Stack;
        vector<bool> visited(vertices, false);
        
        // Fill vertices in stack according to their finishing times
        for (int i = 0; i < vertices; i++) {
            if (!visited[i]) {
                DFSUtil(i, visited, Stack);
            }
        }
        
        // Create transpose graph
        Graph transpose = getTranspose();
        
        // Mark all vertices as not visited for second DFS
        fill(visited.begin(), visited.end(), false);
        
        cout << "Strongly Connected Components:" << endl;
        int sccCount = 0;
        
        // Process all vertices in order defined by Stack
        while (!Stack.empty()) {
            int v = Stack.top();
            Stack.pop();
            
            if (!visited[v]) {
                vector<int> component;
                transpose.DFSUtil2(v, visited, component);
                
                cout << "SCC " << ++sccCount << ": ";
                for (int vertex : component) {
                    cout << vertex << " ";
                }
                cout << endl;
            }
        }
    }
};

int main() {
    cout << "=== Kosaraju's Algorithm ===" << endl;
    Graph g(5);
    
    g.addEdge(1, 0);
    g.addEdge(0, 2);
    g.addEdge(2, 1);
    g.addEdge(0, 3);
    g.addEdge(3, 4);
    
    g.kosarajuSCC();
    
    return 0;
}`,
    c: `/**
 * Kosaraju's Algorithm - C Implementation
 * Find strongly connected components using DFS
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

void DFSUtil(int adjMatrix[][MAX_VERTICES], int v, bool visited[], Stack* stack, int V) {
    visited[v] = true;
    
    for (int i = 0; i < V; i++) {
        if (adjMatrix[v][i] && !visited[i]) {
            DFSUtil(adjMatrix, i, visited, stack, V);
        }
    }
    
    push(stack, v);
}

void DFSUtil2(int adjMatrix[][MAX_VERTICES], int v, bool visited[], int V) {
    visited[v] = true;
    printf("%d ", v);
    
    for (int i = 0; i < V; i++) {
        if (adjMatrix[v][i] && !visited[i]) {
            DFSUtil2(adjMatrix, i, visited, V);
        }
    }
}

void kosarajuSCC(int adjMatrix[][MAX_VERTICES], int V) {
    Stack stack;
    initStack(&stack);
    bool visited[MAX_VERTICES] = {false};
    
    // Fill vertices in stack according to their finishing times
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            DFSUtil(adjMatrix, i, visited, &stack, V);
        }
    }
    
    // Create transpose graph
    int transpose[MAX_VERTICES][MAX_VERTICES];
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            transpose[i][j] = adjMatrix[j][i];
        }
    }
    
    // Mark all vertices as not visited for second DFS
    for (int i = 0; i < V; i++) {
        visited[i] = false;
    }
    
    printf("Strongly Connected Components:\\n");
    int sccCount = 0;
    
    // Process all vertices in order defined by Stack
    while (!isEmpty(&stack)) {
        int v = pop(&stack);
        
        if (!visited[v]) {
            printf("SCC %d: ", ++sccCount);
            DFSUtil2(transpose, v, visited, V);
            printf("\\n");
        }
    }
}

int main() {
    printf("=== Kosaraju's Algorithm ===\\n");
    int adjMatrix[MAX_VERTICES][MAX_VERTICES] = {0};
    
    // Add edges
    adjMatrix[1][0] = 1;
    adjMatrix[0][2] = 1;
    adjMatrix[2][1] = 1;
    adjMatrix[0][3] = 1;
    adjMatrix[3][4] = 1;
    
    kosarajuSCC(adjMatrix, 5);
    
    return 0;
}`,
    python: `"""
Kosaraju's Algorithm - Python Implementation
Find strongly connected components using DFS
"""

from collections import defaultdict
from typing import List

class Graph:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.graph = defaultdict(list)
    
    def add_edge(self, src: int, dest: int) -> None:
        self.graph[src].append(dest)
    
    def dfs_util(self, v: int, visited: List[bool], stack: List[int]) -> None:
        visited[v] = True
        
        for neighbor in self.graph[v]:
            if not visited[neighbor]:
                self.dfs_util(neighbor, visited, stack)
        
        stack.append(v)
    
    def dfs_util2(self, v: int, visited: List[bool], component: List[int]) -> None:
        visited[v] = True
        component.append(v)
        
        for neighbor in self.graph[v]:
            if not visited[neighbor]:
                self.dfs_util2(neighbor, visited, component)
    
    def get_transpose(self) -> 'Graph':
        transpose = Graph(self.vertices)
        for v in range(self.vertices):
            for neighbor in self.graph[v]:
                transpose.graph[neighbor].append(v)
        return transpose
    
    def kosaraju_scc(self) -> None:
        stack = []
        visited = [False] * self.vertices
        
        # Fill vertices in stack according to their finishing times
        for i in range(self.vertices):
            if not visited[i]:
                self.dfs_util(i, visited, stack)
        
        # Create transpose graph
        transpose = self.get_transpose()
        
        # Mark all vertices as not visited for second DFS
        visited = [False] * self.vertices
        
        print("Strongly Connected Components:")
        scc_count = 0
        
        # Process all vertices in order defined by Stack
        while stack:
            v = stack.pop()
            
            if not visited[v]:
                component = []
                transpose.dfs_util2(v, visited, component)
                
                scc_count += 1
                print(f"SCC {scc_count}: {' '.join(map(str, component))}")

def main() -> None:
    print("=== Kosaraju's Algorithm ===")
    g = Graph(5)
    
    g.add_edge(1, 0)
    g.add_edge(0, 2)
    g.add_edge(2, 1)
    g.add_edge(0, 3)
    g.add_edge(3, 4)
    
    g.kosaraju_scc()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Kosaraju's Algorithm - Java Implementation
 * Find strongly connected components using DFS
 */

import java.util.*;

public class KosarajuAlgorithm {
    private int vertices;
    private Map<Integer, List<Integer>> adjList;
    
    public KosarajuAlgorithm(int vertices) {
        this.vertices = vertices;
        this.adjList = new HashMap<>();
        for (int i = 0; i < vertices; i++) {
            adjList.put(i, new ArrayList<>());
        }
    }
    
    public void addEdge(int src, int dest) {
        adjList.get(src).add(dest);
    }
    
    private void dfsUtil(int v, boolean[] visited, Stack<Integer> stack) {
        visited[v] = true;
        
        for (int neighbor : adjList.get(v)) {
            if (!visited[neighbor]) {
                dfsUtil(neighbor, visited, stack);
            }
        }
        
        stack.push(v);
    }
    
    private void dfsUtil2(int v, boolean[] visited, List<Integer> component, 
                         Map<Integer, List<Integer>> transpose) {
        visited[v] = true;
        component.add(v);
        
        for (int neighbor : transpose.get(v)) {
            if (!visited[neighbor]) {
                dfsUtil2(neighbor, visited, component, transpose);
            }
        }
    }
    
    private Map<Integer, List<Integer>> getTranspose() {
        Map<Integer, List<Integer>> transpose = new HashMap<>();
        for (int i = 0; i < vertices; i++) {
            transpose.put(i, new ArrayList<>());
        }
        
        for (int v = 0; v < vertices; v++) {
            for (int neighbor : adjList.get(v)) {
                transpose.get(neighbor).add(v);
            }
        }
        
        return transpose;
    }
    
    public void kosarajuSCC() {
        Stack<Integer> stack = new Stack<>();
        boolean[] visited = new boolean[vertices];
        
        // Fill vertices in stack according to their finishing times
        for (int i = 0; i < vertices; i++) {
            if (!visited[i]) {
                dfsUtil(i, visited, stack);
            }
        }
        
        // Create transpose graph
        Map<Integer, List<Integer>> transpose = getTranspose();
        
        // Mark all vertices as not visited for second DFS
        Arrays.fill(visited, false);
        
        System.out.println("Strongly Connected Components:");
        int sccCount = 0;
        
        // Process all vertices in order defined by Stack
        while (!stack.isEmpty()) {
            int v = stack.pop();
            
            if (!visited[v]) {
                List<Integer> component = new ArrayList<>();
                dfsUtil2(v, visited, component, transpose);
                
                System.out.print("SCC " + (++sccCount) + ": ");
                for (int vertex : component) {
                    System.out.print(vertex + " ");
                }
                System.out.println();
            }
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Kosaraju's Algorithm ===");
        KosarajuAlgorithm g = new KosarajuAlgorithm(5);
        
        g.addEdge(1, 0);
        g.addEdge(0, 2);
        g.addEdge(2, 1);
        g.addEdge(0, 3);
        g.addEdge(3, 4);
        
        g.kosarajuSCC();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef2f2, #fecaca, #f87171)',
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
        Kosaraju's Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'kosaraju.cpp' : 
                   selectedLanguage === 'c' ? 'kosaraju.c' :
                   selectedLanguage === 'python' ? 'kosaraju.py' : 'KosarajuAlgorithm.java'}
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

export default KosarajusAlgorithmCode;