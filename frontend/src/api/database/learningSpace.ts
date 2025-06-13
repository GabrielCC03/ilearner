import type { LearningSpace, CreateLearningSpaceRequest, UpdateLearningSpaceRequest } from '../../types/learningSpace';

const API_BASE_URL = 'http://localhost:8000/database/learning-spaces';

/**
 * Create a new learning space
 */
export const createLearningSpace = async (data: CreateLearningSpaceRequest): Promise<LearningSpace> => {
  const response = await fetch(`${API_BASE_URL}/?name=${encodeURIComponent(data.name)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create learning space');
  }

  return response.json();
};

/**
 * Get all learning spaces
 */
export const getAllLearningSpaces = async (): Promise<LearningSpace[]> => {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch learning spaces');
  }

  return response.json();
};

/**
 * Get a learning space by ID
 */
export const getLearningSpace = async (learningSpaceId: string): Promise<LearningSpace> => {
  const response = await fetch(`${API_BASE_URL}/${learningSpaceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch learning space');
  }

  return response.json();
};

/**
 * Update a learning space
 */
export const updateLearningSpace = async (
  learningSpaceId: string, 
  data: UpdateLearningSpaceRequest
): Promise<LearningSpace> => {
  const searchParams = new URLSearchParams();
  
  if (data.name !== undefined) {
    searchParams.append('name', data.name);
  }

  const response = await fetch(`${API_BASE_URL}/${learningSpaceId}?${searchParams.toString()}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update learning space');
  }

  return response.json();
};

/**
 * Delete a learning space
 */
export const deleteLearningSpace = async (learningSpaceId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${learningSpaceId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete learning space');
  }
};

/**
 * API client object with all learning space methods
 */
export const learningSpaceApi = {
  create: createLearningSpace,
  getAll: getAllLearningSpaces,
  getById: getLearningSpace,
  update: updateLearningSpace,
  delete: deleteLearningSpace,
};
