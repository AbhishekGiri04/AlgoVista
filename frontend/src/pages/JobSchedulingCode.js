import React, { useState } from 'react';
import CodeBlock from '../components/CodeBlock';

const JobSchedulingCode = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    cpp: `/**
 * Job Scheduling - C++ Implementation
 * Optimal task allocation and timing using Branch and Bound
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

struct Job {
    int id, deadline, profit;
    
    Job(int i, int d, int p) : id(i), deadline(d), profit(p) {}
};

class JobScheduling {
private:
    vector<Job> jobs;
    vector<int> bestSchedule;
    int maxProfit;
    int n;
    
    int calculateBound(vector<int>& schedule, int level, int currentProfit) {
        int bound = currentProfit;
        vector<bool> used(n, false);
        
        // Mark used jobs
        for (int i = 0; i < level; i++) {
            if (schedule[i] != -1) {
                used[schedule[i]] = true;
            }
        }
        
        // Add remaining jobs greedily by profit
        vector<pair<int, int>> remaining; // (profit, job_id)
        for (int i = 0; i < n; i++) {
            if (!used[i]) {
                remaining.push_back({jobs[i].profit, i});
            }
        }
        
        sort(remaining.rbegin(), remaining.rend());
        
        for (auto& p : remaining) {
            int jobId = p.second;
            // Check if job can be scheduled in remaining slots
            for (int slot = level; slot < min(n, jobs[jobId].deadline); slot++) {
                if (slot < schedule.size() && schedule[slot] == -1) {
                    bound += jobs[jobId].profit;
                    break;
                }
            }
        }
        
        return bound;
    }
    
    bool isValidSchedule(vector<int>& schedule, int level, int jobId) {
        if (jobId == -1) return true;
        
        // Check if job can be scheduled before its deadline
        return level < jobs[jobId].deadline;
    }
    
    void branchAndBound(vector<int>& schedule, int level, int currentProfit) {
        if (level == n) {
            if (currentProfit > maxProfit) {
                maxProfit = currentProfit;
                bestSchedule = schedule;
            }
            return;
        }
        
        // Try not scheduling any job in this slot
        schedule[level] = -1;
        int bound = calculateBound(schedule, level + 1, currentProfit);
        if (bound > maxProfit) {
            branchAndBound(schedule, level + 1, currentProfit);
        }
        
        // Try scheduling each unscheduled job
        vector<bool> used(n, false);
        for (int i = 0; i < level; i++) {
            if (schedule[i] != -1) {
                used[schedule[i]] = true;
            }
        }
        
        for (int i = 0; i < n; i++) {
            if (!used[i] && isValidSchedule(schedule, level, i)) {
                schedule[level] = i;
                int newProfit = currentProfit + jobs[i].profit;
                
                bound = calculateBound(schedule, level + 1, newProfit);
                if (bound > maxProfit) {
                    branchAndBound(schedule, level + 1, newProfit);
                }
            }
        }
    }
    
public:
    void addJob(int id, int deadline, int profit) {
        jobs.push_back(Job(id, deadline, profit));
    }
    
    int solve() {
        n = jobs.size();
        maxProfit = 0;
        
        vector<int> schedule(n, -1);
        branchAndBound(schedule, 0, 0);
        
        return maxProfit;
    }
    
    void printJobs() {
        cout << "Jobs (ID, Deadline, Profit):" << endl;
        for (const auto& job : jobs) {
            cout << "Job " << job.id << ": (" << job.deadline 
                 << ", " << job.profit << ")" << endl;
        }
    }
    
    void printSolution() {
        cout << "Maximum profit: " << maxProfit << endl;
        cout << "Optimal schedule: ";
        for (int i = 0; i < bestSchedule.size(); i++) {
            if (bestSchedule[i] != -1) {
                cout << "Slot " << i << ": Job " << jobs[bestSchedule[i]].id << " ";
            }
        }
        cout << endl;
    }
};

int main() {
    cout << "=== Job Scheduling Problem ===" << endl;
    
    JobScheduling js;
    js.addJob(1, 2, 100);
    js.addJob(2, 1, 19);
    js.addJob(3, 2, 27);
    js.addJob(4, 1, 25);
    js.addJob(5, 3, 15);
    
    js.printJobs();
    
    int maxProfit = js.solve();
    js.printSolution();
    
    return 0;
}`,
    c: `/**
 * Job Scheduling - C Implementation
 * Optimal task allocation and timing using Branch and Bound
 */

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>

#define MAX_JOBS 20

typedef struct {
    int id, deadline, profit;
} Job;

Job jobs[MAX_JOBS];
int bestSchedule[MAX_JOBS];
int maxProfit = 0;
int n;

int compare(const void* a, const void* b) {
    Job* jobA = (Job*)a;
    Job* jobB = (Job*)b;
    return jobB->profit - jobA->profit; // Sort by profit descending
}

int calculateBound(int schedule[], int level, int currentProfit) {
    int bound = currentProfit;
    bool used[MAX_JOBS] = {false};
    
    // Mark used jobs
    for (int i = 0; i < level; i++) {
        if (schedule[i] != -1) {
            used[schedule[i]] = true;
        }
    }
    
    // Add remaining jobs greedily by profit
    Job remaining[MAX_JOBS];
    int count = 0;
    
    for (int i = 0; i < n; i++) {
        if (!used[i]) {
            remaining[count++] = jobs[i];
        }
    }
    
    qsort(remaining, count, sizeof(Job), compare);
    
    for (int i = 0; i < count; i++) {
        // Check if job can be scheduled in remaining slots
        for (int slot = level; slot < remaining[i].deadline && slot < n; slot++) {
            if (schedule[slot] == -1) {
                bound += remaining[i].profit;
                break;
            }
        }
    }
    
    return bound;
}

bool isValidSchedule(int schedule[], int level, int jobId) {
    if (jobId == -1) return true;
    return level < jobs[jobId].deadline;
}

void branchAndBound(int schedule[], int level, int currentProfit) {
    if (level == n) {
        if (currentProfit > maxProfit) {
            maxProfit = currentProfit;
            for (int i = 0; i < n; i++) {
                bestSchedule[i] = schedule[i];
            }
        }
        return;
    }
    
    // Try not scheduling any job in this slot
    schedule[level] = -1;
    int bound = calculateBound(schedule, level + 1, currentProfit);
    if (bound > maxProfit) {
        branchAndBound(schedule, level + 1, currentProfit);
    }
    
    // Try scheduling each unscheduled job
    bool used[MAX_JOBS] = {false};
    for (int i = 0; i < level; i++) {
        if (schedule[i] != -1) {
            used[schedule[i]] = true;
        }
    }
    
    for (int i = 0; i < n; i++) {
        if (!used[i] && isValidSchedule(schedule, level, i)) {
            schedule[level] = i;
            int newProfit = currentProfit + jobs[i].profit;
            
            bound = calculateBound(schedule, level + 1, newProfit);
            if (bound > maxProfit) {
                branchAndBound(schedule, level + 1, newProfit);
            }
        }
    }
}

int solve() {
    int schedule[MAX_JOBS];
    for (int i = 0; i < n; i++) {
        schedule[i] = -1;
    }
    
    branchAndBound(schedule, 0, 0);
    return maxProfit;
}

void printJobs() {
    printf("Jobs (ID, Deadline, Profit):\\n");
    for (int i = 0; i < n; i++) {
        printf("Job %d: (%d, %d)\\n", jobs[i].id, jobs[i].deadline, jobs[i].profit);
    }
}

void printSolution() {
    printf("Maximum profit: %d\\n", maxProfit);
    printf("Optimal schedule: ");
    for (int i = 0; i < n; i++) {
        if (bestSchedule[i] != -1) {
            printf("Slot %d: Job %d ", i, jobs[bestSchedule[i]].id);
        }
    }
    printf("\\n");
}

int main() {
    printf("=== Job Scheduling Problem ===\\n");
    
    n = 5;
    jobs[0] = (Job){1, 2, 100};
    jobs[1] = (Job){2, 1, 19};
    jobs[2] = (Job){3, 2, 27};
    jobs[3] = (Job){4, 1, 25};
    jobs[4] = (Job){5, 3, 15};
    
    printJobs();
    
    solve();
    printSolution();
    
    return 0;
}`,
    python: `"""
Job Scheduling - Python Implementation
Optimal task allocation and timing using Branch and Bound
"""

from typing import List, Tuple
import sys

class Job:
    def __init__(self, job_id: int, deadline: int, profit: int):
        self.id = job_id
        self.deadline = deadline
        self.profit = profit
    
    def __repr__(self):
        return f"Job({self.id}, {self.deadline}, {self.profit})"

class JobScheduling:
    def __init__(self):
        self.jobs: List[Job] = []
        self.best_schedule: List[int] = []
        self.max_profit = 0
        self.n = 0
    
    def add_job(self, job_id: int, deadline: int, profit: int) -> None:
        self.jobs.append(Job(job_id, deadline, profit))
    
    def calculate_bound(self, schedule: List[int], level: int, current_profit: int) -> int:
        bound = current_profit
        used = set(job_id for job_id in schedule[:level] if job_id != -1)
        
        # Add remaining jobs greedily by profit
        remaining = [(job.profit, i) for i, job in enumerate(self.jobs) if i not in used]
        remaining.sort(reverse=True)
        
        for profit, job_id in remaining:
            # Check if job can be scheduled in remaining slots
            for slot in range(level, min(self.n, self.jobs[job_id].deadline)):
                if slot < len(schedule) and schedule[slot] == -1:
                    bound += profit
                    break
        
        return bound
    
    def is_valid_schedule(self, schedule: List[int], level: int, job_id: int) -> bool:
        if job_id == -1:
            return True
        return level < self.jobs[job_id].deadline
    
    def branch_and_bound(self, schedule: List[int], level: int, current_profit: int) -> None:
        if level == self.n:
            if current_profit > self.max_profit:
                self.max_profit = current_profit
                self.best_schedule = schedule.copy()
            return
        
        # Try not scheduling any job in this slot
        schedule[level] = -1
        bound = self.calculate_bound(schedule, level + 1, current_profit)
        if bound > self.max_profit:
            self.branch_and_bound(schedule, level + 1, current_profit)
        
        # Try scheduling each unscheduled job
        used = set(job_id for job_id in schedule[:level] if job_id != -1)
        
        for i in range(self.n):
            if i not in used and self.is_valid_schedule(schedule, level, i):
                schedule[level] = i
                new_profit = current_profit + self.jobs[i].profit
                
                bound = self.calculate_bound(schedule, level + 1, new_profit)
                if bound > self.max_profit:
                    self.branch_and_bound(schedule, level + 1, new_profit)
    
    def solve(self) -> int:
        self.n = len(self.jobs)
        self.max_profit = 0
        
        schedule = [-1] * self.n
        self.branch_and_bound(schedule, 0, 0)
        
        return self.max_profit
    
    def print_jobs(self) -> None:
        print("Jobs (ID, Deadline, Profit):")
        for job in self.jobs:
            print(f"Job {job.id}: ({job.deadline}, {job.profit})")
    
    def print_solution(self) -> None:
        print(f"Maximum profit: {self.max_profit}")
        print("Optimal schedule:", end=" ")
        for i, job_id in enumerate(self.best_schedule):
            if job_id != -1:
                print(f"Slot {i}: Job {self.jobs[job_id].id}", end=" ")
        print()

def main() -> None:
    print("=== Job Scheduling Problem ===")
    
    js = JobScheduling()
    js.add_job(1, 2, 100)
    js.add_job(2, 1, 19)
    js.add_job(3, 2, 27)
    js.add_job(4, 1, 25)
    js.add_job(5, 3, 15)
    
    js.print_jobs()
    
    max_profit = js.solve()
    js.print_solution()

if __name__ == "__main__":
    main()`,
    java: `/**
 * Job Scheduling - Java Implementation
 * Optimal task allocation and timing using Branch and Bound
 */

import java.util.*;

class Job {
    int id, deadline, profit;
    
    Job(int id, int deadline, int profit) {
        this.id = id;
        this.deadline = deadline;
        this.profit = profit;
    }
    
    @Override
    public String toString() {
        return "Job(" + id + ", " + deadline + ", " + profit + ")";
    }
}

public class JobScheduling {
    private List<Job> jobs;
    private int[] bestSchedule;
    private int maxProfit;
    private int n;
    
    public JobScheduling() {
        this.jobs = new ArrayList<>();
        this.maxProfit = 0;
    }
    
    public void addJob(int id, int deadline, int profit) {
        jobs.add(new Job(id, deadline, profit));
    }
    
    private int calculateBound(int[] schedule, int level, int currentProfit) {
        int bound = currentProfit;
        Set<Integer> used = new HashSet<>();
        
        // Mark used jobs
        for (int i = 0; i < level; i++) {
            if (schedule[i] != -1) {
                used.add(schedule[i]);
            }
        }
        
        // Add remaining jobs greedily by profit
        List<Integer> remaining = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (!used.contains(i)) {
                remaining.add(i);
            }
        }
        
        remaining.sort((a, b) -> Integer.compare(jobs.get(b).profit, jobs.get(a).profit));
        
        for (int jobId : remaining) {
            // Check if job can be scheduled in remaining slots
            for (int slot = level; slot < Math.min(n, jobs.get(jobId).deadline); slot++) {
                if (schedule[slot] == -1) {
                    bound += jobs.get(jobId).profit;
                    break;
                }
            }
        }
        
        return bound;
    }
    
    private boolean isValidSchedule(int[] schedule, int level, int jobId) {
        if (jobId == -1) return true;
        return level < jobs.get(jobId).deadline;
    }
    
    private void branchAndBound(int[] schedule, int level, int currentProfit) {
        if (level == n) {
            if (currentProfit > maxProfit) {
                maxProfit = currentProfit;
                bestSchedule = schedule.clone();
            }
            return;
        }
        
        // Try not scheduling any job in this slot
        schedule[level] = -1;
        int bound = calculateBound(schedule, level + 1, currentProfit);
        if (bound > maxProfit) {
            branchAndBound(schedule, level + 1, currentProfit);
        }
        
        // Try scheduling each unscheduled job
        Set<Integer> used = new HashSet<>();
        for (int i = 0; i < level; i++) {
            if (schedule[i] != -1) {
                used.add(schedule[i]);
            }
        }
        
        for (int i = 0; i < n; i++) {
            if (!used.contains(i) && isValidSchedule(schedule, level, i)) {
                schedule[level] = i;
                int newProfit = currentProfit + jobs.get(i).profit;
                
                bound = calculateBound(schedule, level + 1, newProfit);
                if (bound > maxProfit) {
                    branchAndBound(schedule, level + 1, newProfit);
                }
            }
        }
    }
    
    public int solve() {
        n = jobs.size();
        maxProfit = 0;
        
        int[] schedule = new int[n];
        Arrays.fill(schedule, -1);
        branchAndBound(schedule, 0, 0);
        
        return maxProfit;
    }
    
    public void printJobs() {
        System.out.println("Jobs (ID, Deadline, Profit):");
        for (Job job : jobs) {
            System.out.println("Job " + job.id + ": (" + job.deadline + ", " + job.profit + ")");
        }
    }
    
    public void printSolution() {
        System.out.println("Maximum profit: " + maxProfit);
        System.out.print("Optimal schedule: ");
        for (int i = 0; i < bestSchedule.length; i++) {
            if (bestSchedule[i] != -1) {
                System.out.print("Slot " + i + ": Job " + jobs.get(bestSchedule[i]).id + " ");
            }
        }
        System.out.println();
    }
    
    public static void main(String[] args) {
        System.out.println("=== Job Scheduling Problem ===");
        
        JobScheduling js = new JobScheduling();
        js.addJob(1, 2, 100);
        js.addJob(2, 1, 19);
        js.addJob(3, 2, 27);
        js.addJob(4, 1, 25);
        js.addJob(5, 3, 15);
        
        js.printJobs();
        
        int maxProfit = js.solve();
        js.printSolution();
    }
}`
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #eef2ff, #c7d2fe, #a5b4fc)',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/branchandbound" style={{
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
        ← Back to Branch and Bound
      </a>
      
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1a202c',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Job Scheduling Code
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
                  {selectedLanguage === 'cpp' ? 'job_scheduling.cpp' : 
                   selectedLanguage === 'c' ? 'job_scheduling.c' :
                   selectedLanguage === 'python' ? 'job_scheduling.py' : 'JobScheduling.java'}
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

export default JobSchedulingCode;