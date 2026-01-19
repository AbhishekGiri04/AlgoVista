#include <iostream>
#include <vector>
#include <stack>
#include <sstream>
using namespace std;

void dfs(int u, vector<vector<int>>& adj, vector<bool>& visited, stack<int>& st) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited, st);
        }
    }
    st.push(u);
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./TopologicalSort <vertices> <edges>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    
    vector<vector<int>> adj(vertices);
    
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
    }
    
    vector<bool> visited(vertices, false);
    stack<int> st;
    
    for (int i = 0; i < vertices; i++) {
        if (!visited[i]) {
            dfs(i, adj, visited, st);
        }
    }
    
    cout << "{\"algorithm\":\"Topological Sort\",\"order\":[";
    bool first = true;
    while (!st.empty()) {
        if (!first) cout << ",";
        cout << st.top();
        st.pop();
        first = false;
    }
    cout << "]}" << endl;
    
    return 0;
}
