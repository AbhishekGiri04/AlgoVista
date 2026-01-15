import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const QueueCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Queue Data Structure - C++ Implementation
 * First-In-First-Out (FIFO) structure
 */

#include <iostream>
#include <queue>
using namespace std;

class Queue {
private:
    queue<int> q;
    
public:
    void enqueue(int element) {
        q.push(element);
        cout << "Enqueued " << element << endl;
    }
    
    void dequeue() {
        if (!q.empty()) {
            cout << "Dequeued " << q.front() << endl;
            q.pop();
        } else {
            cout << "Queue is empty!" << endl;
        }
    }
    
    int front() {
        if (!q.empty()) {
            return q.front();
        } else {
            cout << "Queue is empty!" << endl;
            return -1;
        }
    }
    
    int peek() {
        if (!q.empty()) {
            return q.front();
        } else {
            cout << "Queue is empty!" << endl;
            return -1;
        }
    }
    
    void traverse() {
        if (q.empty()) {
            cout << "Queue is empty!" << endl;
            return;
        }
        queue<int> temp = q;
        cout << "Traversing queue (front to back): ";
        while (!temp.empty()) {
            cout << temp.front();
            temp.pop();
            if (!temp.empty()) cout << " -> ";
        }
        cout << endl;
    }
    
    int back() {
        if (!q.empty()) {
            return q.back();
        } else {
            cout << "Queue is empty!" << endl;
            return -1;
        }
    }
    
    bool isEmpty() {
        return q.empty();
    }
    
    int size() {
        return q.size();
    }
    
    void display() {
        if (q.empty()) {
            cout << "Queue is empty!" << endl;
            return;
        }
        
        queue<int> temp = q;
        cout << "Queue (front to back): ";
        while (!temp.empty()) {
            cout << temp.front() << " ";
            temp.pop();
        }
        cout << endl;
    }
};

int main() {
    cout << "=== Queue Data Structure ===" << endl;
    Queue q;
    
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    q.display();
    
    cout << "Front element (peek): " << q.peek() << endl;
    cout << "Back element: " << q.back() << endl;
    cout << "Queue size: " << q.size() << endl;
    
    q.traverse();
    
    q.dequeue();
    q.display();
    
    return 0;
}`,
    c: `/**
 * Queue Data Structure - C Implementation
 * First-In-First-Out (FIFO) structure using array
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int data[MAX_SIZE];
    int front;
    int rear;
    int size;
} Queue;

Queue* createQueue() {
    Queue* queue = (Queue*)malloc(sizeof(Queue));
    queue->front = 0;
    queue->rear = -1;
    queue->size = 0;
    return queue;
}

void enqueue(Queue* queue, int element) {
    if (queue->size >= MAX_SIZE) {
        printf("Queue overflow!");
        return;
    }
    queue->rear = (queue->rear + 1) % MAX_SIZE;
    queue->data[queue->rear] = element;
    queue->size++;
    printf("Enqueued %d", element);
}

void dequeue(Queue* queue) {
    if (queue->size == 0) {
        printf("Queue is empty!");
        return;
    }
    printf("Dequeued %d", queue->data[queue->front]);
    queue->front = (queue->front + 1) % MAX_SIZE;
    queue->size--;
}

int front(Queue* queue) {
    if (queue->size == 0) {
        printf("Queue is empty!");
        return -1;
    }
    return queue->data[queue->front];
}

int peek(Queue* queue) {
    if (queue->size == 0) {
        printf("Queue is empty!");
        return -1;
    }
    return queue->data[queue->front];
}

void traverse(Queue* queue) {
    if (isEmpty(queue)) {
        printf("Queue is empty!");
        return;
    }
    printf("Traversing queue (front to back): ");
    for (int i = 0; i < queue->size; i++) {
        int index = (queue->front + i) % MAX_SIZE;
        printf("%d", queue->data[index]);
        if (i < queue->size - 1) printf(" -> ");
    }
}

int back(Queue* queue) {
    if (queue->size == 0) {
        printf("Queue is empty!");
        return -1;
    }
    return queue->data[queue->rear];
}

bool isEmpty(Queue* queue) {
    return queue->size == 0;
}

int size(Queue* queue) {
    return queue->size;
}

void display(Queue* queue) {
    if (isEmpty(queue)) {
        printf("Queue is empty!");
        return;
    }
    
    printf("Queue (front to back): ");
    for (int i = 0; i < queue->size; i++) {
        int index = (queue->front + i) % MAX_SIZE;
        printf("%d ", queue->data[index]);
    }
}

int main() {
    printf("=== Queue Data Structure ===");
    Queue* q = createQueue();
    
    enqueue(q, 10);
    enqueue(q, 20);
    enqueue(q, 30);
    display(q);
    
    printf("Front element (peek): %d", peek(q));
    printf("Back element: %d", back(q));
    printf("Queue size: %d", size(q));
    
    traverse(q);
    
    dequeue(q);
    display(q);
    
    free(q);
    return 0;
}`,
    python: `"""
Queue Data Structure - Python Implementation
First-In-First-Out (FIFO) structure using collections.deque
"""

from collections import deque
from typing import Optional

class Queue:
    def __init__(self):
        self.data = deque()
    
    def enqueue(self, element: int) -> None:
        self.data.append(element)
        print(f"Enqueued {element}")
    
    def dequeue(self) -> Optional[int]:
        if self.is_empty():
            print("Queue is empty!")
            return None
        
        element = self.data.popleft()
        print(f"Dequeued {element}")
        return element
    
    def front(self) -> Optional[int]:
        if self.is_empty():
            print("Queue is empty!")
            return None
        return self.data[0]
    
    def peek(self) -> Optional[int]:
        if self.is_empty():
            print("Queue is empty!")
            return None
        return self.data[0]
    
    def traverse(self) -> None:
        if self.is_empty():
            print("Queue is empty!")
            return
        elements = ' -> '.join(str(x) for x in self.data)
        print(f"Traversing queue (front to back): {elements}")
    
    def back(self) -> Optional[int]:
        if self.is_empty():
            print("Queue is empty!")
            return None
        return self.data[-1]
    
    def is_empty(self) -> bool:
        return len(self.data) == 0
    
    def size(self) -> int:
        return len(self.data)
    
    def display(self) -> None:
        if self.is_empty():
            print("Queue is empty!")
            return
        
        elements = ' '.join(str(x) for x in self.data)
        print(f"Queue (front to back): {elements}")

def main() -> None:
    print("=== Queue Data Structure ===")
    queue = Queue()
    
    queue.enqueue(10)
    queue.enqueue(20)
    queue.enqueue(30)
    queue.display()
    
    print(f"Front element (peek): {queue.peek()}")
    print(f"Back element: {queue.back()}")
    print(f"Queue size: {queue.size()}")
    
    queue.traverse()
    
    queue.dequeue()
    queue.display()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Queue Data Structure - Java Implementation
 * First-In-First-Out (FIFO) structure using array
 */

