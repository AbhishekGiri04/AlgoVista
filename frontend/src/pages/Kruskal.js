import React, { useState } from 'react';

const Kruskal = () => {
  const [graphData, setGraphData] = useState(`5
0: 1-2 3-6
1: 0-2 2-3 3-8 4-5
2: 1-3 4-7
3: 0-6 1-8 4-9
4: 1-5 2-7 3-9`);
  const [isRunning, setIsRunning] = useState(false);

  const parseInput = () => {
    const input = graphData.trim().split('\n');
    const n = parseInt(input[0]);
    const adjList = Array.from({ length: n }, () => []);
    const edges = [];
    const edgeSet = new Set();

    for (let i = 1; i <= n; i++) {
      const [node, rest] = input[i].split(':');
      const u = parseInt(node.trim());
      const pairs = rest.trim().split(' ');
      for (const pair of pairs) {
        const [v, w] = pair.split('-').map(Number);
        adjList[u].push({ to: v, weight: w });
        const key = u < v ? `${u}-${v}` : `${v}-${u}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ u, v, w });
        }
      }
    }
    return { n, adjList, edges };
  };

  const runKruskal = () => {
    if (isRunning) return;
    setIsRunning(true);

    const { n, edges, adjList } = parseInput();
    const parent = Array.from({ length: n }, (_, i) => i);
    const find = x => parent[x] === x ? x : parent[x] = find(parent[x]);
    const union = (a, b) => {
      const ra = find(a), rb = find(b);
      if (ra !== rb) parent[rb] = ra;
    };

    edges.sort((a, b) => a.w - b.w);
    const mstEdges = [];
    for (const { u, v } of edges) {
      if (find(u) !== find(v)) {
        union(u, v);
        mstEdges.push({ u, v });
      }
    }
    drawGraph(n, adjList, mstEdges);
    
    setTimeout(() => setIsRunning(false), mstEdges.length * 500 + 2000);
  };

  const drawGraph = (n, adjList, mstEdges) => {
    const container = document.getElementById('graph3D');
    container.innerHTML = '';
    const coords = [];
    const R = 200, cx = 350, cy = 220;

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI / n) * i;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      coords.push([x, y]);

      const node = document.createElement('div');
      node.className = 'node';
      node.textContent = i;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      container.appendChild(node);
    }

    for (let u = 0; u < n; u++) {
      for (const { to, weight } of adjList[u]) {
        if (u < to) drawEdge(container, coords[u], coords[to], false, weight);
      }
    }

    setTimeout(() => {
      mstEdges.forEach(({ u, v }, i) => {
        setTimeout(() => {
          const weight = adjList[u].find(e => e.to === v)?.weight || adjList[v].find(e => e.to === u)?.weight;
          drawEdge(container, coords[u], coords[v], true, weight);
        }, i * 500);
      });
    }, 1000);
  };

  const drawEdge = (container, from, to, highlight, weight = '') => {
    const [x1, y1] = from;
    const [x2, y2] = to;
    const dx = x2 - x1, dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const edge = document.createElement('div');
    edge.className = 'edge' + (highlight ? ' orange' : '');
    edge.style.width = `${length}px`;
    edge.style.left = `${x1}px`;
    edge.style.top = `${y1}px`;
    edge.style.transform = `rotate(${angle}deg)`;
    container.appendChild(edge);

    const label = document.createElement('div');
    label.className = 'weight-label';
    label.textContent = weight;
    label.style.left = `${(x1 + x2) / 2 + 10}px`;
    label.style.top = `${(y1 + y2) / 2 + 5}px`;
    container.appendChild(label);
  };

  return (
    <div style={{
      background: '#0a0a0a',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <a href="/graphalgorithms" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)'
      }}>
        ← Back to Graph Algorithms
      </a>

      <h1>Kruskal's Algorithm - MST Visualizer 🕸️</h1>

      <textarea
        value={graphData}
        onChange={(e) => setGraphData(e.target.value)}
        rows="10"
        placeholder="Example:
5
0: 1-2 3-6
1: 0-2 2-3 3-8 4-5
2: 1-3 4-7
3: 0-6 1-8 4-9
4: 1-5 2-7 3-9"
        style={{
          margin: '10px',
          padding: '10px',
          width: '60%',
          fontSize: '16px',
          borderRadius: '8px',
          background: '#2c2c2c',
          color: 'white',
          border: '1px solid #00bcd4'
        }}
      />
      <br />

      <button 
        onClick={runKruskal}
        disabled={isRunning}
        style={{
          margin: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          background: isRunning ? '#666' : '#f57c00',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          boxShadow: '0 0 10px orange',
          cursor: isRunning ? 'not-allowed' : 'pointer'
        }}
      >
        {isRunning ? 'Running...' : 'Visualize Kruskal\'s MST'}
      </button>

      <div 
        id="graph3D"
        style={{
          marginTop: '30px',
          width: '800px',
          height: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
          position: 'relative'
        }}
      />

      <style>{`
        .node {
          width: 50px;
          height: 50px;
          background: #222;
          border: 2px solid #00bcd4;
          color: white;
          position: absolute;
          border-radius: 50%;
          text-align: center;
          line-height: 50px;
          font-weight: bold;
          box-shadow: 0 0 10px cyan;
        }

        .edge {
          height: 2px;
          background: white;
          position: absolute;
          transform-origin: left center;
          opacity: 0.6;
        }

        .edge.orange {
          background: orange;
          box-shadow: 0 0 10px orange;
          opacity: 1;
        }

        .weight-label {
          position: absolute;
          color: yellow;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Kruskal;