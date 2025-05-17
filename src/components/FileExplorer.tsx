
import { useState } from 'react';
import { Folder, FileCode, Plus, FolderPlus, FilePlus, Save, Trash2 } from 'lucide-react';
import { useFileSystem, FileType } from '@/context/FileSystemContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const FileItem = ({ file, depth = 0 }: { file: FileType; depth?: number }) => {
  const { toggleFolder, setActiveFile, deleteFile, deleteFolder } = useFileSystem();
  const isFolder = file.type === 'folder';
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (isFolder) {
      toggleFolder(file.id);
    } else {
      setActiveFile(file);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      deleteFolder(file.id);
    } else {
      deleteFile(file.id);
    }
  };

  const handleAddFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    // We'll reuse the existing modal for adding files
    // Just passing the folder id to create files inside it
    handleCreateItem(file.id, 'file');
  };
  
  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 hover:bg-muted/50 rounded cursor-pointer animate-slide-in group relative`}
        style={{ paddingLeft: `${depth * 16 + 8}px`, animationDelay: `${depth * 0.05}s` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isFolder ? (
          <Folder size={16} className="mr-2 text-secondary" />
        ) : (
          <FileCode size={16} className="mr-2 text-muted-foreground" />
        )}
        <span className="text-sm truncate flex-1">
          {file.name}{file.extension ? `.${file.extension}` : ''}
        </span>

        {isHovered && (
          <div className="flex items-center gap-1">
            {isFolder && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleAddFile}
                title="Add file to folder"
              >
                <FilePlus size={14} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
              title={`Delete ${isFolder ? 'folder' : 'file'}`}
            >
              <Trash2 size={14} className="text-destructive" />
            </Button>
          </div>
        )}
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => handleCreateItem('root', 'file')}
            title="New File"
          >
            <FilePlus size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => handleCreateItem('root', 'folder')}
            title="New Folder"
          >
            <FolderPlus size={14} />
          </Button>
        </div>
      </div>

      <div className="overflow-auto max-h-[calc(100%-40px)]">
        {files.length > 0 ? (
          files.map((file) => <FileItem key={file.id} file={file} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm mb-2">No files yet</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCreateItem('root', 'file')}
                className="flex items-center gap-1"
              >
                <FilePlus size={14} />
                <span>New File</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCreateItem('root', 'folder')}
                className="flex items-center gap-1"
              >
                <FolderPlus size={14} />
                <span>New Folder</span>
              </Button>
            </div>
          </div>
        )}
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
