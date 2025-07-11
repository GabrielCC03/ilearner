from fastapi import APIRouter
from internal import common
import json
from models.common import OpenRouterRequest

router = APIRouter(prefix="/common", tags=["common"])

@router.post("/openrouter")
async def openrouter(request: OpenRouterRequest) -> str:

    '''
    OpenRouter API wrapper
    Returns: response content from OpenRouter API
    '''

    try:
        responseJson = await common.open_router_api(request.model, request.message)
        response = responseJson['choices'][0]['message']['content']
        return response
    except Exception as e:
        return f"Error in openrouter: {str(e)}"

@router.post("/openrouter-stream")
async def openrouter_stream(request: OpenRouterRequest):
    '''
    OpenRouter API wrapper
    Yields: content chunks from OpenRouter API stream
    '''
    try:
        yield await common.open_router_api_streaming(request.model, request.message)
    except Exception as e:
        yield f"Error in openrouter_stream: {str(e)}"