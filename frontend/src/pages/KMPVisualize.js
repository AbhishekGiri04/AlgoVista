import React, { useState, useEffect } from 'react';

const KMPVisualize = () => {
  const [text, setText] = useState('ABABCABABA');
  const [pattern, setPattern] = useState('ABABA');
  const [lps, setLps] = useState([]);
  const [currentPos, setCurrentPos] = useState(-1);
  const [currentMatch, setCurrentMatch] = useState(-1);
  const [matches, setMatches] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setLps([]);
    setCurrentPos(-1);
    setCurrentMatch(-1);
    setMatches([]);
    setComparisons(0);
    setIsRunning(false);
    setIsPaused(false);
    setPhase('idle');
    setLog(['Algorithm initialized', `Text length: ${text.length}`, `Pattern length: ${pattern.length}`]);
  };

  const computeLPS = async (newLog) => {
    setPhase('lps');
    const m = pattern.length;
    const lpsArray = Array(m).fill(0);
    let len = 0;
    let i = 1;

    newLog.push('--- Computing LPS Array ---');
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    while (i < m) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      if (pattern[i] === pattern[len]) {
        len++;
        lpsArray[i] = len;
        newLog.push(`✓ Match at ${i}: lps[${i}] = ${len}`);
        setLps([...lpsArray]);
        setLog([...newLog]);
        i++;
      } else {
        if (len !== 0) {
          len = lpsArray[len - 1];
          newLog.push(`Backtrack: len = lps[${len}]`);
          setLog([...newLog]);
        } else {
          lpsArray[i] = 0;
          newLog.push(`No match: lps[${i}] = 0`);
          setLps([...lpsArray]);
          setLog([...newLog]);
          i++;
        }
      }
      await new Promise(resolve => setTimeout(resolve, speed / 2));
    }

    newLog.push(`LPS Array: [${lpsArray.join(', ')}]`);
    setLog([...newLog]);
    return lpsArray;
  };

  const runKMP = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const n = text.length;
    const m = pattern.length;
    const newLog = [...log];
    let comp = 0;

    const lpsArray = await computeLPS(newLog);
    
    newLog.push('--- Starting Pattern Search ---');
    setLog([...newLog]);
    setPhase('search');
    await new Promise(resolve => setTimeout(resolve, speed));

    const found = [];
    let i = 0;
    let j = 0;

    while (i < n) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      setCurrentPos(i);
      setCurrentMatch(j);
      comp++;
      setComparisons(comp);

      if (text[i] === pattern[j]) {
        newLog.push(`✓ Match at text[${i}] = pattern[${j}] = '${text[i]}'`);
        setLog([...newLog]);
        i++;
        j++;
        await new Promise(resolve => setTimeout(resolve, speed));
      } else {
        newLog.push(`✗ Mismatch at text[${i}] ≠ pattern[${j}]`);
        setLog([...newLog]);
        
        if (j !== 0) {
          j = lpsArray[j - 1];
          newLog.push(`Using LPS: j = lps[${j}]`);
          setLog([...newLog]);
        } else {
          i++;
        }
        await new Promise(resolve => setTimeout(resolve, speed));
      }

      if (j === m) {
        found.push(i - j);
        setMatches([...found]);
        newLog.push(`🎯 Pattern found at position ${i - j}`);
        setLog([...newLog]);
        j = lpsArray[j - 1];
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    setCurrentPos(-1);
    setCurrentMatch(-1);
    setIsRunning(false);
    setPhase('done');
    newLog.push(`Search completed! Found ${found.length} match(es)`);
    newLog.push(`Total comparisons: ${comp}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCharColor = (idx, isPattern = false) => {
    if (isPattern) {
      if (currentMatch === idx) return { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' };
      return { bg: '#e9d5ff', border: '#a855f7', color: '#6b21a8' };
    }
    
    if (matches.some(m => idx >= m && idx < m + pattern.length)) 
      return { bg: '#d1fae5', border: '#10b981', color: '#065f46' };
    
    if (phase === 'search' && currentPos >= 0 && idx >= currentPos - currentMatch && idx < currentPos - currentMatch + pattern.length) {
      if (idx === currentPos) return { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' };
      if (idx < currentPos && idx >= currentPos - currentMatch) return { bg: '#d1fae5', border: '#10b981', color: '#065f46' };
      return { bg: '#e9d5ff', border: '#a855f7', color: '#6b21a8' };
    }
    return { bg: '#f9fafb', border: '#e5e7eb', color: '#6b7280' };
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <a href="/stringalgorithms" style={{
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
        ← Back to String Algorithms
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
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
            textAlign: 'center'
          }}>
            KMP Algorithm Visualizer
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#1e293b',
            textAlign: 'center',
            margin: '0'
          }}>
            Knuth-Morris-Pratt efficient pattern matching with LPS array
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>String Visualization</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Text:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {text.split('').map((char, idx) => {
                    const colors = getCharColor(idx);
                    return (
                      <div key={idx} style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        background: colors.bg,
                        border: `2px solid ${colors.border}`,
                        color: colors.color,
                        borderRadius: '0.5rem',
                        transition: 'all 0.3s ease'
                      }}>
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Pattern:</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {pattern.split('').map((char, idx) => {
                    const colors = getCharColor(idx, true);
                    return (
                      <div key={idx} style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        background: colors.bg,
                        border: `2px solid ${colors.border}`,
                        color: colors.color,
                        borderRadius: '0.5rem',
                        transition: 'all 0.3s ease'
                      }}>
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>

              {lps.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>LPS Array:</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {lps.map((val, idx) => (
                      <div key={idx} style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        background: '#ddd6fe',
                        border: '2px solid #8b5cf6',
                        color: '#5b21b6',
                        borderRadius: '0.5rem'
                      }}>
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {phase === 'search' && currentPos >= 0 && (
                <div style={{
                  padding: '1rem',
                  background: '#fef3c7',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  border: '1px solid #f59e0b'
                }}>
                  <div style={{ fontWeight: '600', color: '#92400e' }}>Text Position: {currentPos}</div>
                  <div style={{ color: '#78350f' }}>Pattern Index: {currentMatch}</div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Text:
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value.toUpperCase())}
                  disabled={isRunning}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    color: '#000',
                    fontWeight: '600',
                    background: '#fff'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Pattern:
                </label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value.toUpperCase())}
                  disabled={isRunning}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    color: '#000',
                    fontWeight: '600',
                    background: '#fff'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={runKMP}
                disabled={isRunning || !pattern}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isRunning || !pattern ? '#9ca3af' : 'linear-gradient(135deg, #a855f7, #9333ea)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: isRunning || !pattern ? 'not-allowed' : 'pointer',
                  opacity: isRunning || !pattern ? 0.5 : 1
                }}
              >
                {isRunning ? 'Running...' : 'Start KMP'}
              </button>
              {isRunning && (
                <button
                  onClick={togglePause}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isPaused ? '▶ Resume' : '⏸ Pause'}
                </button>
              )}
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>Speed:</label>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{speed}ms</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#e9d5ff', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b21a8', marginBottom: '0.25rem' }}>Matches Found</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6b21a8' }}>{matches.length}</div>
                </div>
                <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#374151', marginBottom: '0.25rem' }}>Comparisons</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{comparisons}</div>
                </div>
              </div>
            </div>

            {matches.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Match Positions</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {matches.map((pos, idx) => (
                    <div key={idx} style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                      border: '2px solid #10b981',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      color: '#065f46'
                    }}>
                      Position {pos}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Algorithm Phases</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: phase === 'lps' || phase === 'search' || phase === 'done' ? '#d1fae5' : '#f3f4f6',
                  color: phase === 'lps' || phase === 'search' || phase === 'done' ? '#065f46' : '#6b7280',
                  fontWeight: '600'
                }}>
                  ✓ Phase 1: Compute LPS Array
                </div>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: phase === 'search' || phase === 'done' ? '#d1fae5' : '#f3f4f6',
                  color: phase === 'search' || phase === 'done' ? '#065f46' : '#6b7280',
                  fontWeight: '600'
                }}>
                  {phase === 'search' ? '⏳' : phase === 'done' ? '✓' : '○'} Phase 2: Pattern Search
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>LPS Array Explanation</h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>LPS = Longest Proper Prefix which is also Suffix</p>
                <p style={{ padding: '0.75rem', background: '#e9d5ff', borderRadius: '0.5rem', color: '#6b21a8' }}>
                  Helps skip unnecessary comparisons by using pattern's internal structure
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Algorithm Log</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <style>{`
                  div::-webkit-scrollbar {
                    width: 6px;
                  }
                  div::-webkit-scrollbar-track {
                    background: rgba(148, 163, 184, 0.1);
                    border-radius: 10px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.4);
                    border-radius: 10px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.6);
                  }
                `}</style>
                {log.slice(-15).map((entry, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      background: entry.includes('🎯') ? '#d1fae5' :
                                 entry.includes('✓') ? '#d1fae5' :
                                 entry.includes('✗') ? '#fee2e2' :
                                 entry.includes('---') ? '#e9d5ff' :
                                 '#f3f4f6',
                      color: entry.includes('🎯') ? '#065f46' :
                             entry.includes('✓') ? '#065f46' :
                             entry.includes('✗') ? '#991b1b' :
                             entry.includes('---') ? '#6b21a8' :
                             '#374151',
                      borderLeft: '3px solid #a855f7',
                      fontWeight: entry.includes('🎯') || entry.includes('---') ? '600' : 'normal'
                    }}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Algorithm Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Time Complexity:</span>
                  <span style={{ fontWeight: '600', color: '#a855f7' }}>O(n + m)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Space Complexity:</span>
                  <span style={{ fontWeight: '600', color: '#a855f7' }}>O(m)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Approach:</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>Preprocessing + Linear Scan</span>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontWeight: '600' }}>Use Case:</span>
                  <p style={{ color: '#374151', marginTop: '0.25rem' }}>Efficient pattern matching, text editors, DNA sequencing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMPVisualize;
