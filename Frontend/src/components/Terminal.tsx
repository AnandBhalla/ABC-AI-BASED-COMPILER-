import { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';

const BACKEND_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

const Terminal = () => {
  const { currentDirectory, activeFile, terminalMessages } = useFileSystem();
  const [isLoading, setIsLoading] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const { addTerminalMessage } = useFileSystem();
  
  useEffect(() => {
    scrollToBottom();
  }, [terminalMessages]);

  const executeCode = async () => {
    if (!activeFile || !activeFile.content) {
      addTerminalMessage('Error: No active file to execute');
      return;
    }

    setIsLoading(true);
    addTerminalMessage(`Executing ${activeFile.name}...`);
    
    try {
      console.log('Executing code:', activeFile.content);
      console.log('Active file name:', activeFile.name + "." + activeFile.extension);
      console.log('Active file language:', activeFile.extension);
      const response = await fetch(`${BACKEND_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          code: activeFile.content,
          filename: activeFile.name + "." + activeFile.extension
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        addTerminalMessage(`Language: ${result.language}`);
        if (result.output) {
          addTerminalMessage(`Output:`);
          addTerminalMessage(result.output);
        } else {
          addTerminalMessage('No output');
        }
        addTerminalMessage(`Execution time: ${result.execution_time}ms`);
      } else {
        addTerminalMessage('Execution failed:');
        addTerminalMessage(result.error || 'Unknown error');
      }
    } catch (error) {
      addTerminalMessage('Error connecting to execution service:');
      addTerminalMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="terminal h-full overflow-auto flex flex-col">
      <div className="flex-grow p-2">
        {terminalMessages.map((line, i) => (
          <div key={i} className="animate-fade-in font-mono" style={{ animationDelay: `${i * 0.05}s` }}>
            {line}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      
      <div className="border-t border-gray-700 p-2 flex">
        <button
          onClick={executeCode}
          disabled={isLoading || !activeFile}
          className={`px-4 py-2 rounded flex items-center justify-center ${
            isLoading || !activeFile 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isLoading ? 'Running...' : 'Run'}
        </button>
        <div className="ml-2 text-gray-400 self-center text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
          {activeFile ? `Active file: ${activeFile.name}` : 'No file selected'}
        </div>
      </div>
    </div>
  );
};

export default Terminal;