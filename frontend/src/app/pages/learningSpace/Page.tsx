import { useState } from 'react';
import { Box } from '@mantine/core';
import FileManager from './FileManager';
import ChatInterface from './ChatInterface';
import ToolsPanel from './ToolsPanel';
import { Header } from '../../../components';
import type { FileItem, Message, Tool, HistoryItem } from './types';

export default function LearningSpacePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // File management handlers
  const handleFilesAdd = (newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date()
    }));
    setFiles(prev => [...prev, ...fileItems]);
  };

  const handleFileDelete = (fileId: string) => {
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

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Box className="flex-1 h-full grid grid-cols-12 gap-0 min-h-0">
        {/* Left Panel - File Manager */}
        <Box className="col-span-3 bg-gray-50 h-full min-h-0">
          <FileManager 
            files={files}
            onFilesAdd={handleFilesAdd}
            onFileDelete={handleFileDelete}
          />
        </Box>

        {/* Center Panel - Chat Interface */}
        <Box className="col-span-6 bg-white h-full min-h-0">
          <ChatInterface 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
          />
        </Box>

        {/* Right Panel - Tools */}
        <Box className="col-span-3 bg-gray-50 h-full min-h-0">
          <ToolsPanel 
            tools={tools}
            history={history}
          />
        </Box>
      </Box>
    </div>
  );
}
