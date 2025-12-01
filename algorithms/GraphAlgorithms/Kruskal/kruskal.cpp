#include <iostream>
#include <vector>
#include <algorithm>
#include <fstream>
using namespace std;

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
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

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int V, E;
    input >> V >> E;
    
    vector<Edge> edges(E);
    for (int i = 0; i < E; i++) {
        input >> edges[i].u >> edges[i].v >> edges[i].weight;
    }
    
    sort(edges.begin(), edges.end());
    
    UnionFind uf(V);
    vector<Edge> mst;
    int totalWeight = 0;
    
    for (const Edge& e : edges) {
        if (uf.unite(e.u, e.v)) {
            mst.push_back(e);
            totalWeight += e.weight;
        }
    }
    
    output << "Kruskal's MST:\n";
    for (const Edge& e : mst) {
        output << e.u << " - " << e.v << " : " << e.weight << "\n";
    }
    output << "Total weight: " << totalWeight << "\n";
    
    return 0;
}