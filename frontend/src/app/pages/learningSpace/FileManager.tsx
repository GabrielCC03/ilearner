import { useState } from 'react';
import { Box, Button, Stack, Text, Card, Group, ActionIcon, ThemeIcon } from '@mantine/core';
import { IconPlus, IconFile, IconFileTypePdf, IconFileText, IconTrash } from '@tabler/icons-react';
import FileUploadModal from './FileUploadModal';
import type { FileItem } from './types';

interface FileManagerProps {
  files: FileItem[];
  onFilesAdd: (files: File[]) => void;
  onFileDelete: (fileId: string) => void;
}

export default function FileManager({ files, onFilesAdd, onFileDelete }: FileManagerProps) {
  const [uploadModalOpened, setUploadModalOpened] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return IconFileTypePdf;
    if (type.includes('text')) return IconFileText;
    return IconFile;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box className="h-full flex flex-col">
      <Stack gap="md" className="p-4">
        <Button
          leftSection={<IconPlus size={16} />}
          variant="filled"
          onClick={() => setUploadModalOpened(true)}
          fullWidth
        >
          Add Files
        </Button>

        <Text size="sm" fw={500} c="gray.7">
          Sources ({files.length})
        </Text>
      </Stack>

      <Box className="flex-1 overflow-y-auto px-4 pb-4">
        <Stack gap="xs">
          {files.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              No files uploaded yet
            </Text>
          ) : (
            files.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <Card key={file.id} padding="sm" withBorder>
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm" className="flex-1 min-w-0">
                      <ThemeIcon variant="light" size="sm">
                        <FileIcon size={16} />
                      </ThemeIcon>
                      <Box className="flex-1 min-w-0">
                        <Text size="sm" truncate>
                          {file.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatFileSize(file.size)}
                        </Text>
                      </Box>
                    </Group>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => onFileDelete(file.id)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Card>
              );
            })
          )}
        </Stack>
      </Box>

      <FileUploadModal
        opened={uploadModalOpened}
        onClose={() => setUploadModalOpened(false)}
        onFileDrop={onFilesAdd}
      />
    </Box>
  );
} 