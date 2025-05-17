
import { useState, useEffect } from 'react';

const Terminal = () => {
  const [lines, setLines] = useState<string[]>([
    '> Initializing AI Compiler...',
  ]);
  
  useEffect(() => {
    const messages = [
      'Loading AI modules...',
      'AI modules loaded successfully.',
      'Scanning for code patterns...',
      'Optimizing compilation strategies...',
      'Ready for compilation.'
    ];
    
    let timer: NodeJS.Timeout;
    let index = 0;
    
    const addLine = () => {
      if (index < messages.length) {
        setLines(prev => [...prev, `> ${messages[index]}`]);
        index++;
        timer = setTimeout(addLine, 800);
      }
    };
    
    timer = setTimeout(addLine, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="terminal">
      {lines.map((line, i) => (
        <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
          {line}
        </div>
      ))}
      <div className="inline-block w-2 h-4 bg-green-400 animate-pulse-slow ml-1"></div>
    </div>
  );
};

export default Terminal;
