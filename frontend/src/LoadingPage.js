import React, { useEffect } from 'react';

const LoadingPage = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <img 
        src="https://i.pinimg.com/originals/a2/70/d2/a270d270d5ca184422cf980475b99e24.gif"
        alt="Loading..."
        style={{ 
          width: '100vw', 
          height: '100vh', 
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
    </div>
  );
};

export default LoadingPage;