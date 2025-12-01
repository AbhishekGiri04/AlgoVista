import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const KruskalsAlgorithmCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Kruskal's Algorithm - C++ Implementation
 * Minimum spanning tree using Union-Find
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Edge {
    int src, dest, weight;
    
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

class UnionFind {
private:
    vector<int> parent, rank;
    
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
        return true;
    }
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
    
    void kruskalMST() {
        sort(edges.begin(), edges.end());
        
        UnionFind uf(vertices);
        vector<Edge> mst;
        int totalWeight = 0;
        
        for (const Edge& edge : edges) {
            if (uf.unite(edge.src, edge.dest)) {
                mst.push_back(edge);
                totalWeight += edge.weight;
            }
        }
        
        cout << "Minimum Spanning Tree:" << endl;
        for (const Edge& edge : mst) {
            cout << edge.src << " - " << edge.dest << " : " << edge.weight << endl;
        }
        cout << "Total weight: " << totalWeight << endl;
    }
};

int main() {
    cout << "=== Kruskal's Algorithm ===" << endl;
    Graph g(4);
    
    g.addEdge(0, 1, 10);
    g.addEdge(0, 2, 6);
    g.addEdge(0, 3, 5);
    g.addEdge(1, 3, 15);
    g.addEdge(2, 3, 4);
    
    g.kruskalMST();
    
    return 0;
}`,
    c: `/**
 * Kruskal's Algorithm - C Implementation
 * Minimum spanning tree using Union-Find
 */

#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int src, dest, weight;
} Edge;

typedef struct {
    int parent, rank;
} Subset;

int find(Subset subsets[], int i) {
    if (subsets[i].parent != i) {
        subsets[i].parent = find(subsets, subsets[i].parent);
    }
    return subsets[i].parent;
}

void unionSets(Subset subsets[], int x, int y) {
    int xroot = find(subsets, x);
    int yroot = find(subsets, y);
    
    if (subsets[xroot].rank < subsets[yroot].rank) {
        subsets[xroot].parent = yroot;
    } else if (subsets[xroot].rank > subsets[yroot].rank) {
        subsets[yroot].parent = xroot;
    } else {
        subsets[yroot].parent = xroot;
        subsets[xroot].rank++;
    }
}

int compare(const void* a, const void* b) {
    Edge* edgeA = (Edge*)a;
    Edge* edgeB = (Edge*)b;
    return edgeA->weight - edgeB->weight;
}

void kruskalMST(Edge edges[], int V, int E) {
    qsort(edges, E, sizeof(Edge), compare);
    
    Subset* subsets = (Subset*)malloc(V * sizeof(Subset));
    for (int v = 0; v < V; v++) {
        subsets[v].parent = v;
        subsets[v].rank = 0;
    }
    
    Edge result[V - 1];
    int e = 0, i = 0;
    int totalWeight = 0;
    
    while (e < V - 1 && i < E) {
        Edge nextEdge = edges[i++];
        
        int x = find(subsets, nextEdge.src);
        int y = find(subsets, nextEdge.dest);
        
        if (x != y) {
            result[e++] = nextEdge;
            totalWeight += nextEdge.weight;
            unionSets(subsets, x, y);
        }
    }
    
    printf("Minimum Spanning Tree:\\n");
    for (i = 0; i < e; i++) {
        printf("%d - %d : %d\\n", result[i].src, result[i].dest, result[i].weight);
    }
    printf("Total weight: %d\\n", totalWeight);
    
    free(subsets);
}

int main() {
    printf("=== Kruskal's Algorithm ===\\n");
    Edge edges[] = {
        {0, 1, 10},
        {0, 2, 6},
        {0, 3, 5},
        {1, 3, 15},
        {2, 3, 4}
    };
    
    kruskalMST(edges, 4, 5);
    
    return 0;
}`,
    python: `"""
Kruskal's Algorithm - Python Implementation
Minimum spanning tree using Union-Find
"""

from typing import List, Tuple

class Edge:
    def __init__(self, src: int, dest: int, weight: int):
        self.src = src
        self.dest = dest
        self.weight = weight
    
    def __lt__(self, other):
        return self.weight < other.weight

class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        if self.rank[px] < self.rank[py]:
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.parent[py] = px
        else:
            self.parent[py] = px
            self.rank[px] += 1
        return True

class Graph:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.edges: List[Edge] = []
    
    def add_edge(self, src: int, dest: int, weight: int) -> None:
        self.edges.append(Edge(src, dest, weight))
    
    def kruskal_mst(self) -> None:
        self.edges.sort()
        
        uf = UnionFind(self.vertices)
        mst = []
        total_weight = 0
        
        for edge in self.edges:
            if uf.union(edge.src, edge.dest):
                mst.append(edge)
                total_weight += edge.weight
        
        print("Minimum Spanning Tree:")
        for edge in mst:
            print(f"{edge.src} - {edge.dest} : {edge.weight}")
        print(f"Total weight: {total_weight}")

def main() -> None:
    print("=== Kruskal's Algorithm ===")
    g = Graph(4)
    
    g.add_edge(0, 1, 10)
    g.add_edge(0, 2, 6)
    g.add_edge(0, 3, 5)
    g.add_edge(1, 3, 15)
    g.add_edge(2, 3, 4)
    
    g.kruskal_mst()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Kruskal's Algorithm - Java Implementation
 * Minimum spanning tree using Union-Find
 */

import java.util.*;

class Edge implements Comparable<Edge> {
    int src, dest, weight;
    
    Edge(int src, int dest, int weight) {
        this.src = src;
        this.dest = dest;
        this.weight = weight;
    }
    
    public int compareTo(Edge other) {
        return Integer.compare(this.weight, other.weight);
    }
}

class UnionFind {
    private int[] parent, rank;
    
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    public boolean union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
        return true;
    }
}

public class KruskalAlgorithm {
    private int vertices;
    private List<Edge> edges;
    
    public KruskalAlgorithm(int vertices) {
        this.vertices = vertices;
        this.edges = new ArrayList<>();
    }
    
    public void addEdge(int src, int dest, int weight) {
        edges.add(new Edge(src, dest, weight));
    }
    
    public void kruskalMST() {
        Collections.sort(edges);
        
        UnionFind uf = new UnionFind(vertices);
        List<Edge> mst = new ArrayList<>();
        int totalWeight = 0;
        
        for (Edge edge : edges) {
            if (uf.union(edge.src, edge.dest)) {
                mst.add(edge);
                totalWeight += edge.weight;
            }
        }
        
        System.out.println("Minimum Spanning Tree:");
        for (Edge edge : mst) {
            System.out.println(edge.src + " - " + edge.dest + " : " + edge.weight);
        }
        System.out.println("Total weight: " + totalWeight);
    }
    
    public static void main(String[] args) {
        System.out.println("=== Kruskal's Algorithm ===");
        KruskalAlgorithm g = new KruskalAlgorithm(4);
        
        g.addEdge(0, 1, 10);
        g.addEdge(0, 2, 6);
        g.addEdge(0, 3, 5);
        g.addEdge(1, 3, 15);
        g.addEdge(2, 3, 4);
        
        g.kruskalMST();
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
        Kruskal's Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'kruskal.cpp' : 
                   selectedLanguage === 'c' ? 'kruskal.c' :
                   selectedLanguage === 'python' ? 'kruskal.py' : 'KruskalAlgorithm.java'}
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

export default KruskalsAlgorithmCode;