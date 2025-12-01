import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const KMPCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * KMP Algorithm - C++ Implementation
 * Knuth-Morris-Pratt pattern search with failure function
 */

#include <iostream>
#include <vector>
#include <string>
using namespace std;

class KMP {
private:
    vector<int> computeLPS(const string& pattern) {
        int m = pattern.length();
        vector<int> lps(m, 0);
        int len = 0;
        int i = 1;
        
        cout << "Computing LPS array for pattern: " << pattern << endl;
        
        while (i < m) {
            if (pattern[i] == pattern[len]) {
                len++;
                lps[i] = len;
                cout << "lps[" << i << "] = " << len << " (match)" << endl;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                    cout << "Mismatch, len = lps[" << len << "] = " << lps[len] << endl;
                } else {
                    lps[i] = 0;
                    cout << "lps[" << i << "] = 0" << endl;
                    i++;
                }
            }
        }
        
        cout << "LPS array: ";
        for (int val : lps) cout << val << " ";
        cout << endl << endl;
        
        return lps;
    }
    
public:
    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        vector<int> lps = computeLPS(pattern);
        
        cout << "Searching for pattern '" << pattern << "' in text '" << text << "'" << endl;
        
        int i = 0; // index for text
        int j = 0; // index for pattern
        
        while (i < n) {
            cout << "Comparing text[" << i << "] = '" << text[i] 
                 << "' with pattern[" << j << "] = '" << pattern[j] << "'";
            
            if (pattern[j] == text[i]) {
                cout << " (match)" << endl;
                i++;
                j++;
            } else {
                cout << " (mismatch)" << endl;
            }
            
            if (j == m) {
                cout << "Pattern found at index " << (i - j) << endl;
                matches.push_back(i - j);
                j = lps[j - 1];
            } else if (i < n && pattern[j] != text[i]) {
                if (j != 0) {
                    j = lps[j - 1];
                    cout << "Using LPS: j = " << j << endl;
                } else {
                    i++;
                }
            }
        }
        
        return matches;
    }
    
    void printMatches(const vector<int>& matches) {
        if (matches.empty()) {
            cout << "\\nNo matches found." << endl;
        } else {
            cout << "\\nPattern found at positions: ";
            for (int pos : matches) {
                cout << pos << " ";
            }
            cout << endl;
        }
    }
};

int main() {
    cout << "=== KMP Algorithm ===" << endl;
    
    string text = "ABABDABACDABABCABCABCABCABC";
    string pattern = "ABABCAB";
    
    KMP kmp;
    vector<int> matches = kmp.search(text, pattern);
    kmp.printMatches(matches);
    
    return 0;
}`,
    c: `/**
 * KMP Algorithm - C Implementation
 * Knuth-Morris-Pratt pattern search with failure function
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_MATCHES 100

void computeLPS(char* pattern, int* lps) {
    int m = strlen(pattern);
    int len = 0;
    int i = 1;
    
    lps[0] = 0;
    printf("Computing LPS array for pattern: %s\\n", pattern);
    
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            printf("lps[%d] = %d (match)\\n", i, len);
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
                printf("Mismatch, len = lps[%d] = %d\\n", len, lps[len]);
            } else {
                lps[i] = 0;
                printf("lps[%d] = 0\\n", i);
                i++;
            }
        }
    }
    
    printf("LPS array: ");
    for (int k = 0; k < m; k++) {
        printf("%d ", lps[k]);
    }
    printf("\\n\\n");
}

int kmpSearch(char* text, char* pattern, int matches[]) {
    int n = strlen(text);
    int m = strlen(pattern);
    int* lps = (int*)malloc(m * sizeof(int));
    int matchCount = 0;
    
    computeLPS(pattern, lps);
    
    printf("Searching for pattern '%s' in text '%s'\\n", pattern, text);
    
    int i = 0; // index for text
    int j = 0; // index for pattern
    
    while (i < n) {
        printf("Comparing text[%d] = '%c' with pattern[%d] = '%c'", 
               i, text[i], j, pattern[j]);
        
        if (pattern[j] == text[i]) {
            printf(" (match)\\n");
            i++;
            j++;
        } else {
            printf(" (mismatch)\\n");
        }
        
        if (j == m) {
            printf("Pattern found at index %d\\n", i - j);
            matches[matchCount++] = i - j;
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
                printf("Using LPS: j = %d\\n", j);
            } else {
                i++;
            }
        }
    }
    
    free(lps);
    return matchCount;
}

void printMatches(int matches[], int count) {
    if (count == 0) {
        printf("\\nNo matches found.\\n");
    } else {
        printf("\\nPattern found at positions: ");
        for (int i = 0; i < count; i++) {
            printf("%d ", matches[i]);
        }
        printf("\\n");
    }
}

int main() {
    printf("=== KMP Algorithm ===\\n");
    
    char text[] = "ABABDABACDABABCABCABCABCABC";
    char pattern[] = "ABABCAB";
    int matches[MAX_MATCHES];
    
    int matchCount = kmpSearch(text, pattern, matches);
    printMatches(matches, matchCount);
    
    return 0;
}`,
    python: `"""
KMP Algorithm - Python Implementation
Knuth-Morris-Pratt pattern search with failure function
"""

from typing import List

class KMP:
    def compute_lps(self, pattern: str) -> List[int]:
        m = len(pattern)
        lps = [0] * m
        length = 0
        i = 1
        
        print(f"Computing LPS array for pattern: {pattern}")
        
        while i < m:
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                print(f"lps[{i}] = {length} (match)")
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                    print(f"Mismatch, length = lps[{length}] = {lps[length]}")
                else:
                    lps[i] = 0
                    print(f"lps[{i}] = 0")
                    i += 1
        
        print(f"LPS array: {' '.join(map(str, lps))}\\n")
        return lps
    
    def search(self, text: str, pattern: str) -> List[int]:
        matches = []
        n, m = len(text), len(pattern)
        
        lps = self.compute_lps(pattern)
        
        print(f"Searching for pattern '{pattern}' in text '{text}'")
        
        i = j = 0  # indices for text and pattern
        
        while i < n:
            print(f"Comparing text[{i}] = '{text[i]}' with pattern[{j}] = '{pattern[j]}'", end="")
            
            if pattern[j] == text[i]:
                print(" (match)")
                i += 1
                j += 1
            else:
                print(" (mismatch)")
            
            if j == m:
                print(f"Pattern found at index {i - j}")
                matches.append(i - j)
                j = lps[j - 1]
            elif i < n and pattern[j] != text[i]:
                if j != 0:
                    j = lps[j - 1]
                    print(f"Using LPS: j = {j}")
                else:
                    i += 1
        
        return matches
    
    def print_matches(self, matches: List[int]) -> None:
        if not matches:
            print("\\nNo matches found.")
        else:
            print(f"\\nPattern found at positions: {' '.join(map(str, matches))}")

def main() -> None:
    print("=== KMP Algorithm ===")
    
    text = "ABABDABACDABABCABCABCABCABC"
    pattern = "ABABCAB"
    
    kmp = KMP()
    matches = kmp.search(text, pattern)
    kmp.print_matches(matches)

if __name__ == "__main__":
    main()`,
    java: `/**
 * KMP Algorithm - Java Implementation
 * Knuth-Morris-Pratt pattern search with failure function
 */

