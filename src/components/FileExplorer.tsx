
import { useState } from 'react';
import { Folder, FileCode, Plus, FolderPlus, FilePlus, Save } from 'lucide-react';
import { useFileSystem, FileType } from '@/context/FileSystemContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const FileItem = ({ file, depth = 0 }: { file: FileType; depth?: number }) => {
  const { toggleFolder, setActiveFile } = useFileSystem();
  const isFolder = file.type === 'folder';
  
  const handleClick = () => {
    if (isFolder) {
      toggleFolder(file.id);
    } else {
      setActiveFile(file);
    }
  };
  
  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 hover:bg-muted/50 rounded cursor-pointer animate-slide-in`}
        style={{ paddingLeft: `${depth * 16 + 8}px`, animationDelay: `${depth * 0.05}s` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <Folder size={16} className="mr-2 text-secondary" />
        ) : (
          <FileCode size={16} className="mr-2 text-muted-foreground" />
        )}
        <span className="text-sm truncate">
          {file.name}{file.extension ? `.${file.extension}` : ''}
        </span>
      </div>

      {isFolder && file.expanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileItem 
              key={child.id} 
              file={child} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = () => {
  const { files, createFolder, createFile } = useFileSystem();
  const [newItemParent, setNewItemParent] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');
  const [newFileExtension, setNewFileExtension] = useState('');
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);

  const handleCreateItem = (parentId: string | null, type: 'file' | 'folder') => {
    setNewItemParent(parentId);
    setNewItemType(type);
    setShowNewItemDialog(true);
  };

  const handleCreateConfirm = () => {
    if (!newItemName) return;

    if (newItemType === 'folder') {
      createFolder(newItemParent, newItemName);
    } else {
      createFile(newItemParent, newItemName, newFileExtension || 'txt');
    }

    setNewItemName('');
    setNewFileExtension('');
    setShowNewItemDialog(false);
  };

  return (
    <div className="file-explorer h-full">
      <div className="mb-2 p-2 flex justify-between items-center">
        <span className="text-sm font-semibold text-muted-foreground">EXPLORER</span>
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCreateItem('root', 'file')}>
                <FilePlus className="mr-2" size={14} />
                <span>New File</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateItem('root', 'folder')}>
                <FolderPlus className="mr-2" size={14} />
                <span>New Folder</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-auto max-h-[calc(100%-40px)]">
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>

      {showNewItemDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background p-4 rounded-md shadow-lg w-80">
            <h3 className="font-semibold mb-4">
              Create New {newItemType === 'folder' ? 'Folder' : 'File'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2 bg-muted rounded border border-border"
                  autoFocus
                />
              </div>
              
              {newItemType === 'file' && (
                <div>
                  <label className="block text-sm mb-1">Extension</label>
                  <input
                    type="text"
                    value={newFileExtension}
                    onChange={(e) => setNewFileExtension(e.target.value)}
                    className="w-full p-2 bg-muted rounded border border-border"
                    placeholder="cpp, js, txt..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewItemDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConfirm}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
