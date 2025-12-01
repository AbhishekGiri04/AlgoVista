import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const TravellingSalesmanProblemCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Travelling Salesman Problem (TSP) - C++ Implementation
 * Shortest route visiting all cities using Branch and Bound
 */

#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

class TSP {
private:
    int n;
    vector<vector<int>> graph;
    vector<int> bestPath;
    int minCost;
    
    int calculateBound(vector<int>& path, int level) {
        int bound = 0;
        
        // Add cost of path so far
        for (int i = 0; i < level; i++) {
            if (i == level - 1) {
                bound += graph[path[i]][path[0]]; // Return to start
            } else {
                bound += graph[path[i]][path[i + 1]];
            }
        }
        
        // Add minimum outgoing edge for remaining vertices
        vector<bool> visited(n, false);
        for (int i = 0; i < level; i++) {
            visited[path[i]] = true;
        }
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                int minEdge = INT_MAX;
                for (int j = 0; j < n; j++) {
                    if (i != j && graph[i][j] < minEdge) {
                        minEdge = graph[i][j];
                    }
                }
                if (minEdge != INT_MAX) {
                    bound += minEdge;
                }
            }
        }
        
        return bound;
    }
    
    void branchAndBound(vector<int>& path, int level, int currentCost) {
        if (level == n) {
            int totalCost = currentCost + graph[path[n-1]][path[0]];
            if (totalCost < minCost) {
                minCost = totalCost;
                bestPath = path;
            }
            return;
        }
        
        for (int i = level; i < n; i++) {
            swap(path[level], path[i]);
            
            int newCost = currentCost;
            if (level > 0) {
                newCost += graph[path[level-1]][path[level]];
            }
            
            int bound = calculateBound(path, level + 1);
            
            if (bound < minCost) {
                branchAndBound(path, level + 1, newCost);
            }
            
            swap(path[level], path[i]); // backtrack
        }
    }
    
public:
    TSP(vector<vector<int>>& adjMatrix) {
        graph = adjMatrix;
        n = graph.size();
        minCost = INT_MAX;
    }
    
    int solve() {
        vector<int> path(n);
        for (int i = 0; i < n; i++) {
            path[i] = i;
        }
        
        branchAndBound(path, 1, 0); // Start from city 0
        return minCost;
    }
    
    void printSolution() {
        cout << "Minimum cost: " << minCost << endl;
        cout << "Best path: ";
        for (int city : bestPath) {
            cout << city << " -> ";
        }
        cout << bestPath[0] << endl;
    }
};

int main() {
    cout << "=== Travelling Salesman Problem ===" << endl;
    
    vector<vector<int>> graph = {
        {0, 10, 15, 20},
        {10, 0, 35, 25},
        {15, 35, 0, 30},
        {20, 25, 30, 0}
    };
    
    TSP tsp(graph);
    int minCost = tsp.solve();
    tsp.printSolution();
    
    return 0;
}`,
    c: `/**
 * Travelling Salesman Problem (TSP) - C Implementation
 * Shortest route visiting all cities using Branch and Bound
 */

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>

#define MAX_CITIES 10

int n;
int graph[MAX_CITIES][MAX_CITIES];
int bestPath[MAX_CITIES];
int minCost = INT_MAX;

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int calculateBound(int path[], int level) {
    int bound = 0;
    
    // Add cost of path so far
    for (int i = 0; i < level - 1; i++) {
        bound += graph[path[i]][path[i + 1]];
    }
    if (level > 1) {
        bound += graph[path[level - 1]][path[0]]; // Return to start
    }
    
    // Add minimum outgoing edge for remaining vertices
    bool visited[MAX_CITIES] = {false};
    for (int i = 0; i < level; i++) {
        visited[path[i]] = true;
    }
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            int minEdge = INT_MAX;
            for (int j = 0; j < n; j++) {
                if (i != j && graph[i][j] < minEdge) {
                    minEdge = graph[i][j];
                }
            }
            if (minEdge != INT_MAX) {
                bound += minEdge;
            }
        }
    }
    
    return bound;
}

