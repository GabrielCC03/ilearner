from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class LearningSpace(BaseModel):
    id: str
    name: str
    createdAt: datetime
    updatedAt: datetime
    fileCount: int

class File(BaseModel):
    id: str
    learningSpaceId: str
    name: str
    type: str  # 'pdf', 'txt', 'text'
    size: int  # File size in bytes
    mimeType: str  # MIME type for uploaded files
    uploadedAt: datetime
    extractedText: Optional[str] = None  # Content of parsed file into text
    content: Optional[bytes] = None  # Actual file content

class ChatMessage(BaseModel):
    id: str
    learningSpaceId: str  # Reference to LearningSpaces._id
    toolHistoryId: Optional[str] = None  # Reference to ToolHistory._id (null for general learning space chat)
    
    # Message details
    role: str  # 'user', 'assistant'
    content: str
    timestamp: datetime
    
    # Message metadata
    messageId: str  # Unique identifier for this message
