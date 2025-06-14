import requests
import json
import os
from typing import Optional, List
MODELS = {
    # Selected models for this API
    "gpt-4o": "openai/gpt-4o",
    "gemini-2.0-flash-001": "google/gemini-2.0-flash-001",
    "claude-sonnet-4": "anthropic/claude-sonnet-4",
    "claude-3-5-sonnet": "anthropic/claude-3-5-sonnet",
    "deepseek-r1-0528": "deepseek/deepseek-r1-0528",
    "o1": "openai/o1",
    
}

async def open_router_api(model: str = "openai/gpt-4o", message: str = "", files: Optional[List] = None) -> dict:

    '''
    OpenRouter API wrapper
    Returns: response from OpenRouter API
    '''
    try:

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            },
            data=json.dumps({
                "model": MODELS[model], # optional
                "messages": [
                {
                    "role": "user",
                    "content": message
                }
                ]
            })
        )
    except Exception as e:
        return {"error": f"Failed to get response from OpenRouter API {e}"}

    return response.json()

async def open_router_api_streaming(model: str = "openai/gpt-4o", message: str = "", files: Optional[List] = None):
    '''
    OpenRouter API wrapper for streaming. https://openrouter.ai/docs/api-reference/streaming
    Yields: content chunks from OpenRouter API stream
    '''
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODELS[model],
                "messages": [
                    {
                        "role": "user",
                        "content": message
                    }
                ],
                "stream": True
            },
            stream=True
        )
        
        buffer = ""
        for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
            buffer += chunk
            while True:
                try:
                    # Find the next complete SSE line
                    line_end = buffer.find('\n')
                    if line_end == -1:
                        break
                    
                    line = buffer[:line_end].strip()
                    buffer = buffer[line_end + 1:]
                    
                    if line.startswith('data: '):
                        data = line[6:]
                        if data == '[DONE]':
                            return
                        
                        try:
                            data_obj = json.loads(data)
                            content = data_obj["choices"][0]["delta"].get("content")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            # Skip non-JSON payloads (like comments)
                            pass
                except Exception:
                    break
                    
    except Exception as e:
        yield f"Error: Failed to get streaming response from OpenRouter API - {str(e)}"