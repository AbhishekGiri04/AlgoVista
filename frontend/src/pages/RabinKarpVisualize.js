import React, { useState, useEffect } from 'react';

const RabinKarpVisualize = () => {
  const [text, setText] = useState('ABABCABABA');
  const [pattern, setPattern] = useState('ABABA');
  const [currentPos, setCurrentPos] = useState(-1);
  const [textHash, setTextHash] = useState(null);
  const [patternHash, setPatternHash] = useState(null);
  const [matches, setMatches] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [hashComparisons, setHashComparisons] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState('idle');

  const d = 256; // Number of characters in alphabet
  const q = 101; // A prime number for modulo

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setCurrentPos(-1);
    setTextHash(null);
    setPatternHash(null);
    setMatches([]);
    setComparisons(0);
    setHashComparisons(0);
    setIsRunning(false);
    setIsPaused(false);
    setPhase('idle');
    setLog(['Algorithm initialized', `Text length: ${text.length}`, `Pattern length: ${pattern.length}`]);
  };

  const calculateHash = (str, m) => {
    let hash = 0;
    for (let i = 0; i < m; i++) {
      hash = (d * hash + str.charCodeAt(i)) % q;
    }
    return hash;
  };

  const runRabinKarp = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const n = text.length;
    const m = pattern.length;
    const newLog = [...log];
    let comp = 0;
    let hashComp = 0;

    // Calculate pattern hash
    setPhase('hash');
    newLog.push('--- Computing Pattern Hash ---');
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    const pHash = calculateHash(pattern, m);
    setPatternHash(pHash);
    newLog.push(`Pattern hash: ${pHash}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // Calculate first window hash
    let tHash = calculateHash(text.substring(0, m), m);
    setTextHash(tHash);
    newLog.push(`Initial text window hash: ${tHash}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // Calculate h = d^(m-1) % q for rolling hash
    let h = 1;
    for (let i = 0; i < m - 1; i++) {
      h = (h * d) % q;
    }

    newLog.push('--- Starting Pattern Search ---');
    setLog([...newLog]);
    setPhase('search');
    await new Promise(resolve => setTimeout(resolve, speed));

    const found = [];

    for (let i = 0; i <= n - m; i++) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      setCurrentPos(i);
      hashComp++;
      setHashComparisons(hashComp);

      newLog.push(`Position ${i}: Comparing hashes`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (pHash === tHash) {
        newLog.push(`✓ Hash match! Verifying characters...`);
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed));

        // Verify character by character
        let match = true;
        for (let j = 0; j < m; j++) {
          comp++;
          setComparisons(comp);
          
          if (text[i + j] !== pattern[j]) {
            match = false;
            newLog.push(`✗ Character mismatch at index ${j}`);
            setLog([...newLog]);
            await new Promise(resolve => setTimeout(resolve, speed));
            break;
          }
        }

        if (match) {
          found.push(i);
          setMatches([...found]);
          newLog.push(`🎯 Pattern found at position ${i}`);
          setLog([...newLog]);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      } else {
        newLog.push(`✗ Hash mismatch (${tHash} ≠ ${pHash})`);
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }

      // Calculate hash for next window
      if (i < n - m) {
        tHash = (d * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
        if (tHash < 0) tHash += q;
        setTextHash(tHash);
        newLog.push(`Rolling hash for next window: ${tHash}`);
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
    }

    setCurrentPos(-1);
    setIsRunning(false);
    setPhase('done');
    newLog.push(`Search completed! Found ${found.length} match(es)`);
    newLog.push(`Hash comparisons: ${hashComp}, Character comparisons: ${comp}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCharColor = (idx, isPattern = false) => {
    if (isPattern) {
      return { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' };
    }
    
    if (matches.some(m => idx >= m && idx < m + pattern.length)) 
      return { bg: '#d1fae5', border: '#10b981', color: '#065f46' };
    
    if (currentPos >= 0 && idx >= currentPos && idx < currentPos + pattern.length) {
      return { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' };
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
        <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#1e293b' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Rabin-Karp Algorithm Visualizer</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Rolling hash string matching with efficient pattern search</p>
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

              {(textHash !== null || patternHash !== null) && (
                <div style={{
                  padding: '1rem',
                  background: '#fef3c7',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  border: '1px solid #f59e0b'
                }}>
                  {patternHash !== null && (
                    <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.25rem' }}>
                      Pattern Hash: {patternHash}
                    </div>
                  )}
                  {textHash !== null && currentPos >= 0 && (
                    <div style={{ color: '#78350f' }}>
                      Current Window Hash: {textHash} (Position: {currentPos})
                    </div>
                  )}
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
                onClick={runRabinKarp}
                disabled={isRunning || !pattern}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isRunning || !pattern ? '#9ca3af' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: isRunning || !pattern ? 'not-allowed' : 'pointer',
                  opacity: isRunning || !pattern ? 0.5 : 1
                }}
              >
                {isRunning ? 'Running...' : 'Start Search'}
              </button>
              {isRunning && (
                <button
                  onClick={togglePause}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem' }}>Matches Found</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>{matches.length}</div>
                </div>
                <div style={{ padding: '0.75rem', background: '#dbeafe', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem' }}>Hash Comparisons</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>{hashComparisons}</div>
                </div>
                <div style={{ padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#374151', marginBottom: '0.25rem' }}>Character Comparisons</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{comparisons}</div>
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
                  background: phase === 'hash' || phase === 'search' || phase === 'done' ? '#d1fae5' : '#f3f4f6',
                  color: phase === 'hash' || phase === 'search' || phase === 'done' ? '#065f46' : '#6b7280',
                  fontWeight: '600'
                }}>
                  ✓ Phase 1: Compute Hashes
                </div>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: phase === 'search' || phase === 'done' ? '#d1fae5' : '#f3f4f6',
                  color: phase === 'search' || phase === 'done' ? '#065f46' : '#6b7280',
                  fontWeight: '600'
                }}>
                  {phase === 'search' ? '⏳' : phase === 'done' ? '✓' : '○'} Phase 2: Rolling Hash Search
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Rolling Hash Concept</h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Efficient hash computation using sliding window</p>
                <p style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '0.5rem', color: '#92400e' }}>
                  Removes first character and adds next character in O(1) time
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
                                 entry.includes('---') ? '#fef3c7' :
                                 '#f3f4f6',
                      color: entry.includes('🎯') ? '#065f46' :
                             entry.includes('✓') ? '#065f46' :
                             entry.includes('✗') ? '#991b1b' :
                             entry.includes('---') ? '#92400e' :
                             '#374151',
                      borderLeft: '3px solid #f59e0b',
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
                  <span style={{ fontWeight: '600', color: '#f59e0b' }}>O(n + m)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Space Complexity:</span>
                  <span style={{ fontWeight: '600', color: '#f59e0b' }}>O(1)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Approach:</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>Rolling Hash</span>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontWeight: '600' }}>Use Case:</span>
                  <p style={{ color: '#374151', marginTop: '0.25rem' }}>Plagiarism detection, DNA sequencing, multiple pattern search</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RabinKarpVisualize;
