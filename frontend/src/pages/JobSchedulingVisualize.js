import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const JobSchedulingVisualize = () => {
  const [jobs, setJobs] = useState([
    { id: 1, name: 'Job A', deadline: 2, profit: 100 },
    { id: 2, name: 'Job B', deadline: 1, profit: 19 },
    { id: 3, name: 'Job C', deadline: 2, profit: 27 },
    { id: 4, name: 'Job D', deadline: 1, profit: 25 },
    { id: 5, name: 'Job E', deadline: 3, profit: 15 }
  ]);

  const [schedule, setSchedule] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [currentJob, setCurrentJob] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, [jobs]);

  const reset = () => {
    setSchedule([]);
    setTotalProfit(0);
    setCurrentJob(null);
    const maxDeadline = Math.max(...jobs.map(j => j.deadline));
    setSlots(Array(maxDeadline).fill(null));
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', `Jobs: ${jobs.length}`, 'Sorted by profit (descending)']);
  };

  const runJobScheduling = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
    const maxDeadline = Math.max(...jobs.map(j => j.deadline));
    const timeSlots = Array(maxDeadline).fill(null);
    const scheduled = [];
    let profit = 0;
    const newLog = [...log];

    newLog.push(`Sorted: ${sorted.map(j => `${j.name}(${j.profit})`).join(', ')}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    for (const job of sorted) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      setCurrentJob(job);
      newLog.push(`Considering ${job.name}: profit=${job.profit}, deadline=${job.deadline}`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      // Find latest available slot before deadline
      let slotFound = false;
      for (let t = Math.min(job.deadline - 1, maxDeadline - 1); t >= 0; t--) {
        if (timeSlots[t] === null) {
          timeSlots[t] = job;
          scheduled.push({ ...job, slot: t });
          profit += job.profit;
          slotFound = true;
          
          setSlots([...timeSlots]);
          setSchedule([...scheduled]);
          setTotalProfit(profit);
          
          newLog.push(`✓ Scheduled ${job.name} at time slot ${t + 1} (profit: ${job.profit})`);
          setLog([...newLog]);
          break;
        }
      }

      if (!slotFound) {
        newLog.push(`✗ Cannot schedule ${job.name} (no available slots before deadline)`);
        setLog([...newLog]);
      }

      await new Promise(resolve => setTimeout(resolve, speed));
    }

    setCurrentJob(null);
    setIsRunning(false);
    newLog.push(`Total profit: ${profit}`);
    newLog.push(`Jobs scheduled: ${scheduled.length}/${jobs.length}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b'
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

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Job Scheduling Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Optimal task allocation with deadlines to maximize profit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule Timeline</h2>
            
            <div className="relative bg-gray-50 rounded-lg p-6 h-96">
              <div className="space-y-4">
                {slots.map((job, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-semibold text-gray-600">
                      Slot {idx + 1}
                    </div>
                    <div className={`flex-1 h-16 rounded-lg border-2 flex items-center justify-center font-bold transition-all ${
                      job ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-gray-300 border-dashed'
                    }`}>
                      {job ? (
                        <div className="text-center">
                          <div className="text-lg text-indigo-700">{job.name}</div>
                          <div className="text-xs text-gray-600">Profit: {job.profit}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Empty</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={runJobScheduling} disabled={isRunning} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Scheduling'}
              </button>
              {isRunning && <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{isPaused ? 'Resume' : 'Pause'}</button>}
              <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="2000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {totalProfit > 0 && (
              <div className="bg-white rounded-xl shadow-lg" style={{ padding: '1rem' }}>
                <h3 className="text-lg font-semibold text-gray-800" style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Result Summary</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Profit:</div>
                    <div className="text-3xl font-bold text-indigo-600">{totalProfit}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">Scheduled</div>
                      <div className="text-xl font-bold text-gray-800">{schedule.length}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">Skipped</div>
                      <div className="text-xl font-bold text-gray-800">{jobs.length - schedule.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg" style={{ padding: '1rem' }}>
              <h3 className="text-lg font-semibold text-gray-800" style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Jobs</h3>
              <div className="space-y-2">
                {[...jobs].sort((a, b) => b.profit - a.profit).map((job) => {
                  const isScheduled = schedule.some(s => s.id === job.id);
                  const isCurrent = currentJob?.id === job.id;
                  return (
                    <div
                      key={job.id}
                      className={`p-3 rounded border-2 ${
                        isCurrent ? 'bg-yellow-50 border-yellow-500' :
                        isScheduled ? 'bg-indigo-50 border-indigo-500' :
                        'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{job.name}</span>
                        {isScheduled && (
                          <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded">
                            Slot {schedule.find(s => s.id === job.id).slot + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>Deadline: {job.deadline}</span>
                        <span>Profit: {job.profit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg" style={{ padding: '1rem' }}>
              <h3 className="text-lg font-semibold text-gray-800" style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Algorithm Steps</h3>
              <div className="space-y-2 text-sm text-gray-600" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                <div className="p-2 bg-gray-50 rounded">1. Sort jobs by profit (descending)</div>
                <div className="p-2 bg-gray-50 rounded">2. For each job, find latest available slot before deadline</div>
                <div className="p-2 bg-gray-50 rounded">3. Schedule job if slot available</div>
                <div className="p-2 bg-gray-50 rounded">4. Skip job if no slot available</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg" style={{ padding: '1rem' }}>
              <h3 className="text-lg font-semibold text-gray-800" style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Algorithm Log</h3>
              <div className="space-y-1 text-sm" style={{ maxHeight: '120px', overflowY: 'auto' }}>
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

            <div className="bg-white rounded-xl shadow-lg" style={{ padding: '1rem' }}>
              <h3 className="text-lg font-semibold text-gray-800" style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Time:</strong> <span>O(n² log n)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Space:</strong> <span>O(n)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Approach:</strong> <span>Greedy</span>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <strong style={{ fontSize: '0.8rem' }}>Use Case:</strong>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', lineHeight: '1.3' }}>Task scheduling, resource allocation</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobSchedulingVisualize;