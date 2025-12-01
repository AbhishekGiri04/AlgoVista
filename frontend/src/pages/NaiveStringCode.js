import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const NaiveStringCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Naive String Matching - C++ Implementation
 * Brute force pattern matching algorithm
 */

#include <iostream>
#include <vector>
#include <string>
using namespace std;

class NaiveStringMatching {
public:
    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        cout << "Searching for pattern '" << pattern << "' in text '" << text << "'" << endl;
        cout << "Text length: " << n << ", Pattern length: " << m << endl << endl;
        
        for (int i = 0; i <= n - m; i++) {
            cout << "Checking position " << i << ": ";
            
            int j;
            for (j = 0; j < m; j++) {
                cout << text[i + j];
                if (text[i + j] != pattern[j]) {
                    cout << " != " << pattern[j] << " (mismatch)" << endl;
                    break;
                }
                if (j < m - 1) cout << " == " << pattern[j] << ", ";
            }
            
            if (j == m) {
                cout << " == " << pattern << " (MATCH!)" << endl;
                matches.push_back(i);
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
    cout << "=== Naive String Matching ===" << endl;
    
    string text = "ABABDABACDABABCABCABCABCABC";
    string pattern = "ABABCAB";
    
    NaiveStringMatching nsm;
    vector<int> matches = nsm.search(text, pattern);
    nsm.printMatches(matches);
    
    return 0;
}`,
    c: `/**
 * Naive String Matching - C Implementation
 * Brute force pattern matching algorithm
 */

#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define MAX_MATCHES 100

int naiveStringSearch(char* text, char* pattern, int matches[]) {
    int n = strlen(text);
    int m = strlen(pattern);
    int matchCount = 0;
    
    printf("Searching for pattern '%s' in text '%s'\\n", pattern, text);
    printf("Text length: %d, Pattern length: %d\\n\\n", n, m);
    
    for (int i = 0; i <= n - m; i++) {
        printf("Checking position %d: ", i);
        
        int j;
        for (j = 0; j < m; j++) {
            printf("%c", text[i + j]);
            if (text[i + j] != pattern[j]) {
                printf(" != %c (mismatch)\\n", pattern[j]);
                break;
            }
            if (j < m - 1) {
                printf(" == %c, ", pattern[j]);
            }
        }
        
        if (j == m) {
            printf(" == %s (MATCH!)\\n", pattern);
            matches[matchCount++] = i;
        }
    }
    
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
    printf("=== Naive String Matching ===\\n");
    
    char text[] = "ABABDABACDABABCABCABCABCABC";
    char pattern[] = "ABABCAB";
    int matches[MAX_MATCHES];
    
    int matchCount = naiveStringSearch(text, pattern, matches);
    printMatches(matches, matchCount);
    
    return 0;
}`,
    python: `"""
Naive String Matching - Python Implementation
Brute force pattern matching algorithm
"""

from typing import List

class NaiveStringMatching:
    def search(self, text: str, pattern: str) -> List[int]:
        matches = []
        n, m = len(text), len(pattern)
        
        print(f"Searching for pattern '{pattern}' in text '{text}'")
        print(f"Text length: {n}, Pattern length: {m}\\n")
        
        for i in range(n - m + 1):
            print(f"Checking position {i}: ", end="")
            
            j = 0
            while j < m:
                print(text[i + j], end="")
                if text[i + j] != pattern[j]:
                    print(f" != {pattern[j]} (mismatch)")
                    break
                if j < m - 1:
                    print(f" == {pattern[j]}, ", end="")
                j += 1
            
            if j == m:
                print(f" == {pattern} (MATCH!)")
                matches.append(i)
        
        return matches
    
    def print_matches(self, matches: List[int]) -> None:
        if not matches:
            print("\\nNo matches found.")
        else:
            print(f"\\nPattern found at positions: {' '.join(map(str, matches))}")

def main() -> None:
    print("=== Naive String Matching ===")
    
    text = "ABABDABACDABABCABCABCABCABC"
    pattern = "ABABCAB"
    
    nsm = NaiveStringMatching()
    matches = nsm.search(text, pattern)
    nsm.print_matches(matches)

if __name__ == "__main__":
    main()`,
    java: `/**
 * Naive String Matching - Java Implementation
 * Brute force pattern matching algorithm
 */

import java.util.*;

public class NaiveStringMatching {
    
    public List<Integer> search(String text, String pattern) {
        List<Integer> matches = new ArrayList<>();
        int n = text.length();
        int m = pattern.length();
        
        System.out.println("Searching for pattern '" + pattern + "' in text '" + text + "'");
        System.out.println("Text length: " + n + ", Pattern length: " + m + "\\n");
        
        for (int i = 0; i <= n - m; i++) {
            System.out.print("Checking position " + i + ": ");
            
            int j;
            for (j = 0; j < m; j++) {
                System.out.print(text.charAt(i + j));
                if (text.charAt(i + j) != pattern.charAt(j)) {
                    System.out.println(" != " + pattern.charAt(j) + " (mismatch)");
                    break;
                }
                if (j < m - 1) {
                    System.out.print(" == " + pattern.charAt(j) + ", ");
                }
            }
            
            if (j == m) {
                System.out.println(" == " + pattern + " (MATCH!)");
                matches.add(i);
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
        System.out.println("=== Naive String Matching ===");
        
        String text = "ABABDABACDABABCABCABCABCABC";
        String pattern = "ABABCAB";
        
        NaiveStringMatching nsm = new NaiveStringMatching();
        List<Integer> matches = nsm.search(text, pattern);
        nsm.printMatches(matches);
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff1f2, #fecdd3, #fda4af)',
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
        Naive String Matching Code
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
                  {selectedLanguage === 'cpp' ? 'naive_string.cpp' : 
                   selectedLanguage === 'c' ? 'naive_string.c' :
                   selectedLanguage === 'python' ? 'naive_string.py' : 'NaiveStringMatching.java'}
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

export default NaiveStringCode;