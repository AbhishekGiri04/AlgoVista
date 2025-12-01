import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const FloydWarshallAlgorithmCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Floyd-Warshall Algorithm - C++ Implementation
 * All pairs shortest paths
 */

#include <iostream>
#include <vector>
#include <climits>
using namespace std;

class Graph {
private:
    int vertices;
    vector<vector<int>> dist;
    
public:
    Graph(int v) : vertices(v) {
        dist.assign(v, vector<int>(v, INT_MAX));
        for (int i = 0; i < v; i++) {
            dist[i][i] = 0;
        }
    }
    
    void addEdge(int src, int dest, int weight) {
        dist[src][dest] = weight;
    }
    
    void floydWarshall() {
        for (int k = 0; k < vertices; k++) {
            for (int i = 0; i < vertices; i++) {
                for (int j = 0; j < vertices; j++) {
                    if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX &&
                        dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        
        cout << "All pairs shortest paths:" << endl;
        for (int i = 0; i < vertices; i++) {
            for (int j = 0; j < vertices; j++) {
                if (dist[i][j] == INT_MAX) {
                    cout << "INF ";
                } else {
                    cout << dist[i][j] << " ";
                }
            }
            cout << endl;
        }
    }
};

int main() {
    cout << "=== Floyd-Warshall Algorithm ===" << endl;
    Graph g(4);
    
    g.addEdge(0, 1, 5);
    g.addEdge(0, 3, 10);
    g.addEdge(1, 2, 3);
    g.addEdge(2, 3, 1);
    
    g.floydWarshall();
    
    return 0;
}`,
    c: `/**
 * Floyd-Warshall Algorithm - C Implementation
 * All pairs shortest paths
 */

#include <stdio.h>
#include <limits.h>

#define MAX_VERTICES 100

void floydWarshall(int graph[][MAX_VERTICES], int V) {
    int dist[MAX_VERTICES][MAX_VERTICES];
    
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            dist[i][j] = graph[i][j];
        }
    }
    
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    
    printf("All pairs shortest paths:\\n");
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (dist[i][j] == INT_MAX) {
                printf("INF ");
            } else {
                printf("%d ", dist[i][j]);
            }
        }
        printf("\\n");
    }
}

int main() {
    printf("=== Floyd-Warshall Algorithm ===\\n");
    int graph[MAX_VERTICES][MAX_VERTICES] = {
        {0, 5, INT_MAX, 10},
        {INT_MAX, 0, 3, INT_MAX},
        {INT_MAX, INT_MAX, 0, 1},
        {INT_MAX, INT_MAX, INT_MAX, 0}
    };
    
    floydWarshall(graph, 4);
    
    return 0;
}`,
    python: `"""
Floyd-Warshall Algorithm - Python Implementation
All pairs shortest paths
"""

from typing import List

class Graph:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.dist = [[float('inf')] * vertices for _ in range(vertices)]
        for i in range(vertices):
            self.dist[i][i] = 0
    
    def add_edge(self, src: int, dest: int, weight: int) -> None:
        self.dist[src][dest] = weight
    
    def floyd_warshall(self) -> None:
        for k in range(self.vertices):
            for i in range(self.vertices):
                for j in range(self.vertices):
                    if (self.dist[i][k] != float('inf') and 
                        self.dist[k][j] != float('inf') and
                        self.dist[i][k] + self.dist[k][j] < self.dist[i][j]):
                        self.dist[i][j] = self.dist[i][k] + self.dist[k][j]
        
        print("All pairs shortest paths:")
        for i in range(self.vertices):
            for j in range(self.vertices):
                if self.dist[i][j] == float('inf'):
                    print("INF", end=" ")
                else:
                    print(self.dist[i][j], end=" ")
            print()

def main() -> None:
    print("=== Floyd-Warshall Algorithm ===")
    g = Graph(4)
    
    g.add_edge(0, 1, 5)
    g.add_edge(0, 3, 10)
    g.add_edge(1, 2, 3)
    g.add_edge(2, 3, 1)
    
    g.floyd_warshall()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Floyd-Warshall Algorithm - Java Implementation
 * All pairs shortest paths
 */

public class FloydWarshallAlgorithm {
    private int vertices;
    private int[][] dist;
    
    public FloydWarshallAlgorithm(int vertices) {
        this.vertices = vertices;
        this.dist = new int[vertices][vertices];
        
        for (int i = 0; i < vertices; i++) {
            for (int j = 0; j < vertices; j++) {
                if (i == j) {
                    dist[i][j] = 0;
                } else {
                    dist[i][j] = Integer.MAX_VALUE;
                }
            }
        }
    }
    
    public void addEdge(int src, int dest, int weight) {
        dist[src][dest] = weight;
    }
    
    public void floydWarshall() {
        for (int k = 0; k < vertices; k++) {
            for (int i = 0; i < vertices; i++) {
                for (int j = 0; j < vertices; j++) {
                    if (dist[i][k] != Integer.MAX_VALUE && 
                        dist[k][j] != Integer.MAX_VALUE &&
                        dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        
        System.out.println("All pairs shortest paths:");
        for (int i = 0; i < vertices; i++) {
            for (int j = 0; j < vertices; j++) {
                if (dist[i][j] == Integer.MAX_VALUE) {
                    System.out.print("INF ");
                } else {
                    System.out.print(dist[i][j] + " ");
                }
            }
            System.out.println();
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Floyd-Warshall Algorithm ===");
        FloydWarshallAlgorithm g = new FloydWarshallAlgorithm(4);
        
        g.addEdge(0, 1, 5);
        g.addEdge(0, 3, 10);
        g.addEdge(1, 2, 3);
        g.addEdge(2, 3, 1);
        
        g.floydWarshall();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff7ed, #fed7aa, #fb923c)',
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
        Floyd-Warshall Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'floyd_warshall.cpp' : 
                   selectedLanguage === 'c' ? 'floyd_warshall.c' :
                   selectedLanguage === 'python' ? 'floyd_warshall.py' : 'FloydWarshallAlgorithm.java'}
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

export default FloydWarshallAlgorithmCode;