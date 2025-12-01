import React, { useState } from 'react';

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [traverseOutput, setTraverseOutput] = useState([]);
  const [isTraversing, setIsTraversing] = useState(false);

  const enqueue = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a value to enqueue.');
      return;
    }
    setQueue([...queue, inputValue.trim()]);
    setInputValue('');
  };

  const dequeue = () => {
    if (queue.length === 0) {
      alert('Queue is empty.');
      return;
    }
    setQueue(queue.slice(1));
  };

  const traverseQueue = () => {
    if (queue.length === 0) {
      alert('Queue is empty.');
      return;
    }
    
    setIsTraversing(true);
    setTraverseOutput([]);
    let i = 0;
    
    const interval = setInterval(() => {
      if (i >= queue.length) {
        clearInterval(interval);
        setHighlightIndex(-1);
        setIsTraversing(false);
        return;
      }
      
      setHighlightIndex(i);
      setTraverseOutput(prev => [...prev, queue[i]]);
      i++;
    }, 600);
  };

  return (
    <div style={{
      backgroundColor: '#0e0e0e',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: 'white',
      textAlign: 'center',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <a href="/datastructures" style={{
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
        ← Back
      </a>

      <h1 style={{
        color: '#ff9800',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textShadow: '0 1px 2px rgba(0, 255, 255, 0.2)'
      }}>
        Queue Visualizer 🚦
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          style={{
            padding: '10px',
            margin: '8px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            background: '#2c2c2c',
            color: 'white',
            border: '1px solid #ffa726'
          }}
        />
        <button onClick={enqueue} style={{
          padding: '10px',
          margin: '8px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '6px',
          background: '#fb8c00',
          color: 'white',
          boxShadow: '0 0 10px #ffa726',
          cursor: 'pointer'
        }}>
          Enqueue
        </button>
        <button onClick={dequeue} style={{
          padding: '10px',
          margin: '8px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '6px',
          background: '#fb8c00',
          color: 'white',
          boxShadow: '0 0 10px #ffa726',
          cursor: 'pointer'
        }}>
          Dequeue
        </button>
        <button onClick={traverseQueue} style={{
          padding: '10px',
          margin: '8px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '6px',
          background: '#fb8c00',
          color: 'white',
          boxShadow: '0 0 10px #ffa726',
          cursor: 'pointer'
        }}>
          Traverse
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '300px',
        width: '120px',
        margin: '0 auto',
        padding: '20px 10px',
        background: 'radial-gradient(circle, #1c1c1c, #121212)',
        border: '6px solid #ff9800',
        borderRadius: '50px',
        boxShadow: 'inset 0 0 10px #ff9800, 0 0 30px #ffa726',
        overflow: 'hidden'
      }}>
        {queue.map((value, index) => (
          <div
            key={index}
            style={{
              width: '60px',
              height: '60px',
              margin: '6px 0',
              background: index === highlightIndex 
                ? 'linear-gradient(145deg, #ffc107, #ff9800)' 
                : 'linear-gradient(145deg, #ff9800, #f57c00)',
              borderRadius: '50%',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: '60px',
              textAlign: 'center',
              boxShadow: index === highlightIndex 
                ? '0 0 30px #ffc107, 0 0 60px #ff9800' 
                : '0 0 20px #ff9800',
              transform: index === highlightIndex ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.4s ease'
            }}
          >
            {value}
          </div>
        ))}
      </div>

      {isTraversing && (
        <div style={{
          marginTop: '30px',
          padding: '10px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ffeb3b'
        }}>
          Traversing Queue (FIFO Order):
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '20px',
            gap: '10px'
          }}>
            {traverseOutput.map((value, index) => (
              <div
                key={index}
                style={{
                  width: '60px',
                  height: '60px',
                  margin: '5px',
                  background: 'linear-gradient(145deg, #ff5722, #e64a19)',
                  borderRadius: '50%',
                  lineHeight: '60px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white',
                  animation: 'jump 0.5s ease',
                  boxShadow: '0 0 20px #ff5722'
                }}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes jump {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
          100% { transform: translateY(0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Queue;