import java.util.*;

public class KMP {
    
    private int[] computeLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0;
        int i = 1;
        
        System.out.println("Computing LPS array for pattern: " + pattern);
        
        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                System.out.println("lps[" + i + "] = " + len + " (match)");
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                    System.out.println("Mismatch, len = lps[" + len + "] = " + lps[len]);
                } else {
                    lps[i] = 0;
                    System.out.println("lps[" + i + "] = 0");
                    i++;
                }
            }
        }
        
        System.out.print("LPS array: ");
        for (int val : lps) {
            System.out.print(val + " ");
        }
        System.out.println("\\n");
        
        return lps;
    }
    
    public List<Integer> search(String text, String pattern) {
        List<Integer> matches = new ArrayList<>();
        int n = text.length();
        int m = pattern.length();
        
        int[] lps = computeLPS(pattern);
        
        System.out.println("Searching for pattern '" + pattern + "' in text '" + text + "'");
        
        int i = 0; // index for text
        int j = 0; // index for pattern
        
        while (i < n) {
            System.out.print("Comparing text[" + i + "] = '" + text.charAt(i) + 
                           "' with pattern[" + j + "] = '" + pattern.charAt(j) + "'");
            
            if (pattern.charAt(j) == text.charAt(i)) {
                System.out.println(" (match)");
                i++;
                j++;
            } else {
                System.out.println(" (mismatch)");
            }
            
            if (j == m) {
                System.out.println("Pattern found at index " + (i - j));
                matches.add(i - j);
                j = lps[j - 1];
            } else if (i < n && pattern.charAt(j) != text.charAt(i)) {
                if (j != 0) {
                    j = lps[j - 1];
                    System.out.println("Using LPS: j = " + j);
                } else {
                    i++;
                }
            }
        }
        
        return matches;
    }
    
    public void printMatches(List<Integer> matches) {
        if (matches.isEmpty()) {
            System.out.println("\\nNo matches found.");
        } else {
            System.out.print("\\nPattern found at positions: ");
            for (int pos : matches) {
                System.out.print(pos + " ");
            }
            System.out.println();
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== KMP Algorithm ===");
        
        String text = "ABABDABACDABABCABCABCABCABC";
        String pattern = "ABABCAB";
        
        KMP kmp = new KMP();
        List<Integer> matches = kmp.search(text, pattern);
        kmp.printMatches(matches);
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fefce8, #fef08a, #facc15)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/stringalgorithms" style={{
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
        ← Back to String Algorithms
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        KMP Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'kmp.cpp' : 
                   selectedLanguage === 'c' ? 'kmp.c' :
                   selectedLanguage === 'python' ? 'kmp.py' : 'KMP.java'}
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

export default KMPCode;