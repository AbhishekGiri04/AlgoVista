import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FractionalKnapsackVisualize = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item A', weight: 10, value: 60 },
    { id: 2, name: 'Item B', weight: 20, value: 100 },
    { id: 3, name: 'Item C', weight: 30, value: 120 },
    { id: 4, name: 'Item D', weight: 15, value: 90 }
  ]);

  const [capacity, setCapacity] = useState(50);
  const [knapsack, setKnapsack] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [remainingCapacity, setRemainingCapacity] = useState(capacity);
  const [totalValue, setTotalValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, [capacity]);

  const reset = () => {
    setKnapsack([]);
    setCurrentItem(null);
    setRemainingCapacity(capacity);
    setTotalValue(0);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', `Knapsack capacity: ${capacity}`, 'Items sorted by value/weight ratio']);
  };

  const runFractionalKnapsack = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const sorted = [...items]
      .map(item => ({ ...item, ratio: item.value / item.weight }))
      .sort((a, b) => b.ratio - a.ratio);

    const newLog = [...log];
    newLog.push(`Sorted by ratio: ${sorted.map(i => `${i.name}(${i.ratio.toFixed(2)})`).join(', ')}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    let remaining = capacity;
    let value = 0;
    const selected = [];

    for (const item of sorted) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      setCurrentItem(item);
      newLog.push(`Considering ${item.name}: weight=${item.weight}, value=${item.value}, ratio=${item.ratio.toFixed(2)}`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (remaining >= item.weight) {
        selected.push({ ...item, fraction: 1, takenWeight: item.weight, takenValue: item.value });
        remaining -= item.weight;
        value += item.value;
        newLog.push(`✓ Added full ${item.name} (100%)`);
      } else if (remaining > 0) {
        const fraction = remaining / item.weight;
        const takenValue = item.value * fraction;
        selected.push({ ...item, fraction, takenWeight: remaining, takenValue });
        value += takenValue;
        newLog.push(`✓ Added ${(fraction * 100).toFixed(1)}% of ${item.name}`);
        remaining = 0;
      } else {
        newLog.push(`✗ Skipped ${item.name} (no capacity left)`);
      }

      setKnapsack([...selected]);
      setRemainingCapacity(remaining);
      setTotalValue(value);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (remaining === 0) break;
    }

    setCurrentItem(null);
    setIsRunning(false);
    newLog.push(`Final value: ${value.toFixed(2)}, Used capacity: ${capacity - remaining}/${capacity}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getItemColor = (item) => {
    if (currentItem?.id === item.id) return '#F59E0B';
    if (knapsack.some(k => k.id === item.id)) return '#10B981';
    return '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-2">Fractional Knapsack</h1>
          <p className="text-amber-600">Maximize value with weight constraint using greedy approach</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Knapsack Visualization</h2>
            
            <div className="relative bg-gray-50 rounded-lg p-6 h-96">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Capacity Used</span>
                  <span className="text-sm font-semibold">{capacity - remainingCapacity}/{capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  {knapsack.map((item, idx) => {
                    const prevWidth = knapsack.slice(0, idx).reduce((sum, k) => sum + (k.takenWeight / capacity) * 100, 0);
                    const width = (item.takenWeight / capacity) * 100;
                    return (
                      <div
                        key={item.id}
                        className="absolute h-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold"
                        style={{ left: `${prevWidth}%`, width: `${width}%` }}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const ratio = item.value / item.weight;
                  const inKnapsack = knapsack.find(k => k.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border-2 ${
                        currentItem?.id === item.id ? 'border-yellow-500 bg-yellow-50' :
                        inKnapsack ? 'border-green-500 bg-green-50' :
                        'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{item.name}</span>
                        <span className="text-sm bg-amber-100 px-2 py-1 rounded">Ratio: {ratio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Weight: {item.weight}</span>
                        <span>Value: {item.value}</span>
                      </div>
                      {inKnapsack && (
                        <div className="mt-2 text-sm font-semibold text-green-600">
                          ✓ {(inKnapsack.fraction * 100).toFixed(1)}% taken (Value: {inKnapsack.takenValue.toFixed(2)})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Knapsack Capacity:</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                disabled={isRunning}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={runFractionalKnapsack} disabled={isRunning} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Algorithm'}
              </button>
              {isRunning && <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{isPaused ? 'Resume' : 'Pause'}</button>}
              <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="2000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
              <a href="/greedyalgorithms" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Result Summary</h3>
              <div className="space-y-3">
                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600">{totalValue.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xl font-bold text-gray-800">{capacity - remainingCapacity}</div>
                    <div className="text-xs text-gray-600">Weight Used</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xl font-bold text-gray-800">{remainingCapacity}</div>
                    <div className="text-xs text-gray-600">Remaining</div>
                  </div>
                </div>
              </div>
            </div>

            {knapsack.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Items</h3>
                <div className="space-y-2">
                  {knapsack.map((item) => (
                    <div key={item.id} className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-sm text-gray-600">{(item.fraction * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Weight: {item.takenWeight.toFixed(2)} | Value: {item.takenValue.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Value/Weight Ratios</h3>
              <div className="space-y-2">
                {[...items]
                  .map(item => ({ ...item, ratio: item.value / item.weight }))
                  .sort((a, b) => b.ratio - a.ratio)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${(item.ratio / Math.max(...items.map(i => i.value / i.weight))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-amber-600 w-12 text-right">{item.ratio.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto text-sm">
                {log.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      entry.includes('✓') ? 'text-green-700 bg-green-50' :
                      entry.includes('✗') ? 'text-red-700 bg-red-50' :
                      'text-gray-700'
                    }`}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(n log n)</p>
                <p><strong>Space Complexity:</strong> O(n)</p>
                <p><strong>Approach:</strong> Greedy (max value/weight ratio)</p>
                <p><strong>Use Case:</strong> Resource allocation, optimization</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FractionalKnapsackVisualize;