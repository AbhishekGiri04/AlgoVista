import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const ActivitySelectionCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Activity Selection - C++ Implementation
 * Maximum non-overlapping activities using greedy approach
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Activity {
    int start, finish, id;
    
    Activity(int s, int f, int i) : start(s), finish(f), id(i) {}
};

class ActivitySelection {
private:
    vector<Activity> activities;
    
public:
    void addActivity(int start, int finish, int id) {
        activities.push_back(Activity(start, finish, id));
    }
    
    vector<int> selectActivities() {
        // Sort by finish time
        sort(activities.begin(), activities.end(), 
             [](const Activity& a, const Activity& b) {
                 return a.finish < b.finish;
             });
        
        vector<int> selected;
        if (activities.empty()) return selected;
        
        selected.push_back(activities[0].id);
        int lastFinish = activities[0].finish;
        
        for (int i = 1; i < activities.size(); i++) {
            if (activities[i].start >= lastFinish) {
                selected.push_back(activities[i].id);
                lastFinish = activities[i].finish;
            }
        }
        
        return selected;
    }
    
    void printActivities() {
        cout << "Activities (Start, Finish):" << endl;
        for (const auto& activity : activities) {
            cout << "A" << activity.id << ": (" 
                 << activity.start << ", " << activity.finish << ")" << endl;
        }
    }
};

int main() {
    cout << "=== Activity Selection Problem ===" << endl;
    
    ActivitySelection as;
    as.addActivity(1, 4, 1);
    as.addActivity(3, 5, 2);
    as.addActivity(0, 6, 3);
    as.addActivity(5, 7, 4);
    as.addActivity(3, 9, 5);
    as.addActivity(5, 9, 6);
    as.addActivity(6, 10, 7);
    as.addActivity(8, 11, 8);
    as.addActivity(8, 12, 9);
    as.addActivity(2, 14, 10);
    as.addActivity(12, 16, 11);
    
    as.printActivities();
    
    vector<int> selected = as.selectActivities();
    cout << "\\nSelected activities: ";
    for (int id : selected) {
        cout << "A" << id << " ";
    }
    cout << endl;
    
    return 0;
}`,
    c: `/**
 * Activity Selection - C Implementation
 * Maximum non-overlapping activities using greedy approach
 */

#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int start, finish, id;
} Activity;

int compare(const void* a, const void* b) {
    Activity* actA = (Activity*)a;
    Activity* actB = (Activity*)b;
    return actA->finish - actB->finish;
}

void activitySelection(Activity activities[], int n) {
    // Sort by finish time
    qsort(activities, n, sizeof(Activity), compare);
    
    printf("Activities (Start, Finish):\\n");
    for (int i = 0; i < n; i++) {
        printf("A%d: (%d, %d)\\n", activities[i].id, 
               activities[i].start, activities[i].finish);
    }
    
    printf("\\nSelected activities: ");
    
    // First activity is always selected
    printf("A%d ", activities[0].id);
    int lastFinish = activities[0].finish;
    
    for (int i = 1; i < n; i++) {
        if (activities[i].start >= lastFinish) {
            printf("A%d ", activities[i].id);
            lastFinish = activities[i].finish;
        }
    }
    printf("\\n");
}

int main() {
    printf("=== Activity Selection Problem ===\\n");
    
    Activity activities[] = {
        {1, 4, 1}, {3, 5, 2}, {0, 6, 3}, {5, 7, 4},
        {3, 9, 5}, {5, 9, 6}, {6, 10, 7}, {8, 11, 8},
        {8, 12, 9}, {2, 14, 10}, {12, 16, 11}
    };
    
    int n = sizeof(activities) / sizeof(activities[0]);
    activitySelection(activities, n);
    
    return 0;
}`,
    python: `"""
Activity Selection - Python Implementation
Maximum non-overlapping activities using greedy approach
"""

from typing import List, Tuple

class Activity:
    def __init__(self, start: int, finish: int, activity_id: int):
        self.start = start
        self.finish = finish
        self.id = activity_id
    
    def __repr__(self):
        return f"A{self.id}: ({self.start}, {self.finish})"

class ActivitySelection:
    def __init__(self):
        self.activities: List[Activity] = []
    
    def add_activity(self, start: int, finish: int, activity_id: int) -> None:
        self.activities.append(Activity(start, finish, activity_id))
    
    def select_activities(self) -> List[int]:
        if not self.activities:
            return []
        
        # Sort by finish time
        self.activities.sort(key=lambda x: x.finish)
        
        selected = [self.activities[0].id]
        last_finish = self.activities[0].finish
        
        for i in range(1, len(self.activities)):
            if self.activities[i].start >= last_finish:
                selected.append(self.activities[i].id)
                last_finish = self.activities[i].finish
        
        return selected
    
    def print_activities(self) -> None:
        print("Activities (Start, Finish):")
        for activity in self.activities:
            print(activity)

def main() -> None:
    print("=== Activity Selection Problem ===")
    
    as_solver = ActivitySelection()
    activities_data = [
        (1, 4, 1), (3, 5, 2), (0, 6, 3), (5, 7, 4),
        (3, 9, 5), (5, 9, 6), (6, 10, 7), (8, 11, 8),
        (8, 12, 9), (2, 14, 10), (12, 16, 11)
    ]
    
    for start, finish, activity_id in activities_data:
        as_solver.add_activity(start, finish, activity_id)
    
    as_solver.print_activities()
    
    selected = as_solver.select_activities()
    print(f"\\nSelected activities: {' '.join(f'A{id}' for id in selected)}")

if __name__ == "__main__":
    main()`,
    java: `/**
 * Activity Selection - Java Implementation
 * Maximum non-overlapping activities using greedy approach
 */

import java.util.*;

class Activity {
    int start, finish, id;
    
    Activity(int start, int finish, int id) {
        this.start = start;
        this.finish = finish;
        this.id = id;
    }
    
    @Override
    public String toString() {
        return "A" + id + ": (" + start + ", " + finish + ")";
    }
}

public class ActivitySelection {
    private List<Activity> activities;
    
    public ActivitySelection() {
        this.activities = new ArrayList<>();
    }
    
    public void addActivity(int start, int finish, int id) {
        activities.add(new Activity(start, finish, id));
    }
    
    public List<Integer> selectActivities() {
        if (activities.isEmpty()) return new ArrayList<>();
        
        // Sort by finish time
        activities.sort(Comparator.comparingInt(a -> a.finish));
        
        List<Integer> selected = new ArrayList<>();
        selected.add(activities.get(0).id);
        int lastFinish = activities.get(0).finish;
        
        for (int i = 1; i < activities.size(); i++) {
            if (activities.get(i).start >= lastFinish) {
                selected.add(activities.get(i).id);
                lastFinish = activities.get(i).finish;
            }
        }
        
        return selected;
    }
    
    public void printActivities() {
        System.out.println("Activities (Start, Finish):");
        for (Activity activity : activities) {
            System.out.println(activity);
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Activity Selection Problem ===");
        
        ActivitySelection as = new ActivitySelection();
        int[][] activityData = {
            {1, 4, 1}, {3, 5, 2}, {0, 6, 3}, {5, 7, 4},
            {3, 9, 5}, {5, 9, 6}, {6, 10, 7}, {8, 11, 8},
            {8, 12, 9}, {2, 14, 10}, {12, 16, 11}
        };
        
        for (int[] data : activityData) {
            as.addActivity(data[0], data[1], data[2]);
        }
        
        as.printActivities();
        
        List<Integer> selected = as.selectActivities();
        System.out.print("\\nSelected activities: ");
        for (int id : selected) {
            System.out.print("A" + id + " ");
        }
        System.out.println();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef3c7, #fed7aa, #fbbf24)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/greedyalgorithms" style={{
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
        ← Back to Greedy Algorithms
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Activity Selection Code
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
                  {selectedLanguage === 'cpp' ? 'activity_selection.cpp' : 
                   selectedLanguage === 'c' ? 'activity_selection.c' :
                   selectedLanguage === 'python' ? 'activity_selection.py' : 'ActivitySelection.java'}
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

export default ActivitySelectionCode;