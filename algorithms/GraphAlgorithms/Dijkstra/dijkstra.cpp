#include <iostream>
#include <vector>
#include <queue>
#include <fstream>
#include <climits>
using namespace std;

void dijkstra(vector<vector<pair<int, int>>>& graph, int src, ofstream& output) {
    int V = graph.size();
    vector<int> dist(V, INT_MAX);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        for (auto& edge : graph[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    
    output << "Shortest distances from vertex " << src << ":\n";
    for (int i = 0; i < V; i++) {
        output << "Vertex " << i << ": " << dist[i] << "\n";
    }
}

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
    
    int src;
    input >> src;
    
    dijkstra(graph, src, output);
    
    return 0;
}