import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const MatrixChainMultiplicationCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Matrix Chain Multiplication - C++ Implementation
 * Optimal matrix multiplication order using dynamic programming
 */

#include <iostream>
#include <vector>
#include <climits>
using namespace std;

class MatrixChainMultiplication {
private:
    vector<vector<int>> dp;
    vector<vector<int>> split;
    vector<int> dimensions;
    
public:
    int solve(vector<int>& dims) {
        dimensions = dims;
        int n = dims.size() - 1;
        
        dp.assign(n, vector<int>(n, 0));
        split.assign(n, vector<int>(n, 0));
        
        // l is chain length
        for (int l = 2; l <= n; l++) {
            for (int i = 0; i < n - l + 1; i++) {
                int j = i + l - 1;
                dp[i][j] = INT_MAX;
                
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k+1][j] + 
                              dims[i] * dims[k+1] * dims[j+1];
                    
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        split[i][j] = k;
                    }
                }
            }
        }
        
        return dp[0][n-1];
    }
    
    void printOptimalParentheses(int i, int j) {
        if (i == j) {
            cout << "M" << i;
        } else {
            cout << "(";
            printOptimalParentheses(i, split[i][j]);
            printOptimalParentheses(split[i][j] + 1, j);
            cout << ")";
        }
    }
    
    void printDP() {
        cout << "\\nDP Table (minimum scalar multiplications):" << endl;
        for (int i = 0; i < dp.size(); i++) {
            for (int j = 0; j < dp[i].size(); j++) {
                if (i <= j) {
                    cout << dp[i][j] << "\\t";
                } else {
                    cout << "0\\t";
                }
            }
            cout << endl;
        }
    }
    
    void printMatrices() {
        cout << "Matrix dimensions:" << endl;
        for (int i = 0; i < dimensions.size() - 1; i++) {
            cout << "M" << i << ": " << dimensions[i] 
                 << "x" << dimensions[i+1] << endl;
        }
    }
};

int main() {
    cout << "=== Matrix Chain Multiplication ===" << endl;
    
    vector<int> dimensions = {1, 2, 3, 4, 5};
    
    MatrixChainMultiplication mcm;
    mcm.printMatrices();
    
    int minCost = mcm.solve(dimensions);
    
    cout << "\\nMinimum scalar multiplications: " << minCost << endl;
    
    cout << "Optimal parenthesization: ";
    mcm.printOptimalParentheses(0, dimensions.size() - 2);
    cout << endl;
    
    mcm.printDP();
    
    return 0;
}`,
    c: `/**
 * Matrix Chain Multiplication - C Implementation
 * Optimal matrix multiplication order using dynamic programming
 */

#include <stdio.h>
#include <limits.h>

#define MAX_MATRICES 10

int min(int a, int b) {
    return (a < b) ? a : b;
}

int matrixChainOrder(int dims[], int n, int dp[][MAX_MATRICES], int split[][MAX_MATRICES]) {
    // Initialize DP table
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            dp[i][j] = 0;
        }
    }
    
    // l is chain length
    for (int l = 2; l <= n; l++) {
        for (int i = 0; i < n - l + 1; i++) {
            int j = i + l - 1;
            dp[i][j] = INT_MAX;
            
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j] + 
                          dims[i] * dims[k+1] * dims[j+1];
                
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    split[i][j] = k;
                }
            }
        }
    }
    
    return dp[0][n-1];
}

void printOptimalParentheses(int split[][MAX_MATRICES], int i, int j) {
    if (i == j) {
        printf("M%d", i);
    } else {
        printf("(");
        printOptimalParentheses(split, i, split[i][j]);
        printOptimalParentheses(split, split[i][j] + 1, j);
        printf(")");
    }
}

void printDP(int dp[][MAX_MATRICES], int n) {
    printf("\\nDP Table (minimum scalar multiplications):\\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i <= j) {
                printf("%d\\t", dp[i][j]);
            } else {
                printf("0\\t");
            }
        }
        printf("\\n");
    }
}

void printMatrices(int dims[], int n) {
    printf("Matrix dimensions:\\n");
    for (int i = 0; i < n; i++) {
        printf("M%d: %dx%d\\n", i, dims[i], dims[i+1]);
    }
}

int main() {
    printf("=== Matrix Chain Multiplication ===\\n");
    
    int dimensions[] = {1, 2, 3, 4, 5};
    int n = sizeof(dimensions) / sizeof(dimensions[0]) - 1;
    
    int dp[MAX_MATRICES][MAX_MATRICES];
    int split[MAX_MATRICES][MAX_MATRICES];
    
    printMatrices(dimensions, n);
    
    int minCost = matrixChainOrder(dimensions, n, dp, split);
    
    printf("\\nMinimum scalar multiplications: %d\\n", minCost);
    
    printf("Optimal parenthesization: ");
    printOptimalParentheses(split, 0, n-1);
    printf("\\n");
    
    printDP(dp, n);
    
    return 0;
}`,
    python: `"""
Matrix Chain Multiplication - Python Implementation
Optimal matrix multiplication order using dynamic programming
"""

