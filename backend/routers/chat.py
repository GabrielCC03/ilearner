from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from typing import List, Optional
from pydantic import BaseModel
from models.database import ChatMessage
from models.chat import ChatRequest
from internal.chat import (
    send_chat_message_with_streaming,
    get_chat_history,
    delete_chat_history
)
from internal.database.chat_messages import (
    get_chat_message_by_id,
    update_chat_message,
    delete_chat_message
)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message")
async def send_chat_message(request: ChatRequest):
    """
    Send a chat message and get a streaming response.
    """

    try:
        
        async def generate_response():
            try:
                chunk_count = 0
                async for chunk in send_chat_message_with_streaming(
                    learning_space_id=request.learning_space_id,
                    user_message=request.content,
                    model=request.model,
                    tool_history_id=request.tool_history_id,
                    files=request.files
                ):
                    chunk_count += 1
                    yield chunk
                
            except Exception as e:
                error_msg = f"Error in streaming generation: {str(e)}"
                yield error_msg

        return StreamingResponse(
            generate_response(),
            media_type="text/plain"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat message: {str(e)}"
        )

@router.get("/history/{learning_space_id}", response_model=List[ChatMessage])
async def get_chat_history_endpoint(
    learning_space_id: str, 
    tool_history_id: Optional[str] = None, 
    limit: int = 50, 
    skip: int = 0
):
    """
    Get chat history for a learning space
    """
    try:
        messages = await get_chat_history(
            learning_space_id=learning_space_id,
            tool_history_id=tool_history_id,
            limit=limit,
            skip=skip
        )
        return messages
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve chat history: {str(e)}"
        )

@router.get("/message/{message_id}", response_model=ChatMessage)
async def get_message(message_id: str):
    """
    Get a specific chat message by ID
    """
    try:
        message = await get_chat_message_by_id(message_id)
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
        return message
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve message: {str(e)}"
        )

@router.patch("/message/{message_id}", response_model=ChatMessage)
async def update_message(message_id: str, content: str):
    """
    Update a chat message
    """
    try:
        message = await update_chat_message(
            message_id=message_id,
            update_data={"content": content}
        )
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
        return message
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update message: {str(e)}"
        )

@router.delete("/message/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: str):
    """
    Delete a chat message
    """
    try:
        deleted = await delete_chat_message(message_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete message: {str(e)}"
        )

@router.delete("/history")
async def delete_chat_history_endpoint(
    learning_space_id: str,
    tool_history_id: Optional[str] = None
):
    """
    Delete all chat history for a learning space
    """
    try:
        deleted_count = await delete_chat_history(
            learning_space_id=learning_space_id,
            tool_history_id=tool_history_id
        )
        return {
            "message": f"Deleted {deleted_count} messages",
            "deleted_count": deleted_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete chat history: {str(e)}"
        )
