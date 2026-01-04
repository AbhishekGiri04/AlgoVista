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
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      color: '#1e293b',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/sortingalgorithms" style={{
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
        ← Back to Sorting Algorithms
      </a>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          color: '#1e293b',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Quick Sort Visualization
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', textAlign: 'center' }}>
          Pivot-based Efficient Sorting Algorithm
        </p>
      </motion.div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        padding: '40px',
        marginBottom: '40px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            marginBottom: '20px', 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#1e293b'
          }}>Array Elements</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
            gap: '15px', 
            marginBottom: '25px',
            maxWidth: '800px'
          }}>
            {array.map((value, index) => (
              <motion.div 
                key={index} 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{ 
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  padding: '4px',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <input
                  type="number"
                  value={value}
                  onChange={(e) => updateElement(index, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#1e293b',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => removeElement(index)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addElement} 
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>+</span> Add Element
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRandom} 
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Generate Random
            </motion.button>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runQuickSort}
            disabled={loading}
            style={{
              background: loading 
                ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                : 'linear-gradient(135deg, #ef4444, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading 
                ? 'none'
                : '0 10px 30px rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '200px',
              justifyContent: 'center'
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%'
                  }}
                />
                Processing...
              </>
            ) : (
              <>
                Start Quick Sort
              </>
            )}
          </motion.button>

          {steps.length > 0 && (
            <>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isPlaying ? pause : play} 
                style={{
                  background: isPlaying 
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  boxShadow: isPlaying 
                    ? '0 8px 25px rgba(239, 68, 68, 0.3)'
                    : '0 8px 25px rgba(16, 185, 129, 0.3)'
                }}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset} 
                style={{
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  boxShadow: '0 8px 25px rgba(107, 114, 128, 0.3)'
                }}
              >
                Reset
              </motion.button>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <label style={{ fontWeight: '600', color: '#475569' }}>Speed:</label>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  style={{ 
                    width: '120px',
                    accentColor: '#ef4444'
                  }}
                />
                <span style={{ 
                  color: '#64748b', 
                  fontSize: '14px',
                  minWidth: '60px'
                }}>{speed}ms</span>
              </div>

              <div style={{ 
                color: '#64748b',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                Step {currentStep + 1} / {steps.length}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '24px',
        padding: '50px',
        minHeight: '500px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          height: '350px',
          gap: '12px',
          padding: '30px',
          position: 'relative',
          zIndex: 1
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
          gap: '30px',
          marginTop: '30px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          {[
            { color: 'linear-gradient(135deg, #10b981, #059669)', label: 'Sorted' },
            { color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', label: 'Pivot' },
            { color: 'linear-gradient(135deg, #f59e0b, #d97706)', label: 'Comparing' },
            { color: 'linear-gradient(135deg, #ef4444, #dc2626)', label: 'Swapping' },
            { color: 'linear-gradient(135deg, #06b6d4, #0891b2)', label: 'Active Range' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                background: item.color,
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }} />
              <span style={{ 
                fontSize: '15px', 
                color: '#475569',
                fontWeight: '600'
              }}>{item.label}</span>
            </motion.div>
          ))}
        </div>

        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              marginTop: '40px',
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{ 
              marginBottom: '15px', 
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Current Operation: <motion.span 
                animate={{ 
                  color: currentStepData.type === 'compare' ? '#f59e0b' : 
                        currentStepData.type === 'swap' ? '#ef4444' :
                        currentStepData.type.includes('pivot') ? '#8b5cf6' : '#10b981'
                }}
                style={{ fontWeight: '800' }}
              >
                {currentStepData.type.toUpperCase().replace('_', ' ')}
              </motion.span>
            </h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                color: '#64748b', 
                fontSize: '18px',
                fontWeight: '500',
                lineHeight: '1.6'
              }}
            >
              {currentStepData.description || 'Quick Sort in progress...'}
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Algorithm Analysis Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto 0',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            color: '#1e293b',
            fontSize: '1.5rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>Time Complexity Analysis</h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'end', 
            height: '200px', 
            marginBottom: '25px',
            padding: '20px 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '120px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '11px'
              }}>O(n log n)</div>
              <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Best Case</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Good pivot</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '120px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '11px'
              }}>O(n log n)</div>
              <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Average Case</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Random pivot</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '160px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '12px'
              }}>O(n²)</div>
              <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Worst Case</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Bad pivot</span>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h4 style={{ color: '#d97706', marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Performance Insights</h4>
            <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
              <li>Pivot selection affects performance</li>
              <li>Cache-efficient due to in-place sorting</li>
              <li>Average case is very fast in practice</li>
              <li>Randomized version avoids worst case</li>
            </ul>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            color: '#1e293b',
            fontSize: '1.5rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>Space Complexity Analysis</h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'end', 
            height: '200px', 
            marginBottom: '25px',
            padding: '20px 0'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '80px',
                height: '100px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '14px'
              }}>O(log n)</div>
              <span style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', fontWeight: '600' }}>Recursion Stack</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>In-place sorting</span>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <h4 style={{ color: '#7c3aed', marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>Memory Usage</h4>
            <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
              <li>In-place sorting algorithm</li>
              <li>Only recursion stack space needed</li>
              <li>O(log n) average stack depth</li>
              <li>O(n) worst case stack depth</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '40px auto 0',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '24px',
        padding: '50px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          textAlign: 'center',
          marginBottom: '40px', 
          color: '#1e293b',
          fontSize: '2rem',
          fontWeight: '800'
        }}>How Quick Sort Works</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: '700'
            }}>1</div>
            <h4 style={{ color: '#d97706', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Choose Pivot</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Select a pivot element from the array (first, last, or random)</p>
          </div>
          
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: '700'
            }}>2</div>
            <h4 style={{ color: '#7c3aed', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Partition</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Rearrange array so smaller elements are left of pivot, larger on right</p>
          </div>
          
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: '700'
            }}>3</div>
            <h4 style={{ color: '#059669', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Recurse</h4>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>Recursively apply quick sort to the left and right partitions</p>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <h4 style={{ color: '#d97706', marginBottom: '20px', fontSize: '20px', fontWeight: '700', textAlign: 'center' }}>Pivot-Based Partitioning</h4>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.8', textAlign: 'center', margin: 0 }}>
            Quick Sort's efficiency comes from its partitioning strategy. By choosing a good pivot and partitioning 
            the array around it, we can divide the problem into smaller subproblems. The key insight is that after 
            partitioning, the pivot is in its final sorted position, and we only need to sort the two partitions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickSortVisualize;