import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const RabinKarpCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Rabin-Karp Algorithm - C++ Implementation
 * Rolling hash string matching algorithm
 */

#include <iostream>
#include <vector>
#include <string>
using namespace std;

class RabinKarp {
private:
    static const int PRIME = 101;
    static const int BASE = 256;
    
    long long calculateHash(const string& str, int len) {
        long long hash = 0;
        for (int i = 0; i < len; i++) {
            hash = (hash * BASE + str[i]) % PRIME;
        }
        return hash;
    }
    
    long long recalculateHash(const string& str, int oldIndex, int newIndex, 
                             long long oldHash, int patternLen) {
        long long newHash = oldHash;
        long long h = 1;
        
        // Calculate BASE^(patternLen-1) % PRIME
        for (int i = 0; i < patternLen - 1; i++) {
            h = (h * BASE) % PRIME;
        }
        
        // Remove leading character
        newHash = (newHash - (str[oldIndex] * h) % PRIME + PRIME) % PRIME;
        
        // Add trailing character
        newHash = (newHash * BASE + str[newIndex]) % PRIME;
        
        return newHash;
    }
    
    bool checkEqual(const string& str1, int start1, const string& str2, 
                   int start2, int len) {
        for (int i = 0; i < len; i++) {
            if (str1[start1 + i] != str2[start2 + i]) {
                return false;
            }
        }
        return true;
    }
    
public:
    vector<int> search(const string& text, const string& pattern) {
        vector<int> matches;
        int n = text.length();
        int m = pattern.length();
        
        if (m > n) return matches;
        
        cout << "Searching for pattern '" << pattern << "' in text '" << text << "'" << endl;
        cout << "Using BASE = " << BASE << ", PRIME = " << PRIME << endl << endl;
        
        long long patternHash = calculateHash(pattern, m);
        long long textHash = calculateHash(text, m);
        
        cout << "Pattern hash: " << patternHash << endl;
        cout << "Initial text hash: " << textHash << endl << endl;
        
        // Check first window
        cout << "Checking position 0: ";
        if (patternHash == textHash && checkEqual(text, 0, pattern, 0, m)) {
            cout << "Hash match + String match = FOUND!" << endl;
            matches.push_back(0);
        } else if (patternHash == textHash) {
            cout << "Hash match but string mismatch (spurious hit)" << endl;
        } else {
            cout << "Hash mismatch" << endl;
        }
        
        // Slide the pattern over text one by one
        for (int i = 1; i <= n - m; i++) {
            textHash = recalculateHash(text, i - 1, i + m - 1, textHash, m);
            
            cout << "Position " << i << ": Rolling hash = " << textHash;
            
            if (patternHash == textHash) {
                if (checkEqual(text, i, pattern, 0, m)) {
                    cout << " -> Hash match + String match = FOUND!" << endl;
                    matches.push_back(i);
                } else {
                    cout << " -> Hash match but string mismatch (spurious hit)" << endl;
                }
            } else {
                cout << " -> Hash mismatch" << endl;
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
    cout << "=== Rabin-Karp Algorithm ===" << endl;
    
    string text = "GEEKS FOR GEEKS";
    string pattern = "GEEK";
    
    RabinKarp rk;
    vector<int> matches = rk.search(text, pattern);
    rk.printMatches(matches);
    
    return 0;
}`,
    c: `/**
 * Rabin-Karp Algorithm - C Implementation
 * Rolling hash string matching algorithm
 */

#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define PRIME 101
#define BASE 256
#define MAX_MATCHES 100

long long calculateHash(char* str, int len) {
    long long hash = 0;
    for (int i = 0; i < len; i++) {
        hash = (hash * BASE + str[i]) % PRIME;
    }
    return hash;
}

long long recalculateHash(char* str, int oldIndex, int newIndex, 
                         long long oldHash, int patternLen) {
    long long newHash = oldHash;
    long long h = 1;
    
    // Calculate BASE^(patternLen-1) % PRIME
    for (int i = 0; i < patternLen - 1; i++) {
        h = (h * BASE) % PRIME;
    }
    
    // Remove leading character
    newHash = (newHash - (str[oldIndex] * h) % PRIME + PRIME) % PRIME;
    
    // Add trailing character
    newHash = (newHash * BASE + str[newIndex]) % PRIME;
    
    return newHash;
}

bool checkEqual(char* str1, int start1, char* str2, int start2, int len) {
    for (int i = 0; i < len; i++) {
        if (str1[start1 + i] != str2[start2 + i]) {
            return false;
        }
    }
    return true;
}

int rabinKarpSearch(char* text, char* pattern, int matches[]) {
    int n = strlen(text);
    int m = strlen(pattern);
    int matchCount = 0;
    
    if (m > n) return 0;
    
    printf("Searching for pattern '%s' in text '%s'\\n", pattern, text);
    printf("Using BASE = %d, PRIME = %d\\n\\n", BASE, PRIME);
    
    long long patternHash = calculateHash(pattern, m);
    long long textHash = calculateHash(text, m);
    
    printf("Pattern hash: %lld\\n", patternHash);
    printf("Initial text hash: %lld\\n\\n", textHash);
    
    // Check first window
    printf("Checking position 0: ");
    if (patternHash == textHash && checkEqual(text, 0, pattern, 0, m)) {
        printf("Hash match + String match = FOUND!\\n");
        matches[matchCount++] = 0;
    } else if (patternHash == textHash) {
        printf("Hash match but string mismatch (spurious hit)\\n");
    } else {
        printf("Hash mismatch\\n");
    }
    
    // Slide the pattern over text one by one
    for (int i = 1; i <= n - m; i++) {
        textHash = recalculateHash(text, i - 1, i + m - 1, textHash, m);
        
        printf("Position %d: Rolling hash = %lld", i, textHash);
        
        if (patternHash == textHash) {
            if (checkEqual(text, i, pattern, 0, m)) {
                printf(" -> Hash match + String match = FOUND!\\n");
                matches[matchCount++] = i;
            } else {
                printf(" -> Hash match but string mismatch (spurious hit)\\n");
            }
        } else {
            printf(" -> Hash mismatch\\n");
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
    printf("=== Rabin-Karp Algorithm ===\\n");
    
    char text[] = "GEEKS FOR GEEKS";
    char pattern[] = "GEEK";
    int matches[MAX_MATCHES];
    
    int matchCount = rabinKarpSearch(text, pattern, matches);
    printMatches(matches, matchCount);
    
    return 0;
}`,
    python: `"""
Rabin-Karp Algorithm - Python Implementation
Rolling hash string matching algorithm
"""

from typing import List

class RabinKarp:
    def __init__(self):
        self.PRIME = 101
        self.BASE = 256
    
    def calculate_hash(self, string: str, length: int) -> int:
        hash_value = 0
        for i in range(length):
            hash_value = (hash_value * self.BASE + ord(string[i])) % self.PRIME
        return hash_value
    
    def recalculate_hash(self, string: str, old_index: int, new_index: int, 
                        old_hash: int, pattern_len: int) -> int:
        new_hash = old_hash
        
        # Calculate BASE^(pattern_len-1) % PRIME
        h = pow(self.BASE, pattern_len - 1, self.PRIME)
        
        # Remove leading character
        new_hash = (new_hash - (ord(string[old_index]) * h) % self.PRIME + self.PRIME) % self.PRIME
        
        # Add trailing character
        new_hash = (new_hash * self.BASE + ord(string[new_index])) % self.PRIME
        
        return new_hash
    
    def check_equal(self, str1: str, start1: int, str2: str, start2: int, length: int) -> bool:
        for i in range(length):
            if str1[start1 + i] != str2[start2 + i]:
                return False
        return True
    
    def search(self, text: str, pattern: str) -> List[int]:
        matches = []
        n, m = len(text), len(pattern)
        
        if m > n:
            return matches
        
        print(f"Searching for pattern '{pattern}' in text '{text}'")
        print(f"Using BASE = {self.BASE}, PRIME = {self.PRIME}\\n")
        
        pattern_hash = self.calculate_hash(pattern, m)
        text_hash = self.calculate_hash(text, m)
        
        print(f"Pattern hash: {pattern_hash}")
        print(f"Initial text hash: {text_hash}\\n")
        
        # Check first window
        print("Checking position 0: ", end="")
        if pattern_hash == text_hash and self.check_equal(text, 0, pattern, 0, m):
            print("Hash match + String match = FOUND!")
            matches.append(0)
        elif pattern_hash == text_hash:
            print("Hash match but string mismatch (spurious hit)")
        else:
            print("Hash mismatch")
        
        # Slide the pattern over text one by one
        for i in range(1, n - m + 1):
            text_hash = self.recalculate_hash(text, i - 1, i + m - 1, text_hash, m)
            
            print(f"Position {i}: Rolling hash = {text_hash}", end="")
            
            if pattern_hash == text_hash:
                if self.check_equal(text, i, pattern, 0, m):
                    print(" -> Hash match + String match = FOUND!")
                    matches.append(i)
                else:
                    print(" -> Hash match but string mismatch (spurious hit)")
            else:
                print(" -> Hash mismatch")
        
        return matches
    
    def print_matches(self, matches: List[int]) -> None:
        if not matches:
            print("\\nNo matches found.")
        else:
            print(f"\\nPattern found at positions: {' '.join(map(str, matches))}")

def main() -> None:
    print("=== Rabin-Karp Algorithm ===")
    
    text = "GEEKS FOR GEEKS"
    pattern = "GEEK"
    
    rk = RabinKarp()
    matches = rk.search(text, pattern)
    rk.print_matches(matches)

if __name__ == "__main__":
    main()`,
    java: `/**
 * Rabin-Karp Algorithm - Java Implementation
 * Rolling hash string matching algorithm
 */

import java.util.*;

public class RabinKarp {
    private static final int PRIME = 101;
    private static final int BASE = 256;
    
    private long calculateHash(String str, int len) {
        long hash = 0;
        for (int i = 0; i < len; i++) {
            hash = (hash * BASE + str.charAt(i)) % PRIME;
        }
        return hash;
    }
    
    private long recalculateHash(String str, int oldIndex, int newIndex, 
                               long oldHash, int patternLen) {
        long newHash = oldHash;
        long h = 1;
        
        // Calculate BASE^(patternLen-1) % PRIME
        for (int i = 0; i < patternLen - 1; i++) {
            h = (h * BASE) % PRIME;
        }
        
        // Remove leading character
        newHash = (newHash - (str.charAt(oldIndex) * h) % PRIME + PRIME) % PRIME;
        
        // Add trailing character
        newHash = (newHash * BASE + str.charAt(newIndex)) % PRIME;
        
        return newHash;
    }
    
    private boolean checkEqual(String str1, int start1, String str2, 
                             int start2, int len) {
        for (int i = 0; i < len; i++) {
            if (str1.charAt(start1 + i) != str2.charAt(start2 + i)) {
                return false;
            }
        }
        return true;
    }
    
    public List<Integer> search(String text, String pattern) {
        List<Integer> matches = new ArrayList<>();
        int n = text.length();
        int m = pattern.length();
        
        if (m > n) return matches;
        
        System.out.println("Searching for pattern '" + pattern + "' in text '" + text + "'");
        System.out.println("Using BASE = " + BASE + ", PRIME = " + PRIME + "\\n");
        
        long patternHash = calculateHash(pattern, m);
        long textHash = calculateHash(text, m);
        
        System.out.println("Pattern hash: " + patternHash);
        System.out.println("Initial text hash: " + textHash + "\\n");
        
        // Check first window
        System.out.print("Checking position 0: ");
        if (patternHash == textHash && checkEqual(text, 0, pattern, 0, m)) {
            System.out.println("Hash match + String match = FOUND!");
            matches.add(0);
        } else if (patternHash == textHash) {
            System.out.println("Hash match but string mismatch (spurious hit)");
        } else {
            System.out.println("Hash mismatch");
        }
        
        // Slide the pattern over text one by one
        for (int i = 1; i <= n - m; i++) {
            textHash = recalculateHash(text, i - 1, i + m - 1, textHash, m);
            
            System.out.print("Position " + i + ": Rolling hash = " + textHash);
            
            if (patternHash == textHash) {
                if (checkEqual(text, i, pattern, 0, m)) {
                    System.out.println(" -> Hash match + String match = FOUND!");
                    matches.add(i);
                } else {
                    System.out.println(" -> Hash match but string mismatch (spurious hit)");
                }
            } else {
                System.out.println(" -> Hash mismatch");
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
        System.out.println("=== Rabin-Karp Algorithm ===");
        
        String text = "GEEKS FOR GEEKS";
        String pattern = "GEEK";
        
        RabinKarp rk = new RabinKarp();
        List<Integer> matches = rk.search(text, pattern);
        rk.printMatches(matches);
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ecfeff, #a5f3fc, #67e8f9)',
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
        Rabin-Karp Algorithm Code
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
                  {selectedLanguage === 'cpp' ? 'rabin_karp.cpp' : 
                   selectedLanguage === 'c' ? 'rabin_karp.c' :
                   selectedLanguage === 'python' ? 'rabin_karp.py' : 'RabinKarp.java'}
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

export default RabinKarpCode;