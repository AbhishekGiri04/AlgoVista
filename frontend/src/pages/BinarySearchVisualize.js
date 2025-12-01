import React, { useState, useEffect, useRef } from 'react';

const BinarySearchVisualize = () => {
  const [array, setArray] = useState('1,3,5,7,9,11,13,15,17,19');
  const [target, setTarget] = useState('7');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [found, setFound] = useState(false);
  const intervalRef = useRef(null);

  const handleSearch = async () => {
    const arr = array.split(',').map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
    if (arr.length === 0) {
      alert('Please enter a valid array');
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/binarysearch', {
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
        }, 1000);
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
    setArray('1,3,5,7,9,11,13,15,17,19');
    setTarget('7');
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const arrayData = array.split(',').map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);

  return (
    <div style={{
      backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz5nspmN2Lf5Pa9SMBM6syIVpt-kOq14Tjwyx-pd3A1mzxTwjwGHvnlIjbempu-wxzhuU&usqp=CAU)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: 'white',
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
          background: '#e1f5fe',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          backdropFilter: 'blur(20px)',
          border: '1px solid #b3e5fc'
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
            Binary Search Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Interactive visualization of divide-and-conquer search algorithm
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: '#e8f5e8',
              borderRadius: '20px',
              padding: '32px',
              backdropFilter: 'blur(20px)',
              border: '1px solid #c8e6c9'
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
                    placeholder="1,3,5,7,9,11,13,15,17,19"
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
                    placeholder="7"
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

            <div style={{
              background: '#fff8e1',
              borderRadius: '20px',
              padding: '40px',
              backdropFilter: 'blur(20px)',
              border: '1px solid #ffcc02',
              minHeight: '300px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '40px'
              }}>
                {arrayData.map((value, index) => {
                  let bgColor = '#f8fafc';
                  let borderColor = '#e2e8f0';
                  let textColor = '#475569';
                  let transform = 'scale(1)';
                  let shadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

                  if (steps.length > 0 && currentStep >= 0 && steps[currentStep]) {
                    const step = steps[currentStep];
                    if (index === step.mid) {
                      bgColor = '#fef3c7';
                      borderColor = '#f59e0b';
                      textColor = '#92400e';
                      transform = 'scale(1.15)';
                      shadow = '0 8px 25px rgba(245, 158, 11, 0.6)';
                    } else if (index >= step.left && index <= step.right) {
                      bgColor = '#dbeafe';
                      borderColor = '#3b82f6';
                      textColor = '#1e40af';
                      shadow = '0 6px 15px rgba(59, 130, 246, 0.3)';
                    } else {
                      bgColor = '#f1f5f9';
                      borderColor = '#cbd5e1';
                      textColor = '#94a3b8';
                    }
                    
                    if (step.status === 'found' && index === step.mid) {
                      bgColor = '#d1fae5';
                      borderColor = '#10b981';
                      textColor = '#065f46';
                      shadow = '0 8px 25px rgba(16, 185, 129, 0.6)';
                    }
                  }

                  return (
                    <div
                      key={index}
                      style={{
                        width: '60px',
                        height: '60px',
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
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
                        bottom: '-24px',
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
                      background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      border: '1px solid #3b82f6',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '24px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px', color: '#1e40af' }}>
                        Step {steps[currentStep].stepNumber}: Checking middle element at index {steps[currentStep].mid}
                      </p>
                      <p style={{ fontSize: '16px', margin: '0 0 16px', fontFamily: 'ui-monospace, monospace', color: '#374151' }}>
                        Range: [{steps[currentStep].left}, {steps[currentStep].right}] | Mid: {steps[currentStep].mid} | Value: {arrayData[steps[currentStep].mid]}
                      </p>
                      <p style={{ fontSize: '16px', margin: '0', color: '#374151' }}>
                        {steps[currentStep].comparison}
                      </p>
                      {steps[currentStep].status === 'found' && (
                        <p style={{ fontSize: '16px', color: '#059669', margin: '8px 0 0', fontWeight: '600' }}>
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
                            ? `Target ${target} found at index ${steps.find(s => s.status === 'found')?.mid}`
                            : `Target ${target} not found in array`
                          }
                        </p>
                        <p style={{ margin: '0 0 8px' }}>
                          <strong>Comparisons:</strong> {steps.length}
                        </p>
                        <p style={{ margin: '0' }}>
                          <strong>Time Complexity:</strong> O(log n)
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
              background: '#f3e5f5',
              borderRadius: '20px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid #ce93d8'
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
                      color: '#10b981'
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

            <div style={{
              background: '#ffebee',
              borderRadius: '20px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid #ef9a9a'
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
                  <span><strong>Divide & Conquer:</strong> Splits search space in half each iteration</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#10b981', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Prerequisite:</strong> Array must be sorted</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#f59e0b', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Efficiency:</strong> O(log n) time complexity</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '4px', height: '16px', background: '#ef4444', borderRadius: '2px', marginRight: '12px' }}></div>
                  <span><strong>Method:</strong> Compare with middle element</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{
            background: '#e0f7fa',
            borderRadius: '20px',
            padding: '32px',
            backdropFilter: 'blur(20px)',
            border: '1px solid #b2ebf2'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px' }}>Implementation Details</h3>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', marginRight: '12px' }}></div>
                  <div><strong>Type:</strong> Divide and Conquer Algorithm</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', marginRight: '12px' }}></div>
                  <div><strong>Structure:</strong> Sorted Array/List Required</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%', marginRight: '12px' }}></div>
                  <div><strong>Method:</strong> Middle element comparison</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#a855f7', borderRadius: '50%', marginRight: '12px' }}></div>
                  <div><strong>Access:</strong> Random access, logarithmic reduction</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            background: '#f1f8e9',
            borderRadius: '20px',
            padding: '32px',
            backdropFilter: 'blur(20px)',
            border: '1px solid #dcedc8'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px' }}>Use Cases & Applications</h3>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', marginRight: '12px' }}></div>
                  <span>Large sorted datasets (n > 1000)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#06b6d4', borderRadius: '50%', marginRight: '12px' }}></div>
                  <span>Database indexing and searching</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%', marginRight: '12px' }}></div>
                  <span>Frequent search operations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <div style={{ width: '6px', height: '6px', background: '#a855f7', borderRadius: '50%', marginRight: '12px' }}></div>
                  <span>Library systems and catalogs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <div style={{
            background: '#e3f2fd',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #90caf9',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#059669', margin: '0 0 12px' }}>Advantages</h4>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Logarithmic time complexity O(log n)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Efficient for large datasets</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Optimal space efficiency O(1)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Predictable performance guarantee</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            background: '#fce4ec',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #f8bbd9',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', margin: '0 0 12px' }}>Disadvantages</h4>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Requires pre-sorted data</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Sorting overhead O(n log n)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Not suitable for dynamic data</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Random access requirement</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            background: '#ede7f6',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #d1c4e9',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#7c3aed', margin: '0 0 12px' }}>Alternatives</h4>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Interpolation Search - O(log log n)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Exponential Search - O(log n)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Ternary Search - O(log₃ n)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '6px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%', marginRight: '10px' }}></div>
                  <span>Jump Search - O(√n)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchVisualize;