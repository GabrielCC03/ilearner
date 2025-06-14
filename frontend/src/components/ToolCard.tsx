import { Card, Group, ThemeIcon, Box, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import type { Tool } from '../app/pages/learningSpace/types';
import type { FileItem } from '../types/learningSpace';

interface ToolCardProps {
  tool: Tool;
  learningSpaceId: string;
  files: FileItem[];
}

export default function ToolCard({ tool, learningSpaceId, files }: ToolCardProps) {
  const navigate = useNavigate();
  const IconComponent = tool.icon;

  const handleClick = () => {
    
    // If tool has a custom action, call it
    if (tool.action) {
      tool.action();
    }
    
    // Navigate to the tool's route with learning space context
    navigate(tool.route, {
      state: {
        learningSpaceId,
        files,
        toolId: tool.id
      }
    });
  };

  return (
    <Card 
      key={tool.id} 
      padding="md" 
      withBorder 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <Group gap="sm">
        <ThemeIcon variant="light" size="md">
          <IconComponent size={18} />
        </ThemeIcon>
        <Box className="flex-1">
          <Text size="sm" fw={500}>
            {tool.name}
          </Text>
          <Text size="xs" c="dimmed">
            {tool.description}
          </Text>
        </Box>
        <IconChevronRight size={16} />
      </Group>
    </Card>
  );
}
