import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
  deleteFile: (id: string) => void;
  deleteFolder: (id: string) => void;
  downloadFile: (file: FileType) => void;
  downloadFolder: (folder: FileType) => void;
  terminalMessages: string[];
  addTerminalMessage: (message: string) => void;
}

// Starting with an empty file system
const initialFiles: FileType[] = [];

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
  deleteFile: () => {},
  deleteFolder: () => {},
  downloadFile: () => {},
  downloadFolder: () => {},
  terminalMessages: [],
  addTerminalMessage: () => {},
});

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileType[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<FileType | null>(null);
  const [currentDirectory, setCurrentDirectory] = useState<string>('project');
  const [terminalMessages, setTerminalMessages] = useState<string[]>([
    '> Welcome to ABC Terminal',
    `> Current directory: ${currentDirectory}`,
  ]);

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

  const removeNode = (nodes: FileType[], id: string): FileType[] => {
    return nodes.filter(node => {
      if (node.id === id) {
        return false;
      }
      if (node.children) {
        node.children = removeNode(node.children, id);
      }
      return true;
    });
  };

  const addTerminalMessage = (message: string) => {
    setTerminalMessages(prev => [...prev, `> ${message}`]);
  };

  const toggleFolder = (id: string) => {
    const folderToToggle = findNodeById(files, id);
    setFiles(currentFiles => 
      updateNodes(currentFiles, id, node => ({
        ...node,
        expanded: !node.expanded
      }))
    );
    
    if (folderToToggle) {
      const action = folderToToggle.expanded ? 'Closed' : 'Opened';
      addTerminalMessage(`${action} folder: ${folderToToggle.name}`);
    }
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
      addTerminalMessage(`Created folder: ${name}`);
      return;
    }
    
    const parentFolder = findNodeById(files, parentId);
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
    
    if (parentFolder) {
      addTerminalMessage(`Created folder: ${name} in ${parentFolder.name}`);
    } else {
      addTerminalMessage(`Created folder: ${name}`);
    }
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
      addTerminalMessage(`Created file: ${name}.${extension}`);
      return;
    }
    
    const parentFolder = findNodeById(files, parentId);
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
    
    if (parentFolder) {
      addTerminalMessage(`Created file: ${name}.${extension} in ${parentFolder.name}`);
    } else {
      addTerminalMessage(`Created file: ${name}.${extension}`);
    }
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
      // addTerminalMessage(`Updated file: ${activeFile.name}.${activeFile.extension || ''}`);
    }
  };

  const deleteFile = (id: string) => {
    // If active file is being deleted, clear it
    if (activeFile && activeFile.id === id) {
      addTerminalMessage(`Deleted file: ${activeFile.name}.${activeFile.extension || ''}`);
      setActiveFile(null);
    } else {
      const fileToDelete = findNodeById(files, id);
      if (fileToDelete) {
        addTerminalMessage(`Deleted file: ${fileToDelete.name}.${fileToDelete.extension || ''}`);
      }
    }
    
    setFiles(currentFiles => removeNode(currentFiles, id));
  };

  const deleteFolder = (id: string) => {
    // If active file is inside the folder being deleted, clear it
    const folderToDelete = findNodeById(files, id);
    if (folderToDelete && folderToDelete.type === 'folder') {
      addTerminalMessage(`Deleted folder: ${folderToDelete.name}`);
      
      if (activeFile) {
        const checkIfActiveFileInFolder = (nodes: FileType[] | undefined): boolean => {
          if (!nodes) return false;
          
          for (const node of nodes) {
            if (node.id === activeFile.id) return true;
            if (node.children) {
              if (checkIfActiveFileInFolder(node.children)) return true;
            }
          }
          return false;
        };
        
        if (checkIfActiveFileInFolder(folderToDelete.children)) {
          setActiveFile(null);
        }
      }
    }
    
    setFiles(currentFiles => removeNode(currentFiles, id));
  };

  const saveCurrentFile = () => {
    if (!activeFile || activeFile.type !== 'file') return;
    
    const timestamp = new Date().getTime();
    const fileName = `${activeFile.name}_${timestamp}.${activeFile.extension}`;
    
    addTerminalMessage(`Saved file: ${activeFile.name}.${activeFile.extension || ''}`);
    
    // In a real app, we would save to the server/filesystem
    // For now, we'll just log to console
    console.log(`Saving file to Data/${fileName}`);
    console.log(`Content: ${activeFile.content}`);
  };

  // Add a function to download a file
  const downloadFile = (file: FileType) => {
    if (file.type !== 'file' || !file.content) {
      addTerminalMessage(`Cannot download ${file.name}: Not a valid file`);
      return;
    }
    
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.${file.extension || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addTerminalMessage(`Downloaded file: ${file.name}.${file.extension || ''}`);
  };

  // Add a function to download a folder as a zip
  // const downloadFolder = (folder: FileType) => {
  //   if (folder.type !== 'folder') {
  //     addTerminalMessage(`Cannot download ${folder.name}: Not a folder`);
  //     return;
  //   }
    
  //   // In a real application, you'd use a library like JSZip to create a zip file
  //   // For this demo, we'll just create a text representation
  //   let folderContent = `Folder: ${folder.name}\n`;
    
  //   const addFilesToContent = (nodes: FileType[] | undefined, indent: string = '') => {
  //     if (!nodes) return;
      
  //     for (const node of nodes) {
  //       if (node.type === 'folder') {
  //         folderContent += `${indent}Folder: ${node.name}\n`;
  //         addFilesToContent(node.children, indent + '  ');
  //       } else {
  //         folderContent += `${indent}File: ${node.name}.${node.extension || ''}\n`;
  //         if (node.content) {
  //           folderContent += `${indent}Content: ${node.content.substring(0, 50)}...\n`;
  //         }
  //       }
  //     }
  //   };
    
  //   addFilesToContent(folder.children);
    
  //   const blob = new Blob([folderContent], { type: 'text/plain' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `${folder.name}.txt`; // In a real app, this would be .zip
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
    
  //   addTerminalMessage(`Downloaded folder: ${folder.name}`);
  // };
  const downloadFolder = async (folder: FileType) => {
  if (folder.type !== 'folder') {
    addTerminalMessage(`Cannot download ${folder.name}: Not a folder`);
    return;
  }

  const zip = new JSZip();
  let hasErrors = false;

  // Helper function to add files recursively
  const addFilesToZip = async (nodes: FileType[] | undefined, path: string = '') => {
    if (!nodes) return;

    for (const node of nodes) {
      try {
        const currentPath = path ? `${path}/${node.name}` : node.name;

        if (node.type === 'folder') {
          zip.folder(currentPath);
          await addFilesToZip(node.children, currentPath);
        } else {
          // For files, add their content to the zip
          const fileName = node.extension ? `${node.name}.${node.extension}` : node.name;
          zip.file(`${currentPath}/${fileName}`, node.content || '');
        }
      } catch (error) {
        hasErrors = true;
        addTerminalMessage(`Error processing ${node.name}: ${error.message}`);
      }
    }
  };

  await addFilesToZip(folder.children);

  if (hasErrors) {
    addTerminalMessage(`Completed with errors - some files may be missing`);
  }

  try {
    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Create download link
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folder.name}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addTerminalMessage(`Successfully downloaded folder: ${folder.name}.zip`);
  } catch (error) {
    addTerminalMessage(`Failed to create zip file: ${error.message}`);
  }
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
        currentDirectory,
        deleteFile,
        deleteFolder,
        downloadFile,
        downloadFolder,
        terminalMessages,
        addTerminalMessage
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => useContext(FileSystemContext);
