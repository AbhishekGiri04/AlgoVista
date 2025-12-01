import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const ZeroOneKnapsackCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * 0/1 Knapsack - C++ Implementation
 * Maximum value without weight exceed using dynamic programming
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Item {
    int value, weight;
    
    Item(int v, int w) : value(v), weight(w) {}
};

class ZeroOneKnapsack {
private:
    vector<Item> items;
    vector<vector<int>> dp;
    
public:
    void addItem(int value, int weight) {
        items.push_back(Item(value, weight));
    }
    
    int solve(int capacity) {
        int n = items.size();
        dp.assign(n + 1, vector<int>(capacity + 1, 0));
        
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                // Don't take current item
                dp[i][w] = dp[i-1][w];
                
                // Take current item if possible
                if (items[i-1].weight <= w) {
                    dp[i][w] = max(dp[i][w], 
                                  dp[i-1][w - items[i-1].weight] + items[i-1].value);
                }
            }
        }
        
        return dp[n][capacity];
    }
    
    vector<int> getSelectedItems(int capacity) {
        vector<int> selected;
        int n = items.size();
        int w = capacity;
        
        for (int i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] != dp[i-1][w]) {
                selected.push_back(i-1);
                w -= items[i-1].weight;
            }
        }
        
        reverse(selected.begin(), selected.end());
        return selected;
    }
    
    void printDP(int capacity) {
        cout << "\\nDP Table:" << endl;
        cout << "Item\\\\Weight\\t";
        for (int w = 0; w <= capacity; w++) {
            cout << w << "\\t";
        }
        cout << endl;
        
        for (int i = 0; i <= items.size(); i++) {
            cout << i << "\\t\\t";
            for (int w = 0; w <= capacity; w++) {
                cout << dp[i][w] << "\\t";
            }
            cout << endl;
        }
    }
    
    void printItems() {
        cout << "Items (Value, Weight):" << endl;
        for (int i = 0; i < items.size(); i++) {
            cout << "Item " << i << ": (" << items[i].value 
                 << ", " << items[i].weight << ")" << endl;
        }
    }
};

int main() {
    cout << "=== 0/1 Knapsack Problem ===" << endl;
    
    ZeroOneKnapsack knapsack;
    knapsack.addItem(60, 10);
    knapsack.addItem(100, 20);
    knapsack.addItem(120, 30);
    
    int capacity = 50;
    
    knapsack.printItems();
    cout << "\\nKnapsack capacity: " << capacity << endl;
    
    int maxValue = knapsack.solve(capacity);
    cout << "Maximum value: " << maxValue << endl;
    
    vector<int> selected = knapsack.getSelectedItems(capacity);
    cout << "Selected items: ";
    for (int idx : selected) {
        cout << idx << " ";
    }
    cout << endl;
    
    knapsack.printDP(capacity);
    
    return 0;
}`,
    c: `/**
 * 0/1 Knapsack - C Implementation
 * Maximum value without weight exceed using dynamic programming
 */

#include <stdio.h>
#include <stdlib.h>

#define MAX_ITEMS 100
#define MAX_CAPACITY 1000

typedef struct {
    int value, weight;
} Item;

int max(int a, int b) {
    return (a > b) ? a : b;
}

int knapsack01(Item items[], int n, int capacity, int dp[][MAX_CAPACITY + 1]) {
    // Initialize DP table
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = 0;
        }
    }
    
    // Fill DP table
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            // Don't take current item
            dp[i][w] = dp[i-1][w];
            
            // Take current item if possible
            if (items[i-1].weight <= w) {
                dp[i][w] = max(dp[i][w], 
                              dp[i-1][w - items[i-1].weight] + items[i-1].value);
            }
        }
    }
    
    return dp[n][capacity];
}

void printSelectedItems(Item items[], int n, int capacity, int dp[][MAX_CAPACITY + 1]) {
    printf("Selected items: ");
    int w = capacity;
    
    for (int i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] != dp[i-1][w]) {
            printf("%d ", i-1);
            w -= items[i-1].weight;
        }
    }
    printf("\\n");
}

