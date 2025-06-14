from typing import List, Optional, Dict, Any
from models.database import ChatMessage
from .MongoConnection import mongo_connection
from datetime import datetime
import uuid

collection = mongo_connection.get_collection("ChatMessages")

async def create_chat_message(
    learning_space_id: str,
    role: str,
    content: str,
    tool_history_id: Optional[str] = None
) -> ChatMessage:
    """
    Save a new chat message to the database
    """
    message_data = {
        "_id": str(uuid.uuid4()),
        "learningSpaceId": learning_space_id,
        "toolHistoryId": tool_history_id,
        "role": role,
        "content": content,
        "timestamp": datetime.now(),
        "messageId": str(uuid.uuid4())
    }
    
    result = collection.insert_one(message_data)
    if result.inserted_id:
        return ChatMessage(
            id=message_data["_id"],
            learningSpaceId=message_data["learningSpaceId"],
            toolHistoryId=message_data["toolHistoryId"],
            role=message_data["role"],
            content=message_data["content"],
            timestamp=message_data["timestamp"],
            messageId=message_data["messageId"]
        )
    else:
        raise Exception("Failed to create chat message")

async def get_chat_messages_by_learning_space(
    learning_space_id: str,
    tool_history_id: Optional[str] = None,
    limit: Optional[int] = 100,
    skip: Optional[int] = 0
) -> List[ChatMessage]:
    """
    Get chat messages for a learning space, optionally filtered by tool history
    """
    query = {"learningSpaceId": learning_space_id}
    if tool_history_id is not None:
        query["toolHistoryId"] = tool_history_id
    
    cursor = collection.find(query).sort("timestamp", 1).skip(skip or 0)
    if limit:
        cursor = cursor.limit(limit)
    
    messages = []
    for doc in cursor:
        messages.append(ChatMessage(
            id=doc["_id"],
            learningSpaceId=doc["learningSpaceId"],
            toolHistoryId=doc.get("toolHistoryId"),
            role=doc["role"],
            content=doc["content"],
            timestamp=doc["timestamp"],
            messageId=doc["messageId"]
        ))
    
    return messages

async def get_chat_message_by_id(message_id: str) -> Optional[ChatMessage]:
    """
    Get a chat message by its ID
    """
    doc = collection.find_one({"_id": message_id})
    if doc:
        return ChatMessage(
            id=doc["_id"],
            learningSpaceId=doc["learningSpaceId"],
            toolHistoryId=doc.get("toolHistoryId"),
            role=doc["role"],
            content=doc["content"],
            timestamp=doc["timestamp"],
            messageId=doc["messageId"]
        )
    return None

async def update_chat_message(message_id: str, update_data: Dict[str, Any]) -> Optional[ChatMessage]:
    """
    Update a chat message
    """
    update_data["updatedAt"] = datetime.now()
    
    result = collection.update_one(
        {"_id": message_id},
        {"$set": update_data}
    )
    
    if result.modified_count > 0:
        return await get_chat_message_by_id(message_id)
    return None

async def delete_chat_message(message_id: str) -> bool:
    """
    Delete a chat message
    """
    result = collection.delete_one({"_id": message_id})
    return result.deleted_count > 0

async def delete_chat_messages_by_learning_space(
    learning_space_id: str,
    tool_history_id: Optional[str] = None
) -> int:
    """
    Delete all chat messages for a learning space, optionally filtered by tool history
    Returns the number of deleted messages
    """
    query = {"learningSpaceId": learning_space_id}
    if tool_history_id is not None:
        query["toolHistoryId"] = tool_history_id
    
    result = collection.delete_many(query)
    return result.deleted_count

async def get_latest_chat_messages(
    learning_space_id: str,
    tool_history_id: Optional[str] = None,
    limit: int = 10
) -> List[ChatMessage]:
    """
    Get the latest chat messages for a learning space
    """
    query = {"learningSpaceId": learning_space_id}
    if tool_history_id is not None:
        query["toolHistoryId"] = tool_history_id
    
    cursor = collection.find(query).sort("timestamp", -1).limit(limit)
    
    messages = []
    for doc in cursor:
        messages.append(ChatMessage(
            id=doc["_id"],
            learningSpaceId=doc["learningSpaceId"],
            toolHistoryId=doc.get("toolHistoryId"),
            role=doc["role"],
            content=doc["content"],
            timestamp=doc["timestamp"],
            messageId=doc["messageId"]
        ))
    
    # Return in chronological order (oldest first)
    return list(reversed(messages))
