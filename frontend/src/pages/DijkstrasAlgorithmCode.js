import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const DijkstrasAlgorithmCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Dijkstra's Algorithm - C++ Implementation
 * Find shortest paths from source vertex
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
        adjList[dest].push_back({src, weight}); // Undirected graph
    }
    
    void dijkstra(int src) {
        vector<int> dist(vertices, INT_MAX);
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        
        dist[src] = 0;
        pq.push({0, src});
        
        while (!pq.empty()) {
            int u = pq.top().second;
            pq.pop();
            
            for (auto& edge : adjList[u]) {
                int v = edge.first;
                int weight = edge.second;
                
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.push({dist[v], v});
                }
            }
        }
        
        cout << "Shortest distances from vertex " << src << ":" << endl;
        for (int i = 0; i < vertices; i++) {
            cout << "Vertex " << i << ": " << dist[i] << endl;
        }
    }
};

int main() {
    cout << "=== Dijkstra's Algorithm ===" << endl;
    Graph g(6);
    
    g.addEdge(0, 1, 4);
    g.addEdge(0, 2, 2);
    g.addEdge(1, 2, 1);
    g.addEdge(1, 3, 5);
    g.addEdge(2, 3, 8);
    g.addEdge(2, 4, 10);
    g.addEdge(3, 4, 2);
    
    g.dijkstra(0);
    
    return 0;
}`,
    c: `/**
 * Dijkstra's Algorithm - C Implementation
 * Find shortest paths from source vertex
 */

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>

#define MAX_VERTICES 100

int minDistance(int dist[], bool sptSet[], int V) {
    int min = INT_MAX, min_index;
    
    for (int v = 0; v < V; v++) {
        if (sptSet[v] == false && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void dijkstra(int graph[MAX_VERTICES][MAX_VERTICES], int src, int V) {
    int dist[MAX_VERTICES];
    bool sptSet[MAX_VERTICES];
    
    for (int i = 0; i < V; i++) {
        dist[i] = INT_MAX;
        sptSet[i] = false;
    }
    
    dist[src] = 0;
    
    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, sptSet, V);
        sptSet[u] = true;
        
        for (int v = 0; v < V; v++) {
            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX && 
                dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
    
    printf("Shortest distances from vertex %d:\n", src);
    for (int i = 0; i < V; i++) {
        printf("Vertex %d: %d\n", i, dist[i]);
    }
}

int main() {
    printf("=== Dijkstra's Algorithm ===\n");
    int graph[MAX_VERTICES][MAX_VERTICES] = {
        {0, 4, 2, 0, 0, 0},
        {4, 0, 1, 5, 0, 0},
        {2, 1, 0, 8, 10, 0},
        {0, 5, 8, 0, 2, 0},
        {0, 0, 10, 2, 0, 0},
        {0, 0, 0, 0, 0, 0}
    };
    
    dijkstra(graph, 0, 6);
    
    return 0;
}`,
    python: `"""
Dijkstra's Algorithm - Python Implementation
Find shortest paths from source vertex
"""

import heapq
from collections import defaultdict
from typing import Dict, List, Tuple

class Graph:
    def __init__(self):
        self.graph = defaultdict(list)
    
    def add_edge(self, src: int, dest: int, weight: int) -> None:
        self.graph[src].append((dest, weight))
        self.graph[dest].append((src, weight))  # Undirected graph
    
    def dijkstra(self, src: int) -> Dict[int, int]:
        distances = defaultdict(lambda: float('inf'))
        distances[src] = 0
        pq = [(0, src)]
        
        while pq:
            current_dist, u = heapq.heappop(pq)
            
            if current_dist > distances[u]:
                continue
            
            for neighbor, weight in self.graph[u]:
                distance = current_dist + weight
                
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    heapq.heappush(pq, (distance, neighbor))
        
        return distances
    
    def print_distances(self, distances: Dict[int, int], src: int) -> None:
        print(f"Shortest distances from vertex {src}:")
        for vertex in sorted(distances.keys()):
            print(f"Vertex {vertex}: {distances[vertex]}")

def main() -> None:
    print("=== Dijkstra's Algorithm ===")
    g = Graph()
    
    g.add_edge(0, 1, 4)
    g.add_edge(0, 2, 2)
    g.add_edge(1, 2, 1)
    g.add_edge(1, 3, 5)
    g.add_edge(2, 3, 8)
    g.add_edge(2, 4, 10)
    g.add_edge(3, 4, 2)
    
    distances = g.dijkstra(0)
    g.print_distances(distances, 0)

if __name__ == "__main__":
    main()`,
    java: `/**
 * Dijkstra's Algorithm - Java Implementation
 * Find shortest paths from source vertex
 */

import java.util.*;

public class DijkstraAlgorithm {
    private Map<Integer, List<Edge>> adjList;
    
    static class Edge {
        int dest, weight;
        
        Edge(int dest, int weight) {
            this.dest = dest;
            this.weight = weight;
        }
    }
    
    static class Node implements Comparable<Node> {
        int vertex, distance;
        
        Node(int vertex, int distance) {
            this.vertex = vertex;
            this.distance = distance;
        }
        
        public int compareTo(Node other) {
            return Integer.compare(this.distance, other.distance);
        }
    }
    
    public DijkstraAlgorithm() {
        this.adjList = new HashMap<>();
    }
    
    public void addEdge(int src, int dest, int weight) {
        adjList.computeIfAbsent(src, k -> new ArrayList<>()).add(new Edge(dest, weight));
        adjList.computeIfAbsent(dest, k -> new ArrayList<>()).add(new Edge(src, weight));
    }
    
    public Map<Integer, Integer> dijkstra(int src) {
        Map<Integer, Integer> distances = new HashMap<>();
        PriorityQueue<Node> pq = new PriorityQueue<>();
        
        distances.put(src, 0);
        pq.offer(new Node(src, 0));
        
        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.vertex;
            
            if (current.distance > distances.getOrDefault(u, Integer.MAX_VALUE)) {
                continue;
            }
            
            List<Edge> neighbors = adjList.getOrDefault(u, new ArrayList<>());
            for (Edge edge : neighbors) {
                int v = edge.dest;
                int weight = edge.weight;
                int distance = distances.get(u) + weight;
                
                if (distance < distances.getOrDefault(v, Integer.MAX_VALUE)) {
                    distances.put(v, distance);
                    pq.offer(new Node(v, distance));
                }
            }
        }
        
        return distances;
    }
    
    public void printDistances(Map<Integer, Integer> distances, int src) {
        System.out.println("Shortest distances from vertex " + src + ":");
        distances.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(entry -> System.out.println("Vertex " + entry.getKey() + ": " + entry.getValue()));
    }
    
    public static void main(String[] args) {
        System.out.println("=== Dijkstra's Algorithm ===");
        DijkstraAlgorithm g = new DijkstraAlgorithm();
        
        g.addEdge(0, 1, 4);
        g.addEdge(0, 2, 2);
        g.addEdge(1, 2, 1);
        g.addEdge(1, 3, 5);
        g.addEdge(2, 3, 8);
        g.addEdge(2, 4, 10);
        g.addEdge(3, 4, 2);
        
        Map<Integer, Integer> distances = g.dijkstra(0);
        g.printDistances(distances, 0);
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef7cd, #fde68a, #f59e0b)',
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
        Dijkstra's Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'dijkstra.cpp' : 
                   selectedLanguage === 'c' ? 'dijkstra.c' :
                   selectedLanguage === 'python' ? 'dijkstra.py' : 'DijkstraAlgorithm.java'}
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

export default DijkstrasAlgorithmCode;