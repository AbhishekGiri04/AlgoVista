import React from 'react';

const DataStructures = () => {
  const dataStructures = [
    { name: 'Array', path: '/array', icon: '📊', gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)', shadow: 'rgba(168, 237, 234, 0.3)', desc: 'Contiguous memory storage' },
    { name: 'Stack', path: '/stack', icon: '📚', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)', shadow: 'rgba(255, 236, 210, 0.3)', desc: 'Last-In-First-Out structure' },
    { name: 'Queue', path: '/queue', icon: '🚶', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)', shadow: 'rgba(255, 154, 158, 0.3)', desc: 'First-In-First-Out structure' },
    { name: 'Linked List', path: '/linkedlist', icon: '🔗', gradient: 'linear-gradient(135deg, #e8d5c4, #f4e4bc)', shadow: 'rgba(232, 213, 196, 0.3)', desc: 'Dynamic node-based storage' },
    { name: 'Tree', path: '/tree', icon: '🌳', gradient: 'linear-gradient(135deg, #c7a2d9, #e8b4cb)', shadow: 'rgba(199, 162, 217, 0.3)', desc: 'Hierarchical data organization' },
    { name: 'Graph', path: '/graph', icon: '🕸️', gradient: 'linear-gradient(135deg, #b3d9ff, #c2e9fb)', shadow: 'rgba(179, 217, 255, 0.3)', desc: 'Network of connected nodes' }
  ];

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://www.crio.do/blog/content/images/2020/07/blog_default.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      margin: 0,
      padding: 0
    }}>
      <a href="/visualizer" style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '14px 24px',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 12px 35px rgba(124, 58, 237, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.4)';
      }}>
        ← Back to Dashboard
      </a>
      
      <div style={{
        textAlign: 'center',
        marginTop: '100px',
        marginBottom: '80px'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: '800',
          color: '#8b5cf6',
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Data Structures
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          fontWeight: '400',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Explore different data structures and their implementations
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        maxWidth: '1000px',
        padding: '0 40px 80px',
        width: '100%'
      }}>
        {dataStructures.map((ds, index) => (
          <div
            key={index}
            style={{
              background: ds.gradient,
              borderRadius: '20px',
              padding: '35px 25px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: `0 4px 15px ${ds.shadow.replace('0.3', '0.2')}`,
              transform: 'translateY(0) scale(1)',
              border: 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px) scale(1.01)';
              e.target.style.boxShadow = `0 8px 20px ${ds.shadow.replace('0.3', '0.3')}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = `0 4px 15px ${ds.shadow.replace('0.3', '0.2')}`;
            }}
          >
            <h3 style={{ 
              margin: '0 0 15px', 
              fontSize: '1.6rem', 
              fontWeight: '800',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              color: 'white'
            }}>
              {ds.name}
            </h3>
            
            <p style={{ 
              fontSize: '1rem', 
              opacity: 0.95, 
              margin: '0 0 20px',
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              color: '#1a1f2e'
            }}>
              {ds.desc}
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <button 
                onClick={() => window.location.href = `/${ds.name.toLowerCase().replace(/\s+/g, '')}visualize`}
                style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '120px',
                boxShadow: '0 10px 20px rgba(6, 182, 212, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.08)';
                e.target.style.boxShadow = '0 20px 40px rgba(6, 182, 212, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 20px rgba(6, 182, 212, 0.2)';
              }}>
                Visualize
              </button>
              
              <button 
                onClick={() => window.location.href = `/${ds.name.toLowerCase().replace(/\s+/g, '')}code`}
                style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '120px',
                boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.08)';
                e.target.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.2)';
              }}>
                Code
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataStructures;