import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './syntax-highlighting.css';

const CodeBlock = ({ code, language = 'cpp', showContainer = true }) => {
  const containerStyle = showContainer ? {
    maxWidth: '1000px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '30px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)'
  } : {};

  return (
    <div style={containerStyle}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          background: '#0f172a',
          borderRadius: showContainer ? '12px' : '0',
          padding: '25px',
          fontSize: '13px',
          lineHeight: '1.7',
          border: showContainer ? '1px solid #334155' : 'none',
          boxShadow: showContainer ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
          fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", "Monaco", monospace',
          margin: 0
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          color: '#64748b',
          fontSize: '12px',
          paddingRight: '15px',
          borderRight: '1px solid #334155',
          marginRight: '15px'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;