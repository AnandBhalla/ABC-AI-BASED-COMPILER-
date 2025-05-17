
import { useState, useEffect } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';

const CodeEditor = () => {
  const { activeFile, updateFileContent } = useFileSystem();
  const [code, setCode] = useState('');
  
  useEffect(() => {
    if (activeFile && activeFile.content !== undefined) {
      setCode(activeFile.content);
    } else {
      setCode('// Select a file to edit or create a new one');
    }
  }, [activeFile]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (activeFile) {
      updateFileContent(activeFile.id, newCode);
    }
  };
  
  return (
    <div className="code-editor h-full font-mono relative overflow-auto">
      <div className="absolute top-2 right-2 flex gap-2">
        <div className="text-xs py-1 px-2 bg-muted rounded text-muted-foreground">
          {activeFile ? `${activeFile.name}.${activeFile.extension || ''}` : 'No file selected'}
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={handleCodeChange}
        className="w-full h-full p-8 bg-transparent border-none outline-none resize-none font-mono text-sm"
        spellCheck="false"
        disabled={!activeFile}
      />
    </div>
  );
};

export default CodeEditor;