void branchAndBound(int path[], int level, int currentCost) {
    if (level == n) {
        int totalCost = currentCost + graph[path[n-1]][path[0]];
        if (totalCost < minCost) {
            minCost = totalCost;
            for (int i = 0; i < n; i++) {
                bestPath[i] = path[i];
            }
        }
        return;
    }
    
    for (int i = level; i < n; i++) {
        swap(&path[level], &path[i]);
        
        int newCost = currentCost;
        if (level > 0) {
            newCost += graph[path[level-1]][path[level]];
        }
        
        int bound = calculateBound(path, level + 1);
        
        if (bound < minCost) {
            branchAndBound(path, level + 1, newCost);
        }
        
        swap(&path[level], &path[i]); // backtrack
    }
}

int solveTSP() {
    int path[MAX_CITIES];
    for (int i = 0; i < n; i++) {
        path[i] = i;
    }
    
    branchAndBound(path, 1, 0);
    return minCost;
}

void printSolution() {
    printf("Minimum cost: %d\\n", minCost);
    printf("Best path: ");
    for (int i = 0; i < n; i++) {
        printf("%d -> ", bestPath[i]);
    }
    printf("%d\\n", bestPath[0]);
}

int main() {
    printf("=== Travelling Salesman Problem ===\\n");
    
    n = 4;
    int adjMatrix[4][4] = {
        {0, 10, 15, 20},
        {10, 0, 35, 25},
        {15, 35, 0, 30},
        {20, 25, 30, 0}
    };
    
    // Copy to global graph
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            graph[i][j] = adjMatrix[i][j];
        }
    }
    
    solveTSP();
    printSolution();
    
    return 0;
}`,
    python: `"""
Travelling Salesman Problem (TSP) - Python Implementation
Shortest route visiting all cities using Branch and Bound
"""

from typing import List
import sys

class TSP:
    def __init__(self, graph: List[List[int]]):
        self.graph = graph
        self.n = len(graph)
        self.min_cost = sys.maxsize
        self.best_path = []
    
    def calculate_bound(self, path: List[int], level: int) -> int:
        bound = 0
        
        # Add cost of path so far
        for i in range(level - 1):
            bound += self.graph[path[i]][path[i + 1]]
        if level > 1:
            bound += self.graph[path[level - 1]][path[0]]  # Return to start
        
        # Add minimum outgoing edge for remaining vertices
        visited = set(path[:level])
        
        for i in range(self.n):
            if i not in visited:
                min_edge = min(self.graph[i][j] for j in range(self.n) if i != j)
                bound += min_edge
        
        return bound
    
    def branch_and_bound(self, path: List[int], level: int, current_cost: int) -> None:
        if level == self.n:
            total_cost = current_cost + self.graph[path[self.n - 1]][path[0]]
            if total_cost < self.min_cost:
                self.min_cost = total_cost
                self.best_path = path.copy()
            return
        
        for i in range(level, self.n):
            # Swap
            path[level], path[i] = path[i], path[level]
            
            new_cost = current_cost
            if level > 0:
                new_cost += self.graph[path[level - 1]][path[level]]
            
            bound = self.calculate_bound(path, level + 1)
            
            if bound < self.min_cost:
                self.branch_and_bound(path, level + 1, new_cost)
            
            # Backtrack
            path[level], path[i] = path[i], path[level]
    
    def solve(self) -> int:
        path = list(range(self.n))
        self.branch_and_bound(path, 1, 0)  # Start from city 0
        return self.min_cost
    
    def print_solution(self) -> None:
        print(f"Minimum cost: {self.min_cost}")
        print("Best path:", " -> ".join(map(str, self.best_path + [self.best_path[0]])))

def main() -> None:
    print("=== Travelling Salesman Problem ===")
    
    graph = [
        [0, 10, 15, 20],
        [10, 0, 35, 25],
        [15, 35, 0, 30],
        [20, 25, 30, 0]
    ]
    
    tsp = TSP(graph)
    min_cost = tsp.solve()
    tsp.print_solution()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Travelling Salesman Problem (TSP) - Java Implementation
 * Shortest route visiting all cities using Branch and Bound
 */

