#include <iostream>
#include <vector>
#include <stack>
#include <fstream>
using namespace std;

void fillOrder(int v, vector<vector<int>>& adj, vector<bool>& visited, stack<int>& Stack) {
    visited[v] = true;
    
    for (int u : adj[v]) {
        if (!visited[u]) {
            fillOrder(u, adj, visited, Stack);
        }
    }
    
    Stack.push(v);
}

void DFSUtil(int v, vector<vector<int>>& adj, vector<bool>& visited, ofstream& output) {
    visited[v] = true;
    output << v << " ";
    
    for (int u : adj[v]) {
        if (!visited[u]) {
            DFSUtil(u, adj, visited, output);
        }
    }
}

vector<vector<int>> getTranspose(vector<vector<int>>& adj, int V) {
    vector<vector<int>> transpose(V);
    for (int v = 0; v < V; v++) {
        for (int u : adj[v]) {
            transpose[u].push_back(v);
        }
    }
    return transpose;
}

void kosaraju(vector<vector<int>>& adj, int V, ofstream& output) {
    stack<int> Stack;
    vector<bool> visited(V, false);
    
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            fillOrder(i, adj, visited, Stack);
        }
    }
    
    vector<vector<int>> transpose = getTranspose(adj, V);
    
    fill(visited.begin(), visited.end(), false);
    
    output << "Strongly Connected Components:\n";
    int componentCount = 0;
    
    while (!Stack.empty()) {
        int v = Stack.top();
        Stack.pop();
        
        if (!visited[v]) {
            output << "Component " << ++componentCount << ": ";
            DFSUtil(v, transpose, visited, output);
            output << "\n";
        }
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
    
    kosaraju(adj, V, output);
    
    return 0;
}