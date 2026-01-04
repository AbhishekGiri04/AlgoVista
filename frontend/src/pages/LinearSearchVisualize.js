import React, { useState, useEffect, useRef } from 'react';

const LinearSearchVisualize = () => {
  const [array, setArray] = useState('5,8,3,9,2,1,4');
  const [target, setTarget] = useState('4');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [found, setFound] = useState(false);
  const [algorithm, setAlgorithm] = useState('');
  const [totalComparisons, setTotalComparisons] = useState(0);
  const intervalRef = useRef(null);

  const handleSearch = async () => {
    const arr = array.split(',').map(Number).filter(n => !isNaN(n));
    if (arr.length === 0) {
      alert('Please enter a valid array');
      return;
    }

    setIsSearching(true);
    console.log('Sending request:', { array: arr, target: Number(target) });
    
    try {
      const response = await fetch('http://localhost:8000/api/linearsearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array: arr, target: Number(target) })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Backend response:', result);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setSteps(result.steps || []);
      setFound(result.found || false);
      setAlgorithm(result.algorithm || 'Linear Search');
      setTotalComparisons(result.totalComparisons || 0);
      setCurrentStep(-1);

      // Animate steps
      if (result.steps && result.steps.length > 0) {
        let stepIndex = 0;
        intervalRef.current = setInterval(() => {
          setCurrentStep(stepIndex);
          stepIndex++;
          
          if (stepIndex >= result.steps.length) {
            clearInterval(intervalRef.current);
            setIsSearching(false);
          }
        }, 800);
      } else {
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSteps([]);
    setCurrentStep(-1);
    setIsSearching(false);
    setFound(false);
    setArray('5,8,3,9,2,1,4');
    setTarget('4');
    setTotalComparisons(0);
    setAlgorithm('');
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
        {/* Header */}
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
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            Linear Search Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Interactive visualization of sequential search algorithm
          </p>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Controls */}
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
                    Array Elements
                  </label>
                  <input
                    type="text"
                    value={array}
                    onChange={(e) => setArray(e.target.value)}
                    placeholder="5,8,3,9,2,1,4"
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
                      e.target.style.border = '2px solid #667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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
                    placeholder="4"
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
                      e.target.style.border = '2px solid #667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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
                      background: isSearching ? '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isSearching ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
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

            {/* Visualization */}
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
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '40px'
              }}>
                {arrayData.map((value, index) => {
                  let bgColor = '#f8fafc';
                  let borderColor = '#e2e8f0';
                  let textColor = '#475569';
                  let transform = 'scale(1)';
                  let shadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

                  if (steps.length > 0 && currentStep >= 0) {
                    if (index === currentStep) {
                      bgColor = '#fef3c7';
                      borderColor = '#f59e0b';
                      textColor = '#92400e';
                      transform = 'scale(1.1)';
                      shadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                    } else if (index < currentStep) {
                      const step = steps.find(s => s.index === index);
                      if (step && step.status === 'found') {
                        bgColor = '#d1fae5';
                        borderColor = '#10b981';
                        textColor = '#065f46';
                        shadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                      } else {
                        bgColor = '#f1f5f9';
                        borderColor = '#cbd5e1';
                        textColor = '#64748b';
                      }
                    }
                  }

                  return (
                    <div
                      key={index}
                      style={{
                        width: '70px',
                        height: '70px',
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: '700',
                        color: textColor,
                        transform: transform,
                        boxShadow: shadow,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative'
                      }}
                    >
                      {value}
                      <div style={{
                        position: 'absolute',
                        bottom: '-28px',
                        fontSize: '12px',
                        color: '#64748b',
                        fontWeight: '500'
                      }}>
                        [{index}]
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status */}
              {steps.length > 0 && (
                <div>
                  {currentStep >= 0 && currentStep < steps.length && (
                    <div style={{
                      background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      border: '1px solid #3b82f6',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px', color: '#1e40af' }}>
                        Step {steps[currentStep].stepNumber}: Checking index {steps[currentStep].index}
                      </p>
                      <p style={{ fontSize: '16px', margin: '0 0 16px', fontFamily: 'ui-monospace, monospace', color: '#374151' }}>
                        {steps[currentStep].comparison.replace('✓', '✅').replace('✗', '❌')}
                      </p>
                      {steps[currentStep].status === 'found' && (
                        <p style={{ fontSize: '16px', color: '#059669', margin: '0', fontWeight: '600' }}>
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
                            ? `Target ${target} found at index ${steps.find(s => s.status === 'found')?.index}`
                            : `Target ${target} not found in array`
                          }
                        </p>
                        <p style={{ margin: '0 0 8px' }}>
                          <strong>Comparisons:</strong> {steps.length}
                        </p>
                        <p style={{ margin: '0' }}>
                          <strong>Time Complexity:</strong> O(n)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Performance Chart */}
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
                    height: '140px',
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
                      color: '#10b981'
                    }}>
                      O(n)
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
                    height: `${Math.min((arrayData.length / 20) * 180 + 20, 180)}px`,
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
                      {arrayData.length}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Size</span>
                </div>
              </div>
            </div>

            {/* Algorithm Info */}
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
                  <div style={{ width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Sequential Traversal:</strong> Examines elements one by one from start to end</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#10b981', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Best Case:</strong> O(1) when target is at first position</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#f59e0b', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Average Case:</strong> O(n/2) when target is in middle</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '4px', height: '16px', background: '#ef4444', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Worst Case:</strong> O(n) when target is at end or not found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Extended Details Section */}
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px' }}>Implementation Details</h3>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', marginRight: '12px' }}></div>
                  <div><strong>Type:</strong> Brute Force Sequential Search</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', marginRight: '12px' }}></div>
                  <div><strong>Structure:</strong> Linear Array/List Data Structure</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%', marginRight: '12px' }}></div>
                  <div><strong>Method:</strong> Element-by-element comparison</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#a855f7', borderRadius: '50%', marginRight: '12px' }}></div>
                  <div><strong>Access:</strong> Sequential, cache-friendly pattern</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px' }}>Use Cases & Applications</h3>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', marginRight: '12px' }}></div>
                  <span>Small to medium datasets (n &lt; 1000)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#06b6d4', borderRadius: '50%', marginRight: '12px' }}></div>
                  <span>Unsorted or unstructured data</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%', marginRight: '12px' }}></div>
                  <span>Infrequent search operations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#a855f7', borderRadius: '50%', marginRight: '12px' }}></div>
                  <span>Memory-constrained environments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
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
                  <span>Minimal implementation complexity</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>No data preprocessing required</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Works with any data arrangement</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Optimal space efficiency O(1)</span>
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
                  <span>Performance degrades with dataset size</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>No optimization for sorted data</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Worst-case linear time complexity</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Inefficient for repeated operations</span>
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
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#7c3aed', margin: '0 0 12px' }}>Alternatives</h4>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Binary Search - O(log n) for sorted arrays</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Hash Tables - O(1) average lookup time</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Binary Search Trees - O(log n) balanced</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Interpolation Search - O(log log n) uniform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearSearchVisualize;