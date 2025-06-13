import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Stack, 
  Text, 
  Card, 
  Group, 
  ActionIcon, 
  ThemeIcon, 
  Loader,
  Alert,
  Menu
} from '@mantine/core';
import { 
  IconPlus, 
  IconFile, 
  IconFileTypePdf, 
  IconFileText, 
  IconTrash, 
  IconDownload,
  IconEye,
  IconDots,
  IconExclamationMark
} from '@tabler/icons-react';
import FileUploadModal from './FileUploadModal';
import PdfViewer from '../../../components/PdfViewer';
import { filesApi } from '../../../api/database/files';
import type { FileItem } from '../../../types/learningSpace';

interface FileManagerProps {
  learningSpaceId: string;
  files: FileItem[];
  loading: boolean;
  onFilesAdded: (files: FileItem[]) => void;
  onFileDeleted: (fileId: string) => void;
}

interface ViewingFile {
  id: string;
  name: string;
  url: string;
  type: string;
}

export default function FileManager({ 
  learningSpaceId, 
  files, 
  loading, 
  onFilesAdded, 
  onFileDeleted 
}: FileManagerProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<ViewingFile | null>(null);

  const handleFilesAdd = async (newFiles: File[]) => {
    try {
      setUploading(true);
      setError(null);
      
      const uploadedFiles = await filesApi.uploadMultiple(learningSpaceId, newFiles);
      
      // Convert upload response to FileItem format
      const fileItems: FileItem[] = uploadedFiles.map(file => ({
        ...file,
        type: file.type as 'pdf' | 'txt' | 'text',
        uploadedAt: file.uploadedAt
      }));
      
      onFilesAdded(fileItems); // Notify parent
    } catch (err) {
      setError('Failed to upload files. Please try again.');
      console.error('Error uploading files:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      setDeletingFileId(fileId);
      await filesApi.delete(fileId);
      onFileDeleted(fileId); // Notify parent
    } catch (err) {
      setError('Failed to delete file. Please try again.');
      console.error('Error deleting file:', err);
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleFileDownload = async (file: FileItem) => {
    try {
      await filesApi.download(file.id, file.name);
    } catch (err) {
      setError('Failed to download file. Please try again.');
      console.error('Error downloading file:', err);
    }
  };

  const handleFileView = async (file: FileItem) => {
    try {
      if (file.type === 'pdf') {
        // Get the file URL from the API
        const fileUrl = await filesApi.getFileUrl(file.id);
        setViewingFile({
          id: file.id,
          name: file.name,
          url: fileUrl,
          type: file.type
        });
      } else if (file.type === 'txt' || file.type === 'text') {
        const content = await filesApi.getContent(file.id);
        // You can show content in a modal or new window
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`<pre>${content}</pre>`);
          newWindow.document.title = file.name;
        }
      } else {
        // For other file types, just download them
        await handleFileDownload(file);
      }
    } catch (err) {
      setError('Failed to view file. Please try again.');
      console.error('Error viewing file:', err);
    }
  };

  const handleBackToFileList = () => {
    setViewingFile(null);
  };

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return IconFileTypePdf;
    if (type === 'txt' || type === 'text') return IconFileText;
    return IconFile;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // If viewing a PDF file, render the PDF viewer
  if (viewingFile && viewingFile.type === 'pdf') {
    return (
      <PdfViewer
        fileUrl={viewingFile.url}
        fileName={viewingFile.name}
        onBack={handleBackToFileList}
      />
    );
  }

  // Otherwise, render the file manager
  return (
    <Box className="h-full flex flex-col">
      <Stack gap="md" className="p-4">
        <Button
          leftSection={<IconPlus size={16} />}
          variant="filled"
          onClick={() => setUploadModalOpened(true)}
          fullWidth
          disabled={loading || uploading}
          loading={uploading}
        >
          {uploading ? 'Uploading...' : 'Add Files'}
        </Button>

        <Text size="sm" fw={500} c="gray.7">
          Sources ({files.length})
        </Text>
      </Stack>

      {/* Error Alert */}
      {error && (
        <Alert 
          icon={<IconExclamationMark size={16} />} 
          color="red" 
          m="md"
          onClose={() => setError(null)}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <Box className="flex-1 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="text-center py-8">
            <Loader size="lg" mb="md" />
            <Text c="gray.5">Loading files...</Text>
          </div>
        ) : (
          <Stack gap="xs">
            {files.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="xl">
                No files uploaded yet
              </Text>
            ) : (
              files.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const isDeleting = deletingFileId === file.id;
                
                return (
                  <Card key={file.id} padding="sm" withBorder>
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" className="flex-1 min-w-0">
                        <ThemeIcon variant="light" size="sm">
                          <FileIcon size={16} />
                        </ThemeIcon>
                        <Box className="flex-1 min-w-0">
                          <Text size="sm" truncate title={file.name}>
                            {file.name}
                          </Text>
                          <Group gap="xs">
                            <Text size="xs" c="dimmed">
                              {formatFileSize(file.size)}
                            </Text>
                            <Text size="xs" c="dimmed">
                              •
                            </Text>
                            <Text size="xs" c="dimmed">
                              {formatDate(file.uploadedAt)}
                            </Text>
                          </Group>
                        </Box>
                      </Group>
                      
                      <Group gap="xs">
                        <Menu shadow="md" width={150}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDots size={14} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEye size={14} />}
                              onClick={() => handleFileView(file)}
                            >
                              View
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconDownload size={14} />}
                              onClick={() => handleFileDownload(file)}
                            >
                              Download
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => handleFileDelete(file.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Group>
                  </Card>
                );
              })
            )}
          </Stack>
        )}
      </Box>

      <FileUploadModal
        opened={uploadModalOpened}
        onClose={() => setUploadModalOpened(false)}
        onFileDrop={handleFilesAdd}
      />
    </Box>
  );
} 