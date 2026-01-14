#include <iostream>
#include <vector>
#include <list>
#include <queue>
#include <fstream>
#include <string>
using namespace std;

class Graph {
private:
    int vertices;
    vector<list<int>> adjList;
    
    void DFS(int start, vector<bool>& visited, ofstream& output) {
        visited[start] = true;
        output << start << " ";
        
        for (int neighbor : adjList[start]) {
            if (!visited[neighbor]) {
                DFS(neighbor, visited, output);
            }
        }
    }
    
public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int src, int dest) {
        adjList[src].push_back(dest);
        adjList[dest].push_back(src); // Undirected graph
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
    
    void DFSTraversal(int start, ofstream& output) {
        vector<bool> visited(vertices, false);
        output << "DFS from " << start << ": ";
        DFS(start, visited, output);
        output << "\n";
    }
    
    void BFSTraversal(int start, ofstream& output) {
        vector<bool> visited(vertices, false);
        queue<int> q;
        
        visited[start] = true;
        q.push(start);
        
        output << "BFS from " << start << ": ";
        
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            output << current << " ";
            
            for (int neighbor : adjList[current]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        output << "\n";
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
        else if (operation == "display") {
            graph.display(output);
        }
        else if (operation == "DFS") {
            int start;
            input >> start;
            graph.DFSTraversal(start, output);
        }
        else if (operation == "BFS") {
            int start;
            input >> start;
            graph.BFSTraversal(start, output);
        }
    }
    
    return 0;
}