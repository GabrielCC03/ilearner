from datetime import datetime
from typing import Optional, Dict, Any, List
from bson import ObjectId
from models.database import ToolHistory
from .MongoConnection import mongo_connection

# Get the tool history collection
tool_history_collection = mongo_connection.get_collection('ToolHistory')


async def create_tool_history(learning_space_id: str, tool_type: str, tool_data: Optional[Dict[str, Any]] = None) -> ToolHistory:
    """
    Create a new tool history entry
    """

    collection = tool_history_collection
    
    current_time = datetime.now()
    
    tool_history_data = {
        "learningSpaceId": ObjectId(learning_space_id),
        "type": tool_type,
        "createdAt": current_time,
        "updatedAt": current_time,
        "status": "unsubmitted"
    }
    
    if tool_data:
        tool_history_data["toolData"] = tool_data
    
    try:
        result = collection.insert_one(tool_history_data)

        # Retrieve the created document
        created_doc = collection.find_one({"_id": result.inserted_id})
        
        return ToolHistory(
            id=str(created_doc["_id"]),
            learningSpaceId=str(created_doc["learningSpaceId"]),
            type=created_doc["type"],
            createdAt=created_doc["createdAt"],
            updatedAt=created_doc["updatedAt"],
            status=created_doc["status"],
            toolData=created_doc.get("toolData"),
            tags=created_doc.get("tags")
        )

    except Exception as e:
        print(f"Error creating tool history: {e}")
        raise e

async def get_tool_history(tool_history_id: str) -> Optional[ToolHistory]:
    """
    Get a tool history entry by ID
    """
    collection = tool_history_collection
    
    doc = collection.find_one({"_id": ObjectId(tool_history_id)})
    
    if not doc:
        return None
    
    return ToolHistory(
        id=str(doc["_id"]),
        learningSpaceId=str(doc["learningSpaceId"]),
        type=doc["type"],
        createdAt=doc["createdAt"],
        updatedAt=doc["updatedAt"],
        status=doc["status"],
        toolData=doc.get("toolData"),
        tags=doc.get("tags")
    )

async def update_tool_history(tool_history_id: str, update_data: Dict[str, Any]) -> Optional[ToolHistory]:
    """
    Update a tool history entry
    """
    collection = tool_history_collection
    
    # Add updatedAt timestamp
    update_data["updatedAt"] = datetime.now()
    
    # Convert ObjectId fields if needed
    if "learningSpaceId" in update_data:
        update_data["learningSpaceId"] = ObjectId(update_data["learningSpaceId"])
    
    result = collection.update_one(
        {"_id": ObjectId(tool_history_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        return None
    
    # Return the updated document
    return await get_tool_history(tool_history_id)

async def update_tool_data(tool_history_id: str, tool_data_updates: Dict[str, Any]) -> Optional[ToolHistory]:
    """
    Update specific fields in toolData
    """
    collection = tool_history_collection
    
    # Create update operations for nested toolData fields
    update_ops = {"updatedAt": datetime.utcnow()}
    
    for key, value in tool_data_updates.items():
        update_ops[f"toolData.{key}"] = value
    
    result = collection.update_one(
        {"_id": ObjectId(tool_history_id)},
        {"$set": update_ops}
    )
    
    if result.matched_count == 0:
        return None
    
    # Return the updated document
    return await get_tool_history(tool_history_id)

async def get_tool_history_by_learning_space(learning_space_id: str) -> List[ToolHistory]:
    """
    Get all tool history entries for a learning space
    """
    collection = tool_history_collection
    
    cursor = collection.find({
        "learningSpaceId": ObjectId(learning_space_id)
    }).sort("createdAt", -1)

    tool_histories = []
    for doc in cursor:
        tool_histories.append(ToolHistory(
            id=str(doc["_id"]),
            learningSpaceId=str(doc["learningSpaceId"]),
            type=doc["type"],
            createdAt=doc["createdAt"],
            updatedAt=doc["updatedAt"],
            status=doc["status"],
            toolData=doc.get("toolData"),
            tags=doc.get("tags")
        ))

    return tool_histories

async def delete_tool_history(tool_history_id: str) -> bool:
    """
    Delete a tool history entry by ID
    """
    collection = tool_history_collection
    result = collection.delete_one({"_id": ObjectId(tool_history_id)})
    return result.deleted_count > 0
