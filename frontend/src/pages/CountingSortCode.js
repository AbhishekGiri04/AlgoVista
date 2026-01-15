import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const CountingSortCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Counting Sort Algorithm - C++ Implementation
 * Time Complexity: O(n²) | Space Complexity: O(1)
 * Stable sorting algorithm with in-place comparison
 */

#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;

class CountingSort {
public:
    /**
     * Add element to array
     */
    static void addElement(vector<int>& arr, int element) {
        arr.push_back(element);
        cout << "Added " << element << " to array" << endl;
    }
    
    /**
     * Remove element at index
     */
    static void removeElement(vector<int>& arr, int index) {
        if (index >= 0 && index < arr.size()) {
            cout << "Removed " << arr[index] << " from array" << endl;
            arr.erase(arr.begin() + index);
        }
    }
    
    /**
     * Update element at index
     */
    static void updateElement(vector<int>& arr, int index, int newValue) {
        if (index >= 0 && index < arr.size()) {
            cout << "Updated arr[" << index << "]: " << arr[index] << " -> " << newValue << endl;
            arr[index] = newValue;
        }
    }
    
    /**
     * Sorts array using bubble sort algorithm
     * @param arr Reference to vector to be sorted
     */
    
    /**
     * Generate random array
     */
    static void generateRandom(vector<int>& arr, int size) {
        arr.clear();
        for (int i = 0; i < size; i++) {
            arr.push_back(rand() % 100 + 1);
        }
        cout << "Generated random array of size " << size << endl;
    }
    
    static void sort(vector<int>& arr) {
        int n = arr.size();
        bool swapped;
        
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            
            // Last i elements are already sorted
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                    swapped = true;
                }
            }
            
            // If no swapping occurred, array is sorted
            if (!swapped) break;
        }
    }
    
    /**
     * Utility function to print array
     */
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
    // Test data
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90, 5};
    
    cout << "=== Counting Sort Algorithm ==="  << endl;
    CountingSort::printArray(arr, "Original Array");
    
    CountingSort::addElement(arr, 15);
    CountingSort::updateElement(arr, 0, 70);
    CountingSort::printArray(arr, "Modified Array");
    
    CountingSort::sort(arr);
    
    CountingSort::printArray(arr, "Sorted Array  ");
    
    CountingSort::removeElement(arr, 0);
    CountingSort::printArray(arr, "After Removal ");
    
    cout << "Sorting completed successfully!" << endl;
    
    return 0;
}`,
    c: `/**
 * Counting Sort Algorithm - C Implementation
 * Time Complexity: O(n²) | Space Complexity: O(1)
 * Classic implementation with optimization
 */

#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

#define MAX_SIZE 100

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void addElement(int arr[], int* n, int element) {
    if (*n < MAX_SIZE) {
        arr[*n] = element;
        (*n)++;
        printf("Added %d to array", element);
    }
}

void removeElement(int arr[], int* n, int index) {
    if (index >= 0 && index < *n) {
        printf("Removed %d from array", arr[index]);
        for (int i = index; i < *n - 1; i++) {
            arr[i] = arr[i + 1];
        }
        (*n)--;
    }
}

void updateElement(int arr[], int n, int index, int newValue) {
    if (index >= 0 && index < n) {
        printf("Updated arr[%d]: %d -> %d", index, arr[index], newValue);
        arr[index] = newValue;
    }
}

void countingSort(int arr[], int n) {
    bool swapped;
    
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
}

void printArray(int arr[], int size, const char* label) {
    printf("%s: ", label);
    for (int i = 0; i < size; i++) {
        printf("%3d", arr[i]);
        if (i < size - 1) printf(", ");
    }
}

int main() {
    int arr[MAX_SIZE] = {64, 34, 25, 12, 22, 11, 90, 5};
    int n = 8;
    
    printf("=== Counting Sort Algorithm ===");
    printArray(arr, n, "Original Array");
    
    addElement(arr, &n, 15);
    updateElement(arr, n, 0, 70);
    printArray(arr, n, "Modified Array");
    
    countingSort(arr, n);
    printArray(arr, n, "Sorted Array  ");
    
    removeElement(arr, &n, 0);
    printArray(arr, n, "After Removal ");
    
    printf("Sorting completed successfully!");
    return 0;
}`,
    python: `"""
Counting Sort Algorithm - Python Implementation
Time Complexity: O(n²) | Space Complexity: O(1)
Pythonic implementation with type hints and documentation
"""

