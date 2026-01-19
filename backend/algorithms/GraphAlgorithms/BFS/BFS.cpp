#include <iostream>
#include <vector>
#include <queue>
#include <sstream>
#include <string>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cout << "{\"error\":\"Usage: ./BFS <vertices> <edges> <start>\"}" << endl;
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
    queue<int> q;
    vector<int> path;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        path.push_back(v);
        
        for (int u : adj[v]) {
            if (!visited[u]) {
                visited[u] = true;
                q.push(u);
            }
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"BFS\",\"start\":" << start << ",\"path\":[";
    for (size_t i = 0; i < path.size(); i++) {
        if (i > 0) cout << ",";
        cout << path[i];
    }
    cout << "]}" << endl;
    
    return 0;
}
