#include <iostream>
#include <vector>
#include <algorithm>
#include <fstream>
using namespace std;

struct Item {
    int value, weight;
    double ratio;
    int id;
    
    Item(int v, int w, int i) : value(v), weight(w), id(i) {
        ratio = (double)value / weight;
    }
    
    bool operator<(const Item& other) const {
        return ratio > other.ratio;
    }
};

double fractionalKnapsack(vector<Item>& items, int capacity, ofstream& output) {
    sort(items.begin(), items.end());
    
    double totalValue = 0.0;
    int currentWeight = 0;
    
    output << "Items sorted by value/weight ratio:\n";
    for (const Item& item : items) {
        output << "Item " << item.id << ": value=" << item.value 
               << ", weight=" << item.weight << ", ratio=" << item.ratio << "\n";
    }
    output << "\n";
    
    output << "Knapsack filling process:\n";
    
    for (const Item& item : items) {
        if (currentWeight + item.weight <= capacity) {
            currentWeight += item.weight;
            totalValue += item.value;
            output << "Take full Item " << item.id << " (value: " << item.value << ")\n";
        } else {
            int remainingCapacity = capacity - currentWeight;
            if (remainingCapacity > 0) {
                double fraction = (double)remainingCapacity / item.weight;
                totalValue += item.value * fraction;
                output << "Take " << fraction << " of Item " << item.id 
                       << " (value: " << item.value * fraction << ")\n";
            }
            break;
        }
    }
    
    return totalValue;
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int n, capacity;
    input >> n >> capacity;
    
    vector<Item> items;
    
    for (int i = 0; i < n; i++) {
        int value, weight;
        input >> value >> weight;
        items.push_back(Item(value, weight, i + 1));
    }
    
    output << "Knapsack capacity: " << capacity << "\n\n";
    
    double maxValue = fractionalKnapsack(items, capacity, output);
    
    output << "\nMaximum value: " << maxValue << "\n";
    
    return 0;
}