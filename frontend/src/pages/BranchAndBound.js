import React from 'react';

const BranchAndBound = () => {
  const algorithms = [
    {
      name: 'Travelling Salesman Problem (TSP)',
      description: 'Shortest route visiting all cities',
      gradient: 'linear-gradient(135deg, #ff9f43, #ff6348)',
      shadowColor: 'rgba(255, 159, 67, 0.4)',
      timeComplexity: 'O(n!)',
      spaceComplexity: 'O(n)',
      stable: false,
      inPlace: false
    },
    {
      name: 'Job Scheduling',
      description: 'Optimal task allocation and timing',
      gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
      shadowColor: 'rgba(139, 92, 246, 0.4)',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      stable: false,
      inPlace: false
    }
  ];

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.7), rgba(10, 14, 26, 0.7)), url(https://algocademy.com/blog/wp-content/uploads/2024/10/compressed_image-279-1024x585.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
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
      }}>
        ← Back to Dashboard
      </a>
      
      <div style={{
        textAlign: 'center',
        marginTop: '120px',
        marginBottom: '60px'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '20px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}>
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: '800',
          color: '#f97316',
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Branch and Bound
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          fontWeight: '400',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Systematic exploration with pruning for optimal solutions
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        maxWidth: '800px',
        padding: '0 40px 80px',
        width: '100%'
      }}>
        {algorithms.map((algorithm, index) => (
          <div
            key={index}
            style={{
              background: algorithm.gradient,
              borderRadius: '20px',
              padding: '35px 25px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: `0 4px 15px ${algorithm.shadowColor.replace('0.4', '0.2')}`,
              transform: 'translateY(0) scale(1)',
              border: 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px) scale(1.01)';
              e.target.style.boxShadow = `0 8px 20px ${algorithm.shadowColor.replace('0.4', '0.3')}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = `0 4px 15px ${algorithm.shadowColor.replace('0.4', '0.2')}`;
            }}
          >
            <h3 style={{ 
              margin: '0 0 15px', 
              fontSize: '1.6rem', 
              fontWeight: '800',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {algorithm.name}
            </h3>
            
            <p style={{ 
              fontSize: '1rem', 
              opacity: 0.95, 
              margin: '0 0 12px',
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              color: 'black'
            }}>
              {algorithm.description}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              margin: '12px 0',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              <span style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#991b1b',
                padding: '4px 10px',
                borderRadius: '12px'
              }}>Time: {algorithm.timeComplexity}</span>
              <span style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#1e40af',
                padding: '4px 10px',
                borderRadius: '12px'
              }}>Space: {algorithm.spaceComplexity}</span>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  const name = algorithm.name.toLowerCase().replace(/\s+/g, '').replace(/'/g, '').replace(/-/g, '').replace(/\([^)]*\)/g, '');
                  window.location.href = `/${name}visualize`;
                }}
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
                onClick={(e) => { 
                  e.stopPropagation(); 
                  const name = algorithm.name.toLowerCase().replace(/\s+/g, '').replace(/'/g, '').replace(/-/g, '').replace(/\([^)]*\)/g, '');
                  window.location.href = `/${name}code`;
                }}
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

export default BranchAndBound;