import { Card, Stack, Group, Text, Textarea, Button, Badge, ActionIcon, Collapse } from '@mantine/core';
import { IconPencil, IconChevronUp, IconChevronDown } from '@tabler/icons-react';

interface EssayProps {
  studentEssay: string;
  onEssayChange: (value: string) => void;
  onSubmit: () => void;
  isMinimized?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Essay({ 
  studentEssay, 
  onEssayChange, 
  onSubmit, 
  isMinimized = false, 
  isOpen = true, 
  onToggle 
}: EssayProps) {
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  
  const wordCount = getWordCount(studentEssay);
  const wordCountColor = wordCount < 300 ? 'orange' : wordCount > 400 ? 'red' : 'green';

  if (isMinimized) {
    return (
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group justify="space-between">
          <Group gap="xs">
            <IconPencil size={16} />
            <Text fw={500} size="sm">Your Essay</Text>
          </Group>
          <Group gap="xs">
            <Badge color="blue" variant="light" size="sm">
              {wordCount} words
            </Badge>
            <ActionIcon
              variant="subtle"
              onClick={onToggle}
            >
              {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </ActionIcon>
          </Group>
        </Group>
        
        <Collapse in={isOpen}>
          <Text size="sm" mt="md" lineClamp={3}>
            {studentEssay}
          </Text>
        </Collapse>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Stack gap="md" h="100%">
        <Group justify="space-between">
          <Group gap="xs">
            <IconPencil size={20} color="var(--mantine-color-indigo-6)" />
            <Text fw={600} size="lg">Your Essay</Text>
          </Group>
          <Badge 
            color={wordCountColor} 
            variant="light"
          >
            {wordCount}/300-400 words
          </Badge>
        </Group>
        
        <Textarea
          placeholder="Start writing your essay here..."
          value={studentEssay}
          onChange={(e) => onEssayChange(e.target.value)}
          autosize
          minRows={15}
          styles={{
            input: {
              fontSize: '14px',
              lineHeight: '1.6'
            }
          }}
        />
        
        <Button
          onClick={onSubmit}
          disabled={!studentEssay.trim()}
          size="md"
          fullWidth
        >
          Submit Essay
        </Button>
      </Stack>
    </Card>
  );
}