from typing import List, Tuple

class MatrixChainMultiplication:
    def __init__(self):
        self.dp: List[List[int]] = []
        self.split: List[List[int]] = []
        self.dimensions: List[int] = []
    
    def solve(self, dims: List[int]) -> int:
        self.dimensions = dims
        n = len(dims) - 1
        
        # Initialize DP tables
        self.dp = [[0] * n for _ in range(n)]
        self.split = [[0] * n for _ in range(n)]
        
        # l is chain length
        for l in range(2, n + 1):
            for i in range(n - l + 1):
                j = i + l - 1
                self.dp[i][j] = float('inf')
                
                for k in range(i, j):
                    cost = (self.dp[i][k] + self.dp[k+1][j] + 
                           dims[i] * dims[k+1] * dims[j+1])
                    
                    if cost < self.dp[i][j]:
                        self.dp[i][j] = cost
                        self.split[i][j] = k
        
        return self.dp[0][n-1]
    
    def print_optimal_parentheses(self, i: int, j: int) -> str:
        if i == j:
            return f"M{i}"
        else:
            left = self.print_optimal_parentheses(i, self.split[i][j])
            right = self.print_optimal_parentheses(self.split[i][j] + 1, j)
            return f"({left}{right})"
    
    def print_dp(self) -> None:
        print("\\nDP Table (minimum scalar multiplications):")
        for i in range(len(self.dp)):
            for j in range(len(self.dp[i])):
                if i <= j:
                    print(f"{self.dp[i][j]}\\t", end="")
                else:
                    print("0\\t", end="")
            print()
    
    def print_matrices(self) -> None:
        print("Matrix dimensions:")
        for i in range(len(self.dimensions) - 1):
            print(f"M{i}: {self.dimensions[i]}x{self.dimensions[i+1]}")

def main() -> None:
    print("=== Matrix Chain Multiplication ===")
    
    dimensions = [1, 2, 3, 4, 5]
    
    mcm = MatrixChainMultiplication()
    mcm.print_matrices()
    
    min_cost = mcm.solve(dimensions)
    
    print(f"\\nMinimum scalar multiplications: {min_cost}")
    
    optimal = mcm.print_optimal_parentheses(0, len(dimensions) - 2)
    print(f"Optimal parenthesization: {optimal}")
    
    mcm.print_dp()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Matrix Chain Multiplication - Java Implementation
 * Optimal matrix multiplication order using dynamic programming
 */

public class MatrixChainMultiplication {
    private int[][] dp;
    private int[][] split;
    private int[] dimensions;
    
    public int solve(int[] dims) {
        this.dimensions = dims;
        int n = dims.length - 1;
        
        dp = new int[n][n];
        split = new int[n][n];
        
        // l is chain length
        for (int l = 2; l <= n; l++) {
            for (int i = 0; i < n - l + 1; i++) {
                int j = i + l - 1;
                dp[i][j] = Integer.MAX_VALUE;
                
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k+1][j] + 
                              dims[i] * dims[k+1] * dims[j+1];
                    
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        split[i][j] = k;
                    }
                }
            }
        }
        
        return dp[0][n-1];
    }
    
    public String printOptimalParentheses(int i, int j) {
        if (i == j) {
            return "M" + i;
        } else {
            String left = printOptimalParentheses(i, split[i][j]);
            String right = printOptimalParentheses(split[i][j] + 1, j);
            return "(" + left + right + ")";
        }
    }
    
    public void printDP() {
        System.out.println("\\nDP Table (minimum scalar multiplications):");
        for (int i = 0; i < dp.length; i++) {
            for (int j = 0; j < dp[i].length; j++) {
                if (i <= j) {
                    System.out.print(dp[i][j] + "\\t");
                } else {
                    System.out.print("0\\t");
                }
            }
            System.out.println();
        }
    }
    
    public void printMatrices() {
        System.out.println("Matrix dimensions:");
        for (int i = 0; i < dimensions.length - 1; i++) {
            System.out.println("M" + i + ": " + dimensions[i] + 
                             "x" + dimensions[i+1]);
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Matrix Chain Multiplication ===");
        
        int[] dimensions = {1, 2, 3, 4, 5};
        
        MatrixChainMultiplication mcm = new MatrixChainMultiplication();
        mcm.printMatrices();
        
        int minCost = mcm.solve(dimensions);
        
        System.out.println("\\nMinimum scalar multiplications: " + minCost);
        
        String optimal = mcm.printOptimalParentheses(0, dimensions.length - 2);
        System.out.println("Optimal parenthesization: " + optimal);
        
        mcm.printDP();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #faf5ff, #e9d5ff, #c4b5fd)',
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
        Matrix Chain Multiplication Code
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
                  {selectedLanguage === 'cpp' ? 'matrix_chain.cpp' : 
                   selectedLanguage === 'c' ? 'matrix_chain.c' :
                   selectedLanguage === 'python' ? 'matrix_chain.py' : 'MatrixChainMultiplication.java'}
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

export default MatrixChainMultiplicationCode;