from pydantic import BaseModel
from datetime import datetime
from typing import Optional

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
    content: Optional[bytes] = None  # Actual file content
