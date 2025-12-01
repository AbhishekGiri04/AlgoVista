import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const PrimsAlgorithmCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Prim's Algorithm - C++ Implementation
 * Greedy MST construction using priority queue
 */

#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

class Graph {
private:
    int vertices;
    vector<vector<pair<int, int>>> adjList;
    
public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int src, int dest, int weight) {
        adjList[src].push_back({dest, weight});
        adjList[dest].push_back({src, weight});
    }
    
    void primMST() {
        vector<int> key(vertices, INT_MAX);
        vector<int> parent(vertices, -1);
        vector<bool> inMST(vertices, false);
        
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        
        key[0] = 0;
        pq.push({0, 0});
        
        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();
            
            if (inMST[u]) continue;
            inMST[u] = true;
            
            for (auto& edge : adjList[u]) {
                int v = edge.first;
                int weight = edge.second;
                
                if (!inMST[v] && weight < key[v]) {
                    key[v] = weight;
                    parent[v] = u;
                    pq.push({key[v], v});
                }
            }
        }
        
        cout << "Minimum Spanning Tree:" << endl;
        int totalWeight = 0;
        for (int i = 1; i < vertices; i++) {
            cout << parent[i] << " - " << i << " : " << key[i] << endl;
            totalWeight += key[i];
        }
        cout << "Total weight: " << totalWeight << endl;
    }
};

int main() {
    cout << "=== Prim's Algorithm ===" << endl;
    Graph g(5);
    
    g.addEdge(0, 1, 2);
    g.addEdge(0, 3, 6);
    g.addEdge(1, 2, 3);
    g.addEdge(1, 3, 8);
    g.addEdge(1, 4, 5);
    g.addEdge(2, 4, 7);
    g.addEdge(3, 4, 9);
    
    g.primMST();
    
    return 0;
}`,
    c: `/**
 * Prim's Algorithm - C Implementation
 * Greedy MST construction
 */

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>

#define MAX_VERTICES 100

int minKey(int key[], bool mstSet[], int V) {
    int min = INT_MAX, min_index;
    
    for (int v = 0; v < V; v++) {
        if (mstSet[v] == false && key[v] < min) {
            min = key[v];
            min_index = v;
        }
    }
    return min_index;
}

