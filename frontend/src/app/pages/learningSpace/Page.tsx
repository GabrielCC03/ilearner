import { useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { useParams } from 'react-router-dom';
import FileManager from './FileManager';
import ChatInterface from '../../../components/ChatInterface';
import ToolsPanel from './ToolsPanel';
import { Header } from '../../../components';
import { filesApi } from '../../../api/database/files';
import type { FileItem } from '../../../types/learningSpace';

export default function LearningSpacePage() {
  const { id } = useParams<{ id: string }>();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);

  // Fetch files when learning space loads
  useEffect(() => {
    if (id) {
      fetchFiles(id);
    }
  }, [id]);

  const fetchFiles = async (learningSpaceId: string) => {
    try {
      setFilesLoading(true);
      const fetchedFiles = await filesApi.getForLearningSpace(learningSpaceId);
      setFiles(fetchedFiles);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setFilesLoading(false);
    }
  };

  // File management handlers - called by FileManager
  const handleFilesAdded = (newFiles: FileItem[]) => {
    setFiles(prev => [...newFiles, ...prev]);
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // If no learning space ID, show error
  if (!id) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Learning space ID not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Box className="flex-1 h-full grid grid-cols-12 gap-0 min-h-0">
        {/* Left Panel - File Manager */}
        <Box className="col-span-3 bg-gray-50 h-full min-h-0">
          <FileManager 
            learningSpaceId={id}
            files={files}
            loading={filesLoading}
            onFilesAdded={handleFilesAdded}
            onFileDeleted={handleFileDeleted}
          />
        </Box>

        {/* Center Panel - Chat Interface */}
        <Box className="col-span-6 bg-white h-full min-h-0">
          <ChatInterface 
            messages={[]}
            onSendMessage={() => {}}
          />
        </Box>

        {/* Right Panel - Tools */}
        {/* TODO: Add tools panel and make it work */}
        <Box className="col-span-3 bg-gray-50 h-full min-h-0">
          <ToolsPanel 
            tools={[]}
            history={[]}
          />
        </Box>
      </Box>
    </div>
  );
}
