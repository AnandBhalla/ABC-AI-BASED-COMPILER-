
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

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
        <button className="p-2 rounded-md hover:bg-background transition-colors">
          <span className="text-muted-foreground">Run</span>
        </button>
        <button className="p-2 rounded-md hover:bg-background transition-colors">
          <span className="text-muted-foreground">Compile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