void printDP(int dp[][MAX_CAPACITY + 1], int n, int capacity) {
    printf("\\nDP Table:\\n");
    printf("Item\\\\Weight\\t");
    for (int w = 0; w <= capacity; w++) {
        printf("%d\\t", w);
    }
    printf("\\n");
    
    for (int i = 0; i <= n; i++) {
        printf("%d\\t\\t", i);
        for (int w = 0; w <= capacity; w++) {
            printf("%d\\t", dp[i][w]);
        }
        printf("\\n");
    }
}

void printItems(Item items[], int n) {
    printf("Items (Value, Weight):\\n");
    for (int i = 0; i < n; i++) {
        printf("Item %d: (%d, %d)\\n", i, items[i].value, items[i].weight);
    }
}

int main() {
    printf("=== 0/1 Knapsack Problem ===\\n");
    
    Item items[] = {
        {60, 10},
        {100, 20},
        {120, 30}
    };
    
    int n = sizeof(items) / sizeof(items[0]);
    int capacity = 50;
    int dp[MAX_ITEMS + 1][MAX_CAPACITY + 1];
    
    printItems(items, n);
    printf("\\nKnapsack capacity: %d\\n", capacity);
    
    int maxValue = knapsack01(items, n, capacity, dp);
    printf("Maximum value: %d\\n", maxValue);
    
    printSelectedItems(items, n, capacity, dp);
    printDP(dp, n, capacity);
    
    return 0;
}`,
    python: `"""
0/1 Knapsack - Python Implementation
Maximum value without weight exceed using dynamic programming
"""

from typing import List, Tuple

class Item:
    def __init__(self, value: int, weight: int):
        self.value = value
        self.weight = weight
    
    def __repr__(self):
        return f"Item(value={self.value}, weight={self.weight})"

class ZeroOneKnapsack:
    def __init__(self):
        self.items: List[Item] = []
        self.dp: List[List[int]] = []
    
    def add_item(self, value: int, weight: int) -> None:
        self.items.append(Item(value, weight))
    
    def solve(self, capacity: int) -> int:
        n = len(self.items)
        self.dp = [[0] * (capacity + 1) for _ in range(n + 1)]
        
        for i in range(1, n + 1):
            for w in range(1, capacity + 1):
                # Don't take current item
                self.dp[i][w] = self.dp[i-1][w]
                
                # Take current item if possible
                if self.items[i-1].weight <= w:
                    self.dp[i][w] = max(
                        self.dp[i][w],
                        self.dp[i-1][w - self.items[i-1].weight] + self.items[i-1].value
                    )
        
        return self.dp[n][capacity]
    
    def get_selected_items(self, capacity: int) -> List[int]:
        selected = []
        n = len(self.items)
        w = capacity
        
        for i in range(n, 0, -1):
            if w > 0 and self.dp[i][w] != self.dp[i-1][w]:
                selected.append(i-1)
                w -= self.items[i-1].weight
        
        return selected[::-1]
    
    def print_dp(self, capacity: int) -> None:
        print("\\nDP Table:")
        print("Item\\\\Weight\\t", end="")
        for w in range(capacity + 1):
            print(f"{w}\\t", end="")
        print()
        
        for i in range(len(self.items) + 1):
            print(f"{i}\\t\\t", end="")
            for w in range(capacity + 1):
                print(f"{self.dp[i][w]}\\t", end="")
            print()
    
    def print_items(self) -> None:
        print("Items (Value, Weight):")
        for i, item in enumerate(self.items):
            print(f"Item {i}: ({item.value}, {item.weight})")

def main() -> None:
    print("=== 0/1 Knapsack Problem ===")
    
    knapsack = ZeroOneKnapsack()
    knapsack.add_item(60, 10)
    knapsack.add_item(100, 20)
    knapsack.add_item(120, 30)
    
    capacity = 50
    
    knapsack.print_items()
    print(f"\\nKnapsack capacity: {capacity}")
    
    max_value = knapsack.solve(capacity)
    print(f"Maximum value: {max_value}")
    
    selected = knapsack.get_selected_items(capacity)
    print(f"Selected items: {' '.join(map(str, selected))}")
    
    knapsack.print_dp(capacity)

if __name__ == "__main__":
    main()`,
    java: `/**
 * 0/1 Knapsack - Java Implementation
 * Maximum value without weight exceed using dynamic programming
 */

import java.util.*;

class Item {
    int value, weight;
    
    Item(int value, int weight) {
        this.value = value;
        this.weight = weight;
    }
    
    @Override
    public String toString() {
        return "Item(value=" + value + ", weight=" + weight + ")";
    }
}

public class ZeroOneKnapsack {
    private List<Item> items;
    private int[][] dp;
    
    public ZeroOneKnapsack() {
        this.items = new ArrayList<>();
    }
    
    public void addItem(int value, int weight) {
        items.add(new Item(value, weight));
    }
    
    public int solve(int capacity) {
        int n = items.size();
        dp = new int[n + 1][capacity + 1];
        
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                // Don't take current item
                dp[i][w] = dp[i-1][w];
                
                // Take current item if possible
                if (items.get(i-1).weight <= w) {
                    dp[i][w] = Math.max(dp[i][w], 
                                       dp[i-1][w - items.get(i-1).weight] + items.get(i-1).value);
                }
            }
        }
        
        return dp[n][capacity];
    }
    
    public List<Integer> getSelectedItems(int capacity) {
        List<Integer> selected = new ArrayList<>();
        int n = items.size();
        int w = capacity;
        
        for (int i = n; i > 0 && w > 0; i--) {
            if (dp[i][w] != dp[i-1][w]) {
                selected.add(i-1);
                w -= items.get(i-1).weight;
            }
        }
        
        Collections.reverse(selected);
        return selected;
    }
    
    public void printDP(int capacity) {
        System.out.println("\\nDP Table:");
        System.out.print("Item\\\\Weight\\t");
        for (int w = 0; w <= capacity; w++) {
            System.out.print(w + "\\t");
        }
        System.out.println();
        
        for (int i = 0; i <= items.size(); i++) {
            System.out.print(i + "\\t\\t");
            for (int w = 0; w <= capacity; w++) {
                System.out.print(dp[i][w] + "\\t");
            }
            System.out.println();
        }
    }
    
    public void printItems() {
        System.out.println("Items (Value, Weight):");
        for (int i = 0; i < items.size(); i++) {
            Item item = items.get(i);
            System.out.println("Item " + i + ": (" + item.value + ", " + item.weight + ")");
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== 0/1 Knapsack Problem ===");
        
        ZeroOneKnapsack knapsack = new ZeroOneKnapsack();
        knapsack.addItem(60, 10);
        knapsack.addItem(100, 20);
        knapsack.addItem(120, 30);
        
        int capacity = 50;
        
        knapsack.printItems();
        System.out.println("\\nKnapsack capacity: " + capacity);
        
        int maxValue = knapsack.solve(capacity);
        System.out.println("Maximum value: " + maxValue);
        
        List<Integer> selected = knapsack.getSelectedItems(capacity);
        System.out.print("Selected items: ");
        for (int idx : selected) {
            System.out.print(idx + " ");
        }
        System.out.println();
        
        knapsack.printDP(capacity);
    }
}`
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/dynamicprogramming" style={{
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
        ← Back to Dynamic Programming
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: 'white'
      }}>
        0/1 Knapsack Code
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
                color: selectedLanguage === key ? color : '#94a3b8',
                border: selectedLanguage === key 
                  ? `1px solid ${color}60` 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: selectedLanguage === key ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                margin: '0 2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
                  {selectedLanguage === 'cpp' ? 'knapsack_01.cpp' : 
                   selectedLanguage === 'c' ? 'knapsack_01.c' :
                   selectedLanguage === 'python' ? 'knapsack_01.py' : 'ZeroOneKnapsack.java'}
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
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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

export default ZeroOneKnapsackCode;