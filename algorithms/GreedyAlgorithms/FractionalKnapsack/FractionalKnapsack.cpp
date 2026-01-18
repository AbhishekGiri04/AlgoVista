#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
using namespace std;

struct Item {
    int value, weight;
    double ratio;
    int index;
};

bool compare(Item a, Item b) {
    return a.ratio > b.ratio;
}

int main(int argc, char* argv[]) {
    if (argc < 3) {
        cout << "{\"error\":\"Usage: ./FractionalKnapsack <capacity> <items>\"}" << endl;
        return 1;
    }
    
    int capacity = stoi(argv[1]);
    string itemsStr = argv[2];
    
    // Parse: "3;60,10;100,20;120,30"
    stringstream ss(itemsStr);
    string token;
    getline(ss, token, ';');
    int n = stoi(token);
    
    vector<Item> items(n);
    for (int i = 0; i < n; i++) {
        getline(ss, token, ';');
        stringstream itemSS(token);
        string val;
        
        getline(itemSS, val, ',');
        items[i].value = stoi(val);
        
        getline(itemSS, val, ',');
        items[i].weight = stoi(val);
        
        items[i].ratio = (double)items[i].value / items[i].weight;
        items[i].index = i;
    }
    
    sort(items.begin(), items.end(), compare);
    
    double totalValue = 0.0;
    int remainingCapacity = capacity;
    
    for (int i = 0; i < n; i++) {
        if (remainingCapacity >= items[i].weight) {
            totalValue += items[i].value;
            remainingCapacity -= items[i].weight;
        } else {
            totalValue += items[i].value * ((double)remainingCapacity / items[i].weight);
            break;
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"Fractional Knapsack\",\"capacity\":" << capacity 
         << ",\"items\":" << n << ",\"maxValue\":" << totalValue << "}" << endl;
    
    return 0;
}
