import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextInput, Button, ScrollArea, Text, Paper, Group, ActionIcon, Alert } from '@mantine/core';
import { IconSend, IconRobot, IconUser, IconAlertCircle } from '@tabler/icons-react';
import type { FileItem } from '../types/learningSpace';
import type { Message } from '../app/pages/learningSpace/types';
import { ChatService } from '../api/chat';

interface ChatInterfaceProps {
  learningSpaceId: string;
  files?: FileItem[];
  toolHistoryId?: string | null;
  model?: string;
}

export default function ChatInterface({ 
  learningSpaceId, 
  files = [], 
  toolHistoryId = null,
  model = 'gpt-4o'
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<Message | null>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage, scrollToBottom]);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, [learningSpaceId, toolHistoryId]);

  const loadChatHistory = async () => {
    try {
      const history = await ChatService.getChatHistory(learningSpaceId, toolHistoryId);
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsStreaming(true);
    setError(null);

    // Create a temporary streaming message
    const streamingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
    };
    setCurrentStreamingMessage(streamingMessage);

    try {
      // Use a ref to track accumulated content for better performance
      let accumulatedContent = '';
      let lastUpdateTime = 0;
      const UPDATE_THROTTLE_MS = 50; // Update UI at most every 50ms

      await ChatService.sendMessage(
        userMessage.content,
        learningSpaceId,
        files,
        model,
        toolHistoryId,
        (chunk: string) => {
          // Handle streaming chunks
          accumulatedContent += chunk;
          
          const now = Date.now();
          // Throttle updates to prevent UI from being overwhelmed
          if (now - lastUpdateTime >= UPDATE_THROTTLE_MS) {
            lastUpdateTime = now;
            
            // Update streaming message with accumulated content
            setCurrentStreamingMessage(prevMessage => {
              if (!prevMessage) return null;
              return {
                ...prevMessage,
                content: accumulatedContent
              };
            });
          }
        }
      );

      // Ensure final update with all content
      setCurrentStreamingMessage(prevMessage => {
        if (!prevMessage) return null;
        return {
          ...prevMessage,
          content: accumulatedContent
        };
      });

      // Add the final assistant message
      const finalMessage: Message = {
        ...streamingMessage,
        content: accumulatedContent,
      };

      setMessages(prev => [...prev, finalMessage]);
      setCurrentStreamingMessage(null);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setCurrentStreamingMessage(null);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await ChatService.deleteChatHistory(learningSpaceId, toolHistoryId);
      setMessages([]);
      setError(null);
    } catch (error) {
      console.error('Error clearing chat:', error);
      setError('Failed to clear chat history');
    }
  };

  return (
    <Box className="h-full flex flex-col">
      {/* Header */}
      <Box className="p-4 border-b border-gray-200">
        <Group justify="space-between">
          <Group gap="sm">
            <IconRobot size={20} />
            <Text fw={500} c="gray.7">Chat</Text>
          </Group>
          {messages.length > 0 && (
            <Button
              variant="subtle"
              size="xs"
              onClick={clearChat}
              disabled={isLoading}
            >
              Clear Chat
            </Button>
          )}
        </Group>
        <Text size="sm" c="dimmed" mt="xs">
          Ask questions about your uploaded materials
          {files.length > 0 && ` (${files.length} file${files.length > 1 ? 's' : ''} available)`}
        </Text>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          color="red" 
          onClose={() => setError(null)}
          mx="md"
          mt="md"
        >
          {error}
        </Alert>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-2" ref={scrollAreaRef}>
        {messages.length === 0 && !currentStreamingMessage ? (
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
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Text>
              </Paper>
            ))}
            
            {/* Streaming message */}
            {currentStreamingMessage && (
              <Paper p="md" className="max-w-[80%] mr-auto bg-gray-50">
                <Group gap="xs" mb="xs">
                  <IconRobot size={16} />
                  <Text size="xs" c="dimmed">
                    {currentStreamingMessage.timestamp.toLocaleTimeString()}
                  </Text>
                </Group>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {currentStreamingMessage.content}
                  <span className="animate-pulse">|</span>
                </Text>
              </Paper>
            )}
          </Box>
        )}
        <div ref={messagesEndRef} />
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
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            loading={isStreaming}
          >
            <IconSend size={16} />
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
} 