import java.util.*;

public class TravellingSalesmanProblem {
    private int[][] graph;
    private int n;
    private int[] bestPath;
    private int minCost;
    
    public TravellingSalesmanProblem(int[][] adjMatrix) {
        this.graph = adjMatrix;
        this.n = graph.length;
        this.minCost = Integer.MAX_VALUE;
        this.bestPath = new int[n];
    }
    
    private int calculateBound(int[] path, int level) {
        int bound = 0;
        
        // Add cost of path so far
        for (int i = 0; i < level - 1; i++) {
            bound += graph[path[i]][path[i + 1]];
        }
        if (level > 1) {
            bound += graph[path[level - 1]][path[0]]; // Return to start
        }
        
        // Add minimum outgoing edge for remaining vertices
        boolean[] visited = new boolean[n];
        for (int i = 0; i < level; i++) {
            visited[path[i]] = true;
        }
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                int minEdge = Integer.MAX_VALUE;
                for (int j = 0; j < n; j++) {
                    if (i != j && graph[i][j] < minEdge) {
                        minEdge = graph[i][j];
                    }
                }
                if (minEdge != Integer.MAX_VALUE) {
                    bound += minEdge;
                }
            }
        }
        
        return bound;
    }
    
    private void branchAndBound(int[] path, int level, int currentCost) {
        if (level == n) {
            int totalCost = currentCost + graph[path[n - 1]][path[0]];
            if (totalCost < minCost) {
                minCost = totalCost;
                System.arraycopy(path, 0, bestPath, 0, n);
            }
            return;
        }
        
        for (int i = level; i < n; i++) {
            // Swap
            int temp = path[level];
            path[level] = path[i];
            path[i] = temp;
            
            int newCost = currentCost;
            if (level > 0) {
                newCost += graph[path[level - 1]][path[level]];
            }
            
            int bound = calculateBound(path, level + 1);
            
            if (bound < minCost) {
                branchAndBound(path, level + 1, newCost);
            }
            
            // Backtrack
            temp = path[level];
            path[level] = path[i];
            path[i] = temp;
        }
    }
    
    public int solve() {
        int[] path = new int[n];
        for (int i = 0; i < n; i++) {
            path[i] = i;
        }
        
        branchAndBound(path, 1, 0); // Start from city 0
        return minCost;
    }
    
    public void printSolution() {
        System.out.println("Minimum cost: " + minCost);
        System.out.print("Best path: ");
        for (int city : bestPath) {
            System.out.print(city + " -> ");
        }
        System.out.println(bestPath[0]);
    }
    
    public static void main(String[] args) {
        System.out.println("=== Travelling Salesman Problem ===");
        
        int[][] graph = {
            {0, 10, 15, 20},
            {10, 0, 35, 25},
            {15, 35, 0, 30},
            {20, 25, 30, 0}
        };
        
        TravellingSalesmanProblem tsp = new TravellingSalesmanProblem(graph);
        int minCost = tsp.solve();
        tsp.printSolution();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0fdf4, #bbf7d0, #86efac)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/branchandbound" style={{
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
        ← Back to Branch and Bound
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Travelling Salesman Problem Code
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
              onMouseEnter={(e) => {
                if (selectedLanguage !== key) {
                  e.target.style.color = color;
                  e.target.style.background = `${color}10`;
                  e.target.style.borderColor = `${color}40`;
                  e.target.style.textShadow = `0 0 10px ${color}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLanguage !== key) {
                  e.target.style.color = '#1a202c';
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.textShadow = 'none';
                }
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
                  {selectedLanguage === 'cpp' ? 'tsp.cpp' : 
                   selectedLanguage === 'c' ? 'tsp.c' :
                   selectedLanguage === 'python' ? 'tsp.py' : 'TravellingSalesmanProblem.java'}
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
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                  }
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

export default TravellingSalesmanProblemCode;