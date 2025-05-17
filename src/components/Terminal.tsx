
import { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';

const Terminal = () => {
  const { currentDirectory, activeFile } = useFileSystem();
  const [lines, setLines] = useState<string[]>([
    '> Welcome to ABC Terminal',
    `> Current directory: ${currentDirectory}`,
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const addLine = (text: string) => {
    setLines(prev => [...prev, text]);
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  useEffect(() => {
    // Add a line when the active file changes
    if (activeFile) {
      addLine(`> Opened file: ${activeFile.name}.${activeFile.extension || ''}`);
    }
  }, [activeFile]);
  
  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      
      // Add the command to the terminal output
      addLine(`> ${command}`);
      
      // Process the command
      if (command === 'help') {
        addLine('Available commands: help, ls, pwd, clear');
      } else if (command === 'ls') {
        addLine('Directory listing:');
        addLine('src/');
        addLine('lib/');
        addLine('README.md');
      } else if (command === 'pwd') {
        addLine(`Current directory: ${currentDirectory}`);
      } else if (command === 'clear') {
        setLines(['> Terminal cleared', `> Current directory: ${currentDirectory}`]);
      } else if (command) {
        addLine(`Command not found: ${command}`);
      }
      
      // Clear the input
      setInput('');
    }
  };
  
  return (
    <div className="terminal h-full overflow-auto flex flex-col">
      <div className="flex-grow">
        {lines.map((line, i) => (
          <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            {line}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      
      <div className="flex items-center mt-2">
        <span className="text-green-400">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-grow bg-transparent border-none outline-none ml-2"
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
};

export default Terminal;
