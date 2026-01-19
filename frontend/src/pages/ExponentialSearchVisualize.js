import React, { useState, useEffect, useRef } from 'react';

const ExponentialSearchVisualize = () => {
  const [array, setArray] = useState('1,2,3,4,5,8,10,12,15,20,25,30,35,40,45');
  const [target, setTarget] = useState('20');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [found, setFound] = useState(false);
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
        alert('Array must be sorted for Exponential Search!');
        return;
      }
    }

    setIsSearching(true);
    
    try {
      const response = await fetch('https://algovista-dev.onrender.com/api/exponentialsearch', {
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
        }, 1500);
      } else {
        setIsSearching(false);
      }
    } catch (error) {
      const clientResult = clientExponentialSearch(arr, Number(target));
      setSteps(clientResult.steps);
      setFound(clientResult.found);
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
        }, 1500);
      } else {
        setIsSearching(false);
      }
    }
  };

  const clientExponentialSearch = (arr, target) => {
    const steps = [];
    const n = arr.length;
    let stepNum = 1;
    let found = false;

    if (arr[0] === target) {
      steps.push({
        stepNumber: stepNum++,
        phase: 'exponential',
        bound: 0,
        comparison: `arr[0] = ${arr[0]} == ${target} ✓`,
        status: 'found'
      });
      found = true;
    } else {
      let bound = 1;
      while (bound < n && arr[bound] < target) {
        steps.push({
          stepNumber: stepNum++,
          phase: 'exponential',
          bound: bound,
          comparison: `arr[${bound}] = ${arr[bound]} < ${target} → Double bound to ${bound * 2}`,
          status: 'continue'
        });
        bound *= 2;
      }

      const left = Math.floor(bound / 2);
      const right = Math.min(bound, n - 1);
      
      steps.push({
        stepNumber: stepNum++,
        phase: 'transition',
        left: left,
        right: right,
        comparison: `Range found [${left}, ${right}] → Start binary search`,
        status: 'continue'
      });

      // Binary search
      let l = left, r = right;
      while (l <= r) {
        const mid = l + Math.floor((r - l) / 2);
        
        if (arr[mid] === target) {
          steps.push({
            stepNumber: stepNum++,
            phase: 'binary',
            left: l,
            right: r,
            mid: mid,
            comparison: `arr[${mid}] = ${arr[mid]} == ${target} ✓`,
            status: 'found'
          });
          found = true;
          break;
        } else if (arr[mid] < target) {
          steps.push({
            stepNumber: stepNum++,
            phase: 'binary',
            left: l,
            right: r,
            mid: mid,
            comparison: `arr[${mid}] = ${arr[mid]} < ${target} → Search right half`,
            status: 'continue'
          });
          l = mid + 1;
        } else {
          steps.push({
            stepNumber: stepNum++,
            phase: 'binary',
            left: l,
            right: r,
            mid: mid,
            comparison: `arr[${mid}] = ${arr[mid]} > ${target} → Search left half`,
            status: 'continue'
          });
          r = mid - 1;
        }
      }
    }

    return { steps, found, totalComparisons: steps.length };
  };

  const resetSearch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSteps([]);
    setCurrentStep(-1);
    setIsSearching(false);
    setFound(false);
    setArray('1,2,3,4,5,8,10,12,15,20,25,30,35,40,45');
    setTarget('20');
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
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Exponential Search Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Interactive visualization of exponential bound + binary search algorithm
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
                    placeholder="1,2,3,4,5,8,10,12,15,20,25,30,35,40,45"
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
                      e.target.style.border = '2px solid #10b981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                    placeholder="20"
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
                      e.target.style.border = '2px solid #10b981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
                      background: isSearching ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #06b6d4)',
                      color: 'white',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSearching ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
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
                gap: '4px',
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
                    
                    if (step.phase === 'exponential' && index === step.bound) {
                      if (step.status === 'found') {
                        bgColor = '#d1fae5';
                        borderColor = '#10b981';
                        textColor = '#065f46';
                        transform = 'scale(1.15)';
                        shadow = '0 8px 25px rgba(16, 185, 129, 0.6)';
                      } else {
                        bgColor = '#dcfce7';
                        borderColor = '#16a34a';
                        textColor = '#166534';
                        transform = 'scale(1.1)';
                        shadow = '0 8px 25px rgba(22, 163, 74, 0.4)';
                      }
                    } else if (step.phase === 'binary' && index === step.mid) {
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
                    } else if (step.phase === 'binary' && step.left !== undefined && step.right !== undefined && index >= step.left && index <= step.right) {
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
                        width: '45px',
                        height: '45px',
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
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
                        bottom: '-18px',
                        fontSize: '9px',
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
                      background: steps[currentStep].phase === 'exponential' 
                        ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
                        : steps[currentStep].phase === 'binary'
                        ? 'linear-gradient(135deg, #eff6ff, #dbeafe)'
                        : 'linear-gradient(135deg, #fefce8, #fef3c7)',
                      border: `1px solid ${steps[currentStep].phase === 'exponential' ? '#16a34a' : steps[currentStep].phase === 'binary' ? '#3b82f6' : '#f59e0b'}`,
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px', color: steps[currentStep].phase === 'exponential' ? '#166534' : steps[currentStep].phase === 'binary' ? '#1e40af' : '#92400e' }}>
                        Step {steps[currentStep].stepNumber}: {
                          steps[currentStep].phase === 'exponential' ? 'Exponential Bound Phase' :
                          steps[currentStep].phase === 'binary' ? 'Binary Search Phase' :
                          'Transition Phase'
                        }
                      </p>
                      <p style={{ fontSize: '16px', margin: '0 0 16px', fontFamily: 'ui-monospace, monospace', color: '#374151' }}>
                        {steps[currentStep].comparison.replace('✓', '✅').replace('→', '→')}
                      </p>
                      <div style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>
                        {steps[currentStep].phase === 'exponential' && steps[currentStep].bound !== undefined
                          ? `Checking bound at index ${steps[currentStep].bound} | Next bound: ${steps[currentStep].bound * 2}`
                          : steps[currentStep].phase === 'binary' && steps[currentStep].left !== undefined
                          ? `Binary search range [${steps[currentStep].left}, ${steps[currentStep].right}] | Middle: ${steps[currentStep].mid}`
                          : 'Transitioning from exponential to binary search phase'
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
                            ? `Target ${target} found`
                            : `Target ${target} not found in array`
                          }
                        </p>
                        <p style={{ margin: '0 0 8px' }}>
                          <strong>Comparisons:</strong> {steps.length}
                        </p>
                        <p style={{ margin: '0' }}>
                          <strong>Time Complexity:</strong> O(log n) after finding bounds
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
                    height: '80px',
                    background: 'linear-gradient(to top, #10b981, #34d399)',
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
                      color: '#10b981',
                      whiteSpace: 'nowrap'
                    }}>
                      O(log n)
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
                    height: `${Math.min((Math.log2(arrayData.length) / 10) * 160 + 60, 160)}px`,
                    background: 'linear-gradient(to top, #06b6d4, #67e8f9)',
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
                      color: '#06b6d4'
                    }}>
                      {Math.ceil(Math.log2(arrayData.length))}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Max Bounds</span>
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
                  <div style={{ width: '4px', height: '16px', background: '#16a34a', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Exponential Bounds:</strong> Find range by doubling</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Binary Search:</strong> Within identified range</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#10b981', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Unbounded Arrays:</strong> Works without knowing size</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '4px', height: '16px', background: '#ef4444', borderRadius: '2px', marginRight: '12px' }}></div>
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
                  <span>Works on unbounded arrays</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Better than linear for large targets</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>O(log n) time complexity</span>
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
                  <span>More complex than binary search</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Requires sorted array</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Extra overhead for bound finding</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Not optimal for small arrays</span>
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
                  <span>Unbounded or infinite arrays</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Unknown array size scenarios</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Large sorted datasets</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Stream processing applications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExponentialSearchVisualize;