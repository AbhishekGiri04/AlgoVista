import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const StackCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Stack Data Structure - C++ Implementation
 * Last-In-First-Out (LIFO) structure
 */

#include <iostream>
#include <stack>
using namespace std;

class Stack {
private:
    stack<int> st;
    
public:
    void push(int element) {
        st.push(element);
        cout << "Pushed " << element << endl;
    }
    
    void pop() {
        if (!st.empty()) {
            cout << "Popped " << st.top() << endl;
            st.pop();
        } else {
            cout << "Stack is empty!" << endl;
        }
    }
    
    int top() {
        if (!st.empty()) {
            return st.top();
        } else {
            cout << "Stack is empty!" << endl;
            return -1;
        }
    }
    
    bool isEmpty() {
        return st.empty();
    }
    
    int size() {
        return st.size();
    }
    
    void display() {
        if (st.empty()) {
            cout << "Stack is empty!" << endl;
            return;
        }
        
        stack<int> temp = st;
        cout << "Stack (top to bottom): ";
        while (!temp.empty()) {
            cout << temp.top() << " ";
            temp.pop();
        }
        cout << endl;
    }
};

int main() {
    cout << "=== Stack Data Structure ===" << endl;
    Stack s;
    
    s.push(10);
    s.push(20);
    s.push(30);
    s.display();
    
    cout << "Top element: " << s.top() << endl;
    cout << "Stack size: " << s.size() << endl;
    
    s.pop();
    s.display();
    
    return 0;
}`,
    c: `/**
 * Stack Data Structure - C Implementation
 * Last-In-First-Out (LIFO) structure using array
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int data[MAX_SIZE];
    int top;
} Stack;

Stack* createStack() {
    Stack* stack = (Stack*)malloc(sizeof(Stack));
    stack->top = -1;
    return stack;
}

void push(Stack* stack, int element) {
    if (stack->top >= MAX_SIZE - 1) {
        printf("Stack overflow!\n");
        return;
    }
    stack->data[++stack->top] = element;
    printf("Pushed %d\n", element);
}

void pop(Stack* stack) {
    if (stack->top < 0) {
        printf("Stack is empty!\n");
        return;
    }
    printf("Popped %d\n", stack->data[stack->top]);
    stack->top--;
}

int top(Stack* stack) {
    if (stack->top < 0) {
        printf("Stack is empty!\n");
        return -1;
    }
    return stack->data[stack->top];
}

bool isEmpty(Stack* stack) {
    return stack->top < 0;
}

int size(Stack* stack) {
    return stack->top + 1;
}

void display(Stack* stack) {
    if (isEmpty(stack)) {
        printf("Stack is empty!\n");
        return;
    }
    
    printf("Stack (top to bottom): ");
    for (int i = stack->top; i >= 0; i--) {
        printf("%d ", stack->data[i]);
    }
    printf("\n");
}

int main() {
    printf("=== Stack Data Structure ===\n");
    Stack* s = createStack();
    
    push(s, 10);
    push(s, 20);
    push(s, 30);
    display(s);
    
    printf("Top element: %d\n", top(s));
    printf("Stack size: %d\n", size(s));
    
    pop(s);
    display(s);
    
    free(s);
    return 0;
}`,
    python: `"""
Stack Data Structure - Python Implementation
Last-In-First-Out (LIFO) structure using list
"""

from typing import List, Optional

class Stack:
    def __init__(self):
        self.data: List[int] = []
    
    def push(self, element: int) -> None:
        self.data.append(element)
        print(f"Pushed {element}")
    
    def pop(self) -> Optional[int]:
        if self.is_empty():
            print("Stack is empty!")
            return None
        
        element = self.data.pop()
        print(f"Popped {element}")
        return element
    
    def top(self) -> Optional[int]:
        if self.is_empty():
            print("Stack is empty!")
            return None
        return self.data[-1]
    
    def is_empty(self) -> bool:
        return len(self.data) == 0
    
    def size(self) -> int:
        return len(self.data)
    
    def display(self) -> None:
        if self.is_empty():
            print("Stack is empty!")
            return
        
        elements = ' '.join(str(x) for x in reversed(self.data))
        print(f"Stack (top to bottom): {elements}")

def main() -> None:
    print("=== Stack Data Structure ===")
    stack = Stack()
    
    stack.push(10)
    stack.push(20)
    stack.push(30)
    stack.display()
    
    print(f"Top element: {stack.top()}")
    print(f"Stack size: {stack.size()}")
    
    stack.pop()
    stack.display()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Stack Data Structure - Java Implementation
 * Last-In-First-Out (LIFO) structure using array
 */

public class Stack {
    private int[] data;
    private int top;
    private int capacity;
    
    public Stack(int capacity) {
        this.capacity = capacity;
        this.data = new int[capacity];
        this.top = -1;
    }
    
    public void push(int element) {
        if (top >= capacity - 1) {
            System.out.println("Stack overflow!");
            return;
        }
        data[++top] = element;
        System.out.println("Pushed " + element);
    }
    
    public void pop() {
        if (isEmpty()) {
            System.out.println("Stack is empty!");
            return;
        }
        System.out.println("Popped " + data[top]);
        top--;
    }
    
    public int top() {
        if (isEmpty()) {
            System.out.println("Stack is empty!");
            return -1;
        }
        return data[top];
    }
    
    public boolean isEmpty() {
        return top < 0;
    }
    
    public int size() {
        return top + 1;
    }
    
    public void display() {
        if (isEmpty()) {
            System.out.println("Stack is empty!");
            return;
        }
        
        System.out.print("Stack (top to bottom): ");
        for (int i = top; i >= 0; i--) {
            System.out.print(data[i] + " ");
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        System.out.println("=== Stack Data Structure ===");
        Stack s = new Stack(100);
        
        s.push(10);
        s.push(20);
        s.push(30);
        s.display();
        
        System.out.println("Top element: " + s.top());
        System.out.println("Stack size: " + s.size());
        
        s.pop();
        s.display();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff, #c084fc)',
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
        Stack Code
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
                  {selectedLanguage === 'cpp' ? 'stack.cpp' : 
                   selectedLanguage === 'c' ? 'stack.c' :
                   selectedLanguage === 'python' ? 'stack.py' : 'Stack.java'}
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

export default StackCode;