from typing import List

class CountingSort:
    """
    Professional implementation of Counting Sort algorithm
    """
    
    @staticmethod
    def add_element(arr: List[int], element: int) -> None:
        arr.append(element)
        print(f"Added {element} to array")
    
    @staticmethod
    def remove_element(arr: List[int], index: int) -> None:
        if 0 <= index < len(arr):
            removed = arr.pop(index)
            print(f"Removed {removed} from array")
    
    @staticmethod
    def update_element(arr: List[int], index: int, new_value: int) -> None:
        if 0 <= index < len(arr):
            print(f"Updated arr[{index}]: {arr[index]} -> {new_value}")
            arr[index] = new_value
    
    @staticmethod
    def sort(arr: List[int]) -> None:
        n = len(arr)
        
        for i in range(n - 1):
            swapped = False
            
            for j in range(n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    swapped = True
            
            if not swapped:
                break
    
    @staticmethod
    def print_array(arr: List[int], label: str) -> None:
        formatted_arr = ', '.join(f'{num:3d}' for num in arr)
        print(f"{label}: [{formatted_arr}]")

def main() -> None:
    test_array = [64, 34, 25, 12, 22, 11, 90, 5]
    
    print("=== Counting Sort Algorithm ===")
    CountingSort.print_array(test_array, "Original Array")
    
    CountingSort.add_element(test_array, 15)
    CountingSort.update_element(test_array, 0, 70)
    CountingSort.print_array(test_array, "Modified Array")
    
    CountingSort.sort(test_array)
    CountingSort.print_array(test_array, "Sorted Array  ")
    
    CountingSort.remove_element(test_array, 0)
    CountingSort.print_array(test_array, "After Removal ")
    
    print("Sorting completed successfully!")

if __name__ == "__main__":
    main()`,
    java: `/**
 * Counting Sort Algorithm - Java Implementation
 * Time Complexity: O(n²) | Space Complexity: O(1)
 * Professional object-oriented implementation
 * 
 * @author Algorithm Visualizer
 * @version 1.0
 */

import java.util.Arrays;
import java.util.ArrayList;

public class CountingSort {
    
    public static void addElement(ArrayList<Integer> arr, int element) {
        arr.add(element);
        System.out.println("Added " + element + " to array");
    }
    
    public static void removeElement(ArrayList<Integer> arr, int index) {
        if (index >= 0 && index < arr.size()) {
            int removed = arr.remove(index);
            System.out.println("Removed " + removed + " from array");
        }
    }
    
    public static void updateElement(ArrayList<Integer> arr, int index, int newValue) {
        if (index >= 0 && index < arr.size()) {
            System.out.println("Updated arr[" + index + "]: " + arr.get(index) + " -> " + newValue);
            arr.set(index, newValue);
        }
    }
    
    public static void sort(ArrayList<Integer> arr) {
        int n = arr.size();
        boolean swapped;
        
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            
            for (int j = 0; j < n - i - 1; j++) {
                if (arr.get(j) > arr.get(j + 1)) {
                    int temp = arr.get(j);
                    arr.set(j, arr.get(j + 1));
                    arr.set(j + 1, temp);
                    swapped = true;
                }
            }
            
            if (!swapped) break;
        }
    }
    
    public static void printArray(ArrayList<Integer> arr, String label) {
        System.out.printf("%-15s: [", label);
        for (int i = 0; i < arr.size(); i++) {
            System.out.printf("%3d", arr.get(i));
            if (i < arr.size() - 1) System.out.print(", ");
        }
        System.out.println("]");
    }
    
    public static void main(String[] args) {
        ArrayList<Integer> testArray = new ArrayList<>(Arrays.asList(64, 34, 25, 12, 22, 11, 90, 5));
        
        System.out.println("=== Counting Sort Algorithm ===");
        printArray(testArray, "Original Array");
        
        addElement(testArray, 15);
        updateElement(testArray, 0, 70);
        printArray(testArray, "Modified Array");
        
        sort(testArray);
        printArray(testArray, "Sorted Array");
        
        removeElement(testArray, 0);
        printArray(testArray, "After Removal");
        
        System.out.println("Sorting completed successfully!");
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f3f0ff, #e9d5ff, #ddd6fe)',
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
                position: 'relative',
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

export default CountingSortCode;