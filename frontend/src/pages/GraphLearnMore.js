import React from 'react';

const GraphLearnMore = () => {
  const algorithms = [
    {
      name: 'Depth-First Search (DFS)',
      description: 'Explores as far as possible along each branch before backtracking.',
      type: 'Traversal',
      applications: 'Detecting cycles in graphs. Pathfinding in mazes or puzzles. Topological sorting and connectivity checking.',
      example: 'Solving a maze or analyzing dependencies in project tasks.',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ff5252)'
    },
    {
      name: 'Breadth-First Search (BFS)',
      description: 'Explores all neighbors of a node before moving to the next level.',
      type: 'Traversal',
      applications: 'Shortest path in unweighted graphs. Social network analysis (friends-of-friends). Web crawlers and network broadcasting.',
      example: 'Finding shortest distance between two locations in a city map.',
      gradient: 'linear-gradient(135deg, #48dbfb, #0abde3)'
    },
    {
      name: 'Dijkstra\'s Algorithm',
      description: 'Finds the shortest path from a source node to all other nodes in a weighted graph.',
      type: 'Shortest Path',
      applications: 'GPS navigation systems. Network routing protocols. Optimizing delivery routes in logistics.',
      example: 'Google Maps computing fastest driving route.',
      gradient: 'linear-gradient(135deg, #ff9f43, #ff6348)'
    },
    {
      name: 'Kruskal\'s Algorithm',
      description: 'Finds a Minimum Spanning Tree (MST) by adding edges in increasing weight order without forming cycles.',
      type: 'Minimum Spanning Tree',
      applications: 'Designing cost-effective network layouts. Electrical grid or road network optimization. Cluster analysis in machine learning.',
      example: 'Connecting cities with minimum total road length.',
      gradient: 'linear-gradient(135deg, #feca57, #ff9ff3)'
    },
    {
      name: 'Prim\'s Algorithm',
      description: 'Builds an MST by starting from a node and adding the minimum-weight edge connecting the tree to a new vertex.',
      type: 'Minimum Spanning Tree',
      applications: 'Network design (telecom, computer networks). Infrastructure planning (roads, pipelines).',
      example: 'Laying fiber-optic cables connecting all offices efficiently.',
      gradient: 'linear-gradient(135deg, #4834d4, #686de0)'
    },
    {
      name: 'Bellman-Ford Algorithm',
      description: 'Finds shortest paths from a source node to all others, even with negative edge weights.',
      type: 'Shortest Path',
      applications: 'Routing protocols (distance-vector routing). Detecting negative cycles in graphs.',
      example: 'Network routing in systems with variable costs or delays.',
      gradient: 'linear-gradient(135deg, #00d2d3, #54a0ff)'
    },
    {
      name: 'Floyd-Warshall Algorithm',
      description: 'Computes shortest paths between all pairs of nodes.',
      type: 'All-pairs Shortest Path',
      applications: 'Traffic flow analysis and urban planning. Network optimization in telecommunications. Solving all-pairs shortest path problems.',
      example: 'Finding shortest travel time between all pairs of cities.',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
    },
    {
      name: 'Topological Sort',
      description: 'Orders vertices of a Directed Acyclic Graph (DAG) linearly such that for every edge u → v, u comes before v.',
      type: 'Linear Ordering',
      applications: 'Task scheduling with dependencies. Course prerequisite ordering in universities. Build systems in software engineering (compilation order).',
      example: 'Scheduling tasks in project management where some tasks depend on others.',
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)'
    },
    {
      name: 'Kahn\'s Algorithm',
      description: 'Performs Topological Sorting using in-degree method (removes nodes with zero in-degree iteratively).',
      type: 'Topological Sort',
      applications: 'Same as topological sort: task scheduling, course prerequisites, build systems.',
      example: 'Resolving dependencies between software packages during installation.',
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)'
    },
    {
      name: 'Kosaraju\'s Algorithm',
      description: 'Finds Strongly Connected Components (SCCs) in a directed graph.',
      type: 'Strongly Connected Components',
      applications: 'Social network analysis (groups of mutually connected users). Optimizing web crawling. Detecting cycles and components in complex systems.',
      example: 'Identifying communities in a social network.',
      gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)'
    }
  ];

  const AlgorithmCard = ({ algorithm }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1a1a1a',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
      border: `3px solid ${algorithm.gradient.includes('ff6b6b') ? '#ff6b6b' : algorithm.gradient.includes('48dbfb') ? '#48dbfb' : algorithm.gradient.includes('ff9f43') ? '#ff9f43' : algorithm.gradient.includes('feca57') ? '#feca57' : algorithm.gradient.includes('4834d4') ? '#4834d4' : algorithm.gradient.includes('00d2d3') ? '#00d2d3' : algorithm.gradient.includes('43e97b') ? '#43e97b' : '#ff6b6b'}`,
      backdropFilter: 'blur(10px)',
      transform: 'translateY(0)',
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{ 
        margin: '0 0 16px', 
        fontSize: '1.6rem', 
        fontWeight: '800',
        background: algorithm.gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {algorithm.name}
      </h3>
      <p style={{ margin: '0 0 20px', lineHeight: '1.6', fontSize: '1.05rem', color: '#2d3748' }}>
        {algorithm.description}
      </p>
      <div style={{ 
        padding: '12px 16px', 
        background: '#f7fafc', 
        borderRadius: '8px', 
        border: '1px solid #718096',
        marginBottom: '16px'
      }}>
        <strong style={{ color: '#4a5568' }}>Type:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{algorithm.type}</span>
      </div>
      <div style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '12px', 
        color: 'white',
        marginBottom: '12px'
      }}>
        <strong style={{ fontSize: '1.05rem' }}>Applications:</strong>
        <div style={{ marginTop: '8px', fontSize: '1rem', lineHeight: '1.5' }}>{algorithm.applications}</div>
      </div>
      <div style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
        borderRadius: '12px', 
        color: 'white'
      }}>
        <strong style={{ fontSize: '1.05rem' }}>Example:</strong>
        <div style={{ marginTop: '8px', fontSize: '1rem', lineHeight: '1.5', fontStyle: 'italic' }}>{algorithm.example}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://www.dbta.com/Images/Default.aspx?ImageID=23974)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <a href="/graphalgorithms" style={{
        position: 'fixed',
        top: '40px',
        left: '40px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 6px 20px rgba(124, 58, 237, 0.4)',
        zIndex: 1000
      }}>
        ← Back to Graph Algorithms
      </a>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            color: '#1a202c',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🔗 Graph Algorithms Guide
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#2d3748', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            Complete guide to graph algorithms, their types, and applications
          </p>
        </div>

        {/* Definition Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#43e97b', textAlign: 'center' }}>
            📚 Definition
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #43e97b',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', margin: 0, color: '#2d3748', fontWeight: '500', textAlign: 'center' }}>
              Graph algorithms are used to solve problems related to networks, connectivity, paths, and relationships between entities. They are essential in computer science, networking, logistics, and social networks.
            </p>
          </div>
        </section>

        {/* Algorithms Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#ed8936', textAlign: 'center' }}>
            ⛓️‍💥 Graph Algorithms
          </h2>
          {algorithms.map((algorithm, index) => (
            <AlgorithmCard key={index} algorithm={algorithm} />
          ))}
        </section>

        {/* Comparison Table */}
        <section>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', color: '#38b2ac', textAlign: 'center' }}>
            📋 Quick Comparison Table
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '30px',
            border: '3px solid #38b2ac',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Algorithm</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Type / Purpose</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Key Applications</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'DFS', type: 'Traversal', apps: 'Cycle detection, maze solving, topological sorting' },
                  { name: 'BFS', type: 'Traversal', apps: 'Shortest path (unweighted), social networks, broadcasting' },
                  { name: 'Dijkstra', type: 'Shortest Path', apps: 'GPS navigation, network routing, logistics optimization' },
                  { name: 'Kruskal', type: 'Minimum Spanning Tree', apps: 'Network design, cluster analysis, infrastructure planning' },
                  { name: 'Prim\'s', type: 'Minimum Spanning Tree', apps: 'Telecom networks, pipeline/road design' },
                  { name: 'Bellman-Ford', type: 'Shortest Path', apps: 'Networks with negative weights, routing, negative cycle detection' },
                  { name: 'Floyd-Warshall', type: 'All-pairs Shortest Path', apps: 'Traffic planning, network optimization' },
                  { name: 'Topological Sort', type: 'Linear Ordering', apps: 'Task scheduling, course prerequisites, build systems' },
                  { name: 'Kahn\'s', type: 'Topological Sort', apps: 'Dependency resolution, task scheduling' },
                  { name: 'Kosaraju\'s', type: 'Strongly Connected Components', apps: 'Social network analysis, web crawling, detecting connected components' }
                ].map((item, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '2px solid #e2e8f0',
                    background: index % 2 === 0 ? '#f7fafc' : 'white',
                    transition: 'all 0.2s ease'
                  }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#2d3748', fontSize: '1.05rem' }}>{item.name}</td>
                    <td style={{ padding: '16px', color: '#4a5568', fontWeight: '600' }}>{item.type}</td>
                    <td style={{ padding: '16px', color: '#38a169', fontWeight: '600' }}>{item.apps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GraphLearnMore;