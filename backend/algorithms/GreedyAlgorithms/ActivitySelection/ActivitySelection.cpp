#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
using namespace std;

struct Activity {
    int start, finish, index;
};

bool compare(Activity a, Activity b) {
    return a.finish < b.finish;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"Usage: ./ActivitySelection <activities>\"}" << endl;
        return 1;
    }
    
    string activitiesStr = argv[1];
    
    // Parse: "6;1,3;2,5;0,6;5,7;8,9;5,9"
    stringstream ss(activitiesStr);
    string token;
    getline(ss, token, ';');
    int n = stoi(token);
    
    vector<Activity> activities(n);
    for (int i = 0; i < n; i++) {
        getline(ss, token, ';');
        stringstream actSS(token);
        string val;
        
        getline(actSS, val, ',');
        activities[i].start = stoi(val);
        
        getline(actSS, val, ',');
        activities[i].finish = stoi(val);
        
        activities[i].index = i;
    }
    
    sort(activities.begin(), activities.end(), compare);
    
    vector<int> selected;
    selected.push_back(activities[0].index);
    int lastFinish = activities[0].finish;
    
    for (int i = 1; i < n; i++) {
        if (activities[i].start >= lastFinish) {
            selected.push_back(activities[i].index);
            lastFinish = activities[i].finish;
        }
    }
    
    // Output JSON
    cout << "{\"algorithm\":\"Activity Selection\",\"totalActivities\":" << n 
         << ",\"selectedCount\":" << selected.size() << ",\"selected\":[";
    for (size_t i = 0; i < selected.size(); i++) {
        if (i > 0) cout << ",";
        cout << selected[i];
    }
    cout << "]}" << endl;
    
    return 0;
}
