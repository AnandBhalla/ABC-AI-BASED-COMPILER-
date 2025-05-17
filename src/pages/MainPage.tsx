
import Navbar from '@/components/Navbar';
import FileExplorer from '@/components/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import Terminal from '@/components/Terminal';

const MainPage = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: File Explorer */}
        <div className="w-64 border-r border-border">
          <FileExplorer />
        </div>
        
        {/* Right side: Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
          
          {/* Bottom: Terminal */}
          <div className="border-t border-border">
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
