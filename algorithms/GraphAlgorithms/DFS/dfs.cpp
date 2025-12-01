#include <iostream>
#include <vector>
#include <fstream>
using namespace std;

void dfsUtil(vector<vector<int>>& adj, int v, vector<bool>& visited, ofstream& output) {
    visited[v] = true;
    output << v << " ";
    
    for (int u : adj[v]) {
        if (!visited[u]) {
            dfsUtil(adj, u, visited, output);
        }
    }
}

void dfs(vector<vector<int>>& adj, int start, ofstream& output) {
    vector<bool> visited(adj.size(), false);
    output << "DFS from vertex " << start << ": ";
    dfsUtil(adj, start, visited, output);
    output << "\n";
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int vertices, edges;
    input >> vertices >> edges;
    
    vector<vector<int>> adj(vertices);
    
    for (int i = 0; i < edges; i++) {
        int u, v;
        input >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    
    int start;
    input >> start;
    
    dfs(adj, start, output);
    
    return 0;
}