import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const ExponentialSearchCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Exponential Search Algorithm - C++ Implementation
 * Time Complexity: O(log n) | Space Complexity: O(1)
 * Exponential bounds with binary search
 */

#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;

class ExponentialSearch {
private:
    static int binarySearch(const vector<int>& arr, int left, int right, int target) {
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            }
            
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
    
public:
    static int search(const vector<int>& arr, int target) {
        if (arr[0] == target) {
            return 0;
        }
        
        // Find range for binary search by repeated doubling
        int i = 1;
        while (i < arr.size() && arr[i] <= target) {
            i = i * 2;
        }
        
        // Call binary search for the found range
        return binarySearch(arr, i / 2, min(i, (int)arr.size() - 1), target);
    }
    
    static void printArray(const vector<int>& arr, const string& label) {
        cout << label << ": ";
        for (size_t i = 0; i < arr.size(); i++) {
            cout << setw(3) << arr[i];
            if (i < arr.size() - 1) cout << ", ";
        }
        cout << endl;
    }
};

int main() {
    vector<int> arr = {2, 3, 4, 10, 40, 50, 80, 100};
    int target = 10;
    
    cout << "=== Exponential Search Algorithm ===" << endl;
    ExponentialSearch::printArray(arr, "Sorted Array");
    cout << "Target: " << target << endl << endl;
    
    int result = ExponentialSearch::search(arr, target);
    
    if (result != -1) {
        cout << "Element " << target << " found at index " << result << endl;
    } else {
        cout << "Element " << target << " not found" << endl;
    }
    
    return 0;
}`,
    c: `/**
 * Exponential Search Algorithm - C Implementation
 * Time Complexity: O(log n) | Space Complexity: O(1)
 * Exponential bounds with binary search in C
 */

#include <stdio.h>

int min(int a, int b) {
    return (a < b) ? a : b;
}

int binarySearch(int arr[], int left, int right, int target) {
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        }
        
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

int exponentialSearch(int arr[], int n, int target) {
    if (arr[0] == target) {
        return 0;
    }
    
    // Find range for binary search by repeated doubling
    int i = 1;
    while (i < n && arr[i] <= target) {
        i = i * 2;
    }
    
    // Call binary search for the found range
    return binarySearch(arr, i / 2, min(i, n - 1), target);
}

void printArray(int arr[], int size, const char* label) {
    printf("%s: ", label);
    for (int i = 0; i < size; i++) {
        printf("%3d", arr[i]);
        if (i < size - 1) printf(", ");
    }
    printf("\n");
}

int main() {
    int arr[] = {2, 3, 4, 10, 40, 50, 80, 100};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 10;
    
    printf("=== Exponential Search Algorithm ===\n");
    printArray(arr, n, "Sorted Array");
    printf("Target: %d\n\n", target);
    
    int result = exponentialSearch(arr, n, target);
    
    if (result != -1) {
        printf("Element %d found at index %d\n", target, result);
    } else {
        printf("Element %d not found\n", target);
    }
    
    return 0;
}`,
    python: `"""
Exponential Search Algorithm - Python Implementation
Time Complexity: O(log n) | Space Complexity: O(1)
Exponential bounds followed by binary search
"""

from typing import List, Optional

class ExponentialSearch:
    @staticmethod
    def _binary_search(arr: List[int], left: int, right: int, target: int) -> int:
        while left <= right:
            mid = left + (right - left) // 2
            
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1
    
    @staticmethod
    def search(arr: List[int], target: int) -> Optional[int]:
        if arr[0] == target:
            return 0
        
        # Find range for binary search by repeated doubling
        i = 1
        while i < len(arr) and arr[i] <= target:
            i *= 2
        
        # Call binary search for the found range
        return ExponentialSearch._binary_search(
            arr, i // 2, min(i, len(arr) - 1), target
        )
    
    @staticmethod
    def print_array(arr: List[int], label: str) -> None:
        formatted_arr = ', '.join(f'{num:3d}' for num in arr)
        print(f"{label}: [{formatted_arr}]")

def main() -> None:
    test_array = [2, 3, 4, 10, 40, 50, 80, 100]
    target = 10
    
    print("=== Exponential Search Algorithm ===")
    ExponentialSearch.print_array(test_array, "Sorted Array")
    print(f"Target: {target}\n")
    
    result = ExponentialSearch.search(test_array, target)
    
    if result != -1:
        print(f"Element {target} found at index {result}")
    else:
        print(f"Element {target} not found")

if __name__ == "__main__":
    main()`,
    java: `/**
 * Exponential Search Algorithm - Java Implementation
 * Time Complexity: O(log n) | Space Complexity: O(1)
 * Exponential bounds with binary search
 */

public class ExponentialSearch {
    
    private static int binarySearch(int[] arr, int left, int right, int target) {
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            }
            
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
    
    public static int search(int[] arr, int target) {
        if (arr[0] == target) {
            return 0;
        }
        
        // Find range for binary search by repeated doubling
        int i = 1;
        while (i < arr.length && arr[i] <= target) {
            i = i * 2;
        }
        
        // Call binary search for the found range
        return binarySearch(arr, i / 2, Math.min(i, arr.length - 1), target);
    }
    
    public static void printArray(int[] arr, String label) {
        System.out.printf("%-12s: ", label);
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            System.out.printf("%3d", arr[i]);
            if (i < arr.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println("]");
    }
    
    public static void main(String[] args) {
        int[] testArray = {2, 3, 4, 10, 40, 50, 80, 100};
        int target = 10;
        
        System.out.println("=== Exponential Search Algorithm ===");
        printArray(testArray, "Sorted Array");
        System.out.println("Target: " + target + "\n");
        
        int result = search(testArray, target);
        
        if (result != -1) {
            System.out.println("Element " + target + " found at index " + result);
        } else {
            System.out.println("Element " + target + " not found");
        }
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fdf2f8, #fce7f3, #f9a8d4)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/searchingalgorithms" style={{
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
        ← Back to Searching Algorithms
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Exponential Search Code
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
                  {selectedLanguage === 'cpp' ? 'exponential_search.cpp' : 
                   selectedLanguage === 'c' ? 'exponential_search.c' :
                   selectedLanguage === 'python' ? 'exponential_search.py' : 'ExponentialSearch.java'}
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

export default ExponentialSearchCode;