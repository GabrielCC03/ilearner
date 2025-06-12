import requests
import json
import os

MODELS = {
    # Selected models for this API
    "gpt-4o": "openai/gpt-4o",
    "gemini-2.0-flash-001": "google/gemini-2.0-flash-001",
    "claude-sonnet-4": "anthropic/claude-sonnet-4",
    "claude-3-5-sonnet": "anthropic/claude-3-5-sonnet",
    "deepseek-r1-0528": "deepseek/deepseek-r1-0528",
    "o1": "openai/o1",
    
}

def open_router_api(model: str = "openai/gpt-4o", messages: list[dict] = []):

    '''
    OpenRouter API wrapper
    Returns: response from OpenRouter API
    '''

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
                "content": "What is the meaning of life?"
            }
            ]
        })
    )

#TODO: For streaming: https://openrouter.ai/docs/api-reference/streaming