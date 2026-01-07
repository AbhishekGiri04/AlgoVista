import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ActivitySelectionVisualize = () => {
  const [activities, setActivities] = useState([
    { id: 1, start: 1, end: 4, name: 'A1' },
    { id: 2, start: 3, end: 5, name: 'A2' },
    { id: 3, start: 0, end: 6, name: 'A3' },
    { id: 4, start: 5, end: 7, name: 'A4' },
    { id: 5, start: 8, end: 9, name: 'A5' },
    { id: 6, start: 5, end: 9, name: 'A6' }
  ]);

  const [selected, setSelected] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [rejected, setRejected] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setSelected([]);
    setCurrentActivity(null);
    setRejected([]);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', 'Activities sorted by end time']);
  };

  const runActivitySelection = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const sorted = [...activities].sort((a, b) => a.end - b.end);
    const newLog = [...log];
    const selectedActs = [];
    const rejectedActs = [];
    let lastEnd = -1;

    newLog.push(`Sorted order: ${sorted.map(a => a.name).join(', ')}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    for (const activity of sorted) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      setCurrentActivity(activity);
      newLog.push(`Considering ${activity.name} [${activity.start}, ${activity.end}]`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (activity.start >= lastEnd) {
        selectedActs.push(activity);
        lastEnd = activity.end;
        setSelected([...selectedActs]);
        newLog.push(`✓ Selected ${activity.name} (no overlap)`);
      } else {
        rejectedActs.push(activity);
        setRejected([...rejectedActs]);
        newLog.push(`✗ Rejected ${activity.name} (overlaps with previous)`);
      }
      
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    setCurrentActivity(null);
    setIsRunning(false);
    newLog.push(`Total selected: ${selectedActs.length} activities`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getActivityColor = (activity) => {
    if (currentActivity?.id === activity.id) return '#F59E0B';
    if (selected.some(a => a.id === activity.id)) return '#10B981';
    if (rejected.some(a => a.id === activity.id)) return '#EF4444';
    return '#6B7280';
  };

  const maxTime = Math.max(...activities.map(a => a.end));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">Activity Selection</h1>
          <p className="text-emerald-600">Maximum non-overlapping activities using greedy approach</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Timeline Visualization</h2>
            
            <div className="relative bg-gray-50 rounded-lg p-6 h-96">
              <svg width="100%" height="100%" viewBox="0 0 600 350">
                {/* Timeline axis */}
                <line x1="50" y1="320" x2="550" y2="320" stroke="#374151" strokeWidth="2" />
                {Array.from({ length: maxTime + 1 }, (_, i) => (
                  <g key={i}>
                    <line x1={50 + (i * 500 / maxTime)} y1="315" x2={50 + (i * 500 / maxTime)} y2="325" stroke="#374151" strokeWidth="2" />
                    <text x={50 + (i * 500 / maxTime)} y="340" textAnchor="middle" className="text-xs fill-gray-600">{i}</text>
                  </g>
                ))}

                {/* Activities */}
                {activities.map((activity, idx) => {
                  const x = 50 + (activity.start * 500 / maxTime);
                  const width = ((activity.end - activity.start) * 500 / maxTime);
                  const y = 50 + idx * 40;
                  const color = getActivityColor(activity);

                  return (
                    <g key={activity.id}>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height="30"
                        fill={color}
                        stroke="#1F2937"
                        strokeWidth="2"
                        rx="4"
                      />
                      <text x={x + width / 2} y={y + 20} textAnchor="middle" className="text-sm font-bold fill-white">
                        {activity.name}
                      </text>
                      <text x="30" y={y + 20} textAnchor="end" className="text-xs fill-gray-600">
                        [{activity.start},{activity.end}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={runActivitySelection} disabled={isRunning} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Selection'}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-semibold">✓ Selected: {selected.length}</span>
                  <span className="text-red-600 font-semibold">✗ Rejected: {rejected.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((selected.length + rejected.length) / activities.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {selected.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Activities</h3>
                <div className="space-y-2">
                  {selected.map((activity) => (
                    <div key={activity.id} className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                      <div className="flex justify-between">
                        <span className="font-bold">{activity.name}</span>
                        <span className="text-gray-600">[{activity.start}, {activity.end}]</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Activities List</h3>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-2 rounded flex justify-between ${
                      selected.some(a => a.id === activity.id) ? 'bg-green-100' :
                      rejected.some(a => a.id === activity.id) ? 'bg-red-100' :
                      currentActivity?.id === activity.id ? 'bg-yellow-100' :
                      'bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{activity.name}</span>
                    <span className="text-gray-600">Start: {activity.start}, End: {activity.end}</span>
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
                <p><strong>Approach:</strong> Greedy (earliest finish time)</p>
                <p><strong>Use Case:</strong> Scheduling, resource allocation</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelectionVisualize;