import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const ArrayCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Array Data Structure - C++ Implementation
 * Contiguous memory storage with dynamic operations
 */

#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;

class Array {
private:
    vector<int> arr;
    int capacity;
    
public:
    Array(int size) : capacity(size) {
        arr.reserve(size);
    }
    
    void insert(int element, int index = -1) {
        if (arr.size() < capacity) {
            if (index == -1 || index >= arr.size()) {
                arr.push_back(element);
            } else {
                arr.insert(arr.begin() + index, element);
            }
            cout << "Inserted " << element << endl;
        } else {
            cout << "Array is full!" << endl;
        }
    }
    
    void deleteElement(int index) {
        if (index >= 0 && index < arr.size()) {
            cout << "Deleted " << arr[index] << endl;
            arr.erase(arr.begin() + index);
        } else {
            cout << "Invalid index!" << endl;
        }
    }
    
    void update(int index, int newValue) {
        if (index >= 0 && index < arr.size()) {
            cout << "Updated index " << index << ": " << arr[index] << " -> " << newValue << endl;
            arr[index] = newValue;
        } else {
            cout << "Invalid index!" << endl;
        }
    }
    
    void traverse() {
        cout << "Traversing array: ";
        for (size_t i = 0; i < arr.size(); i++) {
            cout << "arr[" << i << "] = " << arr[i];
            if (i < arr.size() - 1) cout << ", ";
        }
        cout << endl;
    }
    
    void display() {
        cout << "Array: ";
        for (size_t i = 0; i < arr.size(); i++) {
            cout << setw(3) << arr[i];
            if (i < arr.size() - 1) cout << ", ";
        }
        cout << endl;
    }
    
    int search(int element) {
        for (int i = 0; i < arr.size(); i++) {
            if (arr[i] == element) {
                return i;
            }
        }
        return -1;
    }
    
    int size() { return arr.size(); }
};

int main() {
    cout << "=== Array Data Structure ===" << endl;
    Array arr(5);
    
    arr.insert(10);
    arr.insert(20);
    arr.insert(30);
    arr.display();
    
    arr.update(1, 25);
    arr.display();
    
    cout << "Element 25 found at index: " << arr.search(25) << endl;
    
    arr.traverse();
    
    arr.deleteElement(1);
    arr.display();
    
    return 0;
}`,
    c: `/**
 * Array Data Structure - C Implementation
 * Contiguous memory storage with basic operations
 */

#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int* data;
    int size;
    int capacity;
} Array;

Array* createArray(int capacity) {
    Array* arr = (Array*)malloc(sizeof(Array));
    arr->data = (int*)malloc(capacity * sizeof(int));
    arr->size = 0;
    arr->capacity = capacity;
    return arr;
}

void insert(Array* arr, int element) {
    if (arr->size < arr->capacity) {
        arr->data[arr->size] = element;
        arr->size++;
        printf("Inserted %d", element);
    } else {
        printf("Array is full!");
    }
}

void deleteElement(Array* arr, int index) {
    if (index >= 0 && index < arr->size) {
        printf("Deleted %d", arr->data[index]);
        for (int i = index; i < arr->size - 1; i++) {
            arr->data[i] = arr->data[i + 1];
        }
        arr->size--;
    } else {
        printf("Invalid index!");
    }
}

void update(Array* arr, int index, int newValue) {
    if (index >= 0 && index < arr->size) {
        printf("Updated index %d: %d -> %d", index, arr->data[index], newValue);
        arr->data[index] = newValue;
    } else {
        printf("Invalid index!");
    }
}

void traverse(Array* arr) {
    printf("Traversing array: ");
    for (int i = 0; i < arr->size; i++) {
        printf("arr[%d] = %d", i, arr->data[i]);
        if (i < arr->size - 1) printf(", ");
    }
}

void display(Array* arr) {
    printf("Array: ");
    for (int i = 0; i < arr->size; i++) {
        printf("%3d", arr->data[i]);
        if (i < arr->size - 1) printf(", ");
    }
}

int search(Array* arr, int element) {
    for (int i = 0; i < arr->size; i++) {
        if (arr->data[i] == element) {
            return i;
        }
    }
    return -1;
}

void freeArray(Array* arr) {
    free(arr->data);
    free(arr);
}

int main() {
    printf("=== Array Data Structure ===");
    Array* arr = createArray(5);
    
    insert(arr, 10);
    insert(arr, 20);
    insert(arr, 30);
    display(arr);
    
    update(arr, 1, 25);
    display(arr);
    
    printf("Element 25 found at index: %d", search(arr, 25));
    
    traverse(arr);
    
    deleteElement(arr, 1);
    display(arr);
    
    freeArray(arr);
    return 0;
}`,
    python: `"""
Array Data Structure - Python Implementation
Contiguous memory storage using list
"""

