import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const MergeSortCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Merge Sort Algorithm - C++ Implementation
 * Time Complexity: O(n log n) | Space Complexity: O(n)
 * Divide and conquer approach with merging
 */

#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;

class MergeSort {
private:
    static void merge(vector<int>& arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        vector<int> L(n1), R(n2);
        
        // Copy data to temp arrays
        for (int i = 0; i < n1; i++)
            L[i] = arr[left + i];
        for (int j = 0; j < n2; j++)
            R[j] = arr[mid + 1 + j];
        
        // Merge the temp arrays back
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        
        // Copy remaining elements
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }
    
public:
    static void sort(vector<int>& arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            
            sort(arr, left, mid);
            sort(arr, mid + 1, right);
            
            merge(arr, left, mid, right);
        }
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
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90, 5};
    
    cout << "=== Merge Sort Algorithm ===" << endl;
    MergeSort::printArray(arr, "Original Array");
    
    MergeSort::sort(arr, 0, arr.size() - 1);
    
    MergeSort::printArray(arr, "Sorted Array  ");
    cout << "\nSorting completed successfully!" << endl;
    
    return 0;
}`,
    c: `/**
 * Merge Sort Algorithm - C Implementation
 * Time Complexity: O(n log n) | Space Complexity: O(n)
 * Divide and conquer sorting in C
 */

#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    int* L = (int*)malloc(n1 * sizeof(int));
    int* R = (int*)malloc(n2 * sizeof(int));
    
    // Copy data to temp arrays
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    
    // Merge the temp arrays back
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy remaining elements
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    
    free(L);
    free(R);
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        merge(arr, left, mid, right);
    }
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
    int arr[] = {64, 34, 25, 12, 22, 11, 90, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("=== Merge Sort Algorithm ===\n");
    printArray(arr, n, "Original Array");
    
    mergeSort(arr, 0, n - 1);
    
    printArray(arr, n, "Sorted Array  ");
    printf("\nSorting completed successfully!\n");
    
    return 0;
}`,
    python: `"""
Merge Sort Algorithm - Python Implementation
Time Complexity: O(n log n) | Space Complexity: O(n)
Divide and conquer with efficient merging
"""

from typing import List

class MergeSort:
    @staticmethod
    def sort(arr: List[int]) -> None:
        if len(arr) > 1:
            mid = len(arr) // 2
            left_half = arr[:mid]
            right_half = arr[mid:]
            
            # Recursively sort both halves
            MergeSort.sort(left_half)
            MergeSort.sort(right_half)
            
            # Merge the sorted halves
            MergeSort._merge(arr, left_half, right_half)
    
    @staticmethod
    def _merge(arr: List[int], left: List[int], right: List[int]) -> None:
        i = j = k = 0
        
        # Compare and merge
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        
        # Copy remaining elements
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1
    
    @staticmethod
    def print_array(arr: List[int], label: str) -> None:
        formatted_arr = ', '.join(f'{num:3d}' for num in arr)
        print(f"{label}: [{formatted_arr}]")

def main() -> None:
    test_array = [64, 34, 25, 12, 22, 11, 90, 5]
    
    print("=== Merge Sort Algorithm ===")
    MergeSort.print_array(test_array, "Original Array")
    
    MergeSort.sort(test_array)
    
    MergeSort.print_array(test_array, "Sorted Array  ")
    print("\nSorting completed successfully!")

if __name__ == "__main__":
    main()`,
    java: `/**
 * Merge Sort Algorithm - Java Implementation
 * Time Complexity: O(n log n) | Space Complexity: O(n)
 * Divide and conquer sorting algorithm
 */

public class MergeSort {
    
    public static void sort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            
            sort(arr, left, mid);
            sort(arr, mid + 1, right);
            
            merge(arr, left, mid, right);
        }
    }
    
    private static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        // Copy data to temp arrays
        System.arraycopy(arr, left, L, 0, n1);
        System.arraycopy(arr, mid + 1, R, 0, n2);
        
        // Merge the temp arrays back
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        
        // Copy remaining elements
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
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
        int[] testArray = {64, 34, 25, 12, 22, 11, 90, 5};
        
        System.out.println("=== Merge Sort Algorithm ===");
        printArray(testArray, "Original Array");
        
        sort(testArray, 0, testArray.length - 1);
        
        printArray(testArray, "Sorted Array");
        System.out.println("\nSorting completed successfully!");
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #fecfef)',
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
        Merge Sort Code
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
                  {selectedLanguage === 'cpp' ? 'merge_sort.cpp' : 
                   selectedLanguage === 'c' ? 'merge_sort.c' :
                   selectedLanguage === 'python' ? 'merge_sort.py' : 'MergeSort.java'}
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

export default MergeSortCode;