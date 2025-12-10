import React, { useState, useEffect } from 'react';

const JobSchedulingVisualize = () => {
  const [jobs, setJobs] = useState([
    { id: 'A', deadline: 2, profit: 100 },
    { id: 'B', deadline: 1, profit: 19 },
    { id: 'C', deadline: 2, profit: 27 },
    { id: 'D', deadline: 1, profit: 25 },
    { id: 'E', deadline: 3, profit: 15 }
  ]);
  const [steps, setSteps] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [maxDeadline, setMaxDeadline] = useState(3);
  const [speed, setSpeed] = useState(1200);

  const runVisualization = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/jobscheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs })
      });
      const data = await response.json();
      
      if (data.steps) {
        setSteps(data.steps);
        setSchedule(data.schedule);
        setTotalProfit(data.totalProfit);
        setMaxDeadline(data.maxDeadline);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const playVisualization = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const addJob = () => {
    const newId = String.fromCharCode(65 + jobs.length);
    setJobs([...jobs, { id: newId, deadline: 1, profit: 10 }]);
  };

  const removeJob = (index) => {
    setJobs(jobs.filter((_, i) => i !== index));
  };

  const updateJob = (index, field, value) => {
    const newJobs = [...jobs];
    newJobs[index][field] = field === 'id' ? value : parseInt(value) || 0;
    setJobs(newJobs);
  };

  const renderJobsTable = () => (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>📋 Jobs Input</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 100px 100px 80px', gap: '10px', marginBottom: '15px' }}>
        <div style={{ fontWeight: '600', color: '#94a3b8' }}>Job ID</div>
        <div style={{ fontWeight: '600', color: '#94a3b8' }}>Deadline</div>
        <div style={{ fontWeight: '600', color: '#94a3b8' }}>Profit</div>
        <div style={{ fontWeight: '600', color: '#94a3b8' }}>Action</div>
        
        {jobs.map((job, index) => (
          <React.Fragment key={index}>
            <input
              type="text"
              value={job.id}
              onChange={(e) => updateJob(index, 'id', e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '2px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                textAlign: 'center'
              }}
            />
            <input
              type="number"
              value={job.deadline}
              onChange={(e) => updateJob(index, 'deadline', e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '2px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                textAlign: 'center'
              }}
            />
            <input
              type="number"
              value={job.profit}
              onChange={(e) => updateJob(index, 'profit', e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '2px solid #374151',
                backgroundColor: '#1e293b',
                color: 'white',
                textAlign: 'center'
              }}
            />
            <button
              onClick={() => removeJob(index)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#ef4444',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </React.Fragment>
        ))}
      </div>
      
      <button
        onClick={addJob}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid #22c55e',
          backgroundColor: 'transparent',
          color: '#22c55e',
          cursor: 'pointer'
        }}
      >
        + Add Job
      </button>
    </div>
  );

  const renderGanttChart = () => {
    if (!schedule.length) return null;
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#22c55e', marginBottom: '15px' }}>📊 Gantt Chart</h3>
        <div style={{ display: 'flex', gap: '2px' }}>
          {schedule.map((slot, index) => (
            <div
              key={index}
              style={{
                width: '80px',
                height: '60px',
                border: '2px solid #374151',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: slot.jobId ? '#22c55e' : '#374151',
                color: 'white',
                fontWeight: '600'
              }}
            >
              <div style={{ fontSize: '18px' }}>{slot.jobId || 'Empty'}</div>
              <div style={{ fontSize: '12px' }}>t={slot.timeSlot}</div>
              {slot.jobId && <div style={{ fontSize: '10px' }}>₹{slot.profit}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    if (!steps.length) return null;
    
    const step = steps[currentStep];
    const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
    
    return (
      <div style={{ margin: '30px 0', fontFamily: 'monospace', fontSize: '16px' }}>
        {/* Greedy Strategy */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#7c3aed15',
          borderRadius: '12px',
          border: '2px solid #7c3aed'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            🎯 Greedy Strategy: Sort by Profit (Descending)
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {sortedJobs.map((job, index) => (
              <div
                key={job.id}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: job.id === step.jobId ? '#3b82f6' : '#64748b',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {job.id}: ₹{job.profit} (d={job.deadline})
              </div>
            ))}
          </div>
        </div>

        {/* Current Job Processing */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: step.scheduled ? '#22c55e15' : '#ef444415',
          borderRadius: '12px',
          border: `2px solid ${step.scheduled ? '#22c55e' : '#ef4444'}`
        }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
            Processing Job {step.jobId}
          </div>
          <div style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '8px' }}>
            Deadline: {step.deadline} | Profit: ₹{step.profit}
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
            {step.action}
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>
            Total Profit: ₹{step.totalProfit}
          </div>
        </div>

        {/* Time Slots Visualization */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
            🕐 Time Slots Status
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: maxDeadline }, (_, i) => {
              const slotNumber = i + 1;
              const currentSchedule = schedule.find(s => s.timeSlot === slotNumber);
              const isCurrentSlot = step.timeSlot === slotNumber;
              
              return (
                <div
                  key={i}
                  style={{
                    width: '60px',
                    height: '60px',
                    border: `3px solid ${isCurrentSlot ? '#3b82f6' : '#374151'}`,
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: currentSchedule?.jobId ? '#22c55e' : '#1e293b',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  <div>Slot {slotNumber}</div>
                  <div>{currentSchedule?.jobId || 'Free'}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>
            🧮 Algorithm: For each job (sorted by profit), find the latest available slot ≤ deadline
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Time Complexity: O(n log n) for sorting + O(n × d) for scheduling = O(n²) worst case
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/branchandbound" style={{
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        ← Back to Branch & Bound
      </a>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          📅 Job Scheduling Visualizer
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Job Sequencing with Deadlines using Greedy Algorithm
        </p>
        <div style={{ fontSize: '14px', color: '#64748b', marginTop: '10px' }}>
          <span style={{ backgroundColor: '#22c55e', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🟢 Scheduled</span>
          <span style={{ backgroundColor: '#ef4444', padding: '2px 8px', borderRadius: '4px', marginRight: '10px' }}>🔴 Rejected</span>
          <span style={{ backgroundColor: '#3b82f6', padding: '2px 8px', borderRadius: '4px' }}>🔵 Current</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        {/* Jobs Input */}
        {renderJobsTable()}

        {/* Speed Control */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Speed (ms):</label>
          <input
            type="range"
            min="500"
            max="3000"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            style={{ width: '200px' }}
          />
          <span style={{ marginLeft: '10px', fontSize: '14px', color: '#94a3b8' }}>{speed}ms</span>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button
            onClick={runVisualization}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Scheduling...' : 'Schedule Jobs'}
          </button>
          
          <button
            onClick={playVisualization}
            disabled={!steps.length || isPlaying}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? 'Playing...' : 'Play'}
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={!steps.length || currentStep === 0}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={!steps.length || currentStep >= steps.length - 1}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        </div>

        {/* Result Summary */}
        {totalProfit > 0 && (
          <div style={{ 
            marginBottom: '30px', 
            padding: '20px', 
            backgroundColor: '#22c55e15',
            borderRadius: '12px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#22c55e' }}>
              🏆 Optimal Schedule Found!
            </div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              Scheduled Jobs: {schedule.filter(s => s.jobId).map(s => s.jobId).join(' → ')}
            </div>
            <div style={{ fontSize: '16px', color: '#94a3b8' }}>
              Maximum Profit: ₹{totalProfit}
            </div>
          </div>
        )}

        {/* Gantt Chart */}
        {renderGanttChart()}

        {/* Progress */}
        {steps.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>Processing jobs by profit priority...</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#374151',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '30px',
          minHeight: '400px'
        }}>
          {steps.length > 0 ? renderVisualization() : (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '18px' }}>
              Add jobs and click "Schedule Jobs" to start visualization
            </div>
          )}
        </div>

        {/* Algorithm Info */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(124, 58, 237, 0.1)',
          borderRadius: '12px',
          border: '2px solid #7c3aed'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#7c3aed' }}>Job Scheduling Algorithm:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Greedy Approach:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li>📊 Sort jobs by profit (descending)</li>
                <li>🎯 For each job, find latest available slot ≤ deadline</li>
                <li>✅ Schedule if slot available, reject otherwise</li>
                <li>💰 Maximizes total profit</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#a78bfa', marginBottom: '10px' }}>Complexity:</h4>
              <ul style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px' }}>
                <li><strong>Time:</strong> O(n log n) + O(n × d)</li>
                <li><strong>Space:</strong> O(d) for time slots</li>
                <li><strong>Optimal:</strong> Yes, for unit-time jobs</li>
                <li><strong>Applications:</strong> CPU scheduling, task management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSchedulingVisualize;