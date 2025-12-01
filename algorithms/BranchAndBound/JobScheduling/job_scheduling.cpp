#include <iostream>
#include <vector>
#include <algorithm>
#include <fstream>
using namespace std;

struct Job {
    char id;
    int deadline;
    int profit;
};

struct ScheduleStep {
    char jobId;
    int deadline;
    int profit;
    int timeSlot;
    bool scheduled;
    string action;
    int totalProfit;
};

bool compare(Job a, Job b) {
    return a.profit > b.profit;
}

void jobSchedulingWithSteps(vector<Job>& jobs, ofstream& output) {
    int n = jobs.size();
    
    // Sort by profit descending
    sort(jobs.begin(), jobs.end(), compare);
    
    int maxDeadline = 0;
    for (const Job& job : jobs) {
        maxDeadline = max(maxDeadline, job.deadline);
    }
    
    vector<int> timeSlots(maxDeadline + 1, -1);
    vector<ScheduleStep> steps;
    vector<char> scheduledJobs;
    int totalProfit = 0;
    
    // Try to schedule each job
    for (int i = 0; i < n; i++) {
        ScheduleStep step;
        step.jobId = jobs[i].id;
        step.deadline = jobs[i].deadline;
        step.profit = jobs[i].profit;
        step.scheduled = false;
        step.timeSlot = -1;
        
        // Find latest available slot before deadline
        for (int j = jobs[i].deadline; j > 0; j--) {
            if (timeSlots[j] == -1) {
                timeSlots[j] = i;
                step.timeSlot = j;
                step.scheduled = true;
                totalProfit += jobs[i].profit;
                scheduledJobs.push_back(jobs[i].id);
                step.action = "Scheduled at slot " + to_string(j);
                break;
            }
        }
        
        if (!step.scheduled) {
            step.action = "Rejected - no available slot";
        }
        
        step.totalProfit = totalProfit;
        steps.push_back(step);
    }
    
    // Output JSON
    output << "{\n";
    output << "  \"jobs\": [\n";
    for (int i = 0; i < n; i++) {
        if (i > 0) output << ",\n";
        output << "    {\n";
        output << "      \"id\": \"" << jobs[i].id << "\",\n";
        output << "      \"deadline\": " << jobs[i].deadline << ",\n";
        output << "      \"profit\": " << jobs[i].profit << "\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    output << "  \"steps\": [\n";
    for (int i = 0; i < steps.size(); i++) {
        if (i > 0) output << ",\n";
        auto& step = steps[i];
        output << "    {\n";
        output << "      \"jobId\": \"" << step.jobId << "\",\n";
        output << "      \"deadline\": " << step.deadline << ",\n";
        output << "      \"profit\": " << step.profit << ",\n";
        output << "      \"timeSlot\": " << step.timeSlot << ",\n";
        output << "      \"scheduled\": " << (step.scheduled ? "true" : "false") << ",\n";
        output << "      \"action\": \"" << step.action << "\",\n";
        output << "      \"totalProfit\": " << step.totalProfit << "\n";
        output << "    }";
    }
    output << "\n  ],\n";
    
    // Final schedule
    output << "  \"schedule\": [\n";
    for (int i = 1; i <= maxDeadline; i++) {
        if (i > 1) output << ",\n";
        output << "    {\n";
        output << "      \"timeSlot\": " << i << ",\n";
        if (timeSlots[i] != -1) {
            output << "      \"jobId\": \"" << jobs[timeSlots[i]].id << "\",\n";
            output << "      \"profit\": " << jobs[timeSlots[i]].profit << "\n";
        } else {
            output << "      \"jobId\": null,\n";
            output << "      \"profit\": 0\n";
        }
        output << "    }";
    }
    output << "\n  ],\n";
    
    output << "  \"scheduledJobs\": [";
    for (int i = 0; i < scheduledJobs.size(); i++) {
        if (i > 0) output << ", ";
        output << "\"" << scheduledJobs[i] << "\"";
    }
    output << "],\n";
    
    output << "  \"maxDeadline\": " << maxDeadline << ",\n";
    output << "  \"totalProfit\": " << totalProfit << "\n";
    output << "}\n";
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int n;
    input >> n;
    
    vector<Job> jobs(n);
    for (int i = 0; i < n; i++) {
        input >> jobs[i].id >> jobs[i].deadline >> jobs[i].profit;
    }
    
    jobSchedulingWithSteps(jobs, output);
    
    return 0;
}