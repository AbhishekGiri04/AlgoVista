import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
        
        {/* Gradient waves */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute w-full h-px"
            style={{
              top: `${25 + i * 20}%`,
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)'
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 1.5
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Back Button */}
        <motion.a 
          href="/" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 mb-12"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Home
        </motion.a>
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            About ALGOVISTA
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            The next-generation platform revolutionizing how developers and students master Data Structures & Algorithms through immersive, interactive learning experiences.
          </p>
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Mission Section */}
          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">Our Mission</h2>
            <p className="text-gray-100 leading-relaxed mb-4">
              To democratize computer science education by providing an enterprise-grade learning ecosystem that transforms abstract algorithmic concepts into tangible, visual experiences.
            </p>
            <p className="text-gray-100 leading-relaxed">
              We bridge the gap between theoretical knowledge and practical understanding through real-time C++ execution, stunning 3D visualizations, and comprehensive performance analytics.
            </p>
          </motion.div>
          
          {/* Vision Section */}
          <motion.div 
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Our Vision</h2>
            <p className="text-gray-100 leading-relaxed mb-4">
              To become the global standard for algorithmic education, empowering millions of developers worldwide to master complex data structures through innovative visualization technology.
            </p>
            <p className="text-gray-100 leading-relaxed">
              We envision a future where every programmer can intuitively understand and implement sophisticated algorithms with confidence and precision.
            </p>
          </motion.div>
        </div>
        
        {/* Features Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Platform Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Real-Time Execution",
                desc: "Live C++ algorithm processing with instant visual feedback",
                icon: "💻",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "3D Visualizations",
                desc: "Stunning three-dimensional representations of data structures",
                icon: "🎨",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Multi-Language Support",
                desc: "View implementations in multiple programming languages",
                icon: "🧩",
                color: "from-emerald-500 to-teal-500"
              },
              {
                title: "Performance Analytics",
                desc: "Comprehensive complexity analysis and performance metrics",
                icon: "📄",
                color: "from-orange-500 to-red-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
              >
                <div className={`text-4xl mb-4 p-3 rounded-full bg-gradient-to-r ${feature.color} w-16 h-16 flex items-center justify-center mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">{feature.title}</h3>
                <p className="text-gray-200 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Technology Stack */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            Built with Cutting-Edge Technology
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { name: 'React', color: 'from-blue-400 to-cyan-400' },
              { name: 'C++', color: 'from-purple-400 to-pink-400' },
              { name: 'Node.js', color: 'from-green-400 to-emerald-400' },
              { name: 'Express', color: 'from-yellow-400 to-orange-400' },
              { name: 'Framer Motion', color: 'from-indigo-400 to-purple-400' },
              { name: 'Three.js', color: 'from-red-400 to-pink-400' }
            ].map((tech, i) => (
              <motion.span
                key={i}
                className={`px-6 py-3 bg-gradient-to-r ${tech.color} text-black font-bold rounded-full text-lg shadow-lg`}
                whileHover={{ scale: 1.1, y: -2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
          
          <motion.p 
            className="text-lg text-white max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            Built with cutting-edge technology, Algovista delivers exceptional performance and seamless learning experiences.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;