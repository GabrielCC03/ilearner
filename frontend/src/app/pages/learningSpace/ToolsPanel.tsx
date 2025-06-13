import { Box, Text, Button, Stack, Card, Group, ThemeIcon, Divider, ScrollArea } from '@mantine/core';
import { IconBrain, IconFileText, IconHistory, IconChevronRight } from '@tabler/icons-react';
import type { Tool, HistoryItem } from './types';

interface ToolsPanelProps {
  tools: Tool[];
  history: HistoryItem[];
}

export default function ToolsPanel({ tools, history }: ToolsPanelProps) {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const defaultTools: Tool[] = [
    {
      id: 'mcq-quiz',
      name: 'Create MCQ Quiz',
      description: 'Generate multiple choice questions',
      icon: IconBrain,
      action: () => console.log('Create MCQ Quiz')
    },
    {
      id: 'essay-topics',
      name: 'Generate Essay Topics',
      description: 'Create essay prompts and guidelines',
      icon: IconFileText,
      action: () => console.log('Generate Essay Topics')
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
          {toolsToShow.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card key={tool.id} padding="md" withBorder className="cursor-pointer hover:shadow-md transition-shadow">
                <Group gap="sm" onClick={tool.action}>
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
          })}
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
                    className="cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={item.onClick}
                  >
                    <Group gap="sm" wrap="nowrap">
                      <ThemeIcon variant="light" size="sm" color="gray">
                        <HistoryIcon size={14} />
                      </ThemeIcon>
                      <Box className="flex-1 min-w-0">
                        <Text size="sm" truncate>
                          {item.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatDate(item.createdAt)}
                        </Text>
                      </Box>
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