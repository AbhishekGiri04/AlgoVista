#include <iostream>
#include <vector>
#include <sstream>
#include <climits>
using namespace std;

struct Edge {
    int u, v, weight;
};

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cout << "{\"error\":\"Usage: ./BellmanFord <vertices> <edges> <source>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    int source = stoi(argv[3]);
    
    vector<Edge> edges;
    
    // Parse edges: "0,1,4;0,2,1;1,2,2;1,3,5"
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
        
        edges.push_back({u, v, w});
    }
    
    vector<int> dist(vertices, INT_MAX);
    dist[source] = 0;
    
    for (int i = 0; i < vertices - 1; i++) {
        for (auto& e : edges) {
            if (dist[e.u] != INT_MAX && dist[e.u] + e.weight < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.weight;
            }
        }
    }
    
    bool hasNegativeCycle = false;
    for (auto& e : edges) {
        if (dist[e.u] != INT_MAX && dist[e.u] + e.weight < dist[e.v]) {
            hasNegativeCycle = true;
            break;
        }
    }
    
    cout << "{\"algorithm\":\"Bellman-Ford\",\"source\":" << source 
         << ",\"hasNegativeCycle\":" << (hasNegativeCycle ? "true" : "false")
         << ",\"distances\":[";
    for (int i = 0; i < vertices; i++) {
        if (i > 0) cout << ",";
        if (dist[i] == INT_MAX) cout << "null";
        else cout << dist[i];
    }
    cout << "]}" << endl;
    
    return 0;
}
