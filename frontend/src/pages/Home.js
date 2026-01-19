import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { MatrixRain, FloatingCode, PulsingOrb } from '../components/AdvancedAnimations';

const ParticleSystem = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        // Draw connections
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.3;
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
        
        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-40"
    />
  );
};

const FloatingElement = ({ children, delay = 0 }) => {
  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-20px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { duration: 3000 },
    delay,
  });
  
  return <animated.div style={floatAnimation}>{children}</animated.div>;
};

const GlowButton = ({ href, children, primary = false, onClick }) => {
  const buttonClass = primary
    ? "relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white px-10 py-5 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
    : "relative bg-white/10 backdrop-blur-md text-slate-200 px-10 py-5 text-xl font-semibold rounded-2xl border-2 border-white/20 transition-all duration-300 transform hover:scale-105 hover:bg-white/20 hover:border-white/40";
  
  return (
    <motion.a
      href={href}
      className={buttonClass}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {children}
    </motion.a>
  );
};

const DataStructureIcon = ({ type, delay }) => {
  const icons = {
    stack: (
      <div className="flex flex-col space-y-1">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="w-12 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.1 }}
          />
        ))}
      </div>
    ),
    tree: (
      <div className="relative">
        <motion.div
          className="w-4 h-4 bg-orange-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay, type: 'spring' }}
        />
        <motion.div
          className="w-0.5 h-6 bg-orange-300 absolute top-4 left-1/2 transform -translate-x-1/2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: delay + 0.2 }}
        />
        <motion.div
          className="w-4 h-4 bg-orange-400 rounded-full absolute top-8 left-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.4, type: 'spring' }}
        />
        <motion.div
          className="w-4 h-4 bg-orange-400 rounded-full absolute top-8 right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.6, type: 'spring' }}
        />
      </div>
    ),
    graph: (
      <div className="relative w-16 h-16">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-400 rounded-full absolute"
            style={{
              top: `${Math.sin(i * 1.2) * 20 + 30}px`,
              left: `${Math.cos(i * 1.2) * 20 + 30}px`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + i * 0.1, type: 'spring' }}
          />
        ))}
      </div>
    ),
  };
  
  return (
    <FloatingElement delay={delay * 1000}>
      <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        {icons[type]}
      </div>
    </FloatingElement>
  );
};

