from bson import ObjectId
from typing import List, Optional, Dict, Any
from datetime import datetime
from models.database import LearningSpace
from .MongoConnection import mongo_connection

# Get the learning spaces collection
learning_spaces_collection = mongo_connection.get_collection('LearningSpaces')

def object_id_to_str(doc):
    '''
    Convert ObjectId to string and map _id to id for Pydantic model
    '''
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

async def create_learning_space(name: str) -> LearningSpace:
    '''
    Create a new learning space
    '''
    now = datetime.now()
    learning_space = {
        "name": name,
        "createdAt": now,
        "updatedAt": now,
        "fileCount": 0
    }
    
    result = learning_spaces_collection.insert_one(learning_space)
    learning_space["id"] = str(result.inserted_id)
    
    return LearningSpace(**learning_space)

async def get_learning_space(learning_space_id: str) -> Optional[LearningSpace]:
    '''
    Get a learning space by ID
    '''
    try:
        doc = learning_spaces_collection.find_one({"_id": ObjectId(learning_space_id)})
        if doc:
            doc = object_id_to_str(doc)
            return LearningSpace(**doc)
        return None
    except Exception:
        return None

async def get_all_learning_spaces() -> List[LearningSpace]:
    '''
    Get all learning spaces
    '''
    docs = learning_spaces_collection.find().sort("createdAt", -1)
    learning_spaces = []
    
    for doc in docs:
        doc = object_id_to_str(doc)
        learning_spaces.append(LearningSpace(**doc))
    
    return learning_spaces

async def update_learning_space(learning_space_id: str, update_data: Dict[str, Any]) -> Optional[LearningSpace]:
    '''
    Update a learning space
    '''
    try:
        # Always update the updatedAt field
        update_data["updatedAt"] = datetime.now()
        
        # Perform update
        result = learning_spaces_collection.update_one(
            {"_id": ObjectId(learning_space_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 1:
            # Return updated document
            doc = learning_spaces_collection.find_one({"_id": ObjectId(learning_space_id)})
            if doc:
                doc = object_id_to_str(doc)
                return LearningSpace(**doc)
        
        return None
    except Exception:
        return None

async def delete_learning_space(learning_space_id: str) -> bool:
    '''
    Delete a learning space
    '''
    try:
        result = learning_spaces_collection.delete_one({"_id": ObjectId(learning_space_id)})
        return result.deleted_count == 1
    except Exception:
        return False

async def update_file_count(learning_space_id: str, count_change: int = 1) -> bool:
    '''
    Update the file count for a learning space
    '''
    try:
        result = learning_spaces_collection.update_one(
            {"_id": ObjectId(learning_space_id)},
            {"$inc": {"fileCount": count_change}}
        )
        return result.modified_count == 1
    except Exception:
        return False
