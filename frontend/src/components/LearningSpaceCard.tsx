import { Card, Text, Group, ActionIcon, Menu } from '@mantine/core';
import { IconBook, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';

interface LearningSpaceCardProps {
  id: string;
  name: string;
  createdAt: string;
  fileCount: number;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function LearningSpaceCard({ 
  name, 
  createdAt, 
  fileCount, 
  onClick,
  onEdit,
  onDelete 
}: LearningSpaceCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
      onClick={onClick}
      p="lg"
    >
      <Group justify="space-between" mb="md">
        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
          <IconBook size={24} className="text-white" />
        </div>
        
        <Menu position="bottom-end">
          <Menu.Target>
            <ActionIcon 
              variant="subtle" 
              color="gray" 
              onClick={(e) => e.stopPropagation()}
            >
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item 
              leftSection={<IconEdit size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Rename
            </Menu.Item>
            <Menu.Item 
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      
      <div>
        <Text size="lg" fw={600} c="white" mb="xs">
          {name}
        </Text>
        <Text size="sm" c="gray.5">
          {formatDate(createdAt)} • {fileCount} {fileCount === 1 ? 'file' : 'files'}
        </Text>
      </div>
    </Card>
  );
} 