const Home = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };
  
  const codeSnippets = [
    "push(42)",
    "pop()",
    "enqueue(x)",
    "dequeue()",
    "insert(node)",
    "delete(key)",
    "dijkstra()",
    "bfs(graph)",
    "dfs(tree)",
    "sort(array)"
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 animate-pulse" />
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(119,198,255,0.3),transparent_50%)]" />
      </div>
      
      {/* Animated grid pattern overlay */}
      <motion.div 
        className="absolute inset-0 opacity-5" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Floating light beams */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{
            width: '2px',
            height: '100vh',
            background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.5), transparent)',
            left: `${20 + i * 15}%`,
            top: 0
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scaleY: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
      
      {/* Rotating rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-white/10 rounded-full"
          style={{
            width: `${300 + i * 200}px`,
            height: `${300 + i * 200}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 30 + i * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      <MatrixRain />
      <ParticleSystem />
      
      {/* Floating code snippets */}
      {codeSnippets.map((code, i) => (
        <FloatingCode key={i} code={code} delay={i * 2} />
      ))}
      
      {/* Enhanced pulsing orbs with better positioning */}
      {[...Array(8)].map((_, i) => (
        <PulsingOrb 
          key={i} 
          size={Math.random() * 300 + 100} 
          color={['purple', 'blue', 'cyan', 'emerald', 'pink', 'indigo'][i % 6]}
          delay={i * 1.2}
        />
      ))}
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `linear-gradient(45deg, rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.1), transparent)`,
              borderRadius: i % 2 === 0 ? '50%' : '20%',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <ParticleSystem />
      
      {/* Advanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
        
        {/* Animated waves */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-px opacity-10"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
              top: `${25 + i * 20}%`
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 1.5
            }}
          />
        ))}
      </div>
      
      <motion.div
        ref={ref}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        style={{ paddingTop: '120px' }}
      >
        {/* Enhanced Badge */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3))',
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(168, 85, 247, 0.5)',
            borderRadius: '60px',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '40px',
            boxShadow: '0 8px 32px rgba(168, 85, 247, 0.3)'
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(168, 85, 247, 0.4)' }}
          animate={{ 
            borderColor: ['rgba(168, 85, 247, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(168, 85, 247, 0.5)'],
            boxShadow: ['0 8px 32px rgba(168, 85, 247, 0.3)', '0 8px 32px rgba(59, 130, 246, 0.3)', '0 8px 32px rgba(168, 85, 247, 0.3)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            ALGOVISTA - Next Gen DSA Platform
          </span>
        </motion.div>
        
        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: '900',
            textAlign: 'center',
            lineHeight: '1.1',
            marginBottom: '32px',
            maxWidth: '1200px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Visualize • Code • Learn
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
            color: '#f1f5f9',
            textAlign: 'center',
            marginBottom: '48px',
            maxWidth: '900px',
            lineHeight: '1.7',
            fontWeight: '400'
          }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '600'
          }}>
            Production-ready learning platform
          </span>
          {' '}engineered for developers and students.
          <br />
          Experience real-time C++ algorithm execution, interactive visualizations,
          <br />
          multi-language code examples, and performance insights in one unified platform.
          <br />
          <span style={{
            background: 'linear-gradient(45deg, #06b6d4, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            fontSize: '1.1em'
          }}>
            Master 39 algorithms across 8 categories with hands-on learning.
          </span>
        </motion.p>
        
        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <GlowButton href="/visualizer" primary>
            <span className="font-semibold tracking-wide">
              Launch Platform
            </span>
          </GlowButton>
          
          <GlowButton href="/about">
            <span className="font-semibold tracking-wide">
              Explore Features
            </span>
          </GlowButton>
        </motion.div>
        
        {/* Features grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl"
        >
          {[
            { icon: <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>, title: 'Real-Time C++ Execution', desc: 'Execute 39 algorithms with live C++ backend processing. Input data via web interface and watch step-by-step execution in real-time' },
            { icon: <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>, title: 'Multi-Language Code Examples', desc: 'Study algorithm implementations in C++, Python, Java, and JavaScript with professional syntax highlighting and detailed explanations' },
            { icon: <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>, title: 'Interactive Learning Experience', desc: 'Explore 8 algorithm categories with visual step-by-step breakdowns, performance metrics, and comprehensive theory documentation' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="glass-effect p-6 rounded-xl text-center group hover:bg-white/10 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.2 }}
            >
              <motion.div
                className="mb-4 flex justify-center text-purple-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Innovative Footer */}
      <motion.footer
        className="relative z-10 mt-20 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/30 to-slate-900/90 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_70%)]" />
        
        {/* Floating particles in footer */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Main Brand Section */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-4 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl">✈️</div>
              <h3 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                ALGOVISTA 
              </h3>
            </motion.div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Production-ready DSA learning platform with 39 algorithms across 8 categories. Real-time C++ execution, interactive visualizations, and comprehensive learning resources for developers worldwide.
            </p>
          </div>
          
          {/* Tech Stack & Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Tech Stack */}
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-bold text-white mb-6 flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg> Built With
              </h4>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                {[
                  { name: 'React', color: 'from-blue-400 to-cyan-400' },
                  { name: 'C++', color: 'from-purple-400 to-pink-400' },
                  { name: 'Node.js', color: 'from-green-400 to-emerald-400' },
                  { name: 'Express', color: 'from-yellow-400 to-orange-400' },
                  { name: 'Framer Motion', color: 'from-indigo-400 to-purple-400' }
                ].map((tech, i) => (
                  <motion.span
                    key={i}
                    className={`px-4 py-2 bg-gradient-to-r ${tech.color} text-black font-semibold rounded-full text-sm shadow-lg`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 + i * 0.1 }}
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </div>
              
              {/* Social Media Links */}
              <div className="flex justify-center lg:justify-start gap-3">
                <motion.a
                  href="https://www.linkedin.com/in/abhishek-giri04/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.0 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
                
                <motion.a
                  href="https://github.com/abhishekgiri04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.1 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.a>
                
                <motion.a
                  href="https://t.me/AbhishekGiri7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white hover:from-blue-300 hover:to-blue-500 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.2 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
            
            {/* Platform Capabilities */}
            <div className="text-center lg:text-right">
              <h4 className="text-xl font-bold text-white mb-6 flex items-center justify-center lg:justify-end gap-2">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"/></svg> Platform Capabilities 
              </h4>
              <div className="space-y-3">
                {[
                  { text: 'Live C++ Algorithm Execution', color: 'text-purple-400' },
                  { text: '39 Algorithms · 8 Categories', color: 'text-cyan-400' },
                  { text: 'Interactive Code Visualizations', color: 'text-emerald-400' },
                  { text: 'Multi-Language Code Examples', color: 'text-pink-400' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-center lg:justify-end gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.8 + i * 0.1 }}
                  >
                    <span className={`font-semibold ${item.color}`}>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-white/20 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
            <motion.p 
              className="text-slate-400 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
            >
              © 2026 Algovista. All rights reserved.
            </motion.p>
            

            
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.4 }}
            >
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold text-lg">
                Powered by Real-Time Visualization Engine
              </span>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                      ['from-purple-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-yellow-500 to-orange-500', 'from-indigo-500 to-purple-500'][i]
                    }`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;