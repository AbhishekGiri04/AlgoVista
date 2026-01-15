import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const LinkedListCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Linked List Data Structure - C++ Implementation
 * Dynamic node-based storage with pointer connections
 */

#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    
    Node(int value) : data(value), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
    
public:
    LinkedList() : head(nullptr) {}
    
    void insert(int data) {
        Node* newNode = new Node(data);
        newNode->next = head;
        head = newNode;
        cout << "Inserted " << data << " at head" << endl;
    }
    
    void append(int data) {
        Node* newNode = new Node(data);
        if (!head) {
            head = newNode;
        } else {
            Node* temp = head;
            while (temp->next) {
                temp = temp->next;
            }
            temp->next = newNode;
        }
        cout << "Appended " << data << " at tail" << endl;
    }
    
    void remove(int data) {
        if (!head) return;
        
        if (head->data == data) {
            Node* temp = head;
            head = head->next;
            delete temp;
            cout << "Removed " << data << endl;
            return;
        }
        
        Node* current = head;
        while (current->next && current->next->data != data) {
            current = current->next;
        }
        
        if (current->next) {
            Node* temp = current->next;
            current->next = current->next->next;
            delete temp;
            cout << "Removed " << data << endl;
        }
    }
    
    bool search(int data) {
        Node* temp = head;
        while (temp) {
            if (temp->data == data) {
                cout << "Found " << data << " in list" << endl;
                return true;
            }
            temp = temp->next;
        }
        cout << data << " not found in list" << endl;
        return false;
    }
    
    void traverse() {
        cout << "Traversing list: ";
        Node* temp = head;
        int position = 0;
        while (temp) {
            cout << "[" << position << "]:" << temp->data;
            if (temp->next) cout << " -> ";
            temp = temp->next;
            position++;
        }
        cout << " -> NULL" << endl;
    }
    
    void display() {
        cout << "List: ";
        Node* temp = head;
        while (temp) {
            cout << temp->data;
            if (temp->next) cout << " -> ";
            temp = temp->next;
        }
        cout << " -> NULL" << endl;
    }
    
    ~LinkedList() {
        while (head) {
            Node* temp = head;
            head = head->next;
            delete temp;
        }
    }
};

int main() {
    cout << "=== Linked List Data Structure ===" << endl;
    LinkedList list;
    
    list.insert(10);
    list.insert(20);
    list.append(30);
    list.display();
    
    list.search(20);
    list.traverse();
    
    list.remove(20);
    list.display();
    
    return 0;
}`,
    c: `/**
 * Linked List Data Structure - C Implementation
 * Dynamic node-based storage using structures and pointers
 */

#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* createNode(int data) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

Node* insert(Node* head, int data) {
    Node* newNode = createNode(data);
    newNode->next = head;
    printf("Inserted %d at head", data);
    return newNode;
}

Node* append(Node* head, int data) {
    Node* newNode = createNode(data);
    
    if (head == NULL) {
        printf("Appended %d at tail", data);
        return newNode;
    }
    
    Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
    printf("Appended %d at tail", data);
    return head;
}

Node* removeNode(Node* head, int data) {
    if (head == NULL) return NULL;
    
    if (head->data == data) {
        Node* temp = head;
        head = head->next;
        free(temp);
        printf("Removed %d", data);
        return head;
    }
    
    Node* current = head;
    while (current->next != NULL && current->next->data != data) {
        current = current->next;
    }
    
    if (current->next != NULL) {
        Node* temp = current->next;
        current->next = current->next->next;
        free(temp);
        printf("Removed %d", data);
    }
    
    return head;
}

int search(Node* head, int data) {
    Node* temp = head;
    while (temp != NULL) {
        if (temp->data == data) {
            printf("Found %d in list", data);
            return 1;
        }
        temp = temp->next;
    }
    printf("%d not found in list", data);
    return 0;
}

void traverse(Node* head) {
    printf("Traversing list: ");
    Node* temp = head;
    int position = 0;
    while (temp != NULL) {
        printf("[%d]:%d", position, temp->data);
        if (temp->next != NULL) printf(" -> ");
        temp = temp->next;
        position++;
    }
    printf(" -> NULL");
}

void display(Node* head) {
    printf("List: ");
    Node* temp = head;
    while (temp != NULL) {
        printf("%d", temp->data);
        if (temp->next != NULL) printf(" -> ");
        temp = temp->next;
    }
    printf(" -> NULL");
}

void freeList(Node* head) {
    while (head != NULL) {
        Node* temp = head;
        head = head->next;
        free(temp);
    }
}

