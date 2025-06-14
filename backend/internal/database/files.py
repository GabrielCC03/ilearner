from bson import ObjectId, Binary
from typing import List, Optional
from datetime import datetime
from models.database import File
from .MongoConnection import mongo_connection
from .learning_spaces import update_file_count
from ..common import parse_file

# Get the files collection
files_collection = mongo_connection.get_collection('Files')

def object_id_to_str(doc):
    '''
    Convert ObjectId to string and map _id to id for Pydantic model
    '''
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

async def create_file(learning_space_id: str, name: str, file_type: str, size: int, mime_type: str, content: bytes) -> File:
    '''
    Create a new file record with content storage and text extraction
    '''
    now = datetime.now()
    
    # Extract text from the file content
    extracted_text = parse_file(content, file_type, mime_type)
    
    file_doc = {
        "learningSpaceId": learning_space_id,
        "name": name,
        "type": file_type,
        "size": size,
        "mimeType": mime_type,
        "uploadedAt": now,
        "content": Binary(content),  # Store content as BSON Binary
        "extractedText": extracted_text  # Store extracted text
    }
    
    result = files_collection.insert_one(file_doc)
    file_doc["id"] = str(result.inserted_id)
    
    # Remove binary content for the response (we'll fetch it separately when needed)
    file_doc.pop("content", None)
    
    # Update file count in learning space
    await update_file_count(learning_space_id, 1)
    
    return File(**file_doc)

async def get_file(file_id: str, include_content: bool = False) -> Optional[File]:
    '''
    Get a file by ID, optionally including content
    '''
    try:
        projection = {"content": 0} if not include_content else {}
        doc = files_collection.find_one({"_id": ObjectId(file_id)}, projection)
        if doc:
            doc = object_id_to_str(doc)
            # Convert Binary content back to bytes if included
            if include_content and "content" in doc:
                doc["content"] = bytes(doc["content"])
            return File(**doc)
        return None
    except Exception:
        return None

async def get_file_content(file_id: str) -> Optional[bytes]:
    '''
    Get only the file content by ID
    '''
    try:
        doc = files_collection.find_one({"_id": ObjectId(file_id)}, {"content": 1})
        if doc and "content" in doc:
            return bytes(doc["content"])
        return None
    except Exception:
        return None

async def get_files_by_learning_space(learning_space_id: str) -> List[File]:
    '''
    Get all files for a specific learning space (without content)
    '''
    docs = files_collection.find(
        {"learningSpaceId": learning_space_id}, 
        {"content": 0}  # Exclude content for performance
    ).sort("uploadedAt", -1)
    files = []
    
    for doc in docs:
        doc = object_id_to_str(doc)
        files.append(File(**doc))
    
    return files

async def delete_file(file_id: str) -> bool:
    '''
    Delete a file and its content
    '''
    try:
        # First get the file to know which learning space to update
        file_doc = files_collection.find_one({"_id": ObjectId(file_id)}, {"learningSpaceId": 1})
        if not file_doc:
            return False
        
        learning_space_id = file_doc["learningSpaceId"]
        
        # Delete the file record and content
        result = files_collection.delete_one({"_id": ObjectId(file_id)})
        
        if result.deleted_count == 1:
            # Update file count in learning space
            await update_file_count(learning_space_id, -1)
            return True
        
        return False
    except Exception:
        return False

async def delete_files_by_learning_space(learning_space_id: str) -> int:
    '''
    Delete all files for a learning space (used when deleting a learning space)
    '''
    try:
        result = files_collection.delete_many({"learningSpaceId": learning_space_id})
        return result.deleted_count
    except Exception:
        return 0
