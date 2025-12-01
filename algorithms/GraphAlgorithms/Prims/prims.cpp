#include <iostream>
#include <vector>
#include <queue>
#include <fstream>
#include <climits>
using namespace std;

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int V, E;
    input >> V >> E;
    
    vector<vector<pair<int, int>>> graph(V);
    
    for (int i = 0; i < E; i++) {
        int u, v, w;
        input >> u >> v >> w;
        graph[u].push_back({v, w});
        graph[v].push_back({u, w});
    }
    
    vector<bool> inMST(V, false);
    vector<int> key(V, INT_MAX);
    vector<int> parent(V, -1);
    
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    key[0] = 0;
    pq.push({0, 0});
    
    int totalWeight = 0;
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        if (inMST[u]) continue;
        inMST[u] = true;
        totalWeight += key[u];
        
        for (auto& edge : graph[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            if (!inMST[v] && weight < key[v]) {
                key[v] = weight;
                parent[v] = u;
                pq.push({key[v], v});
            }
        }
    }
    
    output << "Prim's MST:\n";
    for (int i = 1; i < V; i++) {
        output << parent[i] << " - " << i << " : " << key[i] << "\n";
    }
    output << "Total weight: " << totalWeight << "\n";
    
    return 0;
}