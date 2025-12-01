import React, { useState } from 'react';
import axios from 'axios';

const StackVisualizer = () => {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:8000/api';

  const pushValue = async () => {
    if (!inputValue) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/stack/push`, { value: inputValue });
      if (response.data.success) {
        await displayStack();
      }
      setInputValue('');
    } catch (error) {
      console.error('Error pushing value:', error);
    }
    setLoading(false);
  };

  const popValue = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/stack/pop`);
      if (response.data.success) {
        await displayStack();
      }
    } catch (error) {
      console.error('Error popping value:', error);
    }
    setLoading(false);
  };

  const displayStack = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stack/display`);
      if (response.data.success) {
        const stackData = response.data.output.split(',').filter(item => item.trim());
        setStack(stackData);
      }
    } catch (error) {
      console.error('Error displaying stack:', error);
    }
  };

  return (
    <div style={{
      backgroundColor: '#0a0e1a',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Stack Visualizer
      </h1>

      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '40px',
        alignItems: 'center'
      }}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px solid #374151',
            background: '#1f2937',
            color: 'white',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={pushValue}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Push
        </button>
        <button
          onClick={popValue}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Pop
        </button>
        <button
          onClick={displayStack}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Display
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '10px',
        minHeight: '300px',
        alignItems: 'center'
      }}>
        {stack.map((item, index) => (
          <div
            key={index}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: '600',
              minWidth: '100px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
              animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StackVisualizer;