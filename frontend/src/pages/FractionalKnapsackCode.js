import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const FractionalKnapsackCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Fractional Knapsack - C++ Implementation
 * Maximize value with weight constraint using greedy approach
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Item {
    int value, weight;
    double ratio;
    
    Item(int v, int w) : value(v), weight(w) {
        ratio = (double)value / weight;
    }
};

class FractionalKnapsack {
private:
    vector<Item> items;
    
public:
    void addItem(int value, int weight) {
        items.push_back(Item(value, weight));
    }
    
    double solve(int capacity) {
        // Sort by value-to-weight ratio in descending order
        sort(items.begin(), items.end(), 
             [](const Item& a, const Item& b) {
                 return a.ratio > b.ratio;
             });
        
        double totalValue = 0.0;
        int currentWeight = 0;
        
        cout << "Items sorted by value/weight ratio:" << endl;
        for (int i = 0; i < items.size(); i++) {
            cout << "Item " << i+1 << ": Value=" << items[i].value 
                 << ", Weight=" << items[i].weight 
                 << ", Ratio=" << items[i].ratio << endl;
        }
        cout << endl;
        
        cout << "Selection process:" << endl;
        for (int i = 0; i < items.size() && currentWeight < capacity; i++) {
            if (currentWeight + items[i].weight <= capacity) {
                // Take the whole item
                currentWeight += items[i].weight;
                totalValue += items[i].value;
                cout << "Take full Item " << i+1 << " (+" << items[i].value << ")" << endl;
            } else {
                // Take fraction of the item
                int remainingCapacity = capacity - currentWeight;
                double fraction = (double)remainingCapacity / items[i].weight;
                totalValue += items[i].value * fraction;
                currentWeight = capacity;
                cout << "Take " << fraction << " of Item " << i+1 
                     << " (+" << items[i].value * fraction << ")" << endl;
            }
        }
        
        return totalValue;
    }
    
    void printItems() {
        cout << "Items (Value, Weight):" << endl;
        for (int i = 0; i < items.size(); i++) {
            cout << "Item " << i+1 << ": (" << items[i].value 
                 << ", " << items[i].weight << ")" << endl;
        }
        cout << endl;
    }
};

int main() {
    cout << "=== Fractional Knapsack Problem ===" << endl;
    
    FractionalKnapsack fk;
    fk.addItem(60, 10);
    fk.addItem(100, 20);
    fk.addItem(120, 30);
    
    int capacity = 50;
    
    fk.printItems();
    cout << "Knapsack capacity: " << capacity << endl << endl;
    
    double maxValue = fk.solve(capacity);
    cout << "\\nMaximum value: " << maxValue << endl;
    
    return 0;
}`,
    c: `/**
 * Fractional Knapsack - C Implementation
 * Maximize value with weight constraint using greedy approach
 */

#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int value, weight;
    double ratio;
} Item;

int compare(const void* a, const void* b) {
    Item* itemA = (Item*)a;
    Item* itemB = (Item*)b;
    if (itemA->ratio < itemB->ratio) return 1;
    if (itemA->ratio > itemB->ratio) return -1;
    return 0;
}

double fractionalKnapsack(Item items[], int n, int capacity) {
    // Calculate ratios
    for (int i = 0; i < n; i++) {
        items[i].ratio = (double)items[i].value / items[i].weight;
    }
    
    // Sort by ratio in descending order
    qsort(items, n, sizeof(Item), compare);
    
    printf("Items sorted by value/weight ratio:\\n");
    for (int i = 0; i < n; i++) {
        printf("Item %d: Value=%d, Weight=%d, Ratio=%.2f\\n", 
               i+1, items[i].value, items[i].weight, items[i].ratio);
    }
    printf("\\n");
    
    double totalValue = 0.0;
    int currentWeight = 0;
    
    printf("Selection process:\\n");
    for (int i = 0; i < n && currentWeight < capacity; i++) {
        if (currentWeight + items[i].weight <= capacity) {
            // Take the whole item
            currentWeight += items[i].weight;
            totalValue += items[i].value;
            printf("Take full Item %d (+%d)\\n", i+1, items[i].value);
        } else {
            // Take fraction of the item
            int remainingCapacity = capacity - currentWeight;
            double fraction = (double)remainingCapacity / items[i].weight;
            totalValue += items[i].value * fraction;
            currentWeight = capacity;
            printf("Take %.2f of Item %d (+%.2f)\\n", 
                   fraction, i+1, items[i].value * fraction);
        }
    }
    
    return totalValue;
}

