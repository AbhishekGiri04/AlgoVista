import React from 'react';

const DataStructuresLearnMore = () => {
  const dataStructures = [
    {
      name: 'Array',
      description: 'A collection of elements stored in contiguous memory locations.',
      type: 'Linear, Contiguous',
      applications: 'Storing lists of items, like student marks, employee records. Implementing matrices and image data in graphics. Used in sorting and searching algorithms.',
      example: 'A list of monthly sales or temperatures.',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ff5252)'
    },
    {
      name: 'Stack',
      description: 'A Last-In-First-Out (LIFO) data structure.',
      type: 'Linear, LIFO',
      applications: 'Undo/Redo functionality in text editors. Expression evaluation and syntax parsing in compilers. Backtracking problems, like maze solving.',
      example: 'Browser history navigation.',
      gradient: 'linear-gradient(135deg, #48dbfb, #0abde3)'
    },
    {
      name: 'Queue',
      description: 'A First-In-First-Out (FIFO) data structure.',
      type: 'Linear, FIFO',
      applications: 'Task scheduling in operating systems. Print job management in printers. Handling requests in servers (web servers, call centers).',
      example: 'Ticket booking systems or job queues.',
      gradient: 'linear-gradient(135deg, #ff9f43, #ff6348)'
    },
    {
      name: 'Linked List',
      description: 'A collection of nodes where each node points to the next (or previous).',
      type: 'Linear, Dynamic',
      applications: 'Implementing dynamic memory allocation. Used in stacks, queues, and adjacency lists for graphs. Efficient insertion/deletion at any position in the list.',
      example: 'Music playlists where songs can be added or removed dynamically.',
      gradient: 'linear-gradient(135deg, #feca57, #ff9ff3)'
    },
    {
      name: 'Tree',
      description: 'Hierarchical data structure with root nodes and child nodes.',
      type: 'Non-linear, Hierarchical',
      applications: 'Hierarchical databases (like file systems). Expression parsing in compilers. Decision-making algorithms, like decision trees. Binary Search Trees (BST) for fast lookup, insertion, deletion.',
      example: 'Organization charts or website menus.',
      gradient: 'linear-gradient(135deg, #4834d4, #686de0)'
    },
    {
      name: 'Graph',
      description: 'Set of nodes (vertices) connected by edges. Can be directed/undirected, weighted/unweighted.',
      type: 'Non-linear, Network',
      applications: 'Social networks (friends or followers). Maps and navigation systems (shortest path finding). Computer networks (routing and connectivity). Dependency resolution in project management or software packages.',
      example: 'Google Maps finding the shortest route, Facebook friend suggestions.',
      gradient: 'linear-gradient(135deg, #00d2d3, #54a0ff)'
    }
  ];

  const DataStructureCard = ({ ds }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1a1a1a',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
      border: `3px solid ${ds.gradient.includes('ff6b6b') ? '#ff6b6b' : ds.gradient.includes('48dbfb') ? '#48dbfb' : ds.gradient.includes('ff9f43') ? '#ff9f43' : ds.gradient.includes('feca57') ? '#feca57' : ds.gradient.includes('4834d4') ? '#4834d4' : '#00d2d3'}`,
      backdropFilter: 'blur(10px)',
      transform: 'translateY(0)',
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{ 
        margin: '0 0 16px', 
        fontSize: '1.6rem', 
        fontWeight: '800',
        background: ds.gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {ds.name}
      </h3>
      <p style={{ margin: '0 0 20px', lineHeight: '1.6', fontSize: '1.05rem', color: '#2d3748' }}>
        {ds.description}
      </p>
      <div style={{ 
        padding: '12px 16px', 
        background: '#f7fafc', 
        borderRadius: '8px', 
        border: '1px solid #718096',
        marginBottom: '16px'
      }}>
        <strong style={{ color: '#4a5568' }}>Type:</strong> <span style={{ color: '#1a202c', fontWeight: '600' }}>{ds.type}</span>
      </div>
      <div style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: '12px', 
        color: 'white',
        marginBottom: '12px'
      }}>
        <strong style={{ fontSize: '1.05rem' }}>Applications:</strong>
        <div style={{ marginTop: '8px', fontSize: '1rem', lineHeight: '1.5' }}>{ds.applications}</div>
      </div>
      <div style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
        borderRadius: '12px', 
        color: 'white'
      }}>
        <strong style={{ fontSize: '1.05rem' }}>Example:</strong>
        <div style={{ marginTop: '8px', fontSize: '1rem', lineHeight: '1.5', fontStyle: 'italic' }}>{ds.example}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://media.licdn.com/dms/image/v2/D5612AQFAdC3uWyOmhw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1699364154012?e=2147483647&v=beta&t=OXWPPxD8dElBloRYJHQjGW0ig8F80IenQq6Tv67SLF0)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <a href="/datastructures" style={{
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
        ← Back to Data Structures
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
            🖥️ Data Structures Guide
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#2d3748', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
            Complete guide to data structures, their types, and applications
          </p>
        </div>

        {/* Definition Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#00d2d3', textAlign: 'center' }}>
            📚 Definition
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '40px',
            border: '3px solid #00d2d3',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', margin: 0, color: '#2d3748', fontWeight: '500', textAlign: 'center' }}>
              Data structures are ways to organize and store data efficiently so that it can be accessed and modified effectively. Choosing the right data structure improves performance and resource utilization.
            </p>
          </div>
        </section>

        {/* Data Structures Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '24px', color: '#ed8936', textAlign: 'center' }}>
            ⌛️ Data Structures
          </h2>
          {dataStructures.map((ds, index) => (
            <DataStructureCard key={index} ds={ds} />
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
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Data Structure</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Type</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Example</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', fontSize: '1.1rem' }}>Applications</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Array', type: 'Linear, Contiguous', example: 'Monthly sales', apps: 'Matrices, search/sort, storing records' },
                  { name: 'Stack', type: 'Linear, LIFO', example: 'Browser history', apps: 'Undo/Redo, expression evaluation, backtracking' },
                  { name: 'Queue', type: 'Linear, FIFO', example: 'Ticket queue', apps: 'Task scheduling, print jobs, server requests' },
                  { name: 'Linked List', type: 'Linear, Dynamic', example: 'Music playlist', apps: 'Dynamic memory, stacks/queues, adjacency list' },
                  { name: 'Tree', type: 'Non-linear, Hierarchical', example: 'Organization chart', apps: 'Hierarchical databases, BST, decision making' },
                  { name: 'Graph', type: 'Non-linear, Network', example: 'Social network', apps: 'Maps, routing, dependency resolution' }
                ].map((item, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '2px solid #e2e8f0',
                    background: index % 2 === 0 ? '#f7fafc' : 'white',
                    transition: 'all 0.2s ease'
                  }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#2d3748', fontSize: '1.05rem' }}>{item.name}</td>
                    <td style={{ padding: '16px', color: '#4a5568', fontWeight: '600' }}>{item.type}</td>
                    <td style={{ padding: '16px', color: '#3182ce', fontWeight: '600' }}>{item.example}</td>
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

export default DataStructuresLearnMore;