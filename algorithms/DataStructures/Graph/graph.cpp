#include <iostream>
#include <vector>
#include <list>
#include <queue>
#include <sstream>
#include <string>
using namespace std;

class Graph {
private:
    int vertices;
    vector<list<int>> adjList;
    
    void DFS(int start, vector<bool>& visited, vector<int>& result) {
        visited[start] = true;
        result.push_back(start);
        
        for (int neighbor : adjList[start]) {
            if (!visited[neighbor]) {
                DFS(neighbor, visited, result);
            }
        }
    }
    
public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int src, int dest) {
        adjList[src].push_back(dest);
        adjList[dest].push_back(src);
    }
    
    string display() {
        stringstream ss;
        ss << "{\"adjacencyList\":[";
        for (int i = 0; i < vertices; i++) {
            if (i > 0) ss << ",";
            ss << "{\"vertex\":" << i << ",\"neighbors\":[";
            bool first = true;
            for (int neighbor : adjList[i]) {
                if (!first) ss << ",";
                ss << neighbor;
                first = false;
            }
            ss << "]}";
        }
        ss << "]}";
        return ss.str();
    }
    
    string DFSTraversal(int start) {
        vector<bool> visited(vertices, false);
        vector<int> result;
        DFS(start, visited, result);
        
        stringstream ss;
        ss << "{\"traversal\":\"DFS\",\"start\":" << start << ",\"path\":[";
        for (size_t i = 0; i < result.size(); i++) {
            if (i > 0) ss << ",";
            ss << result[i];
        }
        ss << "]}";
        return ss.str();
    }
    
    string BFSTraversal(int start) {
        vector<bool> visited(vertices, false);
        queue<int> q;
        vector<int> result;
        
        visited[start] = true;
        q.push(start);
        
        while (!q.empty()) {
            int current = q.front();
            q.pop();
            result.push_back(current);
            
            for (int neighbor : adjList[current]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        
        stringstream ss;
        ss << "{\"traversal\":\"BFS\",\"start\":" << start << ",\"path\":[";
        for (size_t i = 0; i < result.size(); i++) {
            if (i > 0) ss << ",";
            ss << result[i];
        }
        ss << "]}";
        return ss.str();
    }
};

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./Graph <vertices> <operation> [args]\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string operation = argv[2];
    Graph graph(vertices);
    
    if (argc > 3) {
        string edges = argv[3];
        stringstream ss(edges);
        string edge;
        while (getline(ss, edge, ';')) {
            size_t pos = edge.find(',');
            if (pos != string::npos) {
                int u = stoi(edge.substr(0, pos));
                int v = stoi(edge.substr(pos + 1));
                graph.addEdge(u, v);
            }
        }
    }
    
    if (operation == "display") {
        cout << graph.display() << endl;
    }
    else if (operation == "DFS" && argc > 4) {
        int start = stoi(argv[4]);
        cout << graph.DFSTraversal(start) << endl;
    }
    else if (operation == "BFS" && argc > 4) {
        int start = stoi(argv[4]);
        cout << graph.BFSTraversal(start) << endl;
    }
    else {
        cout << "{\"error\":\"Invalid operation\"}" << endl;
    }
    
    return 0;
}