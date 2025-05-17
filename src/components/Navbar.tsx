
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useFileSystem } from '@/context/FileSystemContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const { activeFile, saveCurrentFile } = useFileSystem();

  return (
    <nav className="h-14 bg-muted flex items-center justify-between px-4 border-b border-border shadow-md sticky top-0 z-50">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="font-mono text-xl font-bold hover:text-primary transition-colors"
        >
          <span className="text-primary mr-1">&lt;/&gt;</span>
          ABC
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost"
          onClick={saveCurrentFile}
          disabled={!activeFile}
          className="flex items-center"
          title="Save file"
        >
          <Save size={16} className="mr-1" />
          <span className="text-muted-foreground">Save</span>
        </Button>
        
        <button className="p-2 rounded-md hover:bg-background transition-colors">
          <span className="text-muted-foreground">Run</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
