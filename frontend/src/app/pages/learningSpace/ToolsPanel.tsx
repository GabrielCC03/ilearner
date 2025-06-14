import { Box, Text, Button, Stack, Card, Group, ThemeIcon, Divider, ScrollArea, Menu, ActionIcon } from '@mantine/core';
import { IconBrain, IconFileText, IconHistory, IconDots, IconTrash } from '@tabler/icons-react';
import type { Tool, HistoryItem } from './types';
import type { FileItem } from '../../../types/learningSpace';
import { formatDate } from '../../../api/common';
import ToolCard from '../../../components/ToolCard';

interface ToolsPanelProps {
  tools: Tool[];
  history: HistoryItem[];
  learningSpaceId: string;
  files: FileItem[];
  onDeleteHistory: (toolHistoryId: string) => void;
}

export default function ToolsPanel({ tools, history, learningSpaceId, files, onDeleteHistory }: ToolsPanelProps) {

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return IconBrain;
      case 'essay':
        return IconFileText;
      default:
        return IconFileText;
    }
  };

  const defaultTools: Tool[] = [
    {
      id: 'mcq-quiz',
      name: 'Create MCQ Quiz',
      description: 'Practice answering multiple choice questions',
      icon: IconBrain,
      route: '/tools/mcq',
    },
    {
      id: 'essay-topics',
      name: 'Generate Essay Topics',
      description: 'Practice writing an essay based on the materials',
      icon: IconFileText,
      route: '/tools/essay-topic',
    }
  ];

  const toolsToShow = tools.length > 0 ? tools : defaultTools;

  return (
    <Box className="h-full flex flex-col">
      {/* Tools Section */}
      <Box className="p-4">
        <Text fw={500} mb="md" c="gray.7">
          Study Tools
        </Text>
        <Stack gap="sm">
          {toolsToShow.map((tool) => (
            <ToolCard 
              key={tool.id}
              tool={tool} 
              learningSpaceId={learningSpaceId}
              files={files}
            />
          ))}
        </Stack>
      </Box>

      <Divider />

      {/* History Section */}
      <Box className="flex-1 flex flex-col">
        <Box className="p-4 pb-2">
          <Group justify="space-between" align="center">
            <Text fw={500} c="gray.7">
              History
            </Text>
            <ThemeIcon variant="light" size="sm">
              <IconHistory size={16} />
            </ThemeIcon>
          </Group>
        </Box>

        <ScrollArea className="flex-1 px-4 pb-4">
          {history.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              No generated content yet
            </Text>
          ) : (
            <Stack gap="xs">
              {history.map((item) => {
                const HistoryIcon = getHistoryIcon(item.type);
                return (
                  <Card
                    key={item.id}
                    padding="sm"
                    withBorder
                    onClick={item.onClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" className="flex-1 min-w-0">
                        <ThemeIcon variant="light" size="sm" color="gray">
                          <HistoryIcon size={16} />
                        </ThemeIcon>
                        <Box className="flex-1 min-w-0">
                          <Text size="sm" truncate title={item.name}>
                            {item.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {formatDate(item.createdAt)}
                          </Text>
                        </Box>
                      </Group>
                      <Group gap="xs">
                        <Menu shadow="md" width={150}>
                          <Menu.Target>
                            <ActionIcon
                              variant="subtle"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); }}
                            >
                              <IconDots size={14} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={(e) => { e.stopPropagation(); onDeleteHistory(item.id); }}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Group>
                  </Card>
                );
              })}
            </Stack>
          )}
        </ScrollArea>
      </Box>
    </Box>
  );
} 