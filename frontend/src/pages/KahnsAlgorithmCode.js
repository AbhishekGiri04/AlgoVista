import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const KahnsAlgorithmCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Kahn's Algorithm - C++ Implementation
 * Topological sort using BFS and in-degree
 */

#include <iostream>
#include <vector>
#include <queue>
using namespace std;

class Graph {
private:
    int vertices;
    vector<vector<int>> adjList;
    
public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int src, int dest) {
        adjList[src].push_back(dest);
    }
    
    void kahnsAlgorithm() {
        vector<int> inDegree(vertices, 0);
        
        // Calculate in-degrees
        for (int u = 0; u < vertices; u++) {
            for (int v : adjList[u]) {
                inDegree[v]++;
            }
        }
        
        queue<int> q;
        for (int i = 0; i < vertices; i++) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }
        
        vector<int> result;
        
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            result.push_back(u);
            
            for (int v : adjList[u]) {
                inDegree[v]--;
                if (inDegree[v] == 0) {
                    q.push(v);
                }
            }
        }
        
        if (result.size() != vertices) {
            cout << "Graph has a cycle!" << endl;
        } else {
            cout << "Topological Sort (Kahn's): ";
            for (int vertex : result) {
                cout << vertex << " ";
            }
            cout << endl;
        }
    }
};

int main() {
    cout << "=== Kahn's Algorithm ===" << endl;
    Graph g(6);
    
    g.addEdge(5, 2);
    g.addEdge(5, 0);
    g.addEdge(4, 0);
    g.addEdge(4, 1);
    g.addEdge(2, 3);
    g.addEdge(3, 1);
    
    g.kahnsAlgorithm();
    
    return 0;
}`,
    c: `/**
 * Kahn's Algorithm - C Implementation
 * Topological sort using BFS and in-degree
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 100

typedef struct {
    int items[MAX_VERTICES];
    int front, rear;
} Queue;

void initQueue(Queue* q) {
    q->front = -1;
    q->rear = -1;
}

bool isEmpty(Queue* q) {
    return q->front == -1;
}

void enqueue(Queue* q, int item) {
    if (q->front == -1) q->front = 0;
    q->rear++;
    q->items[q->rear] = item;
}

int dequeue(Queue* q) {
    int item = q->items[q->front];
    q->front++;
    if (q->front > q->rear) {
        q->front = q->rear = -1;
    }
    return item;
}

void kahnsAlgorithm(int adjMatrix[][MAX_VERTICES], int V) {
    int inDegree[MAX_VERTICES] = {0};
    
    // Calculate in-degrees
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (adjMatrix[i][j]) {
                inDegree[j]++;
            }
        }
    }
    
    Queue q;
    initQueue(&q);
    
    for (int i = 0; i < V; i++) {
        if (inDegree[i] == 0) {
            enqueue(&q, i);
        }
    }
    
    int result[MAX_VERTICES];
    int count = 0;
    
    while (!isEmpty(&q)) {
        int u = dequeue(&q);
        result[count++] = u;
        
        for (int v = 0; v < V; v++) {
            if (adjMatrix[u][v]) {
                inDegree[v]--;
                if (inDegree[v] == 0) {
                    enqueue(&q, v);
                }
            }
        }
    }
    
    if (count != V) {
        printf("Graph has a cycle!\\n");
    } else {
        printf("Topological Sort (Kahn's): ");
        for (int i = 0; i < count; i++) {
            printf("%d ", result[i]);
        }
        printf("\\n");
    }
}

int main() {
    printf("=== Kahn's Algorithm ===\\n");
    int adjMatrix[MAX_VERTICES][MAX_VERTICES] = {0};
    
    // Add edges
    adjMatrix[5][2] = 1;
    adjMatrix[5][0] = 1;
    adjMatrix[4][0] = 1;
    adjMatrix[4][1] = 1;
    adjMatrix[2][3] = 1;
    adjMatrix[3][1] = 1;
    
    kahnsAlgorithm(adjMatrix, 6);
    
    return 0;
}`,
    python: `"""
Kahn's Algorithm - Python Implementation
Topological sort using BFS and in-degree
"""

from collections import defaultdict, deque
from typing import List

class Graph:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.graph = defaultdict(list)
    
    def add_edge(self, src: int, dest: int) -> None:
        self.graph[src].append(dest)
    
    def kahns_algorithm(self) -> None:
        in_degree = [0] * self.vertices
        
        # Calculate in-degrees
        for u in range(self.vertices):
            for v in self.graph[u]:
                in_degree[v] += 1
        
        queue = deque()
        for i in range(self.vertices):
            if in_degree[i] == 0:
                queue.append(i)
        
        result = []
        
        while queue:
            u = queue.popleft()
            result.append(u)
            
            for v in self.graph[u]:
                in_degree[v] -= 1
                if in_degree[v] == 0:
                    queue.append(v)
        
        if len(result) != self.vertices:
            print("Graph has a cycle!")
        else:
            print("Topological Sort (Kahn's):", end=" ")
            for vertex in result:
                print(vertex, end=" ")
            print()

def main() -> None:
    print("=== Kahn's Algorithm ===")
    g = Graph(6)
    
    g.add_edge(5, 2)
    g.add_edge(5, 0)
    g.add_edge(4, 0)
    g.add_edge(4, 1)
    g.add_edge(2, 3)
    g.add_edge(3, 1)
    
    g.kahns_algorithm()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Kahn's Algorithm - Java Implementation
 * Topological sort using BFS and in-degree
 */

import java.util.*;

public class KahnsAlgorithm {
    private int vertices;
    private Map<Integer, List<Integer>> adjList;
    
    public KahnsAlgorithm(int vertices) {
        this.vertices = vertices;
        this.adjList = new HashMap<>();
        for (int i = 0; i < vertices; i++) {
            adjList.put(i, new ArrayList<>());
        }
    }
    
    public void addEdge(int src, int dest) {
        adjList.get(src).add(dest);
    }
    
    public void kahnsAlgorithm() {
        int[] inDegree = new int[vertices];
        
        // Calculate in-degrees
        for (int u = 0; u < vertices; u++) {
            for (int v : adjList.get(u)) {
                inDegree[v]++;
            }
        }
        
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < vertices; i++) {
            if (inDegree[i] == 0) {
                queue.offer(i);
            }
        }
        
        List<Integer> result = new ArrayList<>();
        
        while (!queue.isEmpty()) {
            int u = queue.poll();
            result.add(u);
            
            for (int v : adjList.get(u)) {
                inDegree[v]--;
                if (inDegree[v] == 0) {
                    queue.offer(v);
                }
            }
        }
        
        if (result.size() != vertices) {
            System.out.println("Graph has a cycle!");
        } else {
            System.out.print("Topological Sort (Kahn's): ");
            for (int vertex : result) {
                System.out.print(vertex + " ");
            }
            System.out.println();
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Kahn's Algorithm ===");
        KahnsAlgorithm g = new KahnsAlgorithm(6);
        
        g.addEdge(5, 2);
        g.addEdge(5, 0);
        g.addEdge(4, 0);
        g.addEdge(4, 1);
        g.addEdge(2, 3);
        g.addEdge(3, 1);
        
        g.kahnsAlgorithm();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fffbeb, #fef3c7, #fcd34d)',
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
        Kahn's Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'kahns.cpp' : 
                   selectedLanguage === 'c' ? 'kahns.c' :
                   selectedLanguage === 'python' ? 'kahns.py' : 'KahnsAlgorithm.java'}
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

export default KahnsAlgorithmCode;