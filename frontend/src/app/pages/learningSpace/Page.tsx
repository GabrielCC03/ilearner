import { useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import FileManager from './FileManager';
import ChatInterface from '../../../components/ChatInterface';
import ToolsPanel from './ToolsPanel';
import { Header } from '../../../components';
import { filesApi } from '../../../api/database/files';
import { toolHistoryApi } from '../../../api/database/toolHistory';
import type { FileItem } from '../../../types/learningSpace';
import type { HistoryItem } from './types';

export default function LearningSpacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Fetch files when learning space loads
  useEffect(() => {
    if (id) {
      fetchFiles(id);
    }
  }, [id]);

  // Fetch tool history when learning space loads
  useEffect(() => {
    if (id) {
      const fetchHistory = async () => {
        try {
          const data = await toolHistoryApi.getForLearningSpace(id);
          const items: HistoryItem[] = data.map((h) => {
            const itemType: HistoryItem['type'] =
              h.type === 'essay'
                ? 'essay'
                : h.type === 'quiz'
                ? 'quiz'
                : 'summary';
            const name =
              h.toolData?.topic ?? h.type.charAt(0).toUpperCase() + h.type.slice(1);
            return {
              id: h.id,
              name,
              type: itemType,
              createdAt: new Date(h.createdAt),
              onClick: () => {
                const route =
                  h.type === 'essay' ? '/tools/essay-topic' : `/tools/${h.type}`;
                const toolId = h.type === 'essay' ? 'essay-topics' : h.type;
                navigate(route, {
                  state: { learningSpaceId: id, files, toolId, toolHistoryId: h.id }
                });
              }
            };
          });
          setHistory(items);
        } catch (error) {
          console.error('Error fetching tool history:', error);
        }
      };

      fetchHistory();
    }
  }, [id, files, navigate]);

  // Handler to delete a tool history entry
  const handleDeleteHistory = async (toolHistoryId: string) => {
    try {
      await toolHistoryApi.deleteToolHistory(toolHistoryId);
      setHistory(prev => prev.filter(h => h.id !== toolHistoryId));
    } catch (err) {
      console.error('Failed to delete tool history:', err);
    }
  };

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
            learningSpaceId={id}
            files={files}
          />
        </Box>

        {/* Right Panel - Tools */}
        <Box className="col-span-3 bg-gray-50 h-full min-h-0">
          <ToolsPanel 
            tools={[]}
            history={history}
            learningSpaceId={id}
            files={files}
            onDeleteHistory={handleDeleteHistory}
          />
        </Box>
      </Box>
    </div>
  );
}
