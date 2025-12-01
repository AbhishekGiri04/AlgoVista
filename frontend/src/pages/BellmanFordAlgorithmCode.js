import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const BellmanFordAlgorithmCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Bellman-Ford Algorithm - C++ Implementation
 * Detect negative cycles and find shortest paths
 */

#include <iostream>
#include <vector>
#include <climits>
using namespace std;

struct Edge {
    int src, dest, weight;
};

class Graph {
private:
    int vertices;
    vector<Edge> edges;
    
public:
    Graph(int v) : vertices(v) {}
    
    void addEdge(int src, int dest, int weight) {
        edges.push_back({src, dest, weight});
    }
    
    bool bellmanFord(int src) {
        vector<int> dist(vertices, INT_MAX);
        dist[src] = 0;
        
        // Relax all edges V-1 times
        for (int i = 0; i < vertices - 1; i++) {
            for (const Edge& edge : edges) {
                if (dist[edge.src] != INT_MAX && 
                    dist[edge.src] + edge.weight < dist[edge.dest]) {
                    dist[edge.dest] = dist[edge.src] + edge.weight;
                }
            }
        }
        
        // Check for negative cycles
        for (const Edge& edge : edges) {
            if (dist[edge.src] != INT_MAX && 
                dist[edge.src] + edge.weight < dist[edge.dest]) {
                cout << "Graph contains negative cycle!" << endl;
                return false;
            }
        }
        
        cout << "Shortest distances from vertex " << src << ":" << endl;
        for (int i = 0; i < vertices; i++) {
            cout << "Vertex " << i << ": ";
            if (dist[i] == INT_MAX) {
                cout << "INF" << endl;
            } else {
                cout << dist[i] << endl;
            }
        }
        return true;
    }
};

int main() {
    cout << "=== Bellman-Ford Algorithm ===" << endl;
    Graph g(5);
    
    g.addEdge(0, 1, -1);
    g.addEdge(0, 2, 4);
    g.addEdge(1, 2, 3);
    g.addEdge(1, 3, 2);
    g.addEdge(1, 4, 2);
    g.addEdge(3, 2, 5);
    g.addEdge(3, 1, 1);
    g.addEdge(4, 3, -3);
    
    g.bellmanFord(0);
    
    return 0;
}`,
    c: `/**
 * Bellman-Ford Algorithm - C Implementation
 * Detect negative cycles and find shortest paths
 */

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>

typedef struct {
    int src, dest, weight;
} Edge;

bool bellmanFord(Edge edges[], int V, int E, int src) {
    int* dist = (int*)malloc(V * sizeof(int));
    
    for (int i = 0; i < V; i++) {
        dist[i] = INT_MAX;
    }
    dist[src] = 0;
    
    // Relax all edges V-1 times
    for (int i = 0; i < V - 1; i++) {
        for (int j = 0; j < E; j++) {
            if (dist[edges[j].src] != INT_MAX && 
                dist[edges[j].src] + edges[j].weight < dist[edges[j].dest]) {
                dist[edges[j].dest] = dist[edges[j].src] + edges[j].weight;
            }
        }
    }
    
    // Check for negative cycles
    for (int j = 0; j < E; j++) {
        if (dist[edges[j].src] != INT_MAX && 
            dist[edges[j].src] + edges[j].weight < dist[edges[j].dest]) {
            printf("Graph contains negative cycle!\\n");
            free(dist);
            return false;
        }
    }
    
    printf("Shortest distances from vertex %d:\\n", src);
    for (int i = 0; i < V; i++) {
        printf("Vertex %d: ", i);
        if (dist[i] == INT_MAX) {
            printf("INF\\n");
        } else {
            printf("%d\\n", dist[i]);
        }
    }
    
    free(dist);
    return true;
}

int main() {
    printf("=== Bellman-Ford Algorithm ===\\n");
    Edge edges[] = {
        {0, 1, -1},
        {0, 2, 4},
        {1, 2, 3},
        {1, 3, 2},
        {1, 4, 2},
        {3, 2, 5},
        {3, 1, 1},
        {4, 3, -3}
    };
    
    bellmanFord(edges, 5, 8, 0);
    
    return 0;
}`,
    python: `"""
Bellman-Ford Algorithm - Python Implementation
Detect negative cycles and find shortest paths
"""

from typing import List, Tuple, Optional

