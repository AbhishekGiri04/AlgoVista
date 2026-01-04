import React from 'react';

const SearchingAlgorithms = () => {
  return (
    <div style={{
      backgroundColor: '#1a1f2e',
      backgroundImage: 'linear-gradient(rgba(26, 31, 46, 0.6), rgba(26, 31, 46, 0.6)), url(https://img.freepik.com/premium-photo/magnifying-glass-gray-background-with-interconnected-lines-dots_1369729-85415.jpg?semt=ais_hybrid&w=740&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
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
        top: '30px',
        left: '30px',
        background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
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
          color: 'white',
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          Searching Algorithms
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          fontWeight: '400',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Explore different searching techniques and their complexities
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '25px',
        maxWidth: '1200px',
        padding: '0 40px 80px'
      }}>
        {[
          { name: 'Linear Search', desc: 'Sequential search', gradient: 'linear-gradient(135deg, #4834d4, #5f27cd)', shadow: 'rgba(72, 52, 212, 0.3)' },
          { name: 'Binary Search', desc: 'Divide and conquer', gradient: 'linear-gradient(135deg, #686de0, #30336b)', shadow: 'rgba(104, 109, 224, 0.3)' },
          { name: 'Jump Search', desc: 'Block-based search', gradient: 'linear-gradient(135deg, #74b9ff, #0984e3)', shadow: 'rgba(116, 185, 255, 0.3)' },
          { name: 'Exponential Search', desc: 'Exponential bounds', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', shadow: 'rgba(255, 107, 107, 0.3)' }
        ].map((algo, i) => (
          <div key={i} style={{
            background: algo.gradient,
            borderRadius: '15px',
            padding: '25px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: `0 8px 25px ${algo.shadow}`,
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = `0 15px 35px ${algo.shadow.replace('0.3', '0.4')}`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = `0 8px 25px ${algo.shadow}`;
          }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem', fontWeight: '700' }}>{algo.name}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: '0 0 20px', color: 'black' }}>{algo.desc}</p>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              <button 
                onClick={() => window.location.href = `/${algo.name.toLowerCase().replace(/\s+/g, '')}visualize`}
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
                onClick={() => window.location.href = `/${algo.name.toLowerCase().replace(/\s+/g, '')}code`}
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

export default SearchingAlgorithms;