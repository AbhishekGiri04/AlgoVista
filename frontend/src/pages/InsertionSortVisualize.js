import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InsertionSortVisualize = () => {
  const [array, setArray] = useState([5, 3, 8, 4, 2]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const runInsertionSort = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://algovista-flux.onrender.com/api/insertionsort/visualize', {
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
    }
    setLoading(false);
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

  const currentStepData = steps[currentStep] || { arr: array, type: 'start', i: -1, j: -1, keyIdx: -1 };
  const maxValue = Math.max(...(currentStepData.arr || array));

  const getBarColor = (index, value) => {
    const { i, j, keyIdx, type } = currentStepData;
    
    // Sorted portion (green)
    if (index < i) {
      return 'linear-gradient(135deg, #10b981, #059669)';
    }
    
    // Key element being inserted (blue)
    if (index === keyIdx) {
      return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    }
    
    // Currently comparing (yellow)
    if (index === j && type === 'compare') {
      return 'linear-gradient(135deg, #f59e0b, #d97706)';
    }
    
    // Shifting elements (red)
    if (index === j && type === 'shift') {
      return 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    // Element being inserted into position (cyan)
    if (index === j && type === 'insert') {
      return 'linear-gradient(135deg, #06b6d4, #0891b2)';
    }
    
    // Default unsorted (purple/indigo gradient based on height)
    const intensity = value / maxValue;
    if (intensity > 0.7) return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    if (intensity > 0.4) return 'linear-gradient(135deg, #6366f1, #4f46e5)';
    return 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

  const getStepDescription = () => {
    const { type, i, j, keyIdx } = currentStepData;
    
    switch (type) {
      case 'start':
        return 'Starting Insertion Sort - Building sorted portion from left to right';
      case 'key_selected':
        return `Selected key element at position ${keyIdx} to insert into sorted portion`;
      case 'compare':
        return `Comparing key with element at position ${j}`;
      case 'shift':
        return `Shifting element at position ${j} to the right to make space`;
      case 'insert':
        return `Inserting key element at position ${j}`;
      case 'done':
        return 'Insertion Sort completed! Array is now sorted';
      default:
        return 'Insertion Sort in progress...';
    }
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🃏 Insertion Sort Visualization
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
          Interactive Insertion Sort - Like sorting cards in your hand
        </p>
      </motion.div>

      {/* Controls */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        {/* Array Input */}
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
              background: '#3b82f6',
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

        {/* Visualization Controls */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={runInsertionSort}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Processing...' : '🃏 Start Insertion Sort'}
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
                  max="1500"
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

      {/* Visualization */}
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
                  layout: { duration: 0.5 }
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
                  border: '2px solid rgba(255,255,255,0.1)',
                  position: 'relative'
                }}
              >
                <span style={{ 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  zIndex: 1
                }}>
                  {value}
                </span>
                
                {/* Special highlighting for active elements */}
                {(currentStepData.keyIdx === index || currentStepData.j === index) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      background: currentStepData.keyIdx === index 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(29, 78, 216, 0.5))'
                        : currentStepData.type === 'shift'
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(220, 38, 38, 0.5))'
                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.5), rgba(217, 119, 6, 0.5))',
                      borderRadius: '12px',
                      filter: 'blur(8px)',
                      zIndex: -1
                    }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          {[
            { color: '#10b981', label: '🟢 Sorted' },
            { color: '#3b82f6', label: '🔵 Key Element' },
            { color: '#f59e0b', label: '🟡 Comparing' },
            { color: '#ef4444', label: '🔴 Shifting' },
            { color: '#06b6d4', label: '🔷 Inserting' },
            { color: '#6366f1', label: '⚪ Unsorted' }
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

        {/* Step Information */}
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
                color: currentStepData.type === 'shift' ? '#ef4444' : 
                      currentStepData.type === 'key_selected' ? '#3b82f6' :
                      currentStepData.type === 'compare' ? '#f59e0b' : 
                      currentStepData.type === 'insert' ? '#06b6d4' : '#10b981'
              }}>
                {currentStepData.type.toUpperCase().replace('_', ' ')}
              </span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>
              {getStepDescription()}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InsertionSortVisualize;