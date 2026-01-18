#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
using namespace std;

struct Edge {
    int u, v, weight;
};

bool compare(Edge a, Edge b) {
    return a.weight < b.weight;
}

class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
};

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./Kruskal <vertices> <edges>\"}" << endl;
        return 1;
    }
    
    int vertices = stoi(argv[1]);
    string edgesStr = argv[2];
    
    vector<Edge> edges;
    
    // Parse edges: "0,1,4;0,2,1;1,2,2;1,3,5"
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
        
        edges.push_back({u, v, w});
    }
    
    sort(edges.begin(), edges.end(), compare);
    
    DSU dsu(vertices);
    int mstWeight = 0;
    int edgeCount = 0;
    
    for (auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            mstWeight += e.weight;
            edgeCount++;
        }
    }
    
    cout << "{\"algorithm\":\"Kruskal\",\"mstWeight\":" << mstWeight 
         << ",\"edgesInMST\":" << edgeCount << "}" << endl;
    
    return 0;
}
