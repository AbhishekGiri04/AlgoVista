#include <iostream>
#include <vector>
#include <queue>
#include <fstream>
using namespace std;

void bfs(vector<vector<int>>& adj, int start, ofstream& output) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    output << "BFS from vertex " << start << ": ";
    
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        output << v << " ";
        
        for (int u : adj[v]) {
            if (!visited[u]) {
                visited[u] = true;
                q.push(u);
            }
        }
    }
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
    
    bfs(adj, start, output);
    
    return 0;
}