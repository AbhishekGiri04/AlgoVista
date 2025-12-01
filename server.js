const express = require('express');
const path = require('path');
const ActivitySelection = require('./activityselectionvisualize');
const FractionalKnapsack = require('./fractionalknapsackvisualize');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Activity Selection Route
app.get('/activityselectionvisualize', (req, res) => {
    const activitySelector = new ActivitySelection();
    activitySelector.addActivity("A1", 1, 4);
    activitySelector.addActivity("A2", 3, 5);
    activitySelector.addActivity("A3", 0, 6);
    activitySelector.addActivity("A4", 5, 7);
    activitySelector.addActivity("A5", 8, 9);
    activitySelector.addActivity("A6", 5, 9);
    
    const result = activitySelector.visualize();
    
    res.json({
        algorithm: "Activity Selection",
        data: result,
        visualization: generateActivityHTML(result)
    });
});

// Fractional Knapsack Route
app.get('/fractionalknapsackvisualize', (req, res) => {
    const knapsack = new FractionalKnapsack(50);
    knapsack.addItem(1, 60, 10);
    knapsack.addItem(2, 100, 20);
    knapsack.addItem(3, 120, 30);
    
    const result = knapsack.visualize();
    
    res.json({
        algorithm: "Fractional Knapsack",
        data: result,
        visualization: generateKnapsackHTML(result)
    });
});

function generateActivityHTML(data) {
    return `
    <h2>Activity Selection Result</h2>
    <p>Selected: ${data.selected.map(a => a.name).join(', ')}</p>
    <p>Maximum Activities: ${data.maxCount}</p>
    <div style="font-family: monospace;">
    ${data.activities.map(act => {
        const selected = data.selected.includes(act);
        return `<div style="color: ${selected ? 'green' : 'red'}">
            ${selected ? '✓' : '✗'} ${act.name}: (${act.start}-${act.finish})
        </div>`;
    }).join('')}
    </div>`;
}

function generateKnapsackHTML(data) {
    return `
    <h2>Fractional Knapsack Result</h2>
    <p>Total Value: ${data.totalValue.toFixed(2)}</p>
    <p>Capacity: ${data.capacity}</p>
    <div style="font-family: monospace;">
    ${data.solution.map(item => {
        const percentage = (item.fraction * 100).toFixed(1);
        return `<div style="color: green;">
            ✓ Item ${item.id}: ${percentage}% taken, Value: ${item.valueTaken.toFixed(2)}
        </div>`;
    }).join('')}
    </div>`;
}

app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
    console.log('📊 Activity Selection: http://localhost:3000/activityselectionvisualize');
    console.log('🎒 Fractional Knapsack: http://localhost:3000/fractionalknapsackvisualize');
});