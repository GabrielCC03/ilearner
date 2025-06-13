import { Modal, Text, Group, rem, Button } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { DropzoneCustom } from '../../../components';
import { useState, useEffect } from 'react';

interface FileUploadModalProps {
  opened: boolean;
  onClose: () => void;
  onFileDrop: (files: File[]) => void;
}

export default function FileUploadModal({ opened, onClose, onFileDrop }: FileUploadModalProps) {
    
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);



  useEffect(() => {
    if (!opened) {
      setSelectedFiles([]);
    }
  }, [opened]);

  const handleDrop = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleAccept = () => {
    onFileDrop(selectedFiles);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Upload Files" size="lg" centered>
      <div className="flex flex-col h-96 gap-1">
        <DropzoneCustom onDrop={handleDrop} />
        {selectedFiles.length > 0 && (
          <div className="flex-1 flex flex-col min-h-40 gap-1 max-h-40">
            <Text size="sm" fw={500}>Selected Files:</Text>
            <div className="overflow-y-auto max-h-40 h-40 p-2 flex flex-col gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md overflow-hidden">
                  <IconPhoto size={18} />
                  <Text size="sm">{file.name}</Text>
                </div>
              ))}
            </div>
          </div>
        )}
        <Group justify="flex-end" className="mt-auto" gap="sm">
          <Button variant="light" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAccept} disabled={selectedFiles.length === 0}>
            Upload Files
          </Button>
        </Group>
      </div>
    </Modal>
  );
} 