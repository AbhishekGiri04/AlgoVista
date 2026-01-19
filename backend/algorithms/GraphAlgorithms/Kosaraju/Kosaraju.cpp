#include <iostream>
#include <vector>
#include <stack>
#include <sstream>
using namespace std;

void dfs1(int u, vector<vector<int>>& adj, vector<bool>& visited, stack<int>& st) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs1(v, adj, visited, st);
        }
    }
    st.push(u);
}

void dfs2(int u, vector<vector<int>>& adj, vector<bool>& visited, vector<int>& component) {
    visited[u] = true;
    component.push_back(u);
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs2(v, adj, visited, component);
        }
    }
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./Kosaraju <vertices> <edges>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    
    vector<vector<int>> adj(vertices), radj(vertices);
    
    // Parse edges: "0,1;1,2;2,0;1,3;3,4"
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
        radj[v].push_back(u);
    }
    
    vector<bool> visited(vertices, false);
    stack<int> st;
    
    for (int i = 0; i < vertices; i++) {
        if (!visited[i]) {
            dfs1(i, adj, visited, st);
        }
    }
    
    fill(visited.begin(), visited.end(), false);
    int sccCount = 0;
    
    while (!st.empty()) {
        int u = st.top();
        st.pop();
        if (!visited[u]) {
            vector<int> component;
            dfs2(u, radj, visited, component);
            sccCount++;
        }
    }
    
    cout << "{\"algorithm\":\"Kosaraju\",\"sccCount\":" << sccCount << "}" << endl;
    
    return 0;
}
