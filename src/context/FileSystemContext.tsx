
import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type FileType = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileType[];
  expanded?: boolean;
  extension?: string;
};

interface FileSystemContextType {
  files: FileType[];
  activeFile: FileType | null;
  setActiveFile: (file: FileType | null) => void;
  createFolder: (parentId: string | null, name: string) => void;
  createFile: (parentId: string | null, name: string, extension: string) => void;
  updateFileContent: (id: string, content: string) => void;
  toggleFolder: (id: string) => void;
  saveCurrentFile: () => void;
  currentDirectory: string;
}

const initialFiles: FileType[] = [
  {
    id: 'root',
    name: 'Project',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        expanded: true,
        children: [
          { id: 'main', name: 'main', type: 'file', extension: 'cpp', content: '#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}' },
          { id: 'utils', name: 'utils', type: 'file', extension: 'cpp', content: '// Utility functions' },
          { id: 'header', name: 'header', type: 'file', extension: 'h', content: '// Header file' },
        ],
      },
      {
        id: 'lib',
        name: 'lib',
        type: 'folder',
        expanded: false,
        children: [
          { id: 'helper', name: 'helper', type: 'file', extension: 'cpp', content: '// Helper functions' },
          { id: 'math', name: 'math', type: 'file', extension: 'cpp', content: '// Math utilities' },
        ],
      },
      { id: 'readme', name: 'README', type: 'file', extension: 'md', content: '# Project\nThis is a sample project.' },
    ],
  },
];

const FileSystemContext = createContext<FileSystemContextType>({
  files: initialFiles,
  activeFile: null,
  setActiveFile: () => {},
  createFolder: () => {},
  createFile: () => {},
  updateFileContent: () => {},
  toggleFolder: () => {},
  saveCurrentFile: () => {},
  currentDirectory: 'project',
});

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileType[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<FileType | null>(null);
  const [currentDirectory, setCurrentDirectory] = useState<string>('project');

  const findNodeById = (nodes: FileType[], id: string): FileType | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodes = (nodes: FileType[], id: string, updater: (node: FileType) => FileType): FileType[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return updater(node);
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodes(node.children, id, updater)
        };
      }
      return node;
    });
  };

  const toggleFolder = (id: string) => {
    setFiles(currentFiles => 
      updateNodes(currentFiles, id, node => ({
        ...node,
        expanded: !node.expanded
      }))
    );
  };

  const createFolder = (parentId: string | null, name: string) => {
    const newFolder: FileType = {
      id: uuidv4(),
      name,
      type: 'folder',
      expanded: true,
      children: []
    };
    
    if (!parentId) {
      setFiles([...files, newFolder]);
      return;
    }
    
    setFiles(currentFiles => {
      const addToParent = (nodes: FileType[]): FileType[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newFolder],
              expanded: true
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addToParent(node.children)
            };
          }
          return node;
        });
      };
      
      return addToParent(currentFiles);
    });
  };
  
  const createFile = (parentId: string | null, name: string, extension: string) => {
    const newFile: FileType = {
      id: uuidv4(),
      name,
      type: 'file',
      extension,
      content: ''
    };
    
    if (!parentId) {
      setFiles([...files, newFile]);
      return;
    }
    
    setFiles(currentFiles => {
      const addToParent = (nodes: FileType[]): FileType[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newFile],
              expanded: true
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addToParent(node.children)
            };
          }
          return node;
        });
      };
      
      return addToParent(currentFiles);
    });
    
    // Set the new file as active
    setActiveFile(newFile);
  };
  
  const updateFileContent = (id: string, content: string) => {
    setFiles(currentFiles => 
      updateNodes(currentFiles, id, node => ({
        ...node,
        content
      }))
    );
    
    // Also update activeFile if it's the one being edited
    if (activeFile && activeFile.id === id) {
      setActiveFile({
        ...activeFile,
        content
      });
    }
  };

  const saveCurrentFile = () => {
    if (!activeFile || activeFile.type !== 'file') return;
    
    const timestamp = new Date().getTime();
    const fileName = `${activeFile.name}_${timestamp}.${activeFile.extension}`;
    
    // In a real app, we would save to the server/filesystem
    // For now, we'll just log to console
    console.log(`Saving file to Data/${fileName}`);
    console.log(`Content: ${activeFile.content}`);
    
    // Add to terminal messages in a real implementation
  };
  
  return (
    <FileSystemContext.Provider 
      value={{ 
        files, 
        activeFile, 
        setActiveFile, 
        createFolder, 
        createFile, 
        updateFileContent, 
        toggleFolder,
        saveCurrentFile,
        currentDirectory
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => useContext(FileSystemContext);
