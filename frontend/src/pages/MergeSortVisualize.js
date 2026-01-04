import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MergeSortVisualize = () => {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const runMergeSort = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/mergesort/visualize', {
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
      // Fallback to client-side merge sort
      const clientSteps = generateMergeSortSteps([...array]);
      setSteps(clientSteps);
      setCurrentStep(0);
    }
    setLoading(false);
  };

  const generateMergeSortSteps = (arr) => {
    const steps = [];
    const n = arr.length;
    
    const mergeSort = (array, left, right) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
          arr: [...array],
          type: 'divide',
          left,
          mid,
          right,
          description: `Dividing array from ${left} to ${right}`
        });
        
        mergeSort(array, left, mid);
        mergeSort(array, mid + 1, right);
        merge(array, left, mid, right);
      }
    };
    
    const merge = (array, left, mid, right) => {
      const leftArr = array.slice(left, mid + 1);
      const rightArr = array.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;
      
      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          arr: [...array],
          type: 'compare',
          left,
          right,
          mid,
          comparing: [left + i, mid + 1 + j],
          description: `Comparing ${leftArr[i]} and ${rightArr[j]}`
        });
        
        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          i++;
        } else {
          array[k] = rightArr[j];
          j++;
        }
        
        steps.push({
          arr: [...array],
          type: 'merge',
          left,
          right,
          mid,
          merged: k,
          description: `Placing ${array[k]} at position ${k}`
        });
        
        k++;
      }
      
      while (i < leftArr.length) {
        array[k] = leftArr[i];
        steps.push({
          arr: [...array],
          type: 'merge',
          left,
          right,
          mid,
          merged: k,
          description: `Placing remaining ${array[k]} at position ${k}`
        });
        i++;
        k++;
      }
      
      while (j < rightArr.length) {
        array[k] = rightArr[j];
        steps.push({
          arr: [...array],
          type: 'merge',
          left,
          right,
          mid,
          merged: k,
          description: `Placing remaining ${array[k]} at position ${k}`
        });
        j++;
        k++;
      }
    };
    
    mergeSort([...arr], 0, n - 1);
    steps.push({ arr: [...arr].sort((a, b) => a - b), type: 'done', description: 'Merge Sort completed!' });
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
    const { type, left, right, mid, comparing, merged } = currentStepData;
    
    if (type === 'done') {
      return 'linear-gradient(135deg, #10b981, #059669)';
    }
    
    if (type === 'divide') {
      if (index >= left && index <= right) {
        return 'linear-gradient(135deg, #f59e0b, #d97706)';
      }
    }
    
    if (type === 'compare' && comparing && comparing.includes(index)) {
      return 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    if (type === 'merge' && index === merged) {
      return 'linear-gradient(135deg, #06b6d4, #0891b2)';
    }
    
    if (type === 'merge' && left !== undefined && right !== undefined && index >= left && index <= right) {
      return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
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
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🔀 Merge Sort Visualization
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Divide and Conquer - Split, Sort, and Merge
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
              background: '#8b5cf6',
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
            onClick={runMergeSort}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Processing...' : '🔀 Start Merge Sort'}
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
                  min="400"
                  max="1600"
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
                  layout: { duration: 0.6 }
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
            { color: '#f59e0b', label: '🟡 Dividing' },
            { color: '#ef4444', label: '🔴 Comparing' },
            { color: '#06b6d4', label: '🔷 Merging' },
            { color: '#8b5cf6', label: '🟣 Active Range' }
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
                color: currentStepData.type === 'divide' ? '#f59e0b' : 
                      currentStepData.type === 'compare' ? '#ef4444' :
                      currentStepData.type === 'merge' ? '#06b6d4' : '#10b981'
              }}>
                {currentStepData.type.toUpperCase()}
              </span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>
              {currentStepData.description || 'Merge Sort in progress...'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MergeSortVisualize;