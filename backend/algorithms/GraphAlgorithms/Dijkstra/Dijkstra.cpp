#include <iostream>
#include <vector>
#include <queue>
#include <sstream>
#include <climits>
using namespace std;

typedef pair<int, int> pii;

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cout << "{\"error\":\"Usage: ./Dijkstra <vertices> <edges> <source>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    int source = stoi(argv[3]);
    
    vector<vector<pii>> adj(vertices);
    
    // Parse edges: "0,1,4;0,2,1;1,2,2;1,3,5;2,3,8"
    stringstream ss(edgesStr);
    string edge;
    while (getline(ss, edge, ';')) {
        stringstream edgeSS(edge);
        string val;
        
        getline(edgeSS, val, ',');
        int u = stoi(val);
        
        getline(edgeSS, val, ',');
        int v = stoi(val);
        
        getline(edgeSS, val, ',');
        int w = stoi(val);
        
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    
    vector<int> dist(vertices, INT_MAX);
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    
    dist[source] = 0;
    pq.push({0, source});
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"Dijkstra\",\"source\":" << source << ",\"distances\":[";
    for (int i = 0; i < vertices; i++) {
        if (i > 0) cout << ",";
        if (dist[i] == INT_MAX) cout << "null";
        else cout << dist[i];
    }
    cout << "]}" << endl;
    
    return 0;
}
