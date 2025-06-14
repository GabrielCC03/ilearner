from typing import Optional, AsyncGenerator, List
from models.database import ChatMessage
from .common import open_router_api_streaming
from .database.chat_messages import (
    create_chat_message,
    get_latest_chat_messages,
    delete_chat_messages_by_learning_space,
    get_chat_messages_by_learning_space
)

async def send_chat_message_with_streaming(
    learning_space_id: str,
    user_message: str,
    model: str = "gpt-4o",
    tool_history_id: Optional[str] = None,
    context_limit: int = 10,
    files: Optional[List] = None
) -> AsyncGenerator[str, None]:
    """
    Send a chat message and get a streaming response from OpenRouter.
    Saves both user message and assistant response to the database.
    
    Args:
        learning_space_id: ID of the learning space
        user_message: The user's message
        model: Model to use for the response
        tool_history_id: Optional tool history ID for context
        context_limit: Number of recent messages to include as context
    
    Yields:
        String chunks of the assistant's response
    """
    
    # 1. Save the user's message to the database
    try:
        user_chat_message = await create_chat_message(
            learning_space_id=learning_space_id,
            role="user",
            content=user_message,
            tool_history_id=tool_history_id
        )
    except Exception as e:
        yield f"Error saving message: {str(e)}"
        return
    
    # 2. Get recent conversation context
    try:
        recent_messages = await get_latest_chat_messages(
            learning_space_id=learning_space_id,
            tool_history_id=tool_history_id,
            limit=context_limit
        )
    except Exception as e:
        recent_messages = []
    
    # 3. Build the conversation context for the model
    conversation_context = build_conversation_context(recent_messages, user_message)

    # Master prompt with rules and instructions
    master_prompt = """
    You are an AI assistant helping users understand and analyze their uploaded documents. Follow these important rules:

    RULES:
    1. PRIORITIZE DOCUMENT KNOWLEDGE: Always answer questions using information from the provided documents first and foremost.
    2. CITE YOUR SOURCES: When referencing information from documents, always mention the specific document name (e.g., "According to document.pdf..." or "As stated in notes.txt...").
    3. BE EXPLICIT ABOUT SOURCE: Clearly distinguish between information from the documents versus your general knowledge.
    4. AVOID EXTERNAL SOURCES: Do not search for or reference information from external sources unless no relevant information exists in the provided documents.
    5. MAKE DISCLAIMERS: When you must use general knowledge because the documents don't contain relevant information, explicitly state: "Based on my general knowledge (not from your documents)..."
    6. STAY FOCUSED: Keep your answers relevant to the user's question and the document content.
    7. BE ACCURATE: Only cite information that actually appears in the documents. Do not make assumptions about document content.
    8. You will be provided with a conversation history. Focus on answering the user's last question based on the conversation history and the documents.

    If no relevant information is found in the provided documents, clearly state this and ask if they would like you to provide general knowledge on the topic instead.
    """
    conversation_context = f"{master_prompt}\n\nConversation Context:\n{conversation_context}"

    # 4. Stream the response from OpenRouter
    assistant_response = ""
    try:
        async for chunk in open_router_api_streaming(model=model, prompt=conversation_context, files=files):
            assistant_response += chunk
            yield chunk
            
    except Exception as e:
        error_message = f"Error getting response: {str(e)}"
        assistant_response = error_message
        yield error_message
    
    # 5. Save the complete assistant response to the database
    if assistant_response:
        try:
            await create_chat_message(
                learning_space_id=learning_space_id,
                role="assistant",
                content=assistant_response,
                tool_history_id=tool_history_id
            )
        except Exception as e:
            yield f"Error saving assistant response: {str(e)}"

def build_conversation_context(recent_messages: List[ChatMessage], current_message: str) -> str:
    """
    Build conversation context from recent messages.
    """
    if not recent_messages:
        return current_message
    
    # Build a conversation history (limit to avoid token limits)
    context_parts = []
    
    # Add recent messages (excluding the current one we just saved)
    for msg in recent_messages[-5:]:  # Last 5 messages for context
        if msg.role == "user":
            context_parts.append(f"User: {msg.content}")
        else:
            context_parts.append(f"Assistant: {msg.content}")
    
    # Add current message
    context_parts.append(f"User: {current_message}")
    
    return "\n\n".join(context_parts)

async def get_chat_history(
    learning_space_id: str,
    tool_history_id: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
) -> List[ChatMessage]:
    """
    Get chat history for a learning space
    """
    
    return await get_chat_messages_by_learning_space(
        learning_space_id=learning_space_id,
        tool_history_id=tool_history_id,
        limit=limit,
        skip=skip
    )

async def delete_chat_history(
    learning_space_id: str,
    tool_history_id: Optional[str] = None
) -> int:
    """
    Delete chat history for a learning space
    Returns the number of deleted messages
    """
    
    return await delete_chat_messages_by_learning_space(
        learning_space_id=learning_space_id,
        tool_history_id=tool_history_id
    )
