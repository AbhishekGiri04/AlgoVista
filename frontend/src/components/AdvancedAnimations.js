import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const MatrixRain = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#7c3aed';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 35);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: -30, opacity: 0.1 }}
    />
  );
};

export const FloatingCode = ({ code, delay = 0 }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        backgroundColor: 'rgba(30, 41, 59, 0.3)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#c4b5fd',
        left: `${Math.random() * 90 + 5}%`,
        top: '120%',
        zIndex: -10
      }}
      initial={{ opacity: 0, y: 200, rotate: -10 }}
      animate={{ 
        opacity: [0, 0.8, 0.8, 0],
        y: [200, -200],
        rotate: [-10, 10, -10],
        x: [0, Math.random() * 100 - 50, 0]
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "linear"
      }}
    >
      {code}
    </motion.div>
  );
};

export const PulsingOrb = ({ size = 100, color = "purple", delay = 0 }) => {
  const colorMap = {
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cyan: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    pink: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    indigo: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
  };
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: colorMap[color] || colorMap.purple,
        opacity: 0.15,
        filter: 'blur(60px)',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        zIndex: -20
      }}
      animate={{
        scale: [1, 1.8, 1],
        opacity: [0.15, 0.4, 0.15],
        x: [0, Math.random() * 50 - 25, 0],
        y: [0, Math.random() * 50 - 25, 0]
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};