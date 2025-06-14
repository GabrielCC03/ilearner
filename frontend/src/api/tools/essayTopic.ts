import type { EssayInstructions, EssayFeedback, EssayHistory } from '../../types/tools';

const API_BASE = 'http://localhost:8000';

export const generateEssayTopic = async (learningSpaceId: string): Promise<EssayInstructions> => {
  try {
    const response = await fetch(`${API_BASE}/tools/essay-topic/generate/${learningSpaceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating essay topic:', error);
    throw error;
  }
};

export const submitEssay = async (toolHistoryId: string, essayText: string): Promise<{ feedback: EssayFeedback }> => {
  try {
    const response = await fetch(`${API_BASE}/tools/essay-topic/submit/${toolHistoryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        essay_text: essayText
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting essay:', error);
    throw error;
  }
};

export const getEssayHistory = async (toolHistoryId: string): Promise<EssayHistory> => {
  try {
    const response = await fetch(`${API_BASE}/tools/essay-topic/history/${toolHistoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting essay history:', error);
    throw error;
  }
};
