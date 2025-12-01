#include <iostream>
#include <vector>
#include <algorithm>
#include <fstream>
using namespace std;

struct Activity {
    int start, finish, id;
    
    bool operator<(const Activity& other) const {
        return finish < other.finish;
    }
};

void activitySelection(vector<Activity>& activities, ofstream& output) {
    sort(activities.begin(), activities.end());
    
    vector<int> selected;
    int lastFinish = -1;
    
    for (const Activity& act : activities) {
        if (act.start >= lastFinish) {
            selected.push_back(act.id);
            lastFinish = act.finish;
        }
    }
    
    output << "Selected activities: ";
    for (int id : selected) {
        output << id << " ";
    }
    output << "\nTotal activities selected: " << selected.size() << "\n";
    
    output << "\nActivity details:\n";
    for (int id : selected) {
        for (const Activity& act : activities) {
            if (act.id == id) {
                output << "Activity " << id << ": [" << act.start << ", " << act.finish << "]\n";
                break;
            }
        }
    }
}

int main() {
    ifstream input("input.txt");
    ofstream output("output.txt");
    
    int n;
    input >> n;
    
    vector<Activity> activities(n);
    
    for (int i = 0; i < n; i++) {
        input >> activities[i].start >> activities[i].finish;
        activities[i].id = i + 1;
    }
    
    output << "Input activities:\n";
    for (const Activity& act : activities) {
        output << "Activity " << act.id << ": [" << act.start << ", " << act.finish << "]\n";
    }
    output << "\n";
    
    activitySelection(activities, output);
    
    return 0;
}