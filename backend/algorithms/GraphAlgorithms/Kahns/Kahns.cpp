#include <iostream>
#include <vector>
#include <queue>
#include <sstream>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./Kahns <vertices> <edges>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    
    vector<vector<int>> adj(vertices);
    vector<int> indegree(vertices, 0);
    
    // Parse edges: "0,1;0,2;1,3;2,3"
    stringstream ss(edgesStr);
    string edge;
    while (getline(ss, edge, ';')) {
        stringstream edgeSS(edge);
        string val;
        
        getline(edgeSS, val, ',');
        int u = stoi(val);
        
        getline(edgeSS, val, ',');
        int v = stoi(val);
        
        adj[u].push_back(v);
        indegree[v]++;
    }
    
    queue<int> q;
    for (int i = 0; i < vertices; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    
    vector<int> order;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        
        for (int v : adj[u]) {
            indegree[v]--;
            if (indegree[v] == 0) {
                q.push(v);
            }
        }
    }
    
    cout << "{\"algorithm\":\"Kahns\",\"order\":[";
    for (size_t i = 0; i < order.size(); i++) {
        if (i > 0) cout << ",";
        cout << order[i];
    }
    cout << "]}" << endl;
    
    return 0;
}
