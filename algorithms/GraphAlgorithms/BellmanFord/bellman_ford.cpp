#include <iostream>
#include <vector>
#include <fstream>
#include <climits>
using namespace std;

struct Edge {
    int u, v, weight;
};

bool bellmanFord(vector<Edge>& edges, int V, int src, ofstream& output) {
    vector<int> dist(V, INT_MAX);
    dist[src] = 0;
    
    for (int i = 0; i < V - 1; i++) {
        for (const Edge& e : edges) {
            if (dist[e.u] != INT_MAX && dist[e.u] + e.weight < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.weight;
            }
        }
    }
    
    for (const Edge& e : edges) {
        if (dist[e.u] != INT_MAX && dist[e.u] + e.weight < dist[e.v]) {
            output << "Graph contains negative weight cycle\n";
            return false;
        }
    }
    
    output << "Shortest distances from vertex " << src << ":\n";
    for (int i = 0; i < V; i++) {
        output << "Vertex " << i << ": ";
        if (dist[i] == INT_MAX) output << "INF";
        else output << dist[i];
        output << "\n";
    }
    
    return true;
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int V, E;
    input >> V >> E;
    
    vector<Edge> edges(E);
    for (int i = 0; i < E; i++) {
        input >> edges[i].u >> edges[i].v >> edges[i].weight;
    }
    
    int src;
    input >> src;
    
    bellmanFord(edges, V, src, output);
    
    return 0;
}