public class Queue {
    private int[] data;
    private int front;
    private int rear;
    private int size;
    private int capacity;
    
    public Queue(int capacity) {
        this.capacity = capacity;
        this.data = new int[capacity];
        this.front = 0;
        this.rear = -1;
        this.size = 0;
    }
    
    public void enqueue(int element) {
        if (size >= capacity) {
            System.out.println("Queue overflow!");
            return;
        }
        rear = (rear + 1) % capacity;
        data[rear] = element;
        size++;
        System.out.println("Enqueued " + element);
    }
    
    public void dequeue() {
        if (isEmpty()) {
            System.out.println("Queue is empty!");
            return;
        }
        System.out.println("Dequeued " + data[front]);
        front = (front + 1) % capacity;
        size--;
    }
    
    public int front() {
        if (isEmpty()) {
            System.out.println("Queue is empty!");
            return -1;
        }
        return data[front];
    }
    
    public int peek() {
        if (isEmpty()) {
            System.out.println("Queue is empty!");
            return -1;
        }
        return data[front];
    }
    
    public void traverse() {
        if (isEmpty()) {
            System.out.println("Queue is empty!");
            return;
        }
        System.out.print("Traversing queue (front to back): ");
        for (int i = 0; i < size; i++) {
            int index = (front + i) % capacity;
            System.out.print(data[index]);
            if (i < size - 1) System.out.print(" -> ");
        }
        System.out.println();
    }
    
    public int back() {
        if (isEmpty()) {
            System.out.println("Queue is empty!");
            return -1;
        }
        return data[rear];
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    public int size() {
        return size;
    }
    
    public void display() {
        if (isEmpty()) {
            System.out.println("Queue is empty!");
            return;
        }
        
        System.out.print("Queue (front to back): ");
        for (int i = 0; i < size; i++) {
            int index = (front + i) % capacity;
            System.out.print(data[index] + " ");
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        System.out.println("=== Queue Data Structure ===");
        Queue q = new Queue(100);
        
        q.enqueue(10);
        q.enqueue(20);
        q.enqueue(30);
        q.display();
        
        System.out.println("Front element (peek): " + q.peek());
        System.out.println("Back element: " + q.back());
        System.out.println("Queue size: " + q.size());
        
        q.traverse();
        
        q.dequeue();
        q.display();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ecfdf5, #d1fae5, #6ee7b7)',
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
        Queue Code
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
                  {selectedLanguage === 'cpp' ? 'queue.cpp' : 
                   selectedLanguage === 'c' ? 'queue.c' :
                   selectedLanguage === 'python' ? 'queue.py' : 'Queue.java'}
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

export default QueueCode;