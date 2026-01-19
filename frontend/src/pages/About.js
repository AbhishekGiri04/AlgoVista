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
            A production-ready platform transforming how developers and students master Data Structures & Algorithms through interactive, real-time learning experiences.
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
              To democratize computer science education by providing a production-ready learning platform that transforms abstract algorithmic concepts into visual, interactive experiences.
            </p>
            <p className="text-gray-100 leading-relaxed">
              We bridge theory and practice through real-time C++ execution, interactive visualizations, and comprehensive learning resources across 39 algorithms in 8 categories.
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
              To become a leading platform for algorithmic education, empowering developers worldwide to master data structures and algorithms through innovative visualization technology.
            </p>
            <p className="text-gray-100 leading-relaxed">
              We envision a future where every programmer can intuitively understand and implement algorithms with confidence through hands-on, interactive learning.
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
                title: "Real-Time C++ Execution",
                desc: "Live algorithm processing with 39 C++ implementations and instant visual feedback",
                icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>,
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Interactive Visualizations",
                desc: "Step-by-step animated representations of algorithm execution and data structures",
                icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Multi-Language Code Examples",
                desc: "View implementations in C++, Python, Java, and JavaScript with syntax highlighting",
                icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>,
                color: "from-emerald-500 to-teal-500"
              },
              {
                title: "Performance Insights",
                desc: "Time and space complexity analysis with detailed performance metrics",
                icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>,
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
                <div className={`mb-4 p-3 rounded-full bg-gradient-to-r ${feature.color} w-16 h-16 flex items-center justify-center mx-auto text-white`}>
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
              { name: 'Tailwind CSS', color: 'from-cyan-400 to-blue-400' }
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
            Built with modern web technologies, AlgoVista delivers high-performance algorithm execution and seamless interactive learning experiences across all devices.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;