int main() {
    printf("=== Linked List Data Structure ===");
    Node* list = NULL;
    
    list = insert(list, 10);
    list = insert(list, 20);
    list = append(list, 30);
    display(list);
    
    search(list, 20);
    traverse(list);
    
    list = removeNode(list, 20);
    display(list);
    
    freeList(list);
    return 0;
}`,
    python: `"""
Linked List Data Structure - Python Implementation
Dynamic node-based storage with object references
"""

from typing import Optional

class Node:
    def __init__(self, data: int):
        self.data = data
        self.next: Optional['Node'] = None

class LinkedList:
    def __init__(self):
        self.head: Optional[Node] = None
    
    def insert(self, data: int) -> None:
        """Insert at the beginning of the list"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        print(f"Inserted {data} at head")
    
    def append(self, data: int) -> None:
        """Insert at the end of the list"""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        print(f"Appended {data} at tail")
    
    def remove(self, data: int) -> None:
        """Remove first occurrence of data"""
        if not self.head:
            return
        
        if self.head.data == data:
            self.head = self.head.next
            print(f"Removed {data}")
            return
        
        current = self.head
        while current.next and current.next.data != data:
            current = current.next
        
        if current.next:
            current.next = current.next.next
            print(f"Removed {data}")
    
    def search(self, data: int) -> bool:
        """Search for data in the list"""
        current = self.head
        while current:
            if current.data == data:
                print(f"Found {data} in list")
                return True
            current = current.next
        print(f"{data} not found in list")
        return False
    
    def traverse(self) -> None:
        """Traverse and display list with positions"""
        elements = []
        current = self.head
        position = 0
        while current:
            elements.append(f"[{position}]:{current.data}")
            current = current.next
            position += 1
        print(f"Traversing list: {' -> '.join(elements)} -> NULL")
    
    def display(self) -> None:
        """Display the entire list"""
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        
        print(f"List: {' -> '.join(elements)} -> NULL")

def main() -> None:
    print("=== Linked List Data Structure ===")
    linked_list = LinkedList()
    
    linked_list.insert(10)
    linked_list.insert(20)
    linked_list.append(30)
    linked_list.display()
    
    linked_list.search(20)
    linked_list.traverse()
    
    linked_list.remove(20)
    linked_list.display()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Linked List Data Structure - Java Implementation
 * Dynamic node-based storage with object references
 */

class Node {
    int data;
    Node next;
    
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

public class LinkedList {
    private Node head;
    
    public LinkedList() {
        this.head = null;
    }
    
    public void insert(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
        System.out.println("Inserted " + data + " at head");
    }
    
    public void append(int data) {
        Node newNode = new Node(data);
        
        if (head == null) {
            head = newNode;
        } else {
            Node temp = head;
            while (temp.next != null) {
                temp = temp.next;
            }
            temp.next = newNode;
        }
        System.out.println("Appended " + data + " at tail");
    }
    
    public void remove(int data) {
        if (head == null) return;
        
        if (head.data == data) {
            head = head.next;
            System.out.println("Removed " + data);
            return;
        }
        
        Node current = head;
        while (current.next != null && current.next.data != data) {
            current = current.next;
        }
        
        if (current.next != null) {
            current.next = current.next.next;
            System.out.println("Removed " + data);
        }
    }
    
    public boolean search(int data) {
        Node temp = head;
        while (temp != null) {
            if (temp.data == data) {
                System.out.println("Found " + data + " in list");
                return true;
            }
            temp = temp.next;
        }
        System.out.println(data + " not found in list");
        return false;
    }
    
    public void traverse() {
        System.out.print("Traversing list: ");
        Node temp = head;
        int position = 0;
        while (temp != null) {
            System.out.print("[" + position + "]:" + temp.data);
            if (temp.next != null) System.out.print(" -> ");
            temp = temp.next;
            position++;
        }
        System.out.println(" -> NULL");
    }
    
    public void display() {
        System.out.print("List: ");
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data);
            if (temp.next != null) System.out.print(" -> ");
            temp = temp.next;
        }
        System.out.println(" -> NULL");
    }
    
    public static void main(String[] args) {
        System.out.println("=== Linked List Data Structure ===");
        LinkedList list = new LinkedList();
        
        list.insert(10);
        list.insert(20);
        list.append(30);
        list.display();
        
        list.search(20);
        list.traverse();
        
        list.remove(20);
        list.display();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe, #7dd3fc)',
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
        Linked List Code
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
                  {selectedLanguage === 'cpp' ? 'linkedlist.cpp' : 
                   selectedLanguage === 'c' ? 'linkedlist.c' :
                   selectedLanguage === 'python' ? 'linkedlist.py' : 'LinkedList.java'}
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

export default LinkedListCode;