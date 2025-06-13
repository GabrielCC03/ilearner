export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

export interface HistoryItem {
  id: string;
  name: string;
  type: 'quiz' | 'essay' | 'summary';
  createdAt: Date;
  onClick: () => void;
} 