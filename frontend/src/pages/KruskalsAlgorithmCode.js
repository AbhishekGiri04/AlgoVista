import React from 'react';
import { motion } from 'framer-motion';

const KruskalsAlgorithmCode = () => {
  const cppCode = `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
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
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
};

vector<Edge> kruskalMST(int V, vector<Edge>& edges) {
    // Sort edges by weight
    sort(edges.begin(), edges.end());
    
    UnionFind uf(V);
    vector<Edge> mst;
    
    for (const Edge& edge : edges) {
        if (uf.unite(edge.u, edge.v)) {
            mst.push_back(edge);
            if (mst.size() == V - 1) break;
        }
    }
    
    return mst;
}

int main() {
    int V = 5;
    vector<Edge> edges = {
        {0, 1, 4}, {0, 2, 2}, {1, 2, 1},
        {1, 4, 5}, {2, 3, 3}, {2, 4, 6}, {3, 4, 2}
    };
    
    vector<Edge> mst = kruskalMST(V, edges);
    
    cout << "Minimum Spanning Tree edges:\\n";
    int totalWeight = 0;
    for (const Edge& edge : mst) {
        cout << edge.u << " - " << edge.v << " : " << edge.weight << endl;
        totalWeight += edge.weight;
    }
    cout << "Total weight: " << totalWeight << endl;
    
    return 0;
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-orange-800 mb-2">
            Kruskal's Algorithm - Code Implementation
          </h1>
          <p className="text-orange-600">C++ implementation with Union-Find data structure</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-orange-600 text-white p-4">
              <h2 className="text-xl font-semibold">C++ Implementation</h2>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{cppCode}</code>
              </pre>
            </div>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Algorithm Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-orange-600">Time Complexity:</span>
                  <p className="text-gray-600">O(E log E) for sorting edges</p>
                </div>
                <div>
                  <span className="font-medium text-orange-600">Space Complexity:</span>
                  <p className="text-gray-600">O(V) for Union-Find structure</p>
                </div>
                <div>
                  <span className="font-medium text-orange-600">Approach:</span>
                  <p className="text-gray-600">Greedy algorithm with Union-Find</p>
                </div>
              </div>
            </div>

            {/* Key Concepts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Concepts</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="border-l-4 border-orange-500 pl-3">
                  <strong>Union-Find:</strong> Efficiently tracks connected components
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <strong>Path Compression:</strong> Optimizes find operations
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <strong>Union by Rank:</strong> Keeps trees balanced
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <strong>Greedy Choice:</strong> Always pick minimum weight edge
                </div>
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Applications</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Network design and optimization
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Circuit design
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Clustering algorithms
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Transportation networks
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3>
              <div className="space-y-2">
                <a
                  href="/kruskalsalgorithmvisualize"
                  className="block w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center"
                >
                  View Visualization
                </a>
                <a
                  href="/graphalgorithms"
                  className="block w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
                >
                  Back to Graph Algorithms
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KruskalsAlgorithmCode;