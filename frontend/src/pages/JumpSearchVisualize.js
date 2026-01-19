import React, { useState, useEffect, useRef } from 'react';

const JumpSearchVisualize = () => {
  const [array, setArray] = useState('1,3,5,7,9,11,13,15,17,19,21,23,25');
  const [target, setTarget] = useState('15');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [found, setFound] = useState(false);
  const [blockSize, setBlockSize] = useState(0);
  const [totalComparisons, setTotalComparisons] = useState(0);
  const intervalRef = useRef(null);

  const handleSearch = async () => {
    const arr = array.split(',').map(Number).filter(n => !isNaN(n));
    if (arr.length === 0) {
      alert('Please enter a valid array');
      return;
    }

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i-1]) {
        alert('Array must be sorted for Jump Search!');
        return;
      }
    }

    setIsSearching(true);
    
    try {
      const response = await fetch('https://algovista-dev.onrender.com/api/jumpsearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array: arr, target: Number(target) })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setSteps(result.steps || []);
      setFound(result.found || false);
      setBlockSize(result.blockSize || Math.floor(Math.sqrt(arr.length)));
      setTotalComparisons(result.totalComparisons || 0);
      setCurrentStep(-1);

      if (result.steps && result.steps.length > 0) {
        let stepIndex = 0;
        intervalRef.current = setInterval(() => {
          setCurrentStep(stepIndex);
          stepIndex++;
          
          if (stepIndex >= result.steps.length) {
            clearInterval(intervalRef.current);
            setIsSearching(false);
          }
        }, 1400);
      } else {
        setIsSearching(false);
      }
    } catch (error) {
      const clientResult = clientJumpSearch(arr, Number(target));
      setSteps(clientResult.steps);
      setFound(clientResult.found);
      setBlockSize(clientResult.blockSize);
      setTotalComparisons(clientResult.totalComparisons);
      setCurrentStep(-1);

      if (clientResult.steps.length > 0) {
        let stepIndex = 0;
        intervalRef.current = setInterval(() => {
          setCurrentStep(stepIndex);
          stepIndex++;
          
          if (stepIndex >= clientResult.steps.length) {
            clearInterval(intervalRef.current);
            setIsSearching(false);
          }
        }, 1400);
      } else {
        setIsSearching(false);
      }
    }
  };

  const clientJumpSearch = (arr, target) => {
    const steps = [];
    const n = arr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let stepNum = 1;
    let found = false;

    // Jump phase
    while (arr[Math.min(step, n) - 1] < target) {
      steps.push({
        stepNumber: stepNum++,
        phase: 'jump',
        blockStart: prev,
        blockEnd: Math.min(step, n) - 1,
        checkIndex: Math.min(step, n) - 1,
        comparison: `arr[${Math.min(step, n) - 1}] = ${arr[Math.min(step, n) - 1]} < ${target} → Jump to next block`,
        status: 'continue'
      });
      
      prev = step;
      step += Math.floor(Math.sqrt(n));
      if (prev >= n) break;
    }

    // Linear search phase
    for (let i = prev; i < Math.min(step, n); i++) {
      if (arr[i] === target) {
        steps.push({
          stepNumber: stepNum++,
          phase: 'linear',
          blockStart: prev,
          blockEnd: Math.min(step, n) - 1,
          checkIndex: i,
          comparison: `arr[${i}] = ${arr[i]} == ${target} ✓`,
          status: 'found'
        });
        found = true;
        break;
      } else {
        steps.push({
          stepNumber: stepNum++,
          phase: 'linear',
          blockStart: prev,
          blockEnd: Math.min(step, n) - 1,
          checkIndex: i,
          comparison: `arr[${i}] = ${arr[i]} != ${target} → Continue linear search`,
          status: 'continue'
        });
      }
    }

    return { steps, found, blockSize: Math.floor(Math.sqrt(n)), totalComparisons: steps.length };
  };

  const resetSearch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSteps([]);
    setCurrentStep(-1);
    setIsSearching(false);
    setFound(false);
    setArray('1,3,5,7,9,11,13,15,17,19,21,23,25');
    setTarget('15');
    setBlockSize(0);
    setTotalComparisons(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const arrayData = array.split(',').map(Number).filter(n => !isNaN(n));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      color: '#1e293b',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <a href="/searchingalgorithms" style={{
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
        ← Back to Searching Algorithms
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
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Jump Search Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Interactive visualization of block-based search algorithm
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '24px',
              padding: '40px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 24px',
                textAlign: 'center'
              }}>
                Search Configuration
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '20px', alignItems: 'end' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Sorted Array Elements
                  </label>
                  <input
                    type="text"
                    value={array}
                    onChange={(e) => setArray(e.target.value)}
                    placeholder="1,3,5,7,9,11,13,15,17,19,21,23,25"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontFamily: 'ui-monospace, monospace',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      color: '#000',
                      background: '#fff'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid #f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '2px solid #e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="15"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontFamily: 'ui-monospace, monospace',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      color: '#000',
                      background: '#fff'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid #f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '2px solid #e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    style={{
                      background: isSearching ? '#9ca3af' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                      color: 'white',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSearching ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                    }}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                  
                  <button
                    onClick={resetSearch}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '24px',
              padding: '50px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              minHeight: '400px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap',
                marginBottom: '40px'
              }}>
                {arrayData.map((value, index) => {
                  let bgColor = '#f8fafc';
                  let borderColor = '#e2e8f0';
                  let textColor = '#475569';
                  let transform = 'scale(1)';
                  let shadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

                  if (steps.length > 0 && currentStep >= 0 && currentStep < steps.length) {
                    const step = steps[currentStep];
                    
                    if (index === step.checkIndex) {
                      if (step.status === 'found') {
                        bgColor = '#d1fae5';
                        borderColor = '#10b981';
                        textColor = '#065f46';
                        transform = 'scale(1.15)';
                        shadow = '0 8px 25px rgba(16, 185, 129, 0.6)';
                      } else {
                        bgColor = '#fef3c7';
                        borderColor = '#f59e0b';
                        textColor = '#92400e';
                        transform = 'scale(1.1)';
                        shadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                      }
                    } else if (step.phase === 'jump' && index >= step.blockStart && index <= step.blockEnd) {
                      bgColor = '#fef2f2';
                      borderColor = '#ef4444';
                      textColor = '#991b1b';
                      shadow = '0 6px 15px rgba(239, 68, 68, 0.3)';
                    } else if (step.phase === 'linear' && index >= step.blockStart && index <= step.blockEnd) {
                      bgColor = '#dbeafe';
                      borderColor = '#3b82f6';
                      textColor = '#1e40af';
                      shadow = '0 6px 15px rgba(59, 130, 246, 0.3)';
                    } else {
                      bgColor = '#f1f5f9';
                      borderColor = '#cbd5e1';
                      textColor = '#94a3b8';
                    }
                  }

                  return (
                    <div
                      key={index}
                      style={{
                        width: '50px',
                        height: '50px',
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: textColor,
                        transform: transform,
                        boxShadow: shadow,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative'
                      }}
                    >
                      {value}
                      <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        fontSize: '10px',
                        color: '#64748b',
                        fontWeight: '500'
                      }}>
                        [{index}]
                      </div>
                    </div>
                  );
                })}
              </div>

              {steps.length > 0 && (
                <div>
                  {currentStep >= 0 && currentStep < steps.length && (
                    <div style={{
                      background: steps[currentStep].phase === 'jump' 
                        ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
                        : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      border: `1px solid ${steps[currentStep].phase === 'jump' ? '#ef4444' : '#3b82f6'}`,
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px', color: steps[currentStep].phase === 'jump' ? '#991b1b' : '#1e40af' }}>
                        Step {steps[currentStep].stepNumber}: {steps[currentStep].phase === 'jump' ? 'Jump Phase' : 'Linear Search Phase'}
                      </p>
                      <p style={{ fontSize: '16px', margin: '0 0 16px', fontFamily: 'ui-monospace, monospace', color: '#374151' }}>
                        {steps[currentStep].comparison.replace('✓', '✅').replace('→', '→')}
                      </p>
                      <div style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>
                        {steps[currentStep].phase === 'jump' 
                          ? `Block Size: √${arrayData.length} = ${blockSize} | Checking block end at index ${steps[currentStep].checkIndex}`
                          : `Linear search in block [${steps[currentStep].blockStart}, ${steps[currentStep].blockEnd}] | Checking index ${steps[currentStep].checkIndex}`
                        }
                      </div>
                      {steps[currentStep].status === 'found' && (
                        <p style={{ fontSize: '16px', color: '#059669', margin: '12px 0 0', fontWeight: '600' }}>
                          ✅ Target Found!
                        </p>
                      )}
                    </div>
                  )}

                  {!isSearching && steps.length > 0 && (
                    <div style={{
                      background: found 
                        ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' 
                        : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                      border: `1px solid ${found ? '#10b981' : '#ef4444'}`,
                      borderRadius: '16px',
                      padding: '24px',
                      textAlign: 'center'
                    }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        margin: '0 0 16px',
                        color: found ? '#059669' : '#dc2626'
                      }}>
                        {found ? '✅ Search Successful!' : '❌ Target Not Found'}
                      </h3>
                      <div style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
                        <p style={{ margin: '0 0 8px' }}>
                          <strong>Result:</strong> {found 
                            ? `Target ${target} found at index ${steps.find(s => s.status === 'found')?.checkIndex}`
                            : `Target ${target} not found in array`
                          }
                        </p>
                        <p style={{ margin: '0 0 8px' }}>
                          <strong>Comparisons:</strong> {steps.length} | <strong>Block Size:</strong> √{arrayData.length} = {blockSize}
                        </p>
                        <p style={{ margin: '0' }}>
                          <strong>Time Complexity:</strong> O(√n) = O(√{arrayData.length}) ≈ {Math.ceil(Math.sqrt(arrayData.length))} max jumps
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '24px',
              padding: '30px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 20px',
                textAlign: 'center'
              }}>
                Performance Metrics
              </h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'end', height: '200px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '120px',
                    background: 'linear-gradient(to top, #f59e0b, #fbbf24)',
                    borderRadius: '8px 8px 0 0',
                    marginBottom: '12px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#f59e0b'
                    }}>
                      O(√n)
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Time</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '40px',
                    background: 'linear-gradient(to top, #8b5cf6, #a78bfa)',
                    borderRadius: '8px 8px 0 0',
                    marginBottom: '12px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#8b5cf6'
                    }}>
                      O(1)
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Space</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: `${Math.min((Math.sqrt(arrayData.length) / 10) * 160 + 40, 160)}px`,
                    background: 'linear-gradient(to top, #ef4444, #f87171)',
                    borderRadius: '8px 8px 0 0',
                    marginBottom: '12px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#ef4444'
                    }}>
                      {Math.floor(Math.sqrt(arrayData.length))}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Block Size</span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '24px',
              padding: '30px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 16px'
              }}>
                Algorithm Overview
              </h4>
              
              <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.7' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#ef4444', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Block Jumping:</strong> Skips √n elements at a time</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Linear Search:</strong> Within identified block</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#f59e0b', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Optimal Block Size:</strong> √n for best performance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '4px', height: '16px', background: '#10b981', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Prerequisite:</strong> Array must be sorted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#059669', margin: '0 0 12px' }}>Advantages</h4>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Better than linear O(√n) vs O(n)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Simple implementation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Works on any sorted array</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Constant space O(1)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', margin: '0 0 12px' }}>Disadvantages</h4>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Slower than binary search O(log n)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Requires sorted array</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Not optimal for small arrays</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Fixed block size may be suboptimal</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#7c3aed', margin: '0 0 12px' }}>Use Cases</h4>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Medium-sized sorted datasets</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>When binary search is complex</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Sequential access preferred</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Educational demonstrations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumpSearchVisualize;