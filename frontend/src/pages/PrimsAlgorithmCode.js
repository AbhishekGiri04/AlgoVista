import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const PrimsAlgorithmCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Prim Algorithm - C++ Implementation
 * Network of connected nodes using adjacency list
 */

#include <iostream>
#include <vector>
#include <list>
#include <queue>
using namespace std;

class Graph {
private:
    int vertices;
    vector<list<int>> adjList;
    
public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int src, int dest) {
        adjList[src].push_back(dest);
        adjList[dest].push_back(src); // Undirected graph
        cout << "Added edge: " << src << " - " << dest << endl;
    }
    
    void removeEdge(int src, int dest) {
        adjList[src].remove(dest);
        adjList[dest].remove(src);
        cout << "Removed edge: " << src << " - " << dest << endl;
    }
    
    void display() {
        cout << "Graph adjacency list:" << endl;
        for (int i = 0; i < vertices; i++) {
            cout << i << ": ";
            for (int neighbor : adjList[i]) {
                cout << neighbor << " ";
            }
            cout << endl;
        }
    }
    
    void DFS(int start, vector<bool>& visited) {
        visited[start] = true;
        cout << start << " ";
        
        for (int neighbor : adjList[start]) {
            if (!visited[neighbor]) {
                DFS(neighbor, visited);
            }
        }
    }
    
    void DFSTraversal(int start) {
        vector<bool> visited(vertices, false);
        cout << "DFS from " << start << ": ";
        DFS(start, visited);
        cout << endl;
    }
    
    void BFSTraversal(int start) {
        vector<bool> visited(vertices, false);
        queue<int> q;
        
        visited[start] = true;
        q.push(start);
        
        cout << "BFS from " << start << ": ";
        
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            cout << current << " ";
            
            for (int neighbor : adjList[current]) {
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
    cout << "=== Prim Algorithm ===" << endl;
    Graph g(5);
    
    g.addEdge(0, 1);
    g.addEdge(0, 4);
    g.addEdge(1, 2);
    g.addEdge(1, 3);
    g.addEdge(2, 3);
    
    g.display();
    
    g.removeEdge(1, 3);
    g.display();
    
    g.DFSTraversal(0);
    g.BFSTraversal(0);
    
    return 0;
}`,
    c: `/**
 * Prim Algorithm - C Implementation
 * Network of connected nodes using adjacency list with arrays
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 100

typedef struct {
    int adjMatrix[MAX_VERTICES][MAX_VERTICES];
    int vertices;
} Graph;

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
    graph->adjMatrix[dest][src] = 1; // Undirected graph
    printf("Added edge: %d - %d", src, dest);
}

void removeEdge(Graph* graph, int src, int dest) {
    graph->adjMatrix[src][dest] = 0;
    graph->adjMatrix[dest][src] = 0;
    printf("Removed edge: %d - %d", src, dest);
}

void display(Graph* graph) {
    printf("Graph adjacency list:");
    for (int i = 0; i < graph->vertices; i++) {
        printf("%d: ", i);
        for (int j = 0; j < graph->vertices; j++) {
            if (graph->adjMatrix[i][j] == 1) {
                printf("%d ", j);
            }
        }
    }
}

void DFS(Graph* graph, int start, bool visited[]) {
    visited[start] = true;
    printf("%d ", start);
    
    for (int i = 0; i < graph->vertices; i++) {
        if (graph->adjMatrix[start][i] == 1 && !visited[i]) {
            DFS(graph, i, visited);
        }
    }
}

void DFSTraversal(Graph* graph, int start) {
    bool visited[MAX_VERTICES] = {false};
    printf("DFS from %d: ", start);
    DFS(graph, start, visited);
}

void BFSTraversal(Graph* graph, int start) {
    bool visited[MAX_VERTICES] = {false};
    int queue[MAX_VERTICES];
    int front = 0, rear = 0;
    
    visited[start] = true;
    queue[rear++] = start;
    
    printf("BFS from %d: ", start);
    
    while (front < rear) {
        int current = queue[front++];
        printf("%d ", current);
        
        for (int i = 0; i < graph->vertices; i++) {
            if (graph->adjMatrix[current][i] == 1 && !visited[i]) {
                visited[i] = true;
                queue[rear++] = i;
            }
        }
    }
}

int main() {
    printf("=== Prim Algorithm ===");
    Graph* g = createGraph(5);
    
    addEdge(g, 0, 1);
    addEdge(g, 0, 4);
    addEdge(g, 1, 2);
    addEdge(g, 1, 3);
    addEdge(g, 2, 3);
    
    display(g);
    
    removeEdge(g, 1, 3);
    display(g);
    
    DFSTraversal(g, 0);
    BFSTraversal(g, 0);
    
    free(g);
    return 0;
}`,
    python: `"""
Prim Algorithm - Python Implementation
Network of connected nodes using adjacency list
"""

from collections import deque, defaultdict
from typing import List, Set

class Graph:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.adj_list = defaultdict(list)
    
    def add_edge(self, src: int, dest: int) -> None:
        """Add an undirected edge between src and dest"""
        self.adj_list[src].append(dest)
        self.adj_list[dest].append(src)
        print(f"Added edge: {src} - {dest}")
    
    def remove_edge(self, src: int, dest: int) -> None:
        """Remove an edge between src and dest"""
        if dest in self.adj_list[src]:
            self.adj_list[src].remove(dest)
        if src in self.adj_list[dest]:
            self.adj_list[dest].remove(src)
        print(f"Removed edge: {src} - {dest}")
    
    def display(self) -> None:
        """Display the adjacency list representation"""
        print("Graph adjacency list:")
        for vertex in range(self.vertices):
            neighbors = ' '.join(map(str, self.adj_list[vertex]))
            print(f"{vertex}: {neighbors}")
    
    def _dfs(self, start: int, visited: Set[int]) -> None:
        """Helper method for DFS traversal"""
        visited.add(start)
        print(start, end=" ")
        
        for neighbor in self.adj_list[start]:
            if neighbor not in visited:
                self._dfs(neighbor, visited)
    
    def dfs_traversal(self, start: int) -> None:
        """Depth-First Search traversal"""
        visited = set()
        print(f"DFS from {start}: ", end="")
        self._dfs(start, visited)
        print()
    
    def bfs_traversal(self, start: int) -> None:
        """Breadth-First Search traversal"""
        visited = set()
        queue = deque([start])
        visited.add(start)
        
        print(f"BFS from {start}: ", end="")
        
        while queue:
            current = queue.popleft()
            print(current, end=" ")
            
            for neighbor in self.adj_list[current]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        print()

def main() -> None:
    print("=== Prim Algorithm ===")
    graph = Graph(5)
    
    graph.add_edge(0, 1)
    graph.add_edge(0, 4)
    graph.add_edge(1, 2)
    graph.add_edge(1, 3)
    graph.add_edge(2, 3)
    
    graph.display()
    
    graph.remove_edge(1, 3)
    graph.display()
    
    graph.dfs_traversal(0)
    graph.bfs_traversal(0)

if __name__ == "__main__":
    main()`,
    java: `/**
 * Prim Algorithm - Java Implementation
 * Network of connected nodes using adjacency list
 */

import java.util.*;

public class Graph {
    private int vertices;
    private List<List<Integer>> adjList;
    
    public Graph(int vertices) {
        this.vertices = vertices;
        this.adjList = new ArrayList<>();
        
        for (int i = 0; i < vertices; i++) {
            adjList.add(new ArrayList<>());
        }
    }
    
    public void addEdge(int src, int dest) {
        adjList.get(src).add(dest);
        adjList.get(dest).add(src); // Undirected graph
        System.out.println("Added edge: " + src + " - " + dest);
    }
    
    public void removeEdge(int src, int dest) {
        adjList.get(src).remove(Integer.valueOf(dest));
        adjList.get(dest).remove(Integer.valueOf(src));
        System.out.println("Removed edge: " + src + " - " + dest);
    }
    
    public void display() {
        System.out.println("Graph adjacency list:");
        for (int i = 0; i < vertices; i++) {
            System.out.print(i + ": ");
            for (int neighbor : adjList.get(i)) {
                System.out.print(neighbor + " ");
            }
            System.out.println();
        }
    }
    
    private void DFS(int start, boolean[] visited) {
        visited[start] = true;
        System.out.print(start + " ");
        
        for (int neighbor : adjList.get(start)) {
            if (!visited[neighbor]) {
                DFS(neighbor, visited);
            }
        }
    }
    
    public void DFSTraversal(int start) {
        boolean[] visited = new boolean[vertices];
        System.out.print("DFS from " + start + ": ");
        DFS(start, visited);
        System.out.println();
    }
    
    public void BFSTraversal(int start) {
        boolean[] visited = new boolean[vertices];
        Queue<Integer> queue = new LinkedList<>();
        
        visited[start] = true;
        queue.offer(start);
        
        System.out.print("BFS from " + start + ": ");
        
        while (!queue.isEmpty()) {
            int current = queue.poll();
            System.out.print(current + " ");
            
            for (int neighbor : adjList.get(current)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        System.out.println("=== Prim Algorithm ===");
        Graph g = new Graph(5);
        
        g.addEdge(0, 1);
        g.addEdge(0, 4);
        g.addEdge(1, 2);
        g.addEdge(1, 3);
        g.addEdge(2, 3);
        
        g.display();
        
        g.removeEdge(1, 3);
        g.display();
        
        g.DFSTraversal(0);
        g.BFSTraversal(0);
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
        Prim's Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'prim.cpp' : 
                   selectedLanguage === 'c' ? 'prim.c' :
                   selectedLanguage === 'python' ? 'prim.py' : 'PrimsAlgorithm.java'}
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

export default PrimsAlgorithmCode;