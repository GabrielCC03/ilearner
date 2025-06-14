const API_BASE_URL = 'http://localhost:8000/database/tool-history';

export interface ToolHistoryResponse {
  id: string;
  learningSpaceId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  toolData?: Record<string, any>;
  tags?: string[];
}

export const getForLearningSpace = async (
  learningSpaceId: string
): Promise<ToolHistoryResponse[]> => {
  const response = await fetch(
    `${API_BASE_URL}/learning-space/${learningSpaceId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch tool history');
  }

  return response.json();
};

/**
 * Delete a tool history entry by ID
 */
export const deleteToolHistory = async (toolHistoryId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${toolHistoryId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete tool history');
  }
};

export const toolHistoryApi = {
  getForLearningSpace,
  deleteToolHistory
};
