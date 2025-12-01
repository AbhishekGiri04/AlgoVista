#include <iostream>
#include <vector>
#include <stack>
#include <fstream>
using namespace std;

void topologicalSortUtil(int v, vector<vector<int>>& adj, vector<bool>& visited, stack<int>& Stack) {
    visited[v] = true;
    
    for (int u : adj[v]) {
        if (!visited[u]) {
            topologicalSortUtil(u, adj, visited, Stack);
        }
    }
    
    Stack.push(v);
}

void topologicalSort(vector<vector<int>>& adj, int V, ofstream& output) {
    stack<int> Stack;
    vector<bool> visited(V, false);
    
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            topologicalSortUtil(i, adj, visited, Stack);
        }
    }
    
    output << "Topological Sort: ";
    while (!Stack.empty()) {
        output << Stack.top() << " ";
        Stack.pop();
    }
    output << "\n";
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
    
    topologicalSort(adj, V, output);
    
    return 0;
}