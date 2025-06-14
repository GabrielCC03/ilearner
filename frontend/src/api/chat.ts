import type { Message, FileItem } from '../app/pages/learningSpace/types';

export interface ChatRequest {
  content: string;
  learning_space_id: string;
  model?: string;
  tool_history_id?: string | null;
  files?: FileItem[];
}

export interface ChatResponse {
  messages: Message[];
  error?: string;
}

const API_BASE_URL = 'http://localhost:8000';

export class ChatService {
  /**
   * Send a chat message with streaming response
   */
  static async sendMessage(
    message: string,
    learningSpaceId: string,
    files: FileItem[] = [],
    model: string = 'gpt-4o',
    toolHistoryId?: string | null,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const request: ChatRequest = {
      content: message,
      learning_space_id: learningSpaceId,
      model,
      tool_history_id: toolHistoryId,
      files,
    };

    try {
      console.log('Starting streaming request...'); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      console.log('Response received, starting to read stream...'); // Debug log
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let chunkCount = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log(`Streaming completed. Total chunks: ${chunkCount}, Total length: ${fullResponse.length}`); // Debug log
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          
          // Only process non-empty chunks
          if (chunk.trim()) {
            chunkCount++;
            fullResponse += chunk;
            console.log(`Chunk ${chunkCount}: "${chunk.substring(0, 50)}${chunk.length > 50 ? '...' : ''}"`); // Debug log
            
            // Call the chunk callback if provided
            if (onChunk) {
              onChunk(chunk);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullResponse;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a learning space
   */
  static async getChatHistory(
    learningSpaceId: string,
    toolHistoryId?: string | null,
    limit: number = 50,
    skip: number = 0
  ): Promise<Message[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString(),
      });

      if (toolHistoryId) {
        params.append('tool_history_id', toolHistoryId);
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/history/${learningSpaceId}?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert backend message format to frontend format
      return data.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'assistant',
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Delete chat history for a learning space
   */
  static async deleteChatHistory(
    learningSpaceId: string,
    toolHistoryId?: string | null
  ): Promise<{ message: string; deleted_count: number }> {
    try {
      const params = new URLSearchParams({
        learning_space_id: learningSpaceId,
      });

      if (toolHistoryId) {
        params.append('tool_history_id', toolHistoryId);
      }

      const response = await fetch(`${API_BASE_URL}/chat/history?${params}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting chat history:', error);
      throw error;
    }
  }
} 