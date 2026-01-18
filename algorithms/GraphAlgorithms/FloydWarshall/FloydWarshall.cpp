#include <iostream>
#include <vector>
#include <sstream>
#include <climits>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./FloydWarshall <vertices> <edges>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    
    vector<vector<int>> dist(vertices, vector<int>(vertices, INT_MAX));
    
    for (int i = 0; i < vertices; i++) {
        dist[i][i] = 0;
    }
    
    // Parse edges: "0,1,4;0,2,1;1,2,2"
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
        
        dist[u][v] = w;
    }
    
    for (int k = 0; k < vertices; k++) {
        for (int i = 0; i < vertices; i++) {
            for (int j = 0; j < vertices; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
    
    cout << "{\"algorithm\":\"Floyd-Warshall\",\"distances\":[";
    for (int i = 0; i < vertices; i++) {
        if (i > 0) cout << ",";
        cout << "[";
        for (int j = 0; j < vertices; j++) {
            if (j > 0) cout << ",";
            if (dist[i][j] == INT_MAX) cout << "null";
            else cout << dist[i][j];
        }
        cout << "]";
    }
    cout << "]}" << endl;
    
    return 0;
}
