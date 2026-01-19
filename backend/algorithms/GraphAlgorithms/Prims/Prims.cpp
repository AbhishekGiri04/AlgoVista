#include <iostream>
#include <vector>
#include <queue>
#include <sstream>
#include <climits>
using namespace std;

struct Edge {
    int to, weight;
};

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./Prims <vertices> <edges>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    
    vector<vector<Edge>> adj(vertices);
    
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
        
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    
    // Prim's algorithm
    vector<bool> inMST(vertices, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    int mstWeight = 0;
    int edgeCount = 0;
    
    pq.push({0, 0}); // {weight, vertex}
    
    while (!pq.empty() && edgeCount < vertices) {
        auto [weight, u] = pq.top();
        pq.pop();
        
        if (inMST[u]) continue;
        
        inMST[u] = true;
        mstWeight += weight;
        edgeCount++;
        
        for (auto& [v, w] : adj[u]) {
            if (!inMST[v]) {
                pq.push({w, v});
            }
        }
    }
    
    cout << "{\"algorithm\":\"Prims\",\"mstWeight\":" << mstWeight 
         << ",\"edgesInMST\":" << (edgeCount - 1) << "}" << endl;
    
    return 0;
}
