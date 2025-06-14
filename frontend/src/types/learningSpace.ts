export interface FileItem {
  id: string;
  learningSpaceId: string;
  name: string;
  type: 'pdf' | 'txt' | 'text';
  size: number;
  mimeType: string;
  uploadedAt: Date;
  extractedText?: string;
  content?: string;
}

export interface FileUploadResponse {
  id: string;
  learningSpaceId: string;
  name: string;
  type: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  extractedText?: string;
}

export interface FileContentResponse {
  content: string;
}

export interface ExtractedTextResponse {
  extractedText: string;
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
  updatedAt: string;
  fileCount: number;
}

export interface CreateLearningSpaceRequest {
  name: string;
}

export interface UpdateLearningSpaceRequest {
  name?: string;
} 