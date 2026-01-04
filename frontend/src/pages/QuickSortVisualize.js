import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuickSortVisualize = () => {
  const [array, setArray] = useState([10, 7, 8, 9, 1, 5]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const runQuickSort = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/quicksort/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array })
      });
      const data = await response.json();
      if (data.steps) {
        setSteps(data.steps);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to client-side quick sort
      const clientSteps = generateQuickSortSteps([...array]);
      setSteps(clientSteps);
      setCurrentStep(0);
    }
    setLoading(false);
  };

  const generateQuickSortSteps = (arr) => {
    const steps = [];
    
    const quickSort = (array, low, high) => {
      if (low < high) {
        steps.push({
          arr: [...array],
          type: 'partition_start',
          low,
          high,
          pivot: high,
          description: `Starting partition from ${low} to ${high}, pivot: ${array[high]}`
        });
        
        const pi = partition(array, low, high);
        
        steps.push({
          arr: [...array],
          type: 'pivot_placed',
          low,
          high,
          pivot: pi,
          description: `Pivot ${array[pi]} placed at correct position ${pi}`
        });
        
        quickSort(array, low, pi - 1);
        quickSort(array, pi + 1, high);
      }
    };
    
    const partition = (array, low, high) => {
      const pivot = array[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        steps.push({
          arr: [...array],
          type: 'compare',
          low,
          high,
          pivot: high,
          comparing: j,
          i: i + 1,
          description: `Comparing ${array[j]} with pivot ${pivot}`
        });
        
        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          
          steps.push({
            arr: [...array],
            type: 'swap',
            low,
            high,
            pivot: high,
            swapped: [i, j],
            description: `Swapped ${array[i]} and ${array[j]}`
          });
        }
      }
      
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      
      steps.push({
        arr: [...array],
        type: 'pivot_swap',
        low,
        high,
        pivot: i + 1,
        swapped: [i + 1, high],
        description: `Placed pivot ${array[i + 1]} at position ${i + 1}`
      });
      
      return i + 1;
    };
    
    quickSort([...arr], 0, arr.length - 1);
    steps.push({ arr: [...arr].sort((a, b) => a - b), type: 'done', description: 'Quick Sort completed!' });
    return steps;
  };

  const play = () => {
    if (steps.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const pause = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    pause();
    setCurrentStep(0);
  };

  const addElement = () => {
    const newValue = Math.floor(Math.random() * 100) + 1;
    setArray([...array, newValue]);
  };

  const removeElement = (index) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const updateElement = (index, value) => {
    const newArray = [...array];
    newArray[index] = parseInt(value) || 0;
    setArray(newArray);
  };

  const generateRandom = () => {
    const size = Math.floor(Math.random() * 6) + 5;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const currentStepData = steps[currentStep] || { arr: array, type: 'start' };
  const maxValue = Math.max(...(currentStepData.arr || array));

  const getBarColor = (index, value) => {
    const { type, pivot, comparing, swapped, low, high } = currentStepData;
    
    if (type === 'done') {
      return 'linear-gradient(135deg, #10b981, #059669)';
    }
    
    if (pivot !== undefined && index === pivot) {
      return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    }
    
    if (comparing !== undefined && index === comparing) {
      return 'linear-gradient(135deg, #f59e0b, #d97706)';
    }
    
    if (swapped && swapped.includes(index)) {
      return 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    if (low !== undefined && high !== undefined && index >= low && index <= high) {
      return 'linear-gradient(135deg, #06b6d4, #0891b2)';
    }
    
    const intensity = value / maxValue;
    if (intensity > 0.7) return 'linear-gradient(135deg, #6366f1, #4f46e5)';
    if (intensity > 0.4) return 'linear-gradient(135deg, #6b7280, #4b5563)';
    return 'linear-gradient(135deg, #374151, #1f2937)';
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          background: 'linear-gradient(135deg, #ef4444, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          ⚡ Quick Sort Visualization
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Pivot-based Efficient Sorting Algorithm
        </p>
      </motion.div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Array Elements</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
            {array.map((value, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => updateElement(index, e.target.value)}
                  style={{
                    width: '60px',
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#1e293b',
                    color: 'white',
                    textAlign: 'center'
                  }}
                />
                <button
                  onClick={() => removeElement(index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={addElement} style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Add Element
            </button>
            <button onClick={generateRandom} style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Generate Random
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={runQuickSort}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Processing...' : '⚡ Start Quick Sort'}
          </button>

          {steps.length > 0 && (
            <>
              <button onClick={isPlaying ? pause : play} style={{
                background: isPlaying ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>

              <button onClick={reset} style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                🔄 Reset
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label>Speed:</label>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span>{speed}ms</span>
              </div>

              <div style={{ color: '#94a3b8' }}>
                Step {currentStep + 1} / {steps.length}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px',
        padding: '40px',
        minHeight: '400px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          height: '300px',
          gap: '8px',
          padding: '20px'
        }}>
          <AnimatePresence>
            {(currentStepData.arr || array).map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  height: `${(value / maxValue) * 250}px`
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  layout: { duration: 0.4 }
                }}
                style={{
                  width: '50px',
                  background: getBarColor(index, value),
                  borderRadius: '8px 8px 4px 4px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  paddingBottom: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.1)'
                }}
              >
                <span style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  zIndex: 1
                }}>
                  {value}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          {[
            { color: '#10b981', label: '🟢 Sorted' },
            { color: '#8b5cf6', label: '🟣 Pivot' },
            { color: '#f59e0b', label: '🟡 Comparing' },
            { color: '#ef4444', label: '🔴 Swapping' },
            { color: '#06b6d4', label: '🔷 Active Range' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                background: item.color,
                borderRadius: '4px'
              }} />
              <span style={{ fontSize: '14px', color: '#e2e8f0' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px'
            }}
          >
            <h3 style={{ marginBottom: '10px', color: '#f1f5f9' }}>
              Current Operation: <span style={{ 
                color: currentStepData.type === 'compare' ? '#f59e0b' : 
                      currentStepData.type === 'swap' ? '#ef4444' :
                      currentStepData.type.includes('pivot') ? '#8b5cf6' : '#10b981'
              }}>
                {currentStepData.type.toUpperCase().replace('_', ' ')}
              </span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>
              {currentStepData.description || 'Quick Sort in progress...'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuickSortVisualize;