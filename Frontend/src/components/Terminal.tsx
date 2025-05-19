
import { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';

const Terminal = () => {
  const { currentDirectory, activeFile, terminalMessages } = useFileSystem();
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const { addTerminalMessage } = useFileSystem();
  
  useEffect(() => {
    scrollToBottom();
  }, [terminalMessages]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      
      // Add the command to the terminal output
      addTerminalMessage(command);
      
      // Process the command
      if (command === 'help') {
        addTerminalMessage('Available commands: help, ls, pwd, clear');
      } else if (command === 'ls') {
        addTerminalMessage('Directory listing:');
        addTerminalMessage('src/');
        addTerminalMessage('lib/');
        addTerminalMessage('README.md');
      } else if (command === 'pwd') {
        addTerminalMessage(`Current directory: ${currentDirectory}`);
      } else if (command === 'clear') {
        // This will be handled by the FileSystemContext
      } else if (command) {
        addTerminalMessage(`Command not found: ${command}`);
      }
      
      // Clear the input
      setInput('');
    }
  };
  
  return (
    <div className="terminal h-full overflow-auto flex flex-col">
      <div className="flex-grow">
        {terminalMessages.map((line, i) => (
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
