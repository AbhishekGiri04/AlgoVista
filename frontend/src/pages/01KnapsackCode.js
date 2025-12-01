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
};

int main() {
    cout << "=== 0/1 Knapsack Problem ===" << endl;
    
    ZeroOneKnapsack knapsack;
    knapsack.addItem(60, 10);
    knapsack.addItem(100, 20);
    knapsack.addItem(120, 30);
    
    int capacity = 50;
    int maxValue = knapsack.solve(capacity);
    
    cout << "Maximum value: " << maxValue << endl;
    
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

int knapsack01(Item items[], int n, int capacity) {
    int dp[MAX_ITEMS + 1][MAX_CAPACITY + 1];
    
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

int main() {
    printf("=== 0/1 Knapsack Problem ===\n");
    
    Item items[] = {
        {60, 10},
        {100, 20},
        {120, 30}
    };
    
    int n = sizeof(items) / sizeof(items[0]);
    int capacity = 50;
    
    int maxValue = knapsack01(items, n, capacity);
    printf("Maximum value: %d\n", maxValue);
    
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

def main() -> None:
    print("=== 0/1 Knapsack Problem ===")
    
    knapsack = ZeroOneKnapsack()
    knapsack.add_item(60, 10)
    knapsack.add_item(100, 20)
    knapsack.add_item(120, 30)
    
    capacity = 50
    max_value = knapsack.solve(capacity)
    
    print(f"Maximum value: {max_value}")

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
    
    public static void main(String[] args) {
        System.out.println("=== 0/1 Knapsack Problem ===");
        
        ZeroOneKnapsack knapsack = new ZeroOneKnapsack();
        knapsack.addItem(60, 10);
        knapsack.addItem(100, 20);
        knapsack.addItem(120, 30);
        
        int capacity = 50;
        int maxValue = knapsack.solve(capacity);
        
        System.out.println("Maximum value: " + maxValue);
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff7ed, #fed7aa, #fdba74)',
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
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
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

export default ZeroOneKnapsackCode;