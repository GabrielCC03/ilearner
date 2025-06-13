import { useState } from 'react';
import { Box, TextInput, Button, ScrollArea, Text, Paper, Group, ActionIcon } from '@mantine/core';
import { IconSend, IconRobot, IconUser } from '@tabler/icons-react';
import type { Message } from './types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInterface({ messages, onSendMessage, isLoading = false }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box className="h-full flex flex-col">
      {/* Header */}
      <Box className="p-4 border-b border-gray-200">
        <Group gap="sm">
          <IconRobot size={20} />
          <Text fw={500} c="gray.7">Chat</Text>
        </Group>
        <Text size="sm" c="dimmed" mt="xs">
          Ask questions about your uploaded materials
        </Text>
      </Box>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-2">
        {messages.length === 0 ? (
          <Box className="flex items-center justify-center h-full">
            <Text size="sm" c="dimmed" ta="center">
              Start a conversation by asking a question about your materials
            </Text>
          </Box>
        ) : (
          <Box className="space-y-4">
            {messages.map((message) => (
              <Paper
                key={message.id}
                p="md"
                className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'ml-auto bg-blue-50' 
                    : 'mr-auto bg-gray-50'
                }`}
              >
                <Group gap="xs" mb="xs">
                  {message.sender === 'user' ? (
                    <IconUser size={16} />
                  ) : (
                    <IconRobot size={16} />
                  )}
                  <Text size="xs" c="dimmed">
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </Group>
                <Text size="sm">
                  {message.content}
                </Text>
              </Paper>
            ))}
            {isLoading && (
              <Paper p="md" className="max-w-[80%] mr-auto bg-gray-50">
                <Group gap="xs" mb="xs">
                  <IconRobot size={16} />
                  <Text size="xs" c="dimmed">
                    Now
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  Thinking...
                </Text>
              </Paper>
            )}
          </Box>
        )}
      </ScrollArea>

      {/* Input */}
      <Box className="p-4 border-t border-gray-200">
        <Group gap="sm">
          <TextInput
            placeholder="Ask a question about your materials..."
            value={inputValue}
            onChange={(event) => setInputValue(event.currentTarget.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isLoading}
          />
          <ActionIcon
            variant="filled"
            size="lg"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
          >
            <IconSend size={16} />
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
} 