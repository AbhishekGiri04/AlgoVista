import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const CountingSortCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Counting Sort Algorithm - C++ Implementation
 * Time Complexity: O(n + k) | Space Complexity: O(k)
 * Non-comparison integer sorting algorithm
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

class CountingSort {
public:
    static void sort(vector<int>& arr) {
        if (arr.empty()) return;
        
        int max_val = *max_element(arr.begin(), arr.end());
        int min_val = *min_element(arr.begin(), arr.end());
        int range = max_val - min_val + 1;
        
        vector<int> count(range, 0);
        vector<int> output(arr.size());
        
        // Count occurrences
        for (int i = 0; i < arr.size(); i++)
            count[arr[i] - min_val]++;
        
        // Cumulative count
        for (int i = 1; i < count.size(); i++)
            count[i] += count[i - 1];
        
        // Build output array
        for (int i = arr.size() - 1; i >= 0; i--) {
            output[count[arr[i] - min_val] - 1] = arr[i];
            count[arr[i] - min_val]--;
        }
        
        // Copy back to original array
        for (int i = 0; i < arr.size(); i++)
            arr[i] = output[i];
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
    vector<int> arr = {4, 2, 2, 8, 3, 3, 1, 5};
    
    cout << "=== Counting Sort Algorithm ===" << endl;
    CountingSort::printArray(arr, "Original Array");
    
    CountingSort::sort(arr);
    
    CountingSort::printArray(arr, "Sorted Array  ");
    cout << "\nSorting completed successfully!" << endl;
    
    return 0;
}`,
    c: `/**
 * Counting Sort Algorithm - C Implementation
 * Time Complexity: O(n + k) | Space Complexity: O(k)
 * Non-comparison sorting for integers
 */

#include <stdio.h>
#include <stdlib.h>

int findMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}

int findMin(int arr[], int n) {
    int min = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] < min)
            min = arr[i];
    return min;
}

void countingSort(int arr[], int n) {
    int max_val = findMax(arr, n);
    int min_val = findMin(arr, n);
    int range = max_val - min_val + 1;
    
    int* count = (int*)calloc(range, sizeof(int));
    int* output = (int*)malloc(n * sizeof(int));
    
    // Count occurrences
    for (int i = 0; i < n; i++)
        count[arr[i] - min_val]++;
    
    // Cumulative count
    for (int i = 1; i < range; i++)
        count[i] += count[i - 1];
    
    // Build output array
    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i] - min_val] - 1] = arr[i];
        count[arr[i] - min_val]--;
    }
    
    // Copy back to original array
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
    
    free(count);
    free(output);
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
    int arr[] = {4, 2, 2, 8, 3, 3, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("=== Counting Sort Algorithm ===\n");
    printArray(arr, n, "Original Array");
    
    countingSort(arr, n);
    
    printArray(arr, n, "Sorted Array  ");
    printf("\nSorting completed successfully!\n");
    
    return 0;
}`,
    python: `"""
Counting Sort Algorithm - Python Implementation
Time Complexity: O(n + k) | Space Complexity: O(k)
Non-comparison integer sorting algorithm
"""

from typing import List

class CountingSort:
    @staticmethod
    def sort(arr: List[int]) -> None:
        if not arr:
            return
        
        max_val = max(arr)
        min_val = min(arr)
        range_val = max_val - min_val + 1
        
        # Count occurrences
        count = [0] * range_val
        for num in arr:
            count[num - min_val] += 1
        
        # Cumulative count
        for i in range(1, len(count)):
            count[i] += count[i - 1]
        
        # Build output array
        output = [0] * len(arr)
        for i in range(len(arr) - 1, -1, -1):
            output[count[arr[i] - min_val] - 1] = arr[i]
            count[arr[i] - min_val] -= 1
        
        # Copy back to original array
        for i in range(len(arr)):
            arr[i] = output[i]
    
    @staticmethod
    def print_array(arr: List[int], label: str) -> None:
        formatted_arr = ', '.join(f'{num:3d}' for num in arr)
        print(f"{label}: [{formatted_arr}]")

def main() -> None:
    test_array = [4, 2, 2, 8, 3, 3, 1, 5]
    
    print("=== Counting Sort Algorithm ===")
    CountingSort.print_array(test_array, "Original Array")
    
    CountingSort.sort(test_array)
    
    CountingSort.print_array(test_array, "Sorted Array  ")
    print("\nSorting completed successfully!")

if __name__ == "__main__":
    main()`,
    java: `/**
 * Counting Sort Algorithm - Java Implementation
 * Time Complexity: O(n + k) | Space Complexity: O(k)
 * Non-comparison integer sorting algorithm
 */

import java.util.Arrays;

public class CountingSort {
    
    public static void sort(int[] arr) {
        if (arr.length == 0) return;
        
        int maxVal = Arrays.stream(arr).max().getAsInt();
        int minVal = Arrays.stream(arr).min().getAsInt();
        int range = maxVal - minVal + 1;
        
        int[] count = new int[range];
        int[] output = new int[arr.length];
        
        // Count occurrences
        for (int i = 0; i < arr.length; i++)
            count[arr[i] - minVal]++;
        
        // Cumulative count
        for (int i = 1; i < count.length; i++)
            count[i] += count[i - 1];
        
        // Build output array
        for (int i = arr.length - 1; i >= 0; i--) {
            output[count[arr[i] - minVal] - 1] = arr[i];
            count[arr[i] - minVal]--;
        }
        
        // Copy back to original array
        System.arraycopy(output, 0, arr, 0, arr.length);
    }
    
    public static void printArray(int[] arr, String label) {
        System.out.printf("%-15s: ", label);
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
        int[] testArray = {4, 2, 2, 8, 3, 3, 1, 5};
        
        System.out.println("=== Counting Sort Algorithm ===");
        printArray(testArray, "Original Array");
        
        sort(testArray);
        
        printArray(testArray, "Sorted Array");
        System.out.println("\nSorting completed successfully!");
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #4facfe, #00f2fe, #43e97b)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/sortingalgorithms" style={{
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
        ← Back to Sorting Algorithms
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Counting Sort Code
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
                  {selectedLanguage === 'cpp' ? 'counting_sort.cpp' : 
                   selectedLanguage === 'c' ? 'counting_sort.c' :
                   selectedLanguage === 'python' ? 'counting_sort.py' : 'CountingSort.java'}
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

export default CountingSortCode;