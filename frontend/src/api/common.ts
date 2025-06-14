

export async function openRouter(model: string, message: string): Promise<string> {

    /**
     * Wrapper to call the OpenRouter API from the frontend
     */


    const response = await fetch('http://localhost:8000/common/openrouter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, message }),
    });
    const content = await response.json();
    return content;
}

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };