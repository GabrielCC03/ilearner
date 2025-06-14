import type { FileItem, FileUploadResponse, FileContentResponse, ExtractedTextResponse } from '../../types/learningSpace';

const API_BASE_URL = 'http://localhost:8000/database/files';

/**
 * Upload a file to a learning space
 */
export const uploadFile = async (learningSpaceId: string, file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload/${learningSpaceId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to upload file');
  }

  return response.json();
};

/**
 * Get all files for a learning space
 */
export const getFilesForLearningSpace = async (learningSpaceId: string): Promise<FileItem[]> => {
  const response = await fetch(`${API_BASE_URL}/learning-space/${learningSpaceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch files');
  }

  return response.json();
};

/**
 * Get file metadata by ID
 */
export const getFileById = async (fileId: string): Promise<FileItem> => {
  const response = await fetch(`${API_BASE_URL}/${fileId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch file');
  }

  return response.json();
};

/**
 * Download a file
 */
export const downloadFile = async (fileId: string, filename: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${fileId}/download`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to download file');
  }

  // Create blob and download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Get file content as text (for text files only)
 */
export const getFileContent = async (fileId: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/${fileId}/content`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get file content');
  }

  const data: FileContentResponse = await response.json();
  return data.content;
};

/**
 * Delete a file
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${fileId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete file');
  }
};

/**
 * Upload multiple files to a learning space
 */
export const uploadMultipleFiles = async (
  learningSpaceId: string, 
  files: File[]
): Promise<FileUploadResponse[]> => {
  const uploadPromises = files.map(file => uploadFile(learningSpaceId, file));
  return Promise.all(uploadPromises);
};

/**
 * Get file URL for viewing (returns the download endpoint URL)
 */
export const getFileUrl = async (fileId: string): Promise<string> => {
  return `${API_BASE_URL}/${fileId}/download`;
};

/**
 * Get extracted text from a file
 */
export const getFileExtractedText = async (fileId: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/${fileId}/extracted-text`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get extracted text');
  }

  const data: ExtractedTextResponse = await response.json();
  return data.extractedText;
};

/**
 * API client object with all file methods
 */
export const filesApi = {
  upload: uploadFile,
  uploadMultiple: uploadMultipleFiles,
  getForLearningSpace: getFilesForLearningSpace,
  getById: getFileById,
  download: downloadFile,
  getContent: getFileContent,
  getExtractedText: getFileExtractedText,
  getFileUrl: getFileUrl,
  delete: deleteFile,
};