from typing import List, Optional

class Array:
    def __init__(self, capacity: int):
        self.data: List[Optional[int]] = [None] * capacity
        self.size = 0
        self.capacity = capacity
    
    def insert(self, element: int) -> None:
        if self.size < self.capacity:
            self.data[self.size] = element
            self.size += 1
            print(f"Inserted {element}")
        else:
            print("Array is full!")
    
    def delete(self, index: int) -> None:
        if 0 <= index < self.size:
            print(f"Deleted {self.data[index]}")
            # Shift elements left
            for i in range(index, self.size - 1):
                self.data[i] = self.data[i + 1]
            self.data[self.size - 1] = None
            self.size -= 1
        else:
            print("Invalid index!")
    
    def update(self, index: int, newValue: int) -> None:
        if 0 <= index < self.size:
            print(f"Updated index {index}: {self.data[index]} -> {newValue}")
            self.data[index] = newValue
        else:
            print("Invalid index!")
    
    def traverse(self) -> None:
        print("Traversing array: ", end="")
        for i in range(self.size):
            print(f"arr[{i}] = {self.data[i]}", end="")
            if i < self.size - 1:
                print(", ", end="")
    
    def display(self) -> None:
        elements = [str(self.data[i]) for i in range(self.size)]
        print(f"Array: [{', '.join(f'{elem:>3}' for elem in elements)}]")
    
    def search(self, element: int) -> int:
        for i in range(self.size):
            if self.data[i] == element:
                return i
        return -1
    
    def get_size(self) -> int:
        return self.size

def main() -> None:
    print("=== Array Data Structure ===")
    arr = Array(5)
    
    arr.insert(10)
    arr.insert(20)
    arr.insert(30)
    arr.display()
    
    arr.update(1, 25)
    arr.display()
    
    print(f"Element 25 found at index: {arr.search(25)}")
    
    arr.traverse()
    
    arr.delete(1)
    arr.display()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Array Data Structure - Java Implementation
 * Contiguous memory storage with object-oriented design
 */

public class Array {
    private int[] data;
    private int size;
    private int capacity;
    
    public Array(int capacity) {
        this.capacity = capacity;
        this.data = new int[capacity];
        this.size = 0;
    }
    
    public void insert(int element) {
        if (size < capacity) {
            data[size] = element;
            size++;
            System.out.println("Inserted " + element);
        } else {
            System.out.println("Array is full!");
        }
    }
    
    public void delete(int index) {
        if (index >= 0 && index < size) {
            System.out.println("Deleted " + data[index]);
            // Shift elements left
            for (int i = index; i < size - 1; i++) {
                data[i] = data[i + 1];
            }
            size--;
        } else {
            System.out.println("Invalid index!");
        }
    }
    
    public void update(int index, int newValue) {
        if (index >= 0 && index < size) {
            System.out.println("Updated index " + index + ": " + data[index] + " -> " + newValue);
            data[index] = newValue;
        } else {
            System.out.println("Invalid index!");
        }
    }
    
    public void traverse() {
        System.out.print("Traversing array: ");
        for (int i = 0; i < size; i++) {
            System.out.print("arr[" + i + "] = " + data[i]);
            if (i < size - 1) {
                System.out.print(", ");
            }
        }
        System.out.println();
    }
    
    public void display() {
        System.out.print("Array: [");
        for (int i = 0; i < size; i++) {
            System.out.printf("%3d", data[i]);
            if (i < size - 1) {
                System.out.print(", ");
            }
        }
        System.out.println("]");
    }
    
    public int search(int element) {
        for (int i = 0; i < size; i++) {
            if (data[i] == element) {
                return i;
            }
        }
        return -1;
    }
    
    public int getSize() {
        return size;
    }
    
    public static void main(String[] args) {
        System.out.println("=== Array Data Structure ===");
        Array arr = new Array(5);
        
        arr.insert(10);
        arr.insert(20);
        arr.insert(30);
        arr.display();
        
        arr.update(1, 25);
        arr.display();
        
        System.out.println("Element 25 found at index: " + arr.search(25));
        
        arr.traverse();
        
        arr.delete(1);
        arr.display();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef7cd, #fde68a, #f59e0b)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/datastructures" style={{
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
        ← Back to Data Structures
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Array Code
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
                  {selectedLanguage === 'cpp' ? 'array.cpp' : 
                   selectedLanguage === 'c' ? 'array.c' :
                   selectedLanguage === 'python' ? 'array.py' : 'Array.java'}
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

export default ArrayCode;