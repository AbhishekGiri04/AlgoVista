#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;

void dfsUtil(vector<vector<int>>& adj, int v, vector<bool>& visited, vector<int>& path) {
    visited[v] = true;
    path.push_back(v);
    
    for (int u : adj[v]) {
        if (!visited[u]) {
            dfsUtil(adj, u, visited, path);
        }
    }
}

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cout << "{\"error\":\"Usage: ./DFS <vertices> <edges> <start>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    int start = stoi(argv[3]);
    
    vector<vector<int>> adj(vertices);
    
    // Parse edges: "0,1;0,2;1,3"
    stringstream ss(edgesStr);
    string edge;
    while (getline(ss, edge, ';')) {
        size_t pos = edge.find(',');
        if (pos != string::npos) {
            int u = stoi(edge.substr(0, pos));
            int v = stoi(edge.substr(pos + 1));
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
    }
    
    vector<bool> visited(vertices, false);
    vector<int> path;
    dfsUtil(adj, start, visited, path);
    
    // Output JSON
    cout << "{\"algorithm\":\"DFS\",\"start\":" << start << ",\"path\":[";
    for (size_t i = 0; i < path.size(); i++) {
        if (i > 0) cout << ",";
        cout << path[i];
    }
    cout << "]}" << endl;
    
    return 0;
}