int main() {
    printf("=== Fractional Knapsack Problem ===\\n");
    
    Item items[] = {
        {60, 10, 0},
        {100, 20, 0},
        {120, 30, 0}
    };
    
    int n = sizeof(items) / sizeof(items[0]);
    int capacity = 50;
    
    printf("Items (Value, Weight):\\n");
    for (int i = 0; i < n; i++) {
        printf("Item %d: (%d, %d)\\n", i+1, items[i].value, items[i].weight);
    }
    printf("\\nKnapsack capacity: %d\\n\\n", capacity);
    
    double maxValue = fractionalKnapsack(items, n, capacity);
    printf("\\nMaximum value: %.2f\\n", maxValue);
    
    return 0;
}`,
    python: `"""
Fractional Knapsack - Python Implementation
Maximize value with weight constraint using greedy approach
"""

from typing import List, Tuple

class Item:
    def __init__(self, value: int, weight: int):
        self.value = value
        self.weight = weight
        self.ratio = value / weight
    
    def __repr__(self):
        return f"Item(value={self.value}, weight={self.weight}, ratio={self.ratio:.2f})"

class FractionalKnapsack:
    def __init__(self):
        self.items: List[Item] = []
    
    def add_item(self, value: int, weight: int) -> None:
        self.items.append(Item(value, weight))
    
    def solve(self, capacity: int) -> float:
        # Sort by value-to-weight ratio in descending order
        self.items.sort(key=lambda x: x.ratio, reverse=True)
        
        total_value = 0.0
        current_weight = 0
        
        print("Items sorted by value/weight ratio:")
        for i, item in enumerate(self.items, 1):
            print(f"Item {i}: Value={item.value}, Weight={item.weight}, Ratio={item.ratio:.2f}")
        print()
        
        print("Selection process:")
        for i, item in enumerate(self.items):
            if current_weight >= capacity:
                break
            
            if current_weight + item.weight <= capacity:
                # Take the whole item
                current_weight += item.weight
                total_value += item.value
                print(f"Take full Item {i+1} (+{item.value})")
            else:
                # Take fraction of the item
                remaining_capacity = capacity - current_weight
                fraction = remaining_capacity / item.weight
                total_value += item.value * fraction
                current_weight = capacity
                print(f"Take {fraction:.2f} of Item {i+1} (+{item.value * fraction:.2f})")
        
        return total_value
    
    def print_items(self) -> None:
        print("Items (Value, Weight):")
        for i, item in enumerate(self.items, 1):
            print(f"Item {i}: ({item.value}, {item.weight})")
        print()

def main() -> None:
    print("=== Fractional Knapsack Problem ===")
    
    fk = FractionalKnapsack()
    fk.add_item(60, 10)
    fk.add_item(100, 20)
    fk.add_item(120, 30)
    
    capacity = 50
    
    fk.print_items()
    print(f"Knapsack capacity: {capacity}\\n")
    
    max_value = fk.solve(capacity)
    print(f"\\nMaximum value: {max_value:.2f}")

if __name__ == "__main__":
    main()`,
    java: `/**
 * Fractional Knapsack - Java Implementation
 * Maximize value with weight constraint using greedy approach
 */

import java.util.*;

class Item {
    int value, weight;
    double ratio;
    
    Item(int value, int weight) {
        this.value = value;
        this.weight = weight;
        this.ratio = (double) value / weight;
    }
    
    @Override
    public String toString() {
        return String.format("Item(value=%d, weight=%d, ratio=%.2f)", 
                           value, weight, ratio);
    }
}

public class FractionalKnapsack {
    private List<Item> items;
    
    public FractionalKnapsack() {
        this.items = new ArrayList<>();
    }
    
    public void addItem(int value, int weight) {
        items.add(new Item(value, weight));
    }
    
