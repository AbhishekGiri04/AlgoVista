import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const LongestCommonSubsequenceCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Longest Common Subsequence (LCS) - C++ Implementation
 * Find longest common sequence using dynamic programming
 */

#include <iostream>
#include <vector>
#include <string>
using namespace std;

class LCS {
private:
    vector<vector<int>> dp;
    string str1, str2;
    
public:
    int findLCS(string s1, string s2) {
        str1 = s1;
        str2 = s2;
        int m = s1.length();
        int n = s2.length();
        
        dp.assign(m + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i-1] == s2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    string getLCS() {
        int i = str1.length();
        int j = str2.length();
        string lcs = "";
        
        while (i > 0 && j > 0) {
            if (str1[i-1] == str2[j-1]) {
                lcs = str1[i-1] + lcs;
                i--;
                j--;
            } else if (dp[i-1][j] > dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    }
    
    void printDP() {
        cout << "DP Table:" << endl;
        cout << "    ";
        for (char c : str2) cout << c << " ";
        cout << endl;
        
        for (int i = 0; i <= str1.length(); i++) {
            if (i == 0) cout << "  ";
            else cout << str1[i-1] << " ";
            
            for (int j = 0; j <= str2.length(); j++) {
                cout << dp[i][j] << " ";
            }
            cout << endl;
        }
    }
};

int main() {
    cout << "=== Longest Common Subsequence ===" << endl;
    
    string s1 = "ABCDGH";
    string s2 = "AEDFHR";
    
    LCS lcs;
    int length = lcs.findLCS(s1, s2);
    
    cout << "String 1: " << s1 << endl;
    cout << "String 2: " << s2 << endl;
    cout << "LCS Length: " << length << endl;
    cout << "LCS: " << lcs.getLCS() << endl << endl;
    
    lcs.printDP();
    
    return 0;
}`,
    c: `/**
 * Longest Common Subsequence (LCS) - C Implementation
 * Find longest common sequence using dynamic programming
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_LEN 100

int max(int a, int b) {
    return (a > b) ? a : b;
}

int lcs(char* s1, char* s2, int dp[][MAX_LEN]) {
    int m = strlen(s1);
    int n = strlen(s2);
    
    // Initialize DP table
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            dp[i][j] = 0;
        }
    }
    
    // Fill DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    return dp[m][n];
}

void printLCS(char* s1, char* s2, int dp[][MAX_LEN]) {
    int i = strlen(s1);
    int j = strlen(s2);
    char lcs_str[MAX_LEN];
    int index = dp[i][j];
    lcs_str[index] = '\\0';
    
    while (i > 0 && j > 0) {
        if (s1[i-1] == s2[j-1]) {
            lcs_str[index-1] = s1[i-1];
            i--;
            j--;
            index--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    
    printf("LCS: %s\\n", lcs_str);
}

void printDP(char* s1, char* s2, int dp[][MAX_LEN]) {
    int m = strlen(s1);
    int n = strlen(s2);
    
    printf("\\nDP Table:\\n");
    printf("    ");
    for (int j = 0; j < n; j++) {
        printf("%c ", s2[j]);
    }
    printf("\\n");
    
    for (int i = 0; i <= m; i++) {
        if (i == 0) printf("  ");
        else printf("%c ", s1[i-1]);
        
        for (int j = 0; j <= n; j++) {
            printf("%d ", dp[i][j]);
        }
        printf("\\n");
    }
}

int main() {
    printf("=== Longest Common Subsequence ===\\n");
    
    char s1[] = "ABCDGH";
    char s2[] = "AEDFHR";
    int dp[MAX_LEN][MAX_LEN];
    
    int length = lcs(s1, s2, dp);
    
    printf("String 1: %s\\n", s1);
    printf("String 2: %s\\n", s2);
    printf("LCS Length: %d\\n", length);
    
    printLCS(s1, s2, dp);
    printDP(s1, s2, dp);
    
    return 0;
}`,
    python: `"""
Longest Common Subsequence (LCS) - Python Implementation
Find longest common sequence using dynamic programming
"""

from typing import List, Tuple

class LCS:
    def __init__(self):
        self.dp: List[List[int]] = []
        self.str1: str = ""
        self.str2: str = ""
    
    def find_lcs(self, s1: str, s2: str) -> int:
        self.str1 = s1
        self.str2 = s2
        m, n = len(s1), len(s2)
        
        # Initialize DP table
        self.dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # Fill DP table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i-1] == s2[j-1]:
                    self.dp[i][j] = self.dp[i-1][j-1] + 1
                else:
                    self.dp[i][j] = max(self.dp[i-1][j], self.dp[i][j-1])
        
        return self.dp[m][n]
    
    def get_lcs(self) -> str:
        i, j = len(self.str1), len(self.str2)
        lcs = []
        
        while i > 0 and j > 0:
            if self.str1[i-1] == self.str2[j-1]:
                lcs.append(self.str1[i-1])
                i -= 1
                j -= 1
            elif self.dp[i-1][j] > self.dp[i][j-1]:
                i -= 1
            else:
                j -= 1
        
        return ''.join(reversed(lcs))
    
    def print_dp(self) -> None:
        print("\\nDP Table:")
        print("    " + " ".join(self.str2))
        
        for i in range(len(self.str1) + 1):
            if i == 0:
                print("  ", end="")
            else:
                print(f"{self.str1[i-1]} ", end="")
            
            for j in range(len(self.str2) + 1):
                print(f"{self.dp[i][j]} ", end="")
            print()

def main() -> None:
    print("=== Longest Common Subsequence ===")
    
    s1 = "ABCDGH"
    s2 = "AEDFHR"
    
    lcs_solver = LCS()
    length = lcs_solver.find_lcs(s1, s2)
    
    print(f"String 1: {s1}")
    print(f"String 2: {s2}")
    print(f"LCS Length: {length}")
    print(f"LCS: {lcs_solver.get_lcs()}")
    
    lcs_solver.print_dp()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Longest Common Subsequence (LCS) - Java Implementation
 * Find longest common sequence using dynamic programming
 */

public class LongestCommonSubsequence {
    private int[][] dp;
    private String str1, str2;
    
    public int findLCS(String s1, String s2) {
        this.str1 = s1;
        this.str2 = s2;
        int m = s1.length();
        int n = s2.length();
        
        dp = new int[m + 1][n + 1];
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i-1) == s2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    public String getLCS() {
        int i = str1.length();
        int j = str2.length();
        StringBuilder lcs = new StringBuilder();
        
        while (i > 0 && j > 0) {
            if (str1.charAt(i-1) == str2.charAt(j-1)) {
                lcs.insert(0, str1.charAt(i-1));
                i--;
                j--;
            } else if (dp[i-1][j] > dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs.toString();
    }
    
    public void printDP() {
        System.out.println("\\nDP Table:");
        System.out.print("    ");
        for (char c : str2.toCharArray()) {
            System.out.print(c + " ");
        }
        System.out.println();
        
        for (int i = 0; i <= str1.length(); i++) {
            if (i == 0) {
                System.out.print("  ");
            } else {
                System.out.print(str1.charAt(i-1) + " ");
            }
            
            for (int j = 0; j <= str2.length(); j++) {
                System.out.print(dp[i][j] + " ");
            }
            System.out.println();
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Longest Common Subsequence ===");
        
        String s1 = "ABCDGH";
        String s2 = "AEDFHR";
        
        LongestCommonSubsequence lcs = new LongestCommonSubsequence();
        int length = lcs.findLCS(s1, s2);
        
        System.out.println("String 1: " + s1);
        System.out.println("String 2: " + s2);
        System.out.println("LCS Length: " + length);
        System.out.println("LCS: " + lcs.getLCS());
        
        lcs.printDP();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0fdfa, #a7f3d0, #6ee7b7)',
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
        Longest Common Subsequence Code
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
                  {selectedLanguage === 'cpp' ? 'lcs.cpp' : 
                   selectedLanguage === 'c' ? 'lcs.c' :
                   selectedLanguage === 'python' ? 'lcs.py' : 'LongestCommonSubsequence.java'}
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

export default LongestCommonSubsequenceCode;