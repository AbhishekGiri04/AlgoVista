#include <iostream>
#include <vector>
#include <queue>
#include <fstream>
using namespace std;

void kahnsAlgorithm(vector<vector<int>>& adj, int V, ofstream& output) {
    vector<int> indegree(V, 0);
    
    for (int u = 0; u < V; u++) {
        for (int v : adj[u]) {
            indegree[v]++;
        }
    }
    
    queue<int> q;
    for (int i = 0; i < V; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    
    vector<int> result;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);
        
        for (int v : adj[u]) {
            indegree[v]--;
            if (indegree[v] == 0) {
                q.push(v);
            }
        }
    }
    
    if (result.size() != V) {
        output << "Graph has a cycle\n";
    } else {
        output << "Kahn's Topological Sort: ";
        for (int vertex : result) {
            output << vertex << " ";
        }
        output << "\n";
    }
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int V, E;
    input >> V >> E;
    
    vector<vector<int>> adj(V);
    
    for (int i = 0; i < E; i++) {
        int u, v;
        input >> u >> v;
        adj[u].push_back(v);
    }
    
    kahnsAlgorithm(adj, V, output);
    
    return 0;
}