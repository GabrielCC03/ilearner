import { Card, Stack, Group, Text, Paper, List, ActionIcon, Collapse } from '@mantine/core';
import { IconTarget, IconBulb, IconCheck, IconBook, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import type { EssayInstructions } from '../../../../types/tools';

interface InstructionsProps {
  essayData: EssayInstructions | null;
  isMinimized?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Instructions({ essayData, isMinimized = false, isOpen = true, onToggle }: InstructionsProps) {
  if (isMinimized) {
    return (
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group justify="space-between">
          <Group gap="xs">
            <IconTarget size={16} />
            <Text fw={500} size="sm">Essay Assignment</Text>
          </Group>
          <ActionIcon
            variant="subtle"
            onClick={onToggle}
          >
            {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </ActionIcon>
        </Group>
        
        <Collapse in={isOpen}>
          <Stack gap="sm" mt="md">
            <Paper p="sm" radius="md" style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
              <Text fw={500} size="sm">{essayData?.topic}</Text>
            </Paper>
            <Text size="xs" c="dimmed">
              {essayData?.guidelines.length} guidelines • {essayData?.helpingMaterial.length} helping points
            </Text>
          </Stack>
        </Collapse>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconTarget size={20} color="var(--mantine-color-blue-6)" />
            <Text fw={600} size="lg">Essay Assignment</Text>
          </Group>
        </Group>
        
        {/* Topic */}
        <Paper p="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
          <Group gap="xs" mb="xs">
            <IconBulb size={16} color="var(--mantine-color-blue-6)" />
            <Text fw={800} size="sm" c="blue">Topic</Text>
          </Group>
          <Text fw={500} size="md" c="black">
            {essayData?.topic}
          </Text>
        </Paper>
        
        {/* Guidelines */}
        <Paper p="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-green-0)' }}>
          <Group gap="xs" mb="xs">
            <IconCheck size={16} color="var(--mantine-color-green-6)" />
            <Text fw={600} size="sm" c="green">Guidelines</Text>
          </Group>
          <List size="sm" spacing="xs" c="black">
            {essayData?.guidelines.map((guideline, index) => (
              <List.Item key={index}>{guideline}</List.Item>
            ))}
          </List>
        </Paper>
        
        {/* Helping Material */}
        <Paper p="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-yellow-0)' }}>
          <Group gap="xs" mb="xs">
            <IconBook size={16} color="var(--mantine-color-yellow-7)" />
            <Text fw={600} size="sm" c="yellow.7">Helping Material</Text>
          </Group>
          <List size="sm" spacing="xs" c="black">
            {essayData?.helpingMaterial.map((help, index) => (
              <List.Item key={index}>{help}</List.Item>
            ))}
          </List>
        </Paper>
      </Stack>
    </Card>
  );
}
