import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const BreadthFirstSearchCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Breadth First Search (BFS) - C++ Implementation
 * Explore graph level by level using queue
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
        adjList[dest].push_back(src); // Undirected graph
    }
    
    void BFS(int start) {
        vector<bool> visited(vertices, false);
        queue<int> q;
        
        visited[start] = true;
        q.push(start);
        
        cout << "BFS from " << start << ": ";
        
        while (!q.empty()) {
            int vertex = q.front();
            q.pop();
            cout << vertex << " ";
            
            for (int neighbor : adjList[vertex]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        cout << endl;
    }
};

int main() {
    cout << "=== Breadth First Search ===" << endl;
    Graph g(6);
    
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 3);
    g.addEdge(1, 4);
    g.addEdge(2, 5);
    
    g.BFS(0);
    
    return 0;
}`,
    c: `/**
 * Breadth First Search (BFS) - C Implementation
 * Explore graph level by level using queue
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 100

typedef struct {
    int items[MAX_VERTICES];
    int front, rear;
} Queue;

typedef struct {
    int adjMatrix[MAX_VERTICES][MAX_VERTICES];
    int vertices;
} Graph;

Queue* createQueue() {
    Queue* q = (Queue*)malloc(sizeof(Queue));
    q->front = -1;
    q->rear = -1;
    return q;
}

bool isEmpty(Queue* q) {
    return q->front == -1;
}

void enqueue(Queue* q, int value) {
    if (q->front == -1) q->front = 0;
    q->rear++;
    q->items[q->rear] = value;
}

int dequeue(Queue* q) {
    int item = q->items[q->front];
    q->front++;
    if (q->front > q->rear) {
        q->front = q->rear = -1;
    }
    return item;
}

Graph* createGraph(int vertices) {
    Graph* graph = (Graph*)malloc(sizeof(Graph));
    graph->vertices = vertices;
    
    for (int i = 0; i < vertices; i++) {
        for (int j = 0; j < vertices; j++) {
            graph->adjMatrix[i][j] = 0;
        }
    }
    return graph;
}

void addEdge(Graph* graph, int src, int dest) {
    graph->adjMatrix[src][dest] = 1;
    graph->adjMatrix[dest][src] = 1;
}

void BFS(Graph* graph, int start) {
    bool visited[MAX_VERTICES] = {false};
    Queue* q = createQueue();
    
    visited[start] = true;
    enqueue(q, start);
    
    printf("BFS from %d: ", start);
    
    while (!isEmpty(q)) {
        int vertex = dequeue(q);
        printf("%d ", vertex);
        
        for (int i = 0; i < graph->vertices; i++) {
            if (graph->adjMatrix[vertex][i] == 1 && !visited[i]) {
                visited[i] = true;
                enqueue(q, i);
            }
        }
    }
    printf("\n");
    free(q);
}

int main() {
    printf("=== Breadth First Search ===\n");
    Graph* g = createGraph(6);
    
    addEdge(g, 0, 1);
    addEdge(g, 0, 2);
    addEdge(g, 1, 3);
    addEdge(g, 1, 4);
    addEdge(g, 2, 5);
    
    BFS(g, 0);
    
    free(g);
    return 0;
}`,
    python: `"""
Breadth First Search (BFS) - Python Implementation
Explore graph level by level using queue
"""

from collections import defaultdict, deque
from typing import Set

class Graph:
    def __init__(self):
        self.graph = defaultdict(list)
    
    def add_edge(self, src: int, dest: int) -> None:
        self.graph[src].append(dest)
        self.graph[dest].append(src)  # Undirected graph
    
    def bfs(self, start: int) -> None:
        visited = set()
        queue = deque([start])
        visited.add(start)
        
        print(f"BFS from {start}: ", end="")
        
        while queue:
            vertex = queue.popleft()
            print(vertex, end=" ")
            
            for neighbor in self.graph[vertex]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        print()

def main() -> None:
    print("=== Breadth First Search ===")
    g = Graph()
    
    g.add_edge(0, 1)
    g.add_edge(0, 2)
    g.add_edge(1, 3)
    g.add_edge(1, 4)
    g.add_edge(2, 5)
    
    g.bfs(0)

if __name__ == "__main__":
    main()`,
    java: `/**
 * Breadth First Search (BFS) - Java Implementation
 * Explore graph level by level using queue
 */

import java.util.*;

public class BreadthFirstSearch {
    private Map<Integer, List<Integer>> adjList;
    
    public BreadthFirstSearch() {
        this.adjList = new HashMap<>();
    }
    
    public void addEdge(int src, int dest) {
        adjList.computeIfAbsent(src, k -> new ArrayList<>()).add(dest);
        adjList.computeIfAbsent(dest, k -> new ArrayList<>()).add(src);
    }
    
    public void bfs(int start) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        
        visited.add(start);
        queue.offer(start);
        
        System.out.print("BFS from " + start + ": ");
        
        while (!queue.isEmpty()) {
            int vertex = queue.poll();
            System.out.print(vertex + " ");
            
            List<Integer> neighbors = adjList.getOrDefault(vertex, new ArrayList<>());
            for (int neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        System.out.println("=== Breadth First Search ===");
        BreadthFirstSearch g = new BreadthFirstSearch();
        
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        g.addEdge(1, 4);
        g.addEdge(2, 5);
        
        g.bfs(0);
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
        Breadth First Search Code
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
                  {selectedLanguage === 'cpp' ? 'bfs.cpp' : 
                   selectedLanguage === 'c' ? 'bfs.c' :
                   selectedLanguage === 'python' ? 'bfs.py' : 'BreadthFirstSearch.java'}
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

export default BreadthFirstSearchCode;