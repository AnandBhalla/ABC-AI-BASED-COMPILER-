import { useState } from 'react';
import { Folder, FileCode, FolderPlus, FilePlus, Trash2, Download } from 'lucide-react';
import { useFileSystem, FileType } from '@/context/FileSystemContext';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const FileItem = ({ file, depth = 0 }: { file: FileType; depth?: number }) => {
  const { toggleFolder, setActiveFile, deleteFile, deleteFolder, downloadFile, downloadFolder, addTerminalMessage } = useFileSystem();
  const isFolder = file.type === 'folder';
  const [isHovered, setIsHovered] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  
  const handleClick = () => {
    if (isFolder) {
      toggleFolder(file.id);
    } else {
      setActiveFile(file);
      addTerminalMessage(`Opened file: ${file.name}.${file.extension || ''}`);
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
    setShowNewFileModal(true);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      downloadFolder(file);
    } else {
      downloadFile(file);
    }
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
              onClick={handleDownload}
              title={`Download ${isFolder ? 'folder' : 'file'}`}
            >
              <Download size={14} />
            </Button>
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

      {showNewFileModal && (
        <NewItemDialog 
          isOpen={showNewFileModal}
          onClose={() => setShowNewFileModal(false)}
          parentId={file.id}
          isFolder={false}
        />
      )}

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

const NewItemDialog = ({ 
  isOpen, 
  onClose, 
  parentId, 
  isFolder 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  parentId: string | null; 
  isFolder: boolean;
}) => {
  const { createFolder, createFile } = useFileSystem();
  const [newItemName, setNewItemName] = useState('');
  
  const handleSubmit = () => {
    if (!newItemName) return;
    
    if (isFolder) {
      createFolder(parentId, newItemName);
    } else {
      const lastDotIndex = newItemName.lastIndexOf('.');
      const hasExtension = lastDotIndex > 0;
      
      const fileName = hasExtension ? newItemName.substring(0, lastDotIndex) : newItemName;
      const fileExtension = hasExtension ? newItemName.substring(lastDotIndex + 1) : 'txt';
      
      createFile(parentId, fileName, fileExtension);
    }
    
    setNewItemName('');
    onClose();
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Create New {isFolder ? 'Folder' : 'File'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isFolder 
              ? "Enter a name for the new folder." 
              : "Enter a name with extension for the new file (e.g., script.js)."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full p-2 bg-muted rounded border border-border"
            placeholder={isFolder ? "folder-name" : "file-name.ext"}
            autoFocus
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const FileExplorer = () => {
  const { files, addTerminalMessage } = useFileSystem();
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);

  const handleNewFile = () => {
    setShowNewFileDialog(true);
  };

  const handleNewFolder = () => {
    setShowNewFolderDialog(true);
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
            onClick={handleNewFile}
            title="New File"
          >
            <FilePlus size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={handleNewFolder}
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
                onClick={() => setShowNewFileDialog(true)}
                className="flex items-center gap-1"
              >
                <FilePlus size={14} />
                <span>New File</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNewFolderDialog(true)}
                className="flex items-center gap-1"
              >
                <FolderPlus size={14} />
                <span>New Folder</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <NewItemDialog
        isOpen={showNewFileDialog}
        onClose={() => setShowNewFileDialog(false)}
        parentId={null}
        isFolder={false}
      />

      <NewItemDialog
        isOpen={showNewFolderDialog}
        onClose={() => setShowNewFolderDialog(false)}
        parentId={null}
        isFolder={true}
      />
    </div>
  );
};

export default FileExplorer;