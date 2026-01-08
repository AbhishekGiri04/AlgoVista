import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NaiveStringVisualize = () => {
  const [text, setText] = useState('ABABCABABA');
  const [pattern, setPattern] = useState('ABABA');
  const [currentPos, setCurrentPos] = useState(-1);
  const [currentMatch, setCurrentMatch] = useState(-1);
  const [matches, setMatches] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);

  useEffect(() => {
    reset();
  }, [text, pattern]);

  const reset = () => {
    setCurrentPos(-1);
    setCurrentMatch(-1);
    setMatches([]);
    setComparisons(0);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', `Text length: ${text.length}`, `Pattern length: ${pattern.length}`]);
  };

  const runNaiveSearch = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    const n = text.length;
    const m = pattern.length;
    const found = [];
    const newLog = [...log];
    let comp = 0;

    for (let i = 0; i <= n - m; i++) {
      setCurrentPos(i);
      newLog.push(`Checking position ${i}`);
      setLog([...newLog]);
      await new Promise(resolve => setTimeout(resolve, speed / 2));

      let j = 0;
      for (j = 0; j < m; j++) {
        while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

        setCurrentMatch(j);
        comp++;
        setComparisons(comp);

        if (text[i + j] !== pattern[j]) {
          newLog.push(`✗ Mismatch at position ${i}, index ${j}: '${text[i + j]}' ≠ '${pattern[j]}'`);
          setLog([...newLog]);
          await new Promise(resolve => setTimeout(resolve, speed));
          break;
        }

        newLog.push(`✓ Match at position ${i}, index ${j}: '${text[i + j]}' = '${pattern[j]}'`);
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }

      if (j === m) {
        found.push(i);
        setMatches([...found]);
        newLog.push(`🎯 Pattern found at position ${i}`);
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }

    setCurrentPos(-1);
    setCurrentMatch(-1);
    setIsRunning(false);
    newLog.push(`Search completed! Found ${found.length} match(es)`);
    newLog.push(`Total comparisons: ${comp}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCharColor = (idx, isPattern = false) => {
    if (isPattern) {
      if (currentMatch === idx) return 'bg-yellow-300 border-yellow-500';
      return 'bg-blue-100 border-blue-400';
    }
    
    if (matches.some(m => idx >= m && idx < m + pattern.length)) return 'bg-green-200 border-green-500';
    if (currentPos >= 0 && idx >= currentPos && idx < currentPos + pattern.length) {
      if (idx - currentPos === currentMatch) return 'bg-yellow-300 border-yellow-500';
      if (idx - currentPos < currentMatch) return 'bg-green-200 border-green-500';
      return 'bg-blue-100 border-blue-400';
    }
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">Naive String Matching</h1>
          <p className="text-orange-600">Brute force pattern matching with character comparison</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">String Visualization</h2>
            
            <div className="space-y-6 mb-6">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2" style={{ fontWeight: '600', color: '#374151' }}>Text:</div>
                <div className="flex flex-wrap gap-1">
                  {text.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center font-bold border-2 rounded transition-all ${getCharColor(idx)}`}
                      style={{ fontSize: '1rem', color: '#000' }}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2" style={{ fontWeight: '600', color: '#374151' }}>Pattern:</div>
                <div className="flex gap-1">
                  {pattern.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center font-bold border-2 rounded transition-all ${getCharColor(idx, true)}`}
                      style={{ fontSize: '1rem', color: '#000' }}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              {currentPos >= 0 && (
                <div className="p-3 bg-yellow-50 rounded text-sm">
                  <div className="font-semibold">Current Position: {currentPos}</div>
                  <div className="text-gray-600">Comparing: {currentMatch >= 0 ? `Index ${currentMatch}` : 'Starting...'}</div>
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
                  style={{ color: '#000', fontWeight: '600' }}
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
                  style={{ color: '#000', fontWeight: '600' }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={runNaiveSearch} disabled={isRunning || !pattern} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Search'}
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
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Matches Found:</div>
                  <div className="text-3xl font-bold text-orange-600">{matches.length}</div>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Algorithm Steps</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="p-2 bg-gray-50 rounded">1. Start at position 0 in text</div>
                <div className="p-2 bg-gray-50 rounded">2. Compare pattern with text character by character</div>
                <div className="p-2 bg-gray-50 rounded">3. If mismatch, shift pattern by 1 position</div>
                <div className="p-2 bg-gray-50 rounded">4. If full match, record position and continue</div>
                <div className="p-2 bg-gray-50 rounded">5. Repeat until end of text</div>
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
                <p><strong>Time Complexity:</strong> O(n × m)</p>
                <p><strong>Space Complexity:</strong> O(1)</p>
                <p><strong>Approach:</strong> Brute force</p>
                <p><strong>Use Case:</strong> Simple pattern matching</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NaiveStringVisualize;