class Edge:
    def __init__(self, src: int, dest: int, weight: int):
        self.src = src
        self.dest = dest
        self.weight = weight

class Graph:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.edges: List[Edge] = []
    
    def add_edge(self, src: int, dest: int, weight: int) -> None:
        self.edges.append(Edge(src, dest, weight))
    
    def bellman_ford(self, src: int) -> bool:
        dist = [float('inf')] * self.vertices
        dist[src] = 0
        
        # Relax all edges V-1 times
        for _ in range(self.vertices - 1):
            for edge in self.edges:
                if (dist[edge.src] != float('inf') and 
                    dist[edge.src] + edge.weight < dist[edge.dest]):
                    dist[edge.dest] = dist[edge.src] + edge.weight
        
        # Check for negative cycles
        for edge in self.edges:
            if (dist[edge.src] != float('inf') and 
                dist[edge.src] + edge.weight < dist[edge.dest]):
                print("Graph contains negative cycle!")
                return False
        
        print(f"Shortest distances from vertex {src}:")
        for i in range(self.vertices):
            if dist[i] == float('inf'):
                print(f"Vertex {i}: INF")
            else:
                print(f"Vertex {i}: {dist[i]}")
        
        return True

def main() -> None:
    print("=== Bellman-Ford Algorithm ===")
    g = Graph(5)
    
    g.add_edge(0, 1, -1)
    g.add_edge(0, 2, 4)
    g.add_edge(1, 2, 3)
    g.add_edge(1, 3, 2)
    g.add_edge(1, 4, 2)
    g.add_edge(3, 2, 5)
    g.add_edge(3, 1, 1)
    g.add_edge(4, 3, -3)
    
    g.bellman_ford(0)

if __name__ == "__main__":
    main()`,
    java: `/**
 * Bellman-Ford Algorithm - Java Implementation
 * Detect negative cycles and find shortest paths
 */

import java.util.*;

class Edge {
    int src, dest, weight;
    
    Edge(int src, int dest, int weight) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }
}

public class BellmanFordAlgorithm {
    private int vertices;
    private List<Edge> edges;
    
    public BellmanFordAlgorithm(int vertices) {
        this.vertices = vertices;
        this.edges = new ArrayList<>();
    }
    
    public void addEdge(int src, int dest, int weight) {
        edges.add(new Edge(src, dest, weight));
    }
    
    public boolean bellmanFord(int src) {
        int[] dist = new int[vertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        
        // Relax all edges V-1 times
        for (int i = 0; i < vertices - 1; i++) {
            for (Edge edge : edges) {
                if (dist[edge.src] != Integer.MAX_VALUE && 
                    dist[edge.src] + edge.weight < dist[edge.dest]) {
                    dist[edge.dest] = dist[edge.src] + edge.weight;
                }
            }
        }
        
        // Check for negative cycles
        for (Edge edge : edges) {
            if (dist[edge.src] != Integer.MAX_VALUE && 
                dist[edge.src] + edge.weight < dist[edge.dest]) {
                System.out.println("Graph contains negative cycle!");
                return false;
            }
        }
        
        System.out.println("Shortest distances from vertex " + src + ":");
        for (int i = 0; i < vertices; i++) {
            System.out.print("Vertex " + i + ": ");
            if (dist[i] == Integer.MAX_VALUE) {
                System.out.println("INF");
            } else {
                System.out.println(dist[i]);
            }
        }
        
        return true;
    }
    
    public static void main(String[] args) {
        System.out.println("=== Bellman-Ford Algorithm ===");
        BellmanFordAlgorithm g = new BellmanFordAlgorithm(5);
        
        g.addEdge(0, 1, -1);
        g.addEdge(0, 2, 4);
        g.addEdge(1, 2, 3);
        g.addEdge(1, 3, 2);
        g.addEdge(1, 4, 2);
        g.addEdge(3, 2, 5);
        g.addEdge(3, 1, 1);
        g.addEdge(4, 3, -3);
        
        g.bellmanFord(0);
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ecfdf5, #d1fae5, #6ee7b7)',
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
        Bellman-Ford Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'bellman_ford.cpp' : 
                   selectedLanguage === 'c' ? 'bellman_ford.c' :
                   selectedLanguage === 'python' ? 'bellman_ford.py' : 'BellmanFordAlgorithm.java'}
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

export default BellmanFordAlgorithmCode;