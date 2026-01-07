import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RabinKarpVisualize = () => {
  const [text, setText] = useState('ABABCABABA');
  const [pattern, setPattern] = useState('ABABA');
  const [patternHash, setPatternHash] = useState(0);
  const [currentHash, setCurrentHash] = useState(0);
  const [currentPos, setCurrentPos] = useState(-1);
  const [matches, setMatches] = useState([]);
  const [spurious, setSpurious] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [log, setLog] = useState([]);

  const d = 256; // Number of characters
  const q = 101; // Prime number for modulo

  useEffect(() => {
    reset();
  }, [text, pattern]);

  const reset = () => {
    setPatternHash(0);
    setCurrentHash(0);
    setCurrentPos(-1);
    setMatches([]);
    setSpurious([]);
    setComparisons(0);
    setIsRunning(false);
    setIsPaused(false);
    setLog(['Algorithm initialized', `Text length: ${text.length}`, `Pattern length: ${pattern.length}`, `Using d=${d}, q=${q}`]);
  };

  const calculateHash = (str, len) => {
    let hash = 0;
    for (let i = 0; i < len; i++) {
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

    // Calculate pattern hash
    const pHash = calculateHash(pattern, m);
    setPatternHash(pHash);
    newLog.push(`Pattern hash: ${pHash}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // Calculate first window hash
    let tHash = calculateHash(text, m);
    setCurrentHash(tHash);
    setCurrentPos(0);
    newLog.push(`Initial window hash: ${tHash}`);
    setLog([...newLog]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // Calculate h = d^(m-1) % q for rolling hash
    let h = 1;
    for (let i = 0; i < m - 1; i++) {
      h = (h * d) % q;
    }

    const found = [];
    const spuriousHits = [];

    for (let i = 0; i <= n - m; i++) {
      while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));

      setCurrentPos(i);
      setCurrentHash(tHash);

      if (pHash === tHash) {
        newLog.push(`Hash match at position ${i}: ${tHash}`);
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed));

        // Verify character by character
        let match = true;
        for (let j = 0; j < m; j++) {
          comp++;
          setComparisons(comp);
          if (text[i + j] !== pattern[j]) {
            match = false;
            spuriousHits.push(i);
            setSpurious([...spuriousHits]);
            newLog.push(`✗ Spurious hit at ${i} (hash collision)`);
            setLog([...newLog]);
            break;
          }
        }

        if (match) {
          found.push(i);
          setMatches([...found]);
          newLog.push(`🎯 Pattern found at position ${i}`);
          setLog([...newLog]);
        }

        await new Promise(resolve => setTimeout(resolve, speed));
      } else {
        newLog.push(`Hash mismatch at ${i}: ${tHash} ≠ ${pHash}`);
        setLog([...newLog]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }

      // Calculate hash for next window
      if (i < n - m) {
        tHash = (d * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
        if (tHash < 0) tHash += q;
        newLog.push(`Rolling hash for position ${i + 1}: ${tHash}`);
        setLog([...newLog]);
      }
    }

    setCurrentPos(-1);
    setIsRunning(false);
    newLog.push(`Search completed! Found ${found.length} match(es)`);
    newLog.push(`Spurious hits: ${spuriousHits.length}`);
    newLog.push(`Character comparisons: ${comp}`);
    setLog([...newLog]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const getCharColor = (idx) => {
    if (matches.some(m => idx >= m && idx < m + pattern.length)) return 'bg-green-200 border-green-500';
    if (spurious.some(s => idx >= s && idx < s + pattern.length)) return 'bg-red-200 border-red-500';
    if (currentPos >= 0 && idx >= currentPos && idx < currentPos + pattern.length) return 'bg-yellow-200 border-yellow-500';
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-2">Rabin-Karp Algorithm</h1>
          <p className="text-teal-600">Rolling hash pattern matching with efficient window sliding</p>
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
                      className="w-10 h-10 flex items-center justify-center font-bold border-2 rounded bg-teal-100 border-teal-400"
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              {currentPos >= 0 && (
                <div className="space-y-2">
                  <div className="p-3 bg-teal-50 rounded">
                    <div className="text-sm font-semibold">Pattern Hash: {patternHash}</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded">
                    <div className="text-sm font-semibold">Current Window Hash: {currentHash}</div>
                    <div className="text-xs text-gray-600">Position: {currentPos}</div>
                  </div>
                  {patternHash === currentHash && (
                    <div className="p-2 bg-orange-50 rounded text-sm text-orange-700">
                      ⚠️ Hash match! Verifying characters...
                    </div>
                  )}
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
              <button onClick={runRabinKarp} disabled={isRunning || !pattern} className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50">
                {isRunning ? 'Running...' : 'Start Rabin-Karp'}
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
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Matches:</div>
                  <div className="text-2xl font-bold text-teal-600">{matches.length}</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Spurious:</div>
                  <div className="text-2xl font-bold text-red-600">{spurious.length}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Comparisons:</div>
                  <div className="text-2xl font-bold text-gray-800">{comparisons}</div>
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

            {spurious.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Spurious Hits (Hash Collisions)</h3>
                <div className="flex flex-wrap gap-2">
                  {spurious.map((pos, idx) => (
                    <div key={idx} className="px-4 py-2 bg-red-100 border-2 border-red-500 rounded-lg font-semibold">
                      Position {pos}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rolling Hash Formula</h3>
              <div className="p-4 bg-gray-50 rounded font-mono text-xs space-y-2">
                <div>hash(txt[i+1..i+m]) =</div>
                <div className="ml-4 text-teal-600">d × (hash(txt[i..i+m-1]) - txt[i] × h)</div>
                <div className="ml-4 text-teal-600">+ txt[i+m]</div>
                <div className="mt-2 text-gray-600">where h = d^(m-1) mod q</div>
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
                      entry.includes('✗') ? 'text-red-700 bg-red-50' :
                      entry.includes('Hash match') ? 'text-orange-700 bg-orange-50' :
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
                <p><strong>Time Complexity:</strong> O(n + m) average</p>
                <p><strong>Space Complexity:</strong> O(1)</p>
                <p><strong>Approach:</strong> Rolling hash with verification</p>
                <p><strong>Use Case:</strong> Multiple pattern search, plagiarism detection</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RabinKarpVisualize;