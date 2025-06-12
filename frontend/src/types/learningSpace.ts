export interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'docx';
  size: number;
  uploadedAt: string;
  content?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export interface LearningSpace {
  id: string;
  name: string;
  createdAt: string;
  description?: string;
  fileCount?: number;
}

export interface CreateLearningSpaceRequest {
  name: string;
  description?: string;
} 