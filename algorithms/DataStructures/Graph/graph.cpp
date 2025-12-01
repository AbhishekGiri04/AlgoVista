#include <iostream>
#include <vector>
#include <fstream>
#include <string>
using namespace std;

class Graph {
private:
    int vertices;
    vector<vector<int>> adjList;
    
public:
    Graph(int v) : vertices(v), adjList(v) {}
    
    void addEdge(int u, int v) {
        adjList[u].push_back(v);
        adjList[v].push_back(u); // For undirected graph
    }
    
    void display(ofstream& output) {
        output << "Graph adjacency list:\n";
        for (int i = 0; i < vertices; i++) {
            output << i << ": ";
            for (int neighbor : adjList[i]) {
                output << neighbor << " ";
            }
            output << "\n";
        }
    }
    
    bool hasEdge(int u, int v) {
        for (int neighbor : adjList[u]) {
            if (neighbor == v) return true;
        }
        return false;
    }
};

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int vertices;
    input >> vertices;
    Graph graph(vertices);
    
    string operation;
    while (input >> operation) {
        if (operation == "addEdge") {
            int u, v;
            input >> u >> v;
            graph.addEdge(u, v);
            output << "Added edge: " << u << " - " << v << "\n";
        }
        else if (operation == "hasEdge") {
            int u, v;
            input >> u >> v;
            if (graph.hasEdge(u, v)) {
                output << "Edge exists: " << u << " - " << v << "\n";
            } else {
                output << "No edge: " << u << " - " << v << "\n";
            }
        }
        else if (operation == "display") {
            graph.display(output);
        }
    }
    
    return 0;
}