void primMST(int graph[MAX_VERTICES][MAX_VERTICES], int V) {
    int parent[MAX_VERTICES];
    int key[MAX_VERTICES];
    bool mstSet[MAX_VERTICES];
    
    for (int i = 0; i < V; i++) {
        key[i] = INT_MAX;
        mstSet[i] = false;
    }
    
    key[0] = 0;
    parent[0] = -1;
    
    for (int count = 0; count < V - 1; count++) {
        int u = minKey(key, mstSet, V);
        mstSet[u] = true;
        
        for (int v = 0; v < V; v++) {
            if (graph[u][v] && mstSet[v] == false && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }
    
    printf("Minimum Spanning Tree:\\n");
    int totalWeight = 0;
    for (int i = 1; i < V; i++) {
        printf("%d - %d : %d\\n", parent[i], i, key[i]);
        totalWeight += key[i];
    }
    printf("Total weight: %d\\n", totalWeight);
}

int main() {
    printf("=== Prim's Algorithm ===\\n");
    int graph[MAX_VERTICES][MAX_VERTICES] = {
        {0, 2, 0, 6, 0},
        {2, 0, 3, 8, 5},
        {0, 3, 0, 0, 7},
        {6, 8, 0, 0, 9},
        {0, 5, 7, 9, 0}
    };
    
    primMST(graph, 5);
    
    return 0;
}`,
    python: `"""
Prim's Algorithm - Python Implementation
Greedy MST construction using heapq
"""

import heapq
from collections import defaultdict
from typing import List, Tuple

class Graph:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.graph = defaultdict(list)
    
    def add_edge(self, src: int, dest: int, weight: int) -> None:
        self.graph[src].append((dest, weight))
        self.graph[dest].append((src, weight))
    
    def prim_mst(self) -> None:
        visited = set()
        min_heap = [(0, 0, -1)]  # (weight, vertex, parent)
        mst_edges = []
        total_weight = 0
        
        while min_heap and len(visited) < self.vertices:
            weight, u, parent = heapq.heappop(min_heap)
            
            if u in visited:
                continue
            
            visited.add(u)
            if parent != -1:
                mst_edges.append((parent, u, weight))
                total_weight += weight
            
            for neighbor, edge_weight in self.graph[u]:
                if neighbor not in visited:
                    heapq.heappush(min_heap, (edge_weight, neighbor, u))
        
        print("Minimum Spanning Tree:")
        for parent, vertex, weight in mst_edges:
            print(f"{parent} - {vertex} : {weight}")
        print(f"Total weight: {total_weight}")

def main() -> None:
    print("=== Prim's Algorithm ===")
    g = Graph(5)
    
    g.add_edge(0, 1, 2)
    g.add_edge(0, 3, 6)
    g.add_edge(1, 2, 3)
    g.add_edge(1, 3, 8)
    g.add_edge(1, 4, 5)
    g.add_edge(2, 4, 7)
    g.add_edge(3, 4, 9)
    
    g.prim_mst()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Prim's Algorithm - Java Implementation
 * Greedy MST construction using PriorityQueue
 */

import java.util.*;

class Edge implements Comparable<Edge> {
    int vertex, weight, parent;
    
    Edge(int vertex, int weight, int parent) {
        this.vertex = vertex;
        this.weight = weight;
        this.parent = parent;
    }
    
    public int compareTo(Edge other) {
        return Integer.compare(this.weight, other.weight);
    }
}

public class PrimAlgorithm {
    private int vertices;
    private Map<Integer, List<Edge>> adjList;
    
    public PrimAlgorithm(int vertices) {
        this.vertices = vertices;
        this.adjList = new HashMap<>();
        for (int i = 0; i < vertices; i++) {
            adjList.put(i, new ArrayList<>());
        }
    }
    
    public void addEdge(int src, int dest, int weight) {
        adjList.get(src).add(new Edge(dest, weight, -1));
        adjList.get(dest).add(new Edge(src, weight, -1));
    }
    
    public void primMST() {
        boolean[] visited = new boolean[vertices];
        PriorityQueue<Edge> pq = new PriorityQueue<>();
        List<Edge> mstEdges = new ArrayList<>();
        
        pq.offer(new Edge(0, 0, -1));
        int totalWeight = 0;
        
        while (!pq.isEmpty() && mstEdges.size() < vertices - 1) {
            Edge current = pq.poll();
            
            if (visited[current.vertex]) continue;
            
            visited[current.vertex] = true;
            if (current.parent != -1) {
                mstEdges.add(new Edge(current.vertex, current.weight, current.parent));
                totalWeight += current.weight;
            }
            
            for (Edge neighbor : adjList.get(current.vertex)) {
                if (!visited[neighbor.vertex]) {
                    pq.offer(new Edge(neighbor.vertex, neighbor.weight, current.vertex));
                }
            }
        }
        
        System.out.println("Minimum Spanning Tree:");
        for (Edge edge : mstEdges) {
            System.out.println(edge.parent + " - " + edge.vertex + " : " + edge.weight);
        }
        System.out.println("Total weight: " + totalWeight);
    }
    
    public static void main(String[] args) {
        System.out.println("=== Prim's Algorithm ===");
        PrimAlgorithm g = new PrimAlgorithm(5);
        
        g.addEdge(0, 1, 2);
        g.addEdge(0, 3, 6);
        g.addEdge(1, 2, 3);
        g.addEdge(1, 3, 8);
        g.addEdge(1, 4, 5);
        g.addEdge(2, 4, 7);
        g.addEdge(3, 4, 9);
        
        g.primMST();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff, #c084fc)',
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
                  {selectedLanguage === 'cpp' ? 'prims.cpp' : 
                   selectedLanguage === 'c' ? 'prims.c' :
                   selectedLanguage === 'python' ? 'prims.py' : 'PrimAlgorithm.java'}
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

export default PrimsAlgorithmCode;