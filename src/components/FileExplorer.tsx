
import { useState } from 'react';
import { Folder, FileCode } from 'lucide-react';

type File = {
  id: number;
  name: string;
  type: 'file' | 'folder';
  children?: File[];
  expanded?: boolean;
};

const initialFiles: File[] = [
  {
    id: 1,
    name: 'Project',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: 2,
        name: 'src',
        type: 'folder',
        expanded: true,
        children: [
          { id: 3, name: 'main.cpp', type: 'file' },
          { id: 4, name: 'utils.cpp', type: 'file' },
          { id: 5, name: 'header.h', type: 'file' },
        ],
      },
      {
        id: 6,
        name: 'lib',
        type: 'folder',
        expanded: false,
        children: [
          { id: 7, name: 'helper.cpp', type: 'file' },
          { id: 8, name: 'math.cpp', type: 'file' },
        ],
      },
      { id: 9, name: 'README.md', type: 'file' },
    ],
  },
];

const FileItem = ({ file, depth = 0, onToggle }: { file: File; depth?: number; onToggle: (id: number) => void }) => {
  const isFolder = file.type === 'folder';
  
  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 hover:bg-muted/50 rounded cursor-pointer animate-slide-in`}
        style={{ paddingLeft: `${depth * 16 + 8}px`, animationDelay: `${depth * 0.05}s` }}
        onClick={() => isFolder && onToggle(file.id)}
      >
        {isFolder ? (
          <Folder size={16} className="mr-2 text-secondary" />
        ) : (
          <FileCode size={16} className="mr-2 text-muted-foreground" />
        )}
        <span className="text-sm truncate">{file.name}</span>
      </div>

      {isFolder && file.expanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileItem 
              key={child.id} 
              file={child} 
              depth={depth + 1} 
              onToggle={onToggle} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = () => {
  const [files, setFiles] = useState<File[]>(initialFiles);

  const toggleFolder = (id: number) => {
    const toggleExpansion = (items: File[]): File[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: toggleExpansion(item.children) };
        }
        return item;
      });
    };

    setFiles(toggleExpansion(files));
  };

  return (
    <div className="file-explorer h-full">
      <div className="mb-2 text-sm font-semibold text-muted-foreground">EXPLORER</div>
      {files.map((file) => (
        <FileItem key={file.id} file={file} onToggle={toggleFolder} />
      ))}
    </div>
  );
};

export default FileExplorer;