    public double solve(int capacity) {
        // Sort by value-to-weight ratio in descending order
        items.sort((a, b) -> Double.compare(b.ratio, a.ratio));
        
        double totalValue = 0.0;
        int currentWeight = 0;
        
        System.out.println("Items sorted by value/weight ratio:");
        for (int i = 0; i < items.size(); i++) {
            Item item = items.get(i);
            System.out.printf("Item %d: Value=%d, Weight=%d, Ratio=%.2f%n", 
                            i+1, item.value, item.weight, item.ratio);
        }
        System.out.println();
        
        System.out.println("Selection process:");
        for (int i = 0; i < items.size() && currentWeight < capacity; i++) {
            Item item = items.get(i);
            
            if (currentWeight + item.weight <= capacity) {
                // Take the whole item
                currentWeight += item.weight;
                totalValue += item.value;
                System.out.printf("Take full Item %d (+%d)%n", i+1, item.value);
            } else {
                // Take fraction of the item
                int remainingCapacity = capacity - currentWeight;
                double fraction = (double) remainingCapacity / item.weight;
                totalValue += item.value * fraction;
                currentWeight = capacity;
                System.out.printf("Take %.2f of Item %d (+%.2f)%n", 
                                fraction, i+1, item.value * fraction);
            }
        }
        
        return totalValue;
    }
    
    public void printItems() {
        System.out.println("Items (Value, Weight):");
        for (int i = 0; i < items.size(); i++) {
            Item item = items.get(i);
            System.out.printf("Item %d: (%d, %d)%n", i+1, item.value, item.weight);
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        System.out.println("=== Fractional Knapsack Problem ===");
        
        FractionalKnapsack fk = new FractionalKnapsack();
        fk.addItem(60, 10);
        fk.addItem(100, 20);
        fk.addItem(120, 30);
        
        int capacity = 50;
        
        fk.printItems();
        System.out.println("Knapsack capacity: " + capacity + "\\n");
        
        double maxValue = fk.solve(capacity);
        System.out.printf("\\nMaximum value: %.2f%n", maxValue);
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff, #c084fc)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/greedyalgorithms" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '14px 24px',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
        display: 'inline-block',
        marginBottom: '40px'
      }}>
        ← Back to Greedy Algorithms
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Fractional Knapsack Code
      </h1>
      
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
          borderRadius: '16px',
          padding: '6px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          {[
            { key: 'cpp', label: 'C++', color: '#0ea5e9' },
            { key: 'c', label: 'C', color: '#8b5cf6' },
            { key: 'python', label: 'Python', color: '#10b981' },
            { key: 'java', label: 'Java', color: '#f59e0b' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setSelectedLanguage(key)}
              style={{
                background: selectedLanguage === key 
                  ? `linear-gradient(135deg, ${color}20, ${color}10)` 
                  : 'rgba(255, 255, 255, 0.03)',
                color: selectedLanguage === key ? '#ffffff' : '#1a202c',
                border: selectedLanguage === key 
                  ? `1px solid ${color}60` 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: selectedLanguage === key ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                margin: '0 2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textShadow: selectedLanguage === key 
                  ? `0 0 20px ${color}, 0 0 40px ${color}80, 0 0 60px ${color}60` 
                  : 'none',
                boxShadow: selectedLanguage === key 
                  ? `0 4px 20px ${color}30, inset 0 1px 0 rgba(255,255,255,0.1)` 
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
                transform: selectedLanguage === key 
                  ? 'translateY(-1px)' 
                  : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (selectedLanguage !== key) {
                  e.target.style.color = color;
                  e.target.style.background = `${color}10`;
                  e.target.style.borderColor = `${color}40`;
                  e.target.style.textShadow = `0 0 10px ${color}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLanguage !== key) {
                  e.target.style.color = '#1a202c';
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.textShadow = 'none';
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '30px'
        }}>
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            borderRadius: '16px',
            border: '1px solid #334155',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #374151, #4b5563)',
              padding: '12px 20px',
              borderBottom: '1px solid #374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '6px'
                }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <span style={{
                  color: '#d1d5db',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {selectedLanguage === 'cpp' ? 'fractional_knapsack.cpp' : 
                   selectedLanguage === 'c' ? 'fractional_knapsack.c' :
                   selectedLanguage === 'python' ? 'fractional_knapsack.py' : 'FractionalKnapsack.java'}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(codeExamples[selectedLanguage]);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  background: copied 
                    ? 'linear-gradient(135deg, #10b981, #059669)' 
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: copied 
                    ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                    : '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                  }
                }}
              >
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <div style={{ padding: '0', margin: '0' }}>
              <CodeBlock 
                language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'c' ? 'c' : selectedLanguage === 'python' ? 'python' : 'java'}
                code={codeExamples[selectedLanguage]}
                showContainer={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionalKnapsackCode;