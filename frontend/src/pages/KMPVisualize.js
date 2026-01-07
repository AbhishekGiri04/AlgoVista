import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  }, [text, pattern]);

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
          newLog.push(`Using LPS: j = lps[${j}] = ${lpsArray[j - 1]}`);
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
      if (currentMatch === idx) return 'bg-yellow-300 border-yellow-500';
      return 'bg-purple-100 border-purple-400';
    }
    
    if (matches.some(m => idx >= m && idx < m + pattern.length)) return 'bg-green-200 border-green-500';
    if (phase === 'search' && currentPos >= 0 && idx >= currentPos - currentMatch && idx < currentPos - currentMatch + pattern.length) {
      if (idx === currentPos) return 'bg-yellow-300 border-yellow-500';
      if (idx < currentPos && idx >= currentPos - currentMatch) return 'bg-green-200 border-green-500';
      return 'bg-purple-100 border-purple-400';
    }
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">KMP Algorithm</h1>
          <p className="text-purple-600">Knuth-Morris-Pratt efficient pattern matching with LPS array</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">String Visualization</h2>
            
            <div className="space-y-6 mb-6">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Text:</div>
                <div className="flex flex-wrap gap-1">
                  {text.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center font-bold border-2 rounded transition-all ${getCharColor(idx)}`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Pattern:</div>
                <div className="flex gap-1">
                  {pattern.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center font-bold border-2 rounded transition-all ${getCharColor(idx, true)}`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              {lps.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">LPS Array:</div>
                  <div className="flex gap-1">
                    {lps.map((val, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 flex items-center justify-center font-bold border-2 rounded bg-indigo-100 border-indigo-400"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {phase === 'search' && currentPos >= 0 && (
                <div className="p-3 bg-yellow-50 rounded text-sm">
                  <div className="font-semibold">Text Position: {currentPos}</div>
                  <div className="text-gray-600">Pattern Index: {currentMatch}</div>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text:</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value.toUpperCase())}
                  disabled={isRunning}
                  className="w-full px-4 py-2 border rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pattern:</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value.toUpperCase())}
                  disabled={isRunning}
                  className="w-full px-4 py-2 border rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={runKMP} disabled={isRunning || !pattern} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start KMP'}
              </button>
              {isRunning && <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">{isPaused ? 'Resume' : 'Pause'}</button>}
              <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Speed:</label>
                <input type="range" min="200" max="1500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20" />
              </div>
              <a href="/stringalgorithms" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Matches Found:</div>
                  <div className="text-3xl font-bold text-purple-600">{matches.length}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Comparisons:</div>
                  <div className="text-3xl font-bold text-gray-800">{comparisons}</div>
                </div>
              </div>
            </div>

            {matches.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Match Positions</h3>
                <div className="flex flex-wrap gap-2">
                  {matches.map((pos, idx) => (
                    <div key={idx} className="px-4 py-2 bg-green-100 border-2 border-green-500 rounded-lg font-semibold">
                      Position {pos}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Phases</h3>
              <div className="space-y-2 text-sm">
                <div className={`p-2 rounded ${phase === 'lps' || phase === 'search' || phase === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  ✓ Phase 1: Compute LPS Array
                </div>
                <div className={`p-2 rounded ${phase === 'search' || phase === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {phase === 'search' ? '⏳' : phase === 'done' ? '✓' : '○'} Phase 2: Pattern Search
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">LPS Array Explanation</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>LPS = Longest Proper Prefix which is also Suffix</p>
                <p className="p-2 bg-purple-50 rounded">Helps skip unnecessary comparisons by using pattern's internal structure</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Log</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto text-sm">
                {log.slice(-15).map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      entry.includes('🎯') ? 'text-green-700 bg-green-50 font-semibold' :
                      entry.includes('✓') ? 'text-green-700 bg-green-50' :
                      entry.includes('✗') ? 'text-red-700 bg-red-50' :
                      entry.includes('---') ? 'text-purple-700 bg-purple-50 font-semibold' :
                      'text-gray-700'
                    }`}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Time Complexity:</strong> O(n + m)</p>
                <p><strong>Space Complexity:</strong> O(m)</p>
                <p><strong>Approach:</strong> Preprocessing + Linear scan</p>
                <p><strong>Use Case:</strong> Efficient pattern matching</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KMPVisualize;