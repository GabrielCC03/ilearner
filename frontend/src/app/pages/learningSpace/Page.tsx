import { useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { useParams } from 'react-router-dom';
import FileManager from './FileManager';
import ChatInterface from './ChatInterface';
import ToolsPanel from './ToolsPanel';
import { Header } from '../../../components';
import { filesApi } from '../../../api/database/files';
import type { FileItem } from '../../../types/learningSpace';
import type { Message, Tool, HistoryItem } from './types';

export default function LearningSpacePage() {
  const { id } = useParams<{ id: string }>();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

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

  // Chat handlers
  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    // Simulate AI response (replace with actual API call)
    // In the future, this could use the files context for better responses
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'll help you with that question about your materials. This is a placeholder response.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsChatLoading(false);
    }, 1500);
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
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            files={files} // Now chat can access files for context
          />
        </Box>

        {/* Right Panel - Tools */}
        {/* TODO: Add tools panel and make it work */}
        <Box className="col-span-3 bg-gray-50 h-full min-h-0">
          <ToolsPanel 
            tools={tools}
            history={history}
            files={files} // Now tools can access files for processing
          />
        </Box>
      </Box>
    </div>
  );
}
