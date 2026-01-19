#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
using namespace std;

struct Job {
    char id;
    int deadline;
    int profit;
};

bool compare(Job a, Job b) {
    return a.profit > b.profit;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"Usage: ./JobScheduling <jobs>\"}" << endl;
        return 1;
    }
    
    string jobsStr = argv[1];
    stringstream ss(jobsStr);
    
    // Parse: "5;A,2,100;B,1,19;C,2,27;D,1,25;E,3,15"
    string token;
    getline(ss, token, ';');
    int n = stoi(token);
    
    vector<Job> jobs(n);
    for (int i = 0; i < n; i++) {
        getline(ss, token, ';');
        stringstream jobSS(token);
        string val;
        
        getline(jobSS, val, ',');
        jobs[i].id = val[0];
        
        getline(jobSS, val, ',');
        jobs[i].deadline = stoi(val);
        
        getline(jobSS, val, ',');
        jobs[i].profit = stoi(val);
    }
    
    sort(jobs.begin(), jobs.end(), compare);
    
    int maxDeadline = 0;
    for (const Job& job : jobs) {
        maxDeadline = max(maxDeadline, job.deadline);
    }
    
    vector<int> timeSlots(maxDeadline + 1, -1);
    vector<char> scheduledJobs;
    int totalProfit = 0;
    
    for (int i = 0; i < n; i++) {
        for (int j = jobs[i].deadline; j > 0; j--) {
            if (timeSlots[j] == -1) {
                timeSlots[j] = i;
                totalProfit += jobs[i].profit;
                scheduledJobs.push_back(jobs[i].id);
                break;
            }
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"Job Scheduling\",\"scheduledJobs\":[";
    for (size_t i = 0; i < scheduledJobs.size(); i++) {
        if (i > 0) cout << ",";
        cout << "\"" << scheduledJobs[i] << "\"";
    }
    cout << "],\"totalProfit\":" << totalProfit << "}" << endl;
    
    return 0;
}
