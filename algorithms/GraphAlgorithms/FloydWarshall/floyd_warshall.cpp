#include <iostream>
#include <vector>
#include <fstream>
#include <climits>
using namespace std;

void floydWarshall(vector<vector<int>>& graph, int V, ofstream& output) {
    vector<vector<int>> dist = graph;
    
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX && 
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    
    output << "All-pairs shortest paths:\n";
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (dist[i][j] == INT_MAX) output << "INF ";
            else output << dist[i][j] << " ";
        }
        output << "\n";
    }
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int V;
    input >> V;
    
    vector<vector<int>> graph(V, vector<int>(V, INT_MAX));
    
    for (int i = 0; i < V; i++) {
        graph[i][i] = 0;
    }
    
    int E;
    input >> E;
    for (int i = 0; i < E; i++) {
        int u, v, w;
        input >> u >> v >> w;
        graph[u][v] = w;
    }
    
    floydWarshall(graph, V, output);
    